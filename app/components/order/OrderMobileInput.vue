<template>
  <div class="order-mobile-input">
    <label class="block text-sm font-medium mb-2">{{ t('order.mobileNumber') }} *</label>
    <input
      :value="modelValue"
      type="tel"
      name="phone"
      placeholder="01xxxxxxxxx"
      class="w-full px-4 py-3 border border-luxury-border dark:border-luxury-dark-border rounded-luxury focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
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
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>
