<template>
  <section class="order-address-section space-y-6">
    <OrderAddressInput
      :model-value="fullAddress"
      :error="submitAttempted ? (validationErrors.fullAddress || '') : ''"
      @update:modelValue="onAddressChange"
    />

    <OrderFullNameInput
      :model-value="fullName"
      :error="submitAttempted ? (validationErrors.fullName || '') : ''"
      @update:modelValue="onFullNameChange"
    />

    <OrderMobileInput
      :model-value="mobileNumber"
      :error="submitAttempted ? (validationErrors.mobileNumber || '') : ''"
      @update:modelValue="onMobileChange"
    />
    
  </section>
</template>

<script setup lang="ts">
interface Props {
  fullAddress: string
  mobileNumber: string
  fullName: string
  submitAttempted: boolean
  validationErrors: Record<string, string>
}

defineProps<Props>()
const { t } = useI18n()

const emit = defineEmits<{
  (e: 'addressChange', value: string): void
  (e: 'mobileChange', value: string): void
  (e: 'fullNameChange', value: string): void
}>()

function onAddressChange(value: string) {
  emit('addressChange', value)
}

function onMobileChange(value: string) {
  emit('mobileChange', value)
}

function onFullNameChange(value: string) {
  emit('fullNameChange', value)
}
</script>
