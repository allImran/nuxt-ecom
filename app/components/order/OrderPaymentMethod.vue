<template>
  <div class="order-payment-method space-y-3">
    <label class="flex items-center gap-3 p-4 border border-luxury-border dark:border-luxury-dark-border/30 rounded-luxury cursor-pointer">
      <input
        type="radio"
        :checked="selected"
        class="w-5 h-5 accent-luxury-gold"
      />
      <div>
        <p class="font-medium">{{ t('order.cashOnDelivery') }}</p>
        <p class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">Pay with cash upon delivery</p>
      </div>
    </label>

    <label class="flex items-center gap-3 p-4 border border-luxury-border dark:border-luxury-dark-border/30 rounded-luxury opacity-50">
      <input
        type="radio"
        disabled
        class="w-5 h-5"
      />
      <div>
        <p class="font-medium">{{ t('order.othersComingSoon') }}</p>
        <p class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">Mobile banking, cards, etc.</p>
      </div>
    </label>
  </div>
</template>

<script setup lang="ts">
interface Props {
  selected: boolean
}

defineProps<Props>()
const { t } = useI18n()
</script>
