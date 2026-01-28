## Context

The `ProductSectionManager.vue` component is used in the admin product management interface to create and manage text and media sections for product descriptions. Currently, text sections use a basic `<textarea>` element that only supports plain text input.

**Current State:**
```vue
<textarea
  :value="section.content || ''"
  rows="4"
  placeholder="Enter text content..."
  class="w-full bg-transparent border border-luxury-border dark:border-luxury-dark-border rounded-luxury p-3 text-luxury-text dark:text-luxury-dark-text focus:outline-none focus:border-luxury-gold transition-colors resize-y"
  @input="updateSectionContent(index, ($event.target as HTMLTextAreaElement).value)"
></textarea>
```

**Constraints:**
- No logic in `.vue` files - all logic in composables (already followed)
- Vue Quill requires client-side rendering (SSR limitation)
- Must maintain luxury theme consistency
- Existing content is plain text - must remain backward compatible
- Product section content is stored in the `content` field as string

**Stakeholders:**
- Admin users creating/editing product descriptions
- End users viewing product detail pages

## Goals / Non-Goals

**Goals:**
1. Replace textarea with Vue Quill rich text editor for text sections
2. Provide appropriate formatting options (bold, italic, headings, lists, links)
3. Style the editor to match the luxury theme
4. Maintain backward compatibility with existing plain text content
5. Keep the editor lightweight and focused on product description needs

**Non-Goals:**
- Full-featured CMS-style editing (e.g., drag-drop media, complex layouts)
- Custom toolbar buttons beyond Quill's standard options
- Image upload within the editor (use media sections for images)
- Code syntax highlighting
- Change tracking or version history

## Decisions

### Decision 1: Editor Choice - Vue Quill

**What**: Use `@vueup/vue-quill` as the rich text editor.

**Why**:
- Explicitly requested by the user
- Built specifically for Vue 3 with full TypeScript support
- Lightweight and well-maintained
- Clean API that works well with Nuxt
- Produces clean HTML output suitable for product descriptions

**Alternatives considered:**
- Quill directly - Rejected, VueQuill provides better Vue 3 integration
- Tiptap - More powerful but heavier and more complex to set up
- TinyMCE - Commercial license required for full features

### Decision 2: Client-Side Only Registration

**What**: Register Vue Quill as a client-side Nuxt plugin.

**Why**: Quill depends on browser APIs and cannot run on the server. Nuxt requires plugins that use browser-only APIs to be marked with `.client.ts` extension.

**Implementation**:
```typescript
// app/plugins/vue-quill.client.ts
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('QuillEditor', QuillEditor)
})
```

**Alternatives considered:**
- Component-level import - Rejected, plugin registration follows Nuxt best practices
- SSR with conditional rendering - Rejected, adds unnecessary complexity

### Decision 3: Content Storage - HTML in Existing Field

**What**: Store rich text content as HTML in the existing `content` field of `ProductSection`.

**Why**:
- The `content` field is already a string type
- HTML is a standard format that browsers can render
- No database schema changes required
- Backward compatible - plain text renders as-is in HTML

**API Type** (no changes needed):
```typescript
export interface ProductSection {
  type: 'text' | 'media'
  content?: string  // Can now contain HTML
  file_paths?: string[]
}
```

**Alternatives considered:**
- Store as Delta/JSON - Rejected, harder to render on frontend
- Add new `html_content` field - Rejected, unnecessary duplication

### Decision 4: Toolbar Configuration

**What**: Configure a focused toolbar with essential formatting options.

**Why**: Product descriptions need basic formatting without excessive options that could create inconsistent styling.

**Proposed Toolbar**:
```typescript
const toolbar = [
  ['bold', 'italic', 'underline'],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'header': [1, 2, 3, false] }],
  ['link'],
  ['clean']
]
```

**Excluded options**:
- Image upload (use media sections instead)
- Code blocks (not relevant for product descriptions)
- Text color/font (maintain theme consistency)
- Alignments (default alignment is sufficient)

**Alternatives considered:**
- Full toolbar - Rejected, creates inconsistent styling
- Minimal toolbar (bold only) - Rejected, too limited for good descriptions

### Decision 5: Theme Styling - Custom CSS

**What**: Add custom CSS to style Quill editor to match luxury theme.

**Why**: Default Quill styling doesn't match the luxury theme colors and spacing.

**Implementation**: Create component-scoped styles or global CSS override for:
- Border colors: `luxury-border` / `luxury-dark-border`
- Text colors: `luxury-text` / `luxury-dark-text`
- Border radius: `rounded-luxury` (1.5rem)
- Focus state: `border-luxury-gold`
- Toolbar styling to match theme

**Alternatives considered:**
- Use default styling - Rejected, breaks theme consistency
- Custom Quill theme - Rejected, too much maintenance burden

### Decision 6: Backward Compatibility

**What**: Ensure existing plain text content renders correctly.

**Why**: Admin users may have existing products with plain text descriptions.

**Implementation**:
- Plain text stored in `content` renders as-is when displayed
- When edited, Quill editor wraps plain text in `<p>` tags
- No migration script needed - HTML is backward compatible

**Risk**: If displaying raw HTML, need to ensure XSS safety on frontend display.

**Mitigation**: Use Vue's template rendering (not `v-html`) or sanitize HTML if needed.

## Risks / Trade-offs

- **Risk**: XSS vulnerability if HTML is rendered unsafely on product detail page
  - **Mitigation**: Use Vue's `<div v-html>` with caution, consider sanitization library like DOMPurify if user content is untrusted

- **Risk**: Editor styling may conflict with Tailwind/nuxt-config
  - **Mitigation**: Use scoped styles or CSS modules to isolate Quill styles

- **Risk**: Large HTML content in database
  - **Mitigation**: HTML is typically small for product descriptions; can add content length validation if needed

- **Trade-off**: Client-side only rendering causes small delay before editor appears
  - **Justification**: Acceptable for admin interface; product detail page (public) will render HTML fine

- **Trade-off**: Rich text gives users more control but may create inconsistent styling
  - **Mitigation**: Limit toolbar options, use clean HTML output from Quill

## Migration Plan

No database migration needed. The change is purely frontend/admin interface.

**Steps:**
1. Install `@vueup/vue-quill` package
2. Create Nuxt plugin for client-side registration
3. Update `ProductSectionManager.vue` to use Quill editor
4. Add styling to match luxury theme
5. Test with existing plain text content
6. Test on product detail page to ensure HTML renders correctly

**Rollback**:
- Remove Quill dependency
- Revert `ProductSectionManager.vue` to use `<textarea>`
- Delete plugin file
- Existing content remains unaffected

## Open Questions

1. **Should we add HTML sanitization on the product detail page when displaying content?**
   - **Answer**: This depends on trust level of admin users. If all admins are trusted, `v-html` is acceptable. If concerned, add DOMPurify or similar.

2. **Should we add a content limit or validation for rich text?**
   - **Answer**: Not in initial implementation. Can add character limit if database size becomes a concern.

3. **Should we support copy-pasting formatted content from other editors?**
   - **Answer**: Quill handles this natively. We'll use its default paste behavior which strips most styles but preserves basic formatting.
