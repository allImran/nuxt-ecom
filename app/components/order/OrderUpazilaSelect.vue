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
        class="w-full px-4 py-3 pr-10 border border-luxury-border dark:border-luxury-dark-border/30 rounded-luxury focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        @focus="showDropdown = true"
        @blur="handleBlur"
      />
      <button
        v-if="selectedUpazila"
        type="button"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-luxury-text-muted hover:text-luxury-text dark:text-luxury-dark-text-muted dark:hover:text-luxury-dark-text transition-colors"
        @click="clearUpazila"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
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

function clearUpazila() {
  props.onUpazilaChange(null)
  searchQuery.value = ''
}

function handleBlur() {
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}
</script>
