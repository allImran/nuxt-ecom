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
          <UiIcon name="align-left" :size="16" class="mr-2" />
          Add Text
        </UiLuxuryButton>
        <UiLuxuryButton variant="outline" @click="addSection('media')">
          <UiIcon name="image" :size="16" class="mr-2" />
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
              <UiIcon name="chevron-up" :size="16" />
            </button>
            <!-- Move Down -->
            <button
              v-if="index < sections.length - 1"
              type="button"
              class="p-1.5 text-luxury-text-muted hover:text-luxury-gold transition-colors"
              title="Move down"
              @click="moveSection(index, index + 1)"
            >
              <UiIcon name="chevron-down" :size="16" />
            </button>
            <!-- Remove -->
            <button
              type="button"
              class="p-1.5 text-luxury-text-muted hover:text-red-500 transition-colors"
              title="Remove section"
              @click="removeSection(index)"
            >
              <UiIcon name="trash-2" :size="16" />
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
            <UiIcon v-if="uploadingSection !== index" name="plus" :size="16" class="text-luxury-text-muted" />
            <UiIcon v-else name="loader-2" :size="16" class="animate-spin text-luxury-gold" />
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
                <UiIcon name="x" :size="12" class="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8 text-luxury-text-muted dark:text-luxury-dark-text-muted border border-dashed border-luxury-border dark:border-luxury-dark-border rounded-luxury">
      <UiIcon name="file-text" :size="48" class="mx-auto mb-4 opacity-50" />
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
