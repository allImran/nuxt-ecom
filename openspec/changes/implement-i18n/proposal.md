# Proposal: Implement i18n (Internationalization)

## Context

The e-commerce application currently supports only English content. To serve the Bangladeshi market effectively, we need to implement a robust internationalization system with Bangla (bn) as the primary language and English (en) as the secondary option.

## Motivation

- **Market Focus**: Target the Bangladeshi market where Bangla is the primary language
- **User Experience**: Allow users to switch between Bangla and English instantly without page reload
- **Seamless Navigation**: URLs remain unchanged when switching languages, preserving bookmarks and shared links
- **Accessibility**: Ensure Bangla typography renders correctly across the application

## Summary

This change introduces full internationalization (i18n) support using the `@nuxtjs/i18n` module with the following capabilities:

1. **Locale Management**: Bangla (bn) as default, English (en) as toggle option
2. **Persistence**: User language preference stored and retrieved via cookies (not URL segments)
3. **Routing Strategy**: No prefix - URLs remain unchanged when switching languages
4. **Instant Switching**: Language changes immediately update UI without page reload using `setLocale()`
5. **Translation Storage**: JSON files in `app/locales/` directory
6. **Type Safety**: TypeScript integration for translation keys
7. **Bangla Typography**: Proper font support and rendering
8. **SEO Tags**: Manual implementation of hreflang and alternate links since URLs don't change

## Capabilities Delivered

### i18n Core Infrastructure
- Install and configure `@nuxtjs/i18n` module
- Set up locale detection with Bangla as primary default
- Configure browser language detection as secondary fallback
- Implement no_prefix routing strategy (URLs never change)
- Set up cookie-based persistence (not URL-based)

### Translation Management
- Create locale directory structure (`app/locales/`)
- Define translation key schema for type safety
- Store translations in separate JSON files per locale
- Provide guidelines for translation file organization

### Language Switcher State
- Create Pinia store for locale management
- Build composable (`useLocale.ts`) for language operations
- Implement instant language switching using `setLocale()` from @nuxtjs/i18n
- No page reload or URL change when switching
- Handle edge cases (missing translations, fallback logic)

### UI Integration
- Add LanguageSwitcher component to navigation header
- Ensure instant UI updates without page reload
- Ensure proper typography support for Bangla script
- Implement manual SEO meta tags (lang attributes, hreflang, alternate links)
- Provide reactive locale updates across components

### TypeScript Integration
- Generate types from translation JSON files
- Provide autocomplete for translation keys
- Enable compile-time validation of translation usage

## Affected Systems

- **State Management**: New Pinia store for locale state
- **Components**: LanguageSwitcher added to header
- **Styling**: Bangla font support configuration
- **SEO**: Manual meta tags implementation (hreflang, alternate links)
- **Build Process**: Type generation for translation keys
- **No URL Changes**: Routing system unaffected - URLs remain unchanged

## Trade-offs and Decisions

### Prefix vs. No-Prefix Strategy
**Decision**: No-prefix strategy (URLs remain unchanged)

**Rationale**:
- Instant language switching without page reload
- Seamless user experience - no redirects or URL changes
- Bookmarks and shared links work consistently
- Simpler navigation - no need to manage locale in routes
- Better UX for language exploration - users can switch freely

**Trade-off**: URLs don't indicate language, requiring manual SEO implementation (hreflang tags), but superior user experience

### Default Locale
**Decision**: Bangla (bn) as primary default

**Rationale**:
- Primary market is Bangladesh
- Aligns with business goals
- Browser language detection serves as secondary fallback
- English users can easily toggle

**Trade-off**: English-first users need to switch, but primary audience gets optimal experience

### Storage Strategy
**Decision**: Cookie-based persistence with localStorage fallback

**Rationale**:
- Cookies work with SSR (critical for Nuxt)
- Survives browser restarts
- Can be synchronized with localStorage for client-side only paths

**Trade-off**: Slight complexity in synchronization, but provides best UX

### Translation File Structure
**Decision**: Single JSON file per locale in `app/locales/`

**Rationale**:
- Simple and maintainable for current needs (2 languages)
- Easy to generate types from
- Follows Nuxt i18n conventions
- Can be split into namespaces later if needed

**Trade-off**: Single file per locale may grow large, but easier to manage than fragmented files initially

## Dependencies

This change depends on:
- No existing changes

Changes that depend on this:
- Future content pages that need Bangla translations
- Product catalog localization (out of scope for this change)

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| SEO challenges with same URL for multiple languages | High | Implement manual hreflang/alternate tags; monitor Google Search Console |
| Social media shares may not preserve language | Medium | Expected behavior; users can switch after navigating |
| Missing translations causing blank UI | Medium | Implement fallback logic to default locale, add warning in dev mode |
| Bangla font rendering issues | Medium | Test on multiple devices, include proper font stacks |
| Type generation complexity | Low | Use well-established patterns, document process |
| Analytics tracking language without URL params | Low | Use custom dimensions to track by cookie locale |

## Success Criteria

- [ ] Bangla is default language on first visit
- [ ] Language switcher accessible from header navigation
- [ ] Switching language updates UI instantly (< 100ms) without page reload
- [ ] URLs remain unchanged when switching languages
- [ ] Language preference persists across sessions (cookies)
- [ ] Browser language detection works as secondary fallback
- [ ] All static text translatable via `$t()` function
- [ ] TypeScript autocomplete works for translation keys
- [ ] Bangla typography renders correctly
- [ ] Manual SEO meta tags implemented (hreflang, alternate links, lang attributes)
- [ ] No regressions in existing functionality
- [ ] Build process generates types successfully

## Open Questions

1. **Font Choice**: Which Bangla font family should be prioritized? (Can be configured in Tailwind)
2. **Translation Coverage**: Should we translate all existing content immediately or incrementally?
3. **Number/Currency Formatting**: Should we use Bangla or Western numerals for prices in Bangla locale?

## Timeline Estimate

This is a medium-complexity change spanning multiple systems. Implementation should proceed incrementally with testing at each stage.

## References

- [@nuxtjs/i18n Documentation](https://i18n.nuxtjs.org/)
- [Nuxt i18n GitHub](https://github.com/nuxt-modules/i18n)
- Project conventions in `openspec/project.md`
