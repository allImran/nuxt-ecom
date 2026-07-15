<script setup lang="ts">
const { t } = useI18n()
const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)
const businessBrandingStore = useBusinessBrandingStore()
const { business, logoUrl } = storeToRefs(businessBrandingStore)
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const cartStore = useCartStore()
const { totalItems } = storeToRefs(cartStore)

// Wordmark fallback: prefer the loaded business name, otherwise the deployment's
// configured site name. Undefined while branding loads — the template shows a
// small skeleton in that window instead of a placeholder brand.
const runtimeConfig = useRuntimeConfig()
const brandName = computed(
  () => business.value?.name || (runtimeConfig.public.siteName as string | undefined)
)

// Compact the header once the page scrolls (subtle shrink + elevation), mirroring
// the polish in the reference design. Client-only listener, cleaned up on unmount.
const scrolled = ref(false)
const onScroll = () => {
  scrolled.value = window.scrollY > 8
}

// Desktop account dropdown (name / email / logout tucked behind the avatar).
const isUserMenuOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)
const displayName = computed(() => user.value?.email?.split('@')[0] || 'User')

const handleClickOutside = (event: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    isUserMenuOpen.value = false
  }
}

const handleLogout = () => {
  isUserMenuOpen.value = false
  authStore.logout()
}

