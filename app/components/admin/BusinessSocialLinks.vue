<script setup lang="ts">
import { nextTick } from 'vue'

interface SocialLink {
  platform: string
  url: string
}

interface Props {
  modelValue: Record<string, string>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, string>): void
}>()

const socialLinks = computed({
  get: () => {
    // Convert record to array for display (don't filter empty URLs)
    return Object.entries(props.modelValue || {})
      .map(([platform, url]) => ({ platform, url }))
  },
  set: (links: SocialLink[]) => {
    // Convert array back to record
    const record: Record<string, string> = {}
    for (const link of links) {
      if (link.platform) {
        record[link.platform] = link.url || ''
      }
    }
    emit('update:modelValue', record)
  }
})

const platforms = [
  { value: 'facebook', label: 'Facebook', icon: 'facebook' },
  { value: 'instagram', label: 'Instagram', icon: 'instagram' },
  { value: 'twitter', label: 'Twitter/X', icon: 'twitter' },
  { value: 'youtube', label: 'YouTube', icon: 'youtube' },
  { value: 'linkedin', label: 'LinkedIn', icon: 'linkedin' },
  { value: 'tiktok', label: 'TikTok', icon: 'tiktok' },
  { value: 'whatsapp', label: 'WhatsApp', icon: 'message-circle' },
  { value: 'website', label: 'Website', icon: 'globe' },
  { value: 'other', label: 'Other', icon: 'link' }
]

const addSocialLink = async () => {
  const newLinks = [...socialLinks.value]
  // Find platforms not already in use
  const usedPlatforms = new Set(newLinks.map(l => l.platform))
  const availablePlatform = platforms.find(p => !usedPlatforms.has(p.value))

  newLinks.push({
    platform: availablePlatform?.value || 'website',
    url: ''
  })

  socialLinks.value = newLinks
  // Use nextTick to ensure Vue processes the change
  await nextTick()
}

const removeSocialLink = (index: number) => {
  const newLinks = [...socialLinks.value]
  newLinks.splice(index, 1)
  socialLinks.value = newLinks
}

const updatePlatform = (index: number, platform: string) => {
  const newLinks = [...socialLinks.value]
  newLinks[index] = { ...newLinks[index], platform: platform || '' }
  socialLinks.value = newLinks
}

const updateUrl = (index: number, url: string) => {
  const newLinks = [...socialLinks.value]
  newLinks[index] = { ...newLinks[index], url: url || '' }
  socialLinks.value = newLinks
}
</script>

<template>
  <div class="space-y-4">
    <!-- Social Link Rows -->
    <div v-if="socialLinks.length > 0" class="space-y-3">
      <div
        v-for="(link, index) in socialLinks"
        :key="index"
        class="flex gap-3 items-start"
      >
        <!-- Platform Selector -->
        <div class="flex-1">
          <UiLuxurySelect
            :model-value="link.platform"
            @update:model-value="(v) => updatePlatform(index, v as string)"
            label="Platform"
            :options="platforms.map(p => ({ label: p.label, value: p.value }))"
          />
        </div>

        <!-- URL Input -->
        <div class="flex-[2]">
          <UiLuxuryInput
            :model-value="link.url"
            @update:model-value="(v) => updateUrl(index, v as string)"
            type="url"
            label="URL"
            placeholder="https://..."
            :id="`social-url-${index}`"
          />
        </div>

        <!-- Remove Button -->
        <button
          type="button"
          class="mt-6 p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-luxury transition-colors"
          title="Remove social link"
          @click="removeSocialLink(index)"
        >
          <UiIcon name="x" :size="18" />
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8 border-2 border-dashed border-luxury-border dark:border-luxury-dark-border rounded-luxury">
      <UiIcon name="share-2" :size="32" class="text-luxury-text-muted dark:text-luxury-dark-text-muted mx-auto mb-2" />
      <p class="text-luxury-text-muted dark:text-luxury-dark-text-muted">No social links added yet</p>
    </div>

    <!-- Add Button -->
    <UiLuxuryButton
      type="button"
      variant="outline"
      class="w-full"
      @click="addSocialLink"
    >
      <UiIcon name="plus" :size="16" class="mr-2" />
      Add Social Link
    </UiLuxuryButton>
  </div>
</template>
