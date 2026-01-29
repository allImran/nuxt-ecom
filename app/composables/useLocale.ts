export function useLocale() {
  const localeStore = useLocaleStore()
  const { locale, locales, t } = useI18n()

  // Switch language instantly without page reload
  // Uses the store's setLocale which calls i18n's setLocale
  // This updates:
  // - Cookie automatically
  // - Vue i18n locale reactively
  // - All components using $t() or t() re-render
  function switchLanguage(targetLocale: 'bn' | 'en') {
    localeStore.setLocale(targetLocale)
    // No navigateTo() needed with no_prefix strategy
  }

  // Bangla-specific utilities
  const isBangla = computed(() => locale.value === 'bn')

  return {
    ...localeStore,
    locale,
    locales,
    t,
    switchLanguage,
    isBangla
  }
}
