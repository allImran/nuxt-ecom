<template>
  <div class="order-division-select">
    <label class="block text-sm font-medium mb-2">{{ t('order.division') }} *</label>
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="t('order.search')"
        class="w-full px-4 py-3 border rounded-luxury focus:outline-none focus:ring-2 focus:ring-luxury-gold"
        @focus="showDropdown = true"
        @blur="handleBlur"
      />
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

function handleBlur() {
  // Delay to allow click event to fire
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}
</script>
