<template>
  <section class="order-address-section space-y-6">

    <OrderDivisionSelect
      :selected-division="selectedDivision"
      :is-bangla="isBangla"
      :search-divisions="searchDivisions"
      @division-change="onDivisionChange"
    />

    <OrderDistrictSelect
      v-if="selectedDivision"
      :selected-division="selectedDivision"
      :selected-district="selectedDistrict"
      :is-bangla="isBangla"
      :available-districts="availableDistricts"
      :search-districts="searchDistricts"
      @district-change="onDistrictChange"
    />

    <OrderUpazilaSelect
      v-if="selectedDistrict"
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

    <OrderFullNameInput
      :model-value="fullName"
      @update:modelValue="onFullNameChange"
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
  fullName: string
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
  (e: 'fullNameChange', value: string): void
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

function onFullNameChange(value: string) {
  emit('fullNameChange', value)
}
</script>
