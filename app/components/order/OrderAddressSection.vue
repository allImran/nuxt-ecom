<template>
  <section class="order-address-section space-y-6">
    <h2 class="text-xl font-semibold tracking-luxury">{{ t('order.title') }}</h2>

    <OrderDivisionSelect
      :selected-division="selectedDivision"
      :is-bangla="isBangla"
      :search-divisions="searchDivisions"
      @division-change="onDivisionChange"
    />

    <OrderDistrictSelect
      :selected-division="selectedDivision"
      :selected-district="selectedDistrict"
      :is-bangla="isBangla"
      :available-districts="availableDistricts"
      :search-districts="searchDistricts"
      @district-change="onDistrictChange"
    />

    <OrderUpazilaSelect
      :selected-district="selectedDistrict"
      :selected-upazila="selectedUpazila"
      :is-bangla="isBangla"
      :available-upazilas="availableUpazilas"
      :search-upazilas="searchUpazilas"
      @upazila-change="onUpazilaChange"
    />

    <OrderAddressInput
      :model-value="fullAddress"
      @update:modelValue="onAddressChange"
    />

    <OrderMobileInput
      :model-value="mobileNumber"
      @update:modelValue="onMobileChange"
    />
  </section>
</template>

<script setup lang="ts">
import type { LocationData } from '~/types/location'

interface Props {
  selectedDivision: string | null
  selectedDistrict: string | null
  selectedUpazila: string | null
  fullAddress: string
  mobileNumber: string
  isBangla: boolean
  availableDistricts: LocationData[]
  availableUpazilas: LocationData[]
  searchDivisions: (query: string) => LocationData[]
  searchDistricts: (query: string) => LocationData[]
  searchUpazilas: (query: string) => LocationData[]
}

defineProps<Props>()
const { t } = useI18n()

const emit = defineEmits<{
  (e: 'divisionChange', value: string | null): void
  (e: 'districtChange', value: string | null): void
  (e: 'upazilaChange', value: string | null): void
  (e: 'addressChange', value: string): void
  (e: 'mobileChange', value: string): void
}>()

function onDivisionChange(value: string | null) {
  emit('divisionChange', value)
}

function onDistrictChange(value: string | null) {
  emit('districtChange', value)
}

function onUpazilaChange(value: string | null) {
  emit('upazilaChange', value)
}

function onAddressChange(value: string) {
  emit('addressChange', value)
}

function onMobileChange(value: string) {
  emit('mobileChange', value)
}
</script>
