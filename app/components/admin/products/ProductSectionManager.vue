<script setup lang="ts">
import type { ProductSection } from '~/network/admin'
import { useProductViewModel } from '~/composables/useProductViewModel'
import { getPublicImage } from '~/utils/image'

interface Props {
  bucket?: string
}

const props = withDefaults(defineProps<Props>(), {
  bucket: 'product-images'
})

const {
  productForm,
  uploadingSection,
  addSection,
  removeSection,
  updateSectionContent,
  moveSection,
  handleSectionFileUpload,
  removeSectionMediaFile
} = useProductViewModel()

const sections = computed(() => productForm.sections || [])

const handleFileUpload = async (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files || files.length === 0) return

  await handleSectionFileUpload(index, files)
  target.value = ''
}

const getImageUrl = (path: string) => {
  return getPublicImage(props.bucket, path)
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-medium text-luxury-text dark:text-luxury-dark-text">
        Content Sections
      </h3>
      <div class="flex items-center gap-2">
        <UiLuxuryButton variant="outline" @click="addSection('text')">
          <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          Add Text
        </UiLuxuryButton>
        <UiLuxuryButton variant="outline" @click="addSection('media')">
          <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Add Media
        </UiLuxuryButton>
      </div>
    </div>

    <!-- Sections List -->
    <div v-if="sections.length > 0" class="space-y-4">
      <div
        v-for="(section, index) in sections"
        :key="index"
        class="border border-luxury-border dark:border-luxury-dark-border rounded-luxury p-4 space-y-3"
      >
        <!-- Section Header -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-luxury-text-muted dark:text-luxury-dark-text-muted uppercase tracking-wide">
              {{ section.type === 'text' ? 'Text Section' : 'Media Section' }}
            </span>
            <span class="text-xs text-luxury-text-muted/60 dark:text-luxury-dark-text-muted/60">
              #{{ index + 1 }}
            </span>
          </div>
          <div class="flex items-center gap-1">
            <!-- Move Up -->
            <button
              v-if="index > 0"
              type="button"
              class="p-1.5 text-luxury-text-muted hover:text-luxury-gold transition-colors"
              title="Move up"
              @click="moveSection(index, index - 1)"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <!-- Move Down -->
            <button
              v-if="index < sections.length - 1"
              type="button"
              class="p-1.5 text-luxury-text-muted hover:text-luxury-gold transition-colors"
              title="Move down"
              @click="moveSection(index, index + 1)"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <!-- Remove -->
            <button
              type="button"
              class="p-1.5 text-luxury-text-muted hover:text-red-500 transition-colors"
              title="Remove section"
              @click="removeSection(index)"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Text Section Content -->
        <div v-if="section.type === 'text'">
          <QuillEditor
            :content="section.content || ''"
            content-type="html"
            :toolbar="[
              ['bold', 'italic', 'underline'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'header': [1, 2, 3, false] }],
              ['link'],
              ['clean']
            ]"
            placeholder="Enter text content..."
            theme="snow"
            class="luxury-quill-editor"
            @update:content="updateSectionContent(index, $event)"
          />
        </div>

        <!-- Media Section Content -->
        <div v-else class="space-y-3">
          <!-- Upload Button -->
          <label
            class="inline-flex items-center gap-2 px-4 py-2 border border-dashed border-luxury-border dark:border-luxury-dark-border rounded-luxury cursor-pointer hover:border-luxury-gold transition-colors"
            :class="{ 'opacity-50 pointer-events-none': uploadingSection === index }"
          >
            <input
              type="file"
              accept="image/*"
              multiple
              class="hidden"
              @change="handleFileUpload(index, $event)"
            />
            <svg v-if="uploadingSection !== index" class="h-4 w-4 text-luxury-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <svg v-else class="h-4 w-4 animate-spin text-luxury-gold" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
              {{ uploadingSection === index ? 'Uploading...' : 'Add Images' }}
            </span>
          </label>

          <!-- Media Grid -->
          <div v-if="section.file_paths && section.file_paths.length > 0" class="grid grid-cols-3 sm:grid-cols-4 gap-2">
            <div
              v-for="(path, fileIndex) in section.file_paths"
              :key="path"
              class="relative group aspect-square rounded overflow-hidden bg-luxury-surface dark:bg-luxury-dark-surface"
            >
              <img
                :src="getImageUrl(path)"
                :alt="`Section media ${fileIndex + 1}`"
                class="w-full h-full object-cover"
              />
              <button
                type="button"
                class="absolute top-1 right-1 p-1 bg-red-500/80 hover:bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove"
                @click="removeSectionMediaFile(index, fileIndex)"
              >
                <svg class="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8 text-luxury-text-muted dark:text-luxury-dark-text-muted border border-dashed border-luxury-border dark:border-luxury-dark-border rounded-luxury">
      <svg class="h-12 w-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="mb-2">No content sections yet.</p>
      <p class="text-sm">Add text or media sections to build your product description.</p>
    </div>
  </div>
