<template>
  <div class="order-summary">
    <h3 class="text-lg font-bold text-luxury-text dark:text-luxury-dark-text mb-4 tracking-wide uppercase">{{ t('order.total') }}</h3>

    <div class="space-y-3 text-sm">
      <div class="flex justify-between text-luxury-text-muted dark:text-luxury-dark-text-muted">
        <span>{{ t('order.subtotal') }}</span>
        <span class="font-medium text-luxury-text dark:text-luxury-dark-text">{{ formatPrice(subtotal) }}</span>
      </div>
      <div class="flex justify-between text-luxury-text-muted dark:text-luxury-dark-text-muted">
        <span>{{ t('order.deliveryFee') }}</span>
        <span class="font-medium text-luxury-text dark:text-luxury-dark-text">{{ formatPrice(deliveryFee) }}</span>
      </div>
    </div>

    <div class="flex justify-between items-center mt-4 pt-4 border-t border-luxury-border dark:border-gray-600">
      <span class="text-lg font-bold text-luxury-text dark:text-luxury-dark-text">{{ t('order.total') }}</span>
      <span class="text-2xl font-bold text-luxury-gold">{{ formatPrice(total) }}</span>
    </div>

    <button
      type="button"
      :disabled="isDisabled || loading"
      class="mt-6 w-full bg-luxury-gold hover:bg-luxury-gold-hover text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
      @click="onSubmit"
    >
      <span v-if="loading" class="animate-spin text-lg">⟳</span>
      <template v-else>
        <span>{{ t('order.placeOrder') }}</span>
        <UiIcon name="arrow-right" :size="18" class="group-hover:translate-x-1 transition-transform" />
      </template>
    </button>

    <p v-if="success" class="text-center text-green-600 dark:text-green-400 text-sm">
      {{ successMessage }}
    </p>

    <p v-if="error" class="text-center text-red-600 dark:text-red-400 text-sm">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  subtotal: number
  deliveryFee: number
  total: number
  loading: boolean
  success: boolean
  error: boolean
  errorMessage: string
  successMessage: string
  hasProducts: boolean
}

const props = defineProps<Props>()
const { t } = useI18n()

const emit = defineEmits<{
  (e: 'submit'): void
}>()

const isDisabled = computed(() => !props.hasProducts)

function formatPrice(price: number): string {
  return `${price} TK`
}

function onSubmit() {
  emit('submit')
}
</script>
