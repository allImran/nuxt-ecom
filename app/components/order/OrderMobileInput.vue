<template>
  <div class="order-mobile-input">
    <label class="block text-sm font-medium mb-2">{{ t('order.mobileNumber') }} *</label>
    <input
      :value="modelValue"
      type="tel"
      :placeholder="t('order.mobileNumber')"
      class="w-full px-4 py-3 border rounded-luxury focus:outline-none focus:ring-2 focus:ring-luxury-gold"
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
