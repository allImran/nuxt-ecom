<script setup lang="ts">
interface Props {
  currentPage: number
  totalPages: number
  itemsPerPage: number
  totalItems: number
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  'page-change': [page: number]
  'items-per-page-change': [itemsPerPage: number]
}>()

// Available items per page options
const itemsPerPageOptions = [10, 25, 50, 100]

// Computed: Page numbers to show
const pageNumbers = computed(() => {
  const pages: (number | string)[] = []
  const maxVisible = 5

  if (props.totalPages <= maxVisible) {
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i)
    }
  } else {
    if (props.currentPage <= 3) {
      pages.push(1, 2, 3, 4, '...', props.totalPages)
    } else if (props.currentPage >= props.totalPages - 2) {
      pages.push(1, '...', props.totalPages - 3, props.totalPages - 2, props.totalPages - 1, props.totalPages)
    } else {
      pages.push(1, '...', props.currentPage - 1, props.currentPage, props.currentPage + 1, '...', props.totalPages)
    }
  }

  return pages
})

// Computed: Start and end item numbers
const itemRange = computed(() => {
  const start = (props.currentPage - 1) * props.itemsPerPage + 1
  const end = Math.min(start + props.itemsPerPage - 1, props.totalItems)
  return { start, end }
})

// Navigate to page
function goToPage(page: number) {
  if (page >= 1 && page <= props.totalPages && !props.loading) {
    emit('page-change', page)
  }
}

// Change items per page
function changeItemsPerPage(itemsPerPage: number) {
  emit('items-per-page-change', itemsPerPage)
}
</script>

<template>
  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-luxury-surface dark:bg-luxury-dark-surface rounded-luxury p-4 shadow-luxury">
    <!-- Items Per Page Selector -->
    <div class="flex items-center gap-2">
      <span class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
        Show
      </span>
      <select
        :value="itemsPerPage"
        :disabled="loading"
        class="px-2 py-1 bg-luxury-bg dark:bg-luxury-dark-bg border border-luxury-border dark:border-luxury-dark-border rounded text-sm text-luxury-text dark:text-luxury-dark-text focus:outline-none focus:ring-1 focus:ring-luxury-gold disabled:opacity-50"
        @change="changeItemsPerPage(Number(($event.target as HTMLSelectElement).value))"
      >
        <option v-for="option in itemsPerPageOptions" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
      <span class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
        per page
      </span>
    </div>

    <!-- Page Info -->
    <div class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
      <span v-if="totalItems > 0">
        Showing {{ itemRange.start }} to {{ itemRange.end }} of {{ totalItems }} orders
      </span>
      <span v-else>
        No orders
      </span>
    </div>

    <!-- Pagination Controls -->
    <div class="flex items-center gap-1">
      <!-- Previous Button -->
      <button
        type="button"
        :disabled="currentPage === 1 || loading"
        class="p-2 rounded hover:bg-luxury-bg dark:hover:bg-luxury-dark-bg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        @click="goToPage(currentPage - 1)"
      >
        <UiIcon name="chevron-left" :size="18" class="text-luxury-text dark:text-luxury-dark-text" />
      </button>

      <!-- Page Numbers -->
      <template v-for="(page, index) in pageNumbers" :key="`page-${page}-${index}`">
        <span v-if="page === '...'" class="px-2 text-luxury-text-muted dark:text-luxury-dark-text-muted">
          ...
        </span>
        <button
          v-else
          type="button"
          :disabled="loading"
          class="min-w-[36px] h-9 px-3 rounded text-sm font-medium transition-colors"
          :class="currentPage === page
            ? 'bg-luxury-gold text-white'
            : 'text-luxury-text dark:text-luxury-dark-text hover:bg-luxury-bg dark:hover:bg-luxury-dark-bg'"
          @click="goToPage(page as number)"
        >
          {{ page }}
        </button>
      </template>

      <!-- Next Button -->
      <button
        type="button"
        :disabled="currentPage === totalPages || loading"
        class="p-2 rounded hover:bg-luxury-bg dark:hover:bg-luxury-dark-bg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        @click="goToPage(currentPage + 1)"
      >
        <UiIcon name="chevron-right" :size="18" class="text-luxury-text dark:text-luxury-dark-text" />
      </button>
    </div>
  </div>
</template>
