export const useLocaleStore = defineStore('locale', () => {
  // Call useI18n at the top level to get the reactive locale
  const { locale, setLocale: i18nSetLocale } = useI18n()

  // Available locales with metadata
  const availableLocales = computed(() => [
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ])

  // Getters - use the i18n locale directly as source of truth
  const currentLocale = computed(() => locale.value as 'bn' | 'en')
  const isBangla = computed(() => locale.value === 'bn')
  const isEnglish = computed(() => locale.value === 'en')

  // Actions
  function setLocale(targetLocale: 'bn' | 'en') {
    i18nSetLocale(targetLocale)
  }

  function toggleLocale() {
    const newLocale = locale.value === 'bn' ? 'en' : 'bn'
    i18nSetLocale(newLocale)
  }

  return {
    currentLocale,
    availableLocales,
    isBangla,
    isEnglish,
    setLocale,
    toggleLocale
  }
})
