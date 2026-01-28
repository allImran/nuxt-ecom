<script setup lang="ts">
import { useProductViewModel } from '~/composables/useProductViewModel'
import { getPublicImage } from '~/utils/image'

interface Props {
  bucket?: string
}

const props = withDefaults(defineProps<Props>(), {
  bucket: 'product-images'
})

const { productForm, uploadFile, uploading: isUploading } = useProductViewModel()

const uploading = computed(() => isUploading.value)
const dragOver = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const images = computed(() => productForm.file_paths || [])

const getImageUrl = (path: string) => {
  return getPublicImage(props.bucket, path)
}

const handleFiles = async (files: FileList | null) => {
  if (!files || files.length === 0) return

  const newPaths: string[] = []

  for (const file of Array.from(files)) {
    if (!file.type.startsWith('image/')) {
      console.warn(`Skipping non-image file: ${file.name}`)
      continue
    }

    try {
      const response = await uploadFile(file)
      newPaths.push(response.path)
    } catch (error) {
      console.error('Failed to upload image:', error)
    }
  }

  if (newPaths.length > 0) {
    productForm.file_paths = [...images.value, ...newPaths]
  }
}

const onDrop = (event: DragEvent) => {
  event.preventDefault()
  dragOver.value = false
  handleFiles(event.dataTransfer?.files || null)
}

const onDragOver = (event: DragEvent) => {
  event.preventDefault()
  dragOver.value = true
}

const onDragLeave = () => {
  dragOver.value = false
}

const onFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  handleFiles(target.files)
  // Reset input so same file can be selected again
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const removeImage = (index: number) => {
  const newImages = [...images.value]
  newImages.splice(index, 1)
  productForm.file_paths = newImages
}

const moveImage = (fromIndex: number, toIndex: number) => {
  if (toIndex < 0 || toIndex >= images.value.length) return
  const newImages = [...images.value]
  const [removed] = newImages.splice(fromIndex, 1)
  if (removed) {
    newImages.splice(toIndex, 0, removed)
    productForm.file_paths = newImages
  }
}
</script>

<template>
  <div class="space-y-4">
    <!-- {{productForm.file_paths}} -->
    <!-- Drop Zone -->
    <div
      class="border-2 border-dashed rounded-luxury p-8 text-center transition-colors duration-200 cursor-pointer"
      :class="[
        dragOver
          ? 'border-luxury-gold bg-luxury-gold/5'
          : 'border-luxury-border dark:border-luxury-dark-border hover:border-luxury-gold/50',
        uploading ? 'opacity-50 pointer-events-none' : ''
      ]"
      @drop="onDrop"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        multiple
        class="hidden"
        @change="onFileSelect"
      />

      <div v-if="uploading" class="flex flex-col items-center gap-2">
        <svg class="animate-spin h-8 w-8 text-luxury-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-luxury-text-muted dark:text-luxury-dark-text-muted">Uploading...</span>
      </div>

      <div v-else class="flex flex-col items-center gap-2">
        <svg class="h-10 w-10 text-luxury-text-muted dark:text-luxury-dark-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p class="text-luxury-text-muted dark:text-luxury-dark-text-muted">
          <span class="text-luxury-gold font-medium">Click to upload</span> or drag and drop
        </p>
        <p class="text-sm text-luxury-text-muted/70 dark:text-luxury-dark-text-muted/70">
          PNG, JPG, GIF up to 10MB
        </p>
      </div>
    </div>

    <!-- Image Grid -->
    <div v-if="images.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <div
        v-for="(path, index) in images"
        :key="path"
        class="relative group aspect-square rounded-luxury overflow-hidden bg-luxury-surface dark:bg-luxury-dark-surface border border-luxury-border dark:border-luxury-dark-border"
      >
        <img
          :src="getImageUrl(path)"
          :alt="`Product image ${index + 1}`"
          class="w-full h-full object-cover"
        />

        <!-- Overlay with actions -->
        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
          <!-- Move Left -->
          <button
            v-if="index > 0"
            type="button"
            class="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            title="Move left"
            @click.stop="moveImage(index, index - 1)"
          >
            <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <!-- Move Right -->
          <button
            v-if="index < images.length - 1"
            type="button"
            class="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            title="Move right"
            @click.stop="moveImage(index, index + 1)"
          >
            <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <!-- Remove -->
          <button
            type="button"
            class="p-2 bg-red-500/80 hover:bg-red-500 rounded-full transition-colors"
            title="Remove image"
            @click.stop="removeImage(index)"
          >
            <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Primary badge for first image -->
        <div
          v-if="index === 0"
          class="absolute top-2 left-2 px-2 py-1 bg-luxury-gold text-white text-xs font-medium rounded"
        >
          Primary
        </div>
      </div>
    </div>
  </div>
</template>
