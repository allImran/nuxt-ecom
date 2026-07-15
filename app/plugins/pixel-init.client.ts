/**
 * The base pixel snippet (nuxt.config.ts app.head.script) only fires PageView on the
 * initial hard load. This covers subsequent SPA route changes, which vue-router never
 * triggers a full page load for.
 */
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  if (!config.public.pixelId) return

  const router = useRouter()
  router.afterEach(() => {
    if (typeof (window as any).fbq === 'function') {
      ;(window as any).fbq('track', 'PageView')
    }
  })
})
