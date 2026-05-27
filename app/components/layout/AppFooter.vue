<script setup lang="ts">
const { t } = useI18n()
const businessBrandingStore = useBusinessBrandingStore()
const { business } = storeToRefs(businessBrandingStore)

const currentYear = computed(() => new Date().getFullYear())
</script>

<template>
  <footer class="bg-luxury-surface dark:bg-luxury-dark-surface border-t border-luxury-border dark:border-luxury-dark-border transition-colors duration-200">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Brand -->
        <div class="space-y-4">
          <h3 class="text-lg font-bold tracking-luxury text-luxury-text dark:text-luxury-dark-text">
            {{ business?.name || 'URBAN<span class="text-luxury-gold">EASE</span>' }}
          </h3>
          <p class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
            {{ business?.slogan || 'Premium products for discerning customers. Experience luxury shopping.' }}
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-sm font-semibold text-luxury-text dark:text-luxury-dark-text mb-4 uppercase tracking-wide">
            Quick Links
          </h4>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/" class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted hover:text-luxury-gold transition-colors">
                Home
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/products" class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted hover:text-luxury-gold transition-colors">
                Products
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/about" class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted hover:text-luxury-gold transition-colors">
                About Us
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/contact" class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted hover:text-luxury-gold transition-colors">
                Contact
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h4 class="text-sm font-semibold text-luxury-text dark:text-luxury-dark-text mb-4 uppercase tracking-wide">
            Support
          </h4>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/faq" class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted hover:text-luxury-gold transition-colors">
                FAQ
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/shipping" class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted hover:text-luxury-gold transition-colors">
                Shipping Info
              </NuxtLink>
            </li>
            <!-- <li>
              <NuxtLink to="/returns" class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted hover:text-luxury-gold transition-colors">
                Returns
              </NuxtLink>
            </li> -->
            <li>
              <NuxtLink to="/privacy" class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted hover:text-luxury-gold transition-colors">
                Privacy Policy
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-8 pt-8 border-t border-luxury-border dark:border-luxury-dark-border">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
            &copy; {{ currentYear }} {{ business?.name || 'INDOORSHOPPING' }}. All rights reserved.
          </p>
          <div class="flex space-x-6">
            <!-- {{  business?.social?.facebook }} -->
            <a
              v-if="business?.social?.facebook"
              :href="business.social.facebook"
              target="_blank"
              rel="noopener noreferrer"
              class="text-luxury-text-muted dark:text-luxury-dark-text-muted hover:text-luxury-gold transition-colors"
            >
              <span class="sr-only">Facebook</span>
              <UiIcon name="facebook" :size="20" />
            </a>
            <a
              v-if="business?.social?.whatsapp"
              :href="business.social.whatsapp"
              target="_blank"
              rel="noopener noreferrer"
              class="text-luxury-text-muted dark:text-luxury-dark-text-muted hover:text-luxury-gold transition-colors"
            >
              <span class="sr-only">WhatsApp</span>
              <UiIcon name="message-circle" :size="20" />
            </a>
            <a
              v-if="business?.social?.youtube"
              :href="business.social.youtube"
              target="_blank"
              rel="noopener noreferrer"
              class="text-luxury-text-muted dark:text-luxury-dark-text-muted hover:text-luxury-gold transition-colors"
            >
              <span class="sr-only">YouTube</span>
              <UiIcon name="youtube" :size="20" />
            </a>
            <a
              v-if="business?.social?.instagram"
              :href="business.social.instagram"
              target="_blank"
              rel="noopener noreferrer"
              class="text-luxury-text-muted dark:text-luxury-dark-text-muted hover:text-luxury-gold transition-colors"
            >
              <span class="sr-only">Instagram</span>
              <UiIcon name="instagram" :size="20" />
            </a>
            <a
              v-if="business?.social?.twitter"
              :href="business.social.twitter"
              target="_blank"
              rel="noopener noreferrer"
              class="text-luxury-text-muted dark:text-luxury-dark-text-muted hover:text-luxury-gold transition-colors"
            >
              <span class="sr-only">Twitter</span>
              <UiIcon name="twitter" :size="20" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
