<template>
  <div class="order-district-select">
    <label class="block text-sm font-medium mb-2">
      {{ t('order.district') }}
      <span class="text-luxury-text-muted dark:text-luxury-dark-text-muted">({{ t('order.optional') }})</span>
    </label>
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="t('order.search')"
        :disabled="!selectedDivision"
        class="w-full px-4 py-3 border rounded-luxury focus:outline-none focus:ring-2 focus:ring-luxury-gold disabled:opacity-50 disabled:cursor-not-allowed"
        @focus="showDropdown = true"
        @blur="handleBlur"
      />
      <div
        v-if="showDropdown && filteredDistricts.length > 0"
        class="absolute z-10 w-full mt-1 bg-white dark:bg-luxury-dark-surface border border-luxury-border dark:border-luxury-dark-border rounded-luxury shadow-lg max-h-60 overflow-auto"
      >
        <div
          v-for="district in filteredDistricts"
          :key="district.id"
          class="px-4 py-3 cursor-pointer hover:bg-luxury-border dark:hover:bg-luxury-dark-border transition-colors"
          @mousedown="selectDistrict(district)"
        >
          {{ isBangla ? district.bn_name : district.name }}
        </div>
      </div>
    </div>
    <p v-if="selectedDistrictName" class="mt-2 text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
      {{ t('order.selectDistrict') }}: {{ selectedDistrictName }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { LocationData } from '~/types/location'

interface Props {
  selectedDivision: string | null
  selectedDistrict: string | null
  isBangla: boolean
  availableDistricts: LocationData[]
  searchDistricts: (query: string) => LocationData[]
  onDistrictChange: (value: string | null) => void
}

const props = defineProps<Props>()
const { t } = useI18n()

const searchQuery = ref('')
const showDropdown = ref(false)

const filteredDistricts = computed(() => {
  return props.searchDistricts(searchQuery.value)
})

const selectedDistrictName = computed(() => {
  if (!props.selectedDistrict) return ''
  const district = filteredDistricts.value.find(d => d.id === props.selectedDistrict)
  return district ? (props.isBangla ? district.bn_name : district.name) : ''
})

function selectDistrict(district: LocationData) {
  props.onDistrictChange(district.id)
  searchQuery.value = props.isBangla ? district.bn_name : district.name
  showDropdown.value = false
}

function handleBlur() {
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}
</script>
