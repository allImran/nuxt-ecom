<template>
  <div class="order-summary p-6 border border-luxury-border dark:border-luxury-dark-border rounded-luxury space-y-4">
    <h3 class="text-lg font-semibold tracking-luxury">{{ t('order.total') }}</h3>

    <div class="space-y-2">
      <div class="flex justify-between text-sm">
        <span class="text-luxury-text-muted dark:text-luxury-dark-text-muted">{{ t('order.subtotal') }}</span>
        <span>{{ formatPrice(subtotal) }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-luxury-text-muted dark:text-luxury-dark-text-muted">{{ t('order.deliveryFee') }}</span>
        <span>{{ formatPrice(deliveryFee) }}</span>
      </div>
      <div class="border-t border-luxury-border dark:border-luxury-dark-border pt-2 flex justify-between font-semibold text-lg">
        <span>{{ t('order.total') }}</span>
        <span>{{ formatPrice(total) }}</span>
      </div>
    </div>

    <button
      type="button"
      :disabled="isDisabled || loading"
      class="w-full bg-luxury-gold hover:bg-luxury-gold-hover text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-luxury-gold/30 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md group"
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
