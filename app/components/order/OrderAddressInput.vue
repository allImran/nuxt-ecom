<template>
  <div class="order-address-input">
    <label class="block text-sm font-medium text-luxury-text dark:text-luxury-dark-text mb-1.5">{{ t('order.fullAddress') }} <span class="text-luxury-gold">*</span></label>
    <div class="relative">
      <textarea
        :value="modelValue"
        name="address"
        :placeholder="t('order.fullAddress')"
        rows="3"
        class="block w-full px-4 py-3 rounded-lg bg-luxury-bg dark:bg-luxury-dark-bg border border-luxury-border dark:border-gray-600 text-luxury-text dark:text-luxury-dark-text placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all resize-none pr-10"
        @input="onInput"
      />
      <UiIcon name="home" :size="20" class="absolute right-3 top-3.5 text-luxury-text-muted pointer-events-none" />
    </div>
    <p v-if="error" class="mt-2 text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  error: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

defineProps<Props>()
const { t } = useI18n()

const emit = defineEmits<Emits>()

function onInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>
