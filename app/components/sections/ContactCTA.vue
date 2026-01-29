<script setup lang="ts">
interface Props {
  title?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Need Help?',
  description: "If you have any questions, please don't hesitate to contact us."
})
</script>

<template>
  <div class="mt-16 text-center">
    <UiBaseCard class="max-w-2xl mx-auto p-8 sm:p-10">
      <h3 class="text-2xl font-bold text-luxury-text dark:text-luxury-dark-text mb-3">
        {{ title }}
      </h3>
      <p class="text-luxury-text-muted dark:text-luxury-dark-text-muted mb-6 max-w-md mx-auto">
        {{ description }}
      </p>
      <div class="flex justify-center">
        <NuxtLink to="/contact">
          <UiLuxuryButton variant="outline">
            <span>{{ $t('nav.contact') }}</span>
            <UiIcon name="arrow-right" :size="18" class="ml-2" />
          </UiLuxuryButton>
        </NuxtLink>
      </div>
    </UiBaseCard>
  </div>
</template>
