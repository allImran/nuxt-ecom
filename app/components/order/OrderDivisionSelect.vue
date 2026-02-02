<template>
  <div class="order-division-select">
    <label class="block text-sm font-medium mb-2">{{ t('order.division') }} *</label>
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="t('order.search')"
        class="w-full px-4 py-3 pr-10 border border-luxury-border dark:border-luxury-dark-border rounded-luxury focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
        @focus="showDropdown = true"
        @blur="handleBlur"
      />
      <button
        v-if="selectedDivision"
        type="button"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-luxury-text-muted hover:text-luxury-text dark:text-luxury-dark-text-muted dark:hover:text-luxury-dark-text transition-colors"
        @click="clearDivision"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
      <div
        v-if="showDropdown && filteredDivisions.length > 0"
        class="absolute z-10 w-full mt-1 bg-white dark:bg-luxury-dark-surface border border-luxury-border dark:border-luxury-dark-border rounded-luxury shadow-lg max-h-60 overflow-auto"
      >
        <div
          v-for="division in filteredDivisions"
          :key="division.id"
          class="px-4 py-3 cursor-pointer hover:bg-luxury-border dark:hover:bg-luxury-dark-border transition-colors"
          @mousedown="selectDivision(division)"
        >
          {{ isBangla ? division.bn_name : division.name }}
        </div>
      </div>
    </div>
    <p v-if="selectedDivisionName" class="mt-2 text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
      {{ t('order.selectDivision') }}: {{ selectedDivisionName }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { LocationData } from '~/types/location'

interface Props {
  selectedDivision: string | null
  isBangla: boolean
  searchDivisions: (query: string) => LocationData[]
  onDivisionChange: (value: string | null) => void
}

const props = defineProps<Props>()
const { t } = useI18n()

const searchQuery = ref('')
const showDropdown = ref(false)

const filteredDivisions = computed(() => {
  return props.searchDivisions(searchQuery.value)
})

const selectedDivisionName = computed(() => {
  if (!props.selectedDivision) return ''
  const division = filteredDivisions.value.find(d => d.id === props.selectedDivision)
  return division ? (props.isBangla ? division.bn_name : division.name) : ''
})

function selectDivision(division: LocationData) {
  props.onDivisionChange(division.id)
  searchQuery.value = props.isBangla ? division.bn_name : division.name
  showDropdown.value = false
}

function clearDivision() {
  props.onDivisionChange(null)
  searchQuery.value = ''
}

function handleBlur() {
  // Delay to allow click event to fire
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}
</script>