onMounted(() => {
  cartStore.loadCart()
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('click', handleClickOutside)
})

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Close menu on route change
const route = useRoute()
watch(() => route.path, () => {
  closeMobileMenu()
  isUserMenuOpen.value = false
})
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full backdrop-blur-md border-b transition-all duration-300"
    :class="scrolled
      ? 'bg-luxury-bg/90 dark:bg-luxury-dark-bg/90 border-luxury-border dark:border-luxury-dark-border shadow-luxury dark:shadow-luxury-dark'
      : 'bg-luxury-bg/70 dark:bg-luxury-dark-bg/70 border-transparent'"
  >
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div
        class="flex items-center justify-between transition-all duration-300"
        :class="scrolled ? 'h-14' : 'h-16'"
      >
        <!-- Logo / Wordmark -->
        <div class="shrink-0">
          <NuxtLink to="/" class="group flex items-center gap-2.5" aria-label="Go to home">
            <img
              v-if="logoUrl"
              :src="logoUrl"
              :alt="brandName || 'Logo'"
              class="w-auto object-contain transition-all duration-300"
              :class="scrolled ? 'h-8' : 'h-9'"
            />
            <span
              v-else-if="brandName"
              class="text-xl font-bold tracking-luxury text-luxury-text dark:text-luxury-dark-text group-hover:text-luxury-gold transition-colors"
            >
              {{ brandName }}
            </span>
            <!-- Branding still loading -->
            <span
              v-else
              class="h-6 w-28 rounded animate-pulse bg-luxury-border dark:bg-luxury-dark-border"
              aria-hidden="true"
            />
          </NuxtLink>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:block">
          <LayoutAppMenu variant="horizontal" />
        </div>

        <!-- Theme Toggle, Language & Auth -->
        <div class="flex items-center gap-1 sm:gap-2">
          <!-- Language Toggle -->
          <LayoutLanguageToggle />

          <!-- Cart Icon -->
          <NuxtLink
            to="/checkout"
            class="relative p-2 rounded-full text-luxury-text dark:text-luxury-dark-text hover:bg-luxury-gold/10 hover:text-luxury-gold transition-colors"
            aria-label="View cart"
          >
            <UiIcon name="shopping-cart" :size="20" />
            <span
              v-if="totalItems > 0"
              class="absolute -top-0.5 -right-0.5 bg-luxury-gold text-white text-[11px] leading-none font-bold rounded-full h-5 w-5 flex items-center justify-center ring-2 ring-luxury-bg dark:ring-luxury-dark-bg"
            >
              {{ totalItems }}
            </span>
          </NuxtLink>

          <!-- Theme Toggle -->
          <button
            @click="themeStore.toggleTheme"
            class="p-2 rounded-full text-luxury-text dark:text-luxury-dark-text hover:bg-luxury-gold/10 hover:text-luxury-gold transition-colors"
            aria-label="Toggle theme"
          >
            <UiIcon v-if="isDark" name="sun" :size="20" />
            <UiIcon v-else name="moon" :size="20" />
          </button>

          <!-- Auth Section (Desktop) -->
          <div
            v-if="user"
            ref="userMenuRef"
            class="hidden md:block relative ml-1 pl-3 border-l border-luxury-border dark:border-luxury-dark-border"
          >
            <!-- Trigger -->
            <button
              @click="isUserMenuOpen = !isUserMenuOpen"
              class="flex items-center gap-2 p-1 rounded-full hover:bg-luxury-gold/10 transition-colors"
              aria-haspopup="true"
              :aria-expanded="isUserMenuOpen"
              aria-label="Account menu"
            >
              <span class="w-8 h-8 rounded-full bg-luxury-gold/15 ring-1 ring-luxury-gold/20 flex items-center justify-center">
                <UiIcon name="user" :size="16" class="text-luxury-gold" />
              </span>
              <UiIcon
                name="chevron-down"
                :size="16"
                class="text-luxury-text-muted dark:text-luxury-dark-text-muted transition-transform duration-200"
                :class="{ 'rotate-180': isUserMenuOpen }"
              />
            </button>

            <!-- Dropdown -->
            <transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 -translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-1"
            >
              <div
                v-if="isUserMenuOpen"
                class="absolute right-0 mt-2 w-64 origin-top-right rounded-xl bg-luxury-surface dark:bg-luxury-dark-surface border border-luxury-border dark:border-luxury-dark-border shadow-luxury dark:shadow-luxury-dark overflow-hidden"
                role="menu"
              >
                <!-- Identity -->
                <div class="flex items-center gap-3 px-4 py-4 border-b border-luxury-border dark:border-luxury-dark-border">
                  <span class="shrink-0 w-10 h-10 rounded-full bg-luxury-gold/15 ring-1 ring-luxury-gold/20 flex items-center justify-center">
                    <UiIcon name="user" :size="20" class="text-luxury-gold" />
                  </span>
                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-luxury-text dark:text-luxury-dark-text truncate">
                      {{ displayName }}
                    </p>
                    <p class="text-xs text-luxury-text-muted dark:text-luxury-dark-text-muted truncate">
                      {{ user.email }}
                    </p>
                  </div>
                </div>
                <!-- Actions -->
                <div class="p-1.5">
                  <button
                    @click="handleLogout"
                    class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-luxury-text dark:text-luxury-dark-text hover:bg-luxury-gold/10 hover:text-luxury-gold transition-colors"
                    role="menuitem"
                  >
                    <UiIcon name="log-out" :size="18" />
                    {{ t('auth.logout') || 'Logout' }}
                  </button>
                </div>
              </div>
            </transition>
          </div>
          <div v-else class="hidden md:flex items-center gap-2 ml-1 pl-3 border-l border-luxury-border dark:border-luxury-dark-border">
            <NuxtLink
              to="/login"
              class="text-sm font-medium px-3 py-2 rounded-luxury text-luxury-text dark:text-luxury-dark-text hover:text-luxury-gold transition-colors"
            >
              {{ t('auth.login') }}
            </NuxtLink>
            <NuxtLink
              to="/signup"
              class="text-sm font-medium px-4 py-2 rounded-luxury bg-luxury-gold hover:bg-luxury-gold-hover text-white shadow-md hover:shadow-lg transition-all"
            >
              {{ t('auth.signup') }}
            </NuxtLink>
          </div>

          <!-- Mobile Menu Button -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden p-2 rounded-full text-luxury-text dark:text-luxury-dark-text hover:bg-luxury-gold/10 hover:text-luxury-gold transition-colors focus:outline-none"
            aria-label="Open mobile menu"
          >
            <UiIcon v-if="!isMobileMenuOpen" name="menu" :size="24" />
            <UiIcon v-else name="x" :size="24" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Drawer (Backdrop & Panel) -->
    <Teleport to="body">
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 z-[100] md:hidden"
      >
        <!-- Backdrop -->
        <transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="isMobileMenuOpen"
            class="fixed inset-0 bg-black/50 backdrop-blur-sm"
            @click="closeMobileMenu"
          />
        </transition>

        <!-- Panel -->
        <transition
          enter-active-class="transition duration-300 ease-out transform"
          enter-from-class="translate-x-full"
          enter-to-class="translate-x-0"
          leave-active-class="transition duration-200 ease-in transform"
          leave-from-class="translate-x-0"
          leave-to-class="translate-x-full"
        >
          <div
            v-if="isMobileMenuOpen"
            class="fixed right-0 top-0 h-full w-64 max-w-xs bg-luxury-bg dark:bg-luxury-dark-bg shadow-2xl overflow-y-auto"
          >
            <div class="p-6">
              <div class="flex items-center justify-between mb-8">
                <div class="flex items-center space-x-2">
                  <img
                    v-if="logoUrl"
                    :src="logoUrl"
                    :alt="brandName || 'Logo'"
                    class="h-8 w-auto object-contain"
                  />
                  <span v-else class="text-lg font-bold tracking-luxury text-luxury-text dark:text-luxury-dark-text">
                    {{ brandName || 'Menu' }}
                  </span>
                </div>
                <button
                  @click="closeMobileMenu"
                  class="p-2 -mr-2 rounded-lg text-luxury-text dark:text-luxury-dark-text hover:bg-luxury-surface dark:hover:bg-luxury-dark-surface"
                >
                  <UiIcon name="x" :size="24" />
                </button>
              </div>

              <div class="space-y-6">
                <LayoutAppMenu variant="vertical" />

                <div class="pt-6 border-t border-luxury-border dark:border-luxury-dark-border space-y-4">
                  <div class="flex justify-center">
                    <LayoutLanguageToggle />
                  </div>

                  <!-- Cart (Mobile) -->
                  <NuxtLink
                    to="/checkout"
                    @click="closeMobileMenu"
                    class="flex items-center justify-center space-x-2 py-2 text-luxury-text dark:text-luxury-dark-text hover:text-luxury-gold transition-colors"
                  >
                    <div class="relative">
                      <UiIcon name="shopping-cart" :size="20" />
                      <span
                        v-if="totalItems > 0"
                        class="absolute -top-2 -right-2 bg-luxury-gold text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                      >
                        {{ totalItems }}
                      </span>
                    </div>
                    <span class="text-sm font-medium">Cart</span>
                  </NuxtLink>
                  <!-- Logged In User (Mobile) -->
                  <div v-if="user" class="space-y-4">
                    <div class="flex items-center justify-center space-x-2 py-2">
                      <div class="w-8 h-8 rounded-full bg-luxury-gold/20 flex items-center justify-center">
                        <UiIcon name="user" :size="16" class="text-luxury-gold" />
                      </div>
                      <span class="text-sm font-medium text-luxury-text dark:text-luxury-dark-text">
                        {{ user.email?.split('@')[0] || 'User' }}
                      </span>
                    </div>
                    <button
                      @click="authStore.logout"
                      class="block w-full text-center text-sm font-medium text-luxury-text dark:text-luxury-dark-text hover:text-luxury-gold transition-colors py-2"
                    >
                      {{ t('auth.logout') || 'Logout' }}
                    </button>
                  </div>
                  <!-- Logged Out (Mobile) -->
                  <template v-else>
                    <NuxtLink
                      to="/login"
                      @click="closeMobileMenu"
                      class="block text-center text-sm font-medium text-luxury-text dark:text-luxury-dark-text hover:text-luxury-gold transition-colors py-2"
                    >
                      {{ t('auth.login') }}
                    </NuxtLink>
                    <NuxtLink
                      to="/signup"
                      @click="closeMobileMenu"
                      class="block text-center text-sm font-medium px-4 py-2 rounded-luxury bg-luxury-gold hover:bg-luxury-gold-hover text-white transition-colors shadow-luxury"
                    >
                      {{ t('auth.signup') }}
                    </NuxtLink>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </Teleport>
  </header>
</template>

