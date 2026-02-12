<script setup lang="ts">
import { getPublicImage } from '~/utils/image'

interface Props {
  modelValue?: string
  bucket?: string
}

const props = withDefaults(defineProps<Props>(), {
  bucket: 'product-images'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | undefined): void
}>()

const logo = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const uploading = ref(false)
const dragOver = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const getImageUrl = (path: string) => {
  return getPublicImage(props.bucket, path)
}

const handleFile = async (file: File | null) => {
  if (!file) return

  if (!file.type.startsWith('image/')) {
    console.warn('Please select an image file')
    return
  }

  uploading.value = true
  try {
    const { adminNetwork } = await import('~/network/admin')
    const response = await adminNetwork.uploadFile(file)
    logo.value = response.path
  } catch (error) {
    console.error('Failed to upload logo:', error)
  } finally {
    uploading.value = false
  }
}

const onDrop = (event: DragEvent) => {
  event.preventDefault()
  dragOver.value = false
  const file = event.dataTransfer?.files?.[0] || null
  handleFile(file)
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
  const file = target.files?.[0] || null
  handleFile(file)
  // Reset input so same file can be selected again
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const removeLogo = async () => {
  // Delete existing logo from storage if present
  if (logo.value) {
    try {
      const { adminNetwork } = await import('~/network/admin')
      await adminNetwork.deleteFile(logo.value)
    } catch (error) {
      console.error('Failed to delete logo from storage:', error)
    }
  }
  // Clear the logo value
  logo.value = null``
}
</script>

<template>
  <div class="space-y-4">
    <!-- Drop Zone / Preview -->
    <div
      class="border-2 border-dashed rounded-luxury p-8 text-center transition-colors duration-200 cursor-pointer relative"
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
        class="hidden"
        @change="onFileSelect"
      />

      <!-- Logo Preview -->
      <div v-if="logo && !uploading" class="space-y-4">
        <div class="flex justify-center">
          <img
            :src="getImageUrl(logo)"
            alt="Business logo"
            class="max-w-[200px] max-h-[200px] object-contain"
          />
        </div>

        <!-- Remove Button -->
        <button
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-luxury transition-colors"
          @click.stop="removeLogo"
        >
          <UiIcon name="trash-2" :size="16" />
          Remove Logo
        </button>
      </div>

      <!-- Upload Zone -->
      <div v-else class="flex flex-col items-center gap-2">
        <div v-if="uploading">
          <UiIcon name="loader-2" :size="48" class="animate-spin text-luxury-gold" />
          <span class="text-luxury-text-muted dark:text-luxury-dark-text-muted mt-4">Uploading...</span>
        </div>
        <div v-else class="flex flex-col items-center gap-2">
          <UiIcon name="image" :size="48" class="text-luxury-text-muted dark:text-luxury-dark-text-muted" />
          <p class="text-luxury-text-muted dark:text-luxury-dark-text-muted">
            <span class="text-luxury-gold font-medium">Click to upload</span> or drag and drop
          </p>
          <p class="text-sm text-luxury-text-muted/70 dark:text-luxury-dark-text-muted/70">
            PNG, JPG, GIF up to 10MB
          </p>
        </div>
      </div>
    </div>

    <!-- Help text -->
    <p class="text-sm text-luxury-text-muted/70 dark:text-luxury-dark-text-muted/70 text-center">
      Recommended size: 200x200px or larger. Square aspect ratio works best.
    </p>
  </div>
</template>
