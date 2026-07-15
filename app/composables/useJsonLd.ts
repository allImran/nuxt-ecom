import type { MaybeRefOrGetter } from 'vue'

/**
 * Inject a reactive JSON-LD (schema.org) block into <head>.
 *
 * Pass a value, ref, or getter that returns the structured-data object (or null
 * while data is still loading). The script tag is (re)rendered whenever the value
 * changes, so it works with data fetched in onMounted / useAsyncData.
 *
 * Note on the current static-SPA deployment: product data is fetched client-side,
 * so this JSON-LD is populated after hydration. Google's rendering crawler picks
 * it up; non-rendering social scrapers do not. Once product pages are prerendered
 * (nuxt generate, the C2 rendering fix), the same code emits the data into the
 * served HTML with no changes here.
 */
export function useJsonLd(data: MaybeRefOrGetter<Record<string, any> | null | undefined>) {
  const json = computed(() => {
    const value = toValue(data)
    if (!value) return ''
    // Escape "<" so a stray "</script>" inside a value can't break out of the tag.
    return JSON.stringify(value).replace(/</g, '\\u003c')
  })

  useHead({
    script: [
      {
        type: 'application/ld+json',
        // Only meaningful when json is non-empty; an empty string yields an inert
        // (ignored) tag while data is still loading.
        innerHTML: json,
      },
    ],
  })
}
