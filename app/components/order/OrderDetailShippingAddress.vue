<script setup lang="ts">
import type { ShippingAddress } from '~/types/order'

interface Props {
  shippingAddress: ShippingAddress
}

const props = defineProps<Props>()

// Build full location string
const fullLocation = computed(() => {
  const parts = [
    props.shippingAddress.address,
    props.shippingAddress.upazila_name,
    props.shippingAddress.district_name,
    props.shippingAddress.division_name
  ].filter(Boolean)
  return parts.join(', ')
})
</script>

<template>
  <div class="bg-luxury-surface dark:bg-luxury-dark-surface rounded-luxury p-6 sm:p-8 shadow-luxury">
    <div class="flex items-start gap-4">
      <!-- Location Icon -->
      <div class="flex-shrink-0 mt-1">
        <UiIcon name="map-pin" :size="20" class="text-luxury-gold" />
      </div>

      <!-- Address Info -->
      <div class="flex-1">
        <h2 class="text-lg font-semibold text-luxury-text dark:text-luxury-dark-text mb-4 tracking-luxury">
          {{ $t('order.shippingAddress') }}
        </h2>

        <div class="space-y-2">
          <!-- Name (if exists) -->
          <p v-if="shippingAddress.full_name" class="text-base text-luxury-text dark:text-luxury-dark-text">
            {{ shippingAddress.full_name }}
          </p>

          <!-- Mobile -->
          <p class="text-base text-luxury-text dark:text-luxury-dark-text">
            {{ shippingAddress.mobile }}
          </p>

          <!-- Full Address -->
          <p class="text-base text-luxury-text-muted dark:text-luxury-dark-text-muted">
            {{ fullLocation }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
