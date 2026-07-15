<script setup lang="ts">
interface CategoryOption {
  id: string
  name: string
}

interface Props {
  search: string
  category: string
  sort: string
  categories: CategoryOption[]
  resultCount: number
  totalCount: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:category': [value: string]
  'update:sort': [value: string]
  clear: []
}>()

const categoryOptions = computed(() => [
  { value: 'all', label: 'All Categories' },
  ...props.categories.map(c => ({ value: c.id, label: c.name })),
])

// Note: no price sort — the public list endpoint doesn't return variant prices,
// so the storefront grid has no price data to sort on. These all sort on fields
// the list payload actually contains.
const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
]

const hasActiveFilters = computed(() =>
  !!props.search || (props.category && props.category !== 'all') || (props.sort && props.sort !== 'featured')
)
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_auto_auto] gap-4 lg:gap-6 lg:items-end">
      <!-- Search -->
      <div class="relative">
        <UiLuxuryInput
          id="product-search"
          label="Search products"
          placeholder="Search products"
          :model-value="search"
          @update:model-value="emit('update:search', $event)"
        />
        <div class="absolute right-1 top-3 text-luxury-text-muted dark:text-luxury-dark-text-muted pointer-events-none">
          <UiIcon name="search" :size="18" />
        </div>
      </div>

      <!-- Category -->
      <div class="min-w-[12rem]">
        <UiLuxurySelect
          id="product-category"
          label="Category"
          :options="categoryOptions"
          :model-value="category || 'all'"
          @update:model-value="emit('update:category', String($event))"
        />
      </div>

      <!-- Sort -->
      <div class="min-w-[12rem]">
        <UiLuxurySelect
          id="product-sort"
          label="Sort by"
          :options="sortOptions"
          :model-value="sort || 'featured'"
          @update:model-value="emit('update:sort', String($event))"
        />
      </div>
    </div>

    <!-- Result summary + clear -->
    <div class="flex items-center justify-between text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
      <span>
        Showing {{ resultCount }} of {{ totalCount }} product{{ totalCount === 1 ? '' : 's' }}
      </span>
      <button
        v-if="hasActiveFilters"
        type="button"
        class="inline-flex items-center gap-1 text-luxury-gold hover:underline"
        @click="emit('clear')"
      >
        <UiIcon name="x" :size="14" />
        Clear filters
      </button>
    </div>
  </div>
</template>
