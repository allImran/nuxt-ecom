<script setup lang="ts">
const { currentLocale, availableLocales, switchLanguage } = useLocale()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

// Instant language switch using setLocale from @nuxtjs/i18n
// Updates UI immediately without page reload or URL change
function handleLanguageSelect(localeCode: string) {
  switchLanguage(localeCode as 'bn' | 'en')
  isOpen.value = false
}

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

// Add/remove click event listener
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="dropdownRef" class="relative">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      :aria-label="`Switch language. Current: ${availableLocales.find(l => l.code === currentLocale)?.name}`"
      aria-haspopup="true"
      :aria-expanded="isOpen"
    >
      <span class="text-xl" aria-hidden="true">
        {{ availableLocales.find(l => l.code === currentLocale)?.flag }}
      </span>
      <span class="hidden sm:inline">
        {{ availableLocales.find(l => l.code === currentLocale)?.name }}
      </span>
      <svg
        class="w-4 h-4 transition-transform"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
      role="menu"
    >
      <button
        v-for="locale in availableLocales"
        :key="locale.code"
        @click="handleLanguageSelect(locale.code)"
        class="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg transition-colors text-left"
        :class="{
          'bg-gray-100 dark:bg-gray-700': locale.code === currentLocale,
          'font-semibold': locale.code === currentLocale
        }"
        :aria-current="locale.code === currentLocale ? 'true' : undefined"
        role="menuitem"
      >
        <span class="text-xl" aria-hidden="true">{{ locale.flag }}</span>
        <span>{{ locale.name }}</span>
        <svg
          v-if="locale.code === currentLocale"
          class="w-4 h-4 ml-auto text-green-600"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
