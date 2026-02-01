<template>
  <div class="order-upazila-select">
    <label class="block text-sm font-medium mb-2">
      {{ t('order.upazila') }}
      <span class="text-luxury-text-muted dark:text-luxury-dark-text-muted">({{ t('order.optional') }})</span>
    </label>
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="t('order.search')"
        :disabled="!selectedDistrict"
        class="w-full px-4 py-3 border rounded-luxury focus:outline-none focus:ring-2 focus:ring-luxury-gold disabled:opacity-50 disabled:cursor-not-allowed"
        @focus="showDropdown = true"
        @blur="handleBlur"
      />
      <div
        v-if="showDropdown && filteredUpazilas.length > 0"
        class="absolute z-10 w-full mt-1 bg-white dark:bg-luxury-dark-surface border border-luxury-border dark:border-luxury-dark-border rounded-luxury shadow-lg max-h-60 overflow-auto"
      >
        <div
          v-for="upazila in filteredUpazilas"
          :key="upazila.id"
          class="px-4 py-3 cursor-pointer hover:bg-luxury-border dark:hover:bg-luxury-dark-border transition-colors"
          @mousedown="selectUpazila(upazila)"
        >
          {{ isBangla ? upazila.bn_name : upazila.name }}
        </div>
      </div>
    </div>
    <p v-if="selectedUpazilaName" class="mt-2 text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
      {{ t('order.selectUpazila') }}: {{ selectedUpazilaName }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { LocationData } from '~/types/location'

interface Props {
  selectedDistrict: string | null
  selectedUpazila: string | null
  isBangla: boolean
  availableUpazilas: LocationData[]
  searchUpazilas: (query: string) => LocationData[]
  onUpazilaChange: (value: string | null) => void
}

const props = defineProps<Props>()
const { t } = useI18n()

const searchQuery = ref('')
const showDropdown = ref(false)

const filteredUpazilas = computed(() => {
  return props.searchUpazilas(searchQuery.value)
})

const selectedUpazilaName = computed(() => {
  if (!props.selectedUpazila) return ''
  const upazila = filteredUpazilas.value.find(u => u.id === props.selectedUpazila)
  return upazila ? (props.isBangla ? upazila.bn_name : upazila.name) : ''
})

function selectUpazila(upazila: LocationData) {
  props.onUpazilaChange(upazila.id)
  searchQuery.value = props.isBangla ? upazila.bn_name : upazila.name
  showDropdown.value = false
}

function handleBlur() {
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}
</script>
