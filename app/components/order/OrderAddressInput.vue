<template>
  <div class="order-address-input">
    <label class="block text-sm font-medium mb-2">{{ t('order.fullAddress') }} *</label>
    <textarea
      :value="modelValue"
      :placeholder="t('order.fullAddress')"
      rows="3"
      class="w-full px-4 py-3 border border-luxury-border dark:border-luxury-dark-border rounded-luxury focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent resize-none"
      @input="onInput"
    />
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
