<script setup lang="ts">
interface Props {
  currentPage: number
  totalPages: number
}

const props = defineProps<Props>()

const route = useRoute()

// Real <a href> page links (preserve active filters via query) so navigation is
// crawlable and shareable, not just a click handler.
const linkTo = (page: number) => ({ path: route.path, query: { ...route.query, page: page === 1 ? undefined : String(page) } })

// Compact page window: first, last, current ±1, with … gaps.
const pages = computed<(number | '…')[]>(() => {
  const total = props.totalPages
  const current = props.currentPage
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const out: (number | '…')[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  if (start > 2) out.push('…')
  for (let p = start; p <= end; p++) out.push(p)
  if (end < total - 1) out.push('…')
  out.push(total)
  return out
})
</script>

<template>
  <nav v-if="totalPages > 1" aria-label="Pagination" class="flex items-center justify-center gap-2 mt-12">
    <!-- Previous -->
    <NuxtLink
      v-if="currentPage > 1"
      :to="linkTo(currentPage - 1)"
      rel="prev"
      class="inline-flex items-center justify-center w-10 h-10 rounded-luxury border border-luxury-border dark:border-luxury-dark-border text-luxury-text dark:text-luxury-dark-text hover:border-luxury-gold hover:text-luxury-gold transition-colors"
      aria-label="Previous page"
    >
      <UiIcon name="chevron-left" :size="18" />
    </NuxtLink>
    <span
      v-else
      class="inline-flex items-center justify-center w-10 h-10 rounded-luxury border border-luxury-border/50 dark:border-luxury-dark-border/50 text-luxury-text-muted/40 cursor-not-allowed"
      aria-hidden="true"
    >
      <UiIcon name="chevron-left" :size="18" />
    </span>

    <!-- Page numbers -->
    <template v-for="(p, i) in pages" :key="`${p}-${i}`">
      <span v-if="p === '…'" class="px-2 text-luxury-text-muted dark:text-luxury-dark-text-muted select-none">…</span>
      <NuxtLink
        v-else
        :to="linkTo(p)"
        :aria-current="p === currentPage ? 'page' : undefined"
        class="inline-flex items-center justify-center min-w-10 h-10 px-3 rounded-luxury border transition-colors"
        :class="p === currentPage
          ? 'border-luxury-gold bg-luxury-gold text-white'
          : 'border-luxury-border dark:border-luxury-dark-border text-luxury-text dark:text-luxury-dark-text hover:border-luxury-gold hover:text-luxury-gold'"
      >
        {{ p }}
      </NuxtLink>
    </template>

    <!-- Next -->
    <NuxtLink
      v-if="currentPage < totalPages"
      :to="linkTo(currentPage + 1)"
      rel="next"
      class="inline-flex items-center justify-center w-10 h-10 rounded-luxury border border-luxury-border dark:border-luxury-dark-border text-luxury-text dark:text-luxury-dark-text hover:border-luxury-gold hover:text-luxury-gold transition-colors"
      aria-label="Next page"
    >
      <UiIcon name="chevron-right" :size="18" />
    </NuxtLink>
    <span
      v-else
      class="inline-flex items-center justify-center w-10 h-10 rounded-luxury border border-luxury-border/50 dark:border-luxury-dark-border/50 text-luxury-text-muted/40 cursor-not-allowed"
      aria-hidden="true"
    >
      <UiIcon name="chevron-right" :size="18" />
    </span>
  </nav>
</template>
