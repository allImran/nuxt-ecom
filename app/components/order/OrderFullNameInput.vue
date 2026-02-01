<template>
  <div class="order-full-name-input">
    <label class="block text-sm font-medium mb-2">{{ t('order.fullName') }} *</label>
    <input
      :value="modelValue"
      type="text"
      :placeholder="t('order.fullName')"
      class="w-full px-4 py-3 border border-luxury-border dark:border-luxury-dark-border/30 rounded-luxury focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
      @input="onInput"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

defineProps<Props>()
const { t } = useI18n()

const emit = defineEmits<Emits>()

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>
