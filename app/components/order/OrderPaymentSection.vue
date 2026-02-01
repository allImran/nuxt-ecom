<template>
  <section class="order-payment-section space-y-6">
    <h2 class="text-xl font-semibold tracking-luxury">{{ t('order.placeOrder') }}</h2>
    <OrderPaymentMethod :selected="true" />
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>