</template>

<style scoped>
/* Quill Editor Luxury Theme Styling */
:deep(.luxury-quill-editor) {
  border-radius: 1.5rem;
}

:deep(.luxury-quill-editor .ql-toolbar) {
  border: 1px solid rgb(229, 231, 235);
  border-top-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
  background: rgb(255, 255, 255);
  border-bottom: none;
}

:deep(.luxury-quill-editor .ql-container) {
  border: 1px solid rgb(229, 231, 235);
  border-bottom-left-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
  background: transparent;
  font-size: 1rem;
  min-height: 120px;
}

:deep(.luxury-quill-editor .ql-editor) {
  color: rgb(17, 24, 39);
  background: transparent;
}

:deep(.luxury-quill-editor .ql-editor.ql-blank::before) {
  color: rgb(107, 114, 128);
  font-style: normal;
}

:deep(.luxury-quill-editor:focus-within .ql-toolbar) {
  border-color: rgb(212, 175, 55);
}

:deep(.luxury-quill-editor:focus-within .ql-container) {
  border-color: rgb(212, 175, 55);
}

/* Dark mode styling */
:deep(.dark .luxury-quill-editor .ql-toolbar) {
  border-color: rgb(55, 65, 81);
  background: rgb(17, 24, 39);
}

:deep(.dark .luxury-quill-editor .ql-container) {
  border-color: rgb(55, 65, 81);
  background: transparent;
}

:deep(.dark .luxury-quill-editor .ql-editor) {
  color: rgb(243, 244, 246);
}

:deep(.dark .luxury-quill-editor .ql-editor.ql-blank::before) {
  color: rgb(156, 163, 175);
}

:deep(.dark .luxury-quill-editor:focus-within .ql-toolbar) {
  border-color: rgb(212, 175, 55);
}

:deep(.dark .luxury-quill-editor:focus-within .ql-container) {
  border-color: rgb(212, 175, 55);
}

/* Toolbar button styling */
:deep(.luxury-quill-editor .ql-toolbar button) {
  color: rgb(107, 114, 128);
}

:deep(.luxury-quill-editor .ql-toolbar button:hover) {
  color: rgb(212, 175, 55);
}

:deep(.luxury-quill-editor .ql-toolbar button.ql-active) {
  color: rgb(212, 175, 55);
}

:deep(.dark .luxury-quill-editor .ql-toolbar button) {
  color: rgb(156, 163, 175);
}

:deep(.dark .luxury-quill-editor .ql-toolbar button:hover) {
  color: rgb(212, 175, 55);
}

:deep(.dark .luxury-quill-editor .ql-toolbar button.ql-active) {
  color: rgb(212, 175, 55);
}

/* Toolbar styling */
:deep(.luxury-quill-editor .ql-toolbar .ql-picker-label) {
  color: rgb(107, 114, 128);
}

:deep(.luxury-quill-editor .ql-toolbar .ql-picker-label:hover) {
  color: rgb(212, 175, 55);
}

:deep(.luxury-quill-editor .ql-toolbar .ql-picker-label.ql-active) {
  color: rgb(212, 175, 55);
}

:deep(.dark .luxury-quill-editor .ql-toolbar .ql-picker-label) {
  color: rgb(156, 163, 175);
}

:deep(.dark .luxury-quill-editor .ql-toolbar .ql-picker-label:hover) {
  color: rgb(212, 175, 55);
}

:deep(.dark .luxury-quill-editor .ql-toolbar .ql-picker-label.ql-active) {
  color: rgb(212, 175, 55);
}
</style>
