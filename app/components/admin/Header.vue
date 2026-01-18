<template>
  <div class="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
    <h1 class="text-3xl font-bold bg-linear-to-r from-luxury-text to-luxury-gold dark:from-luxury-dark-text dark:to-luxury-gold bg-clip-text text-transparent tracking-luxury">
      {{ title }}
    </h1>
    <div class="relative w-full sm:w-64">
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        type="text"
        :placeholder="placeholder"
        class="w-full pl-10 pr-4 py-2 bg-luxury-surface dark:bg-luxury-dark-surface border border-luxury-border dark:border-luxury-dark-border rounded-[var(--radius-luxury)] focus:outline-none focus:ring-2 focus:ring-luxury-gold dark:focus:ring-luxury-gold/50 shadow-luxury dark:shadow-luxury-dark transition-all text-luxury-text dark:text-luxury-dark-text"
      />
      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-muted dark:text-luxury-dark-text-muted">🔍</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  modelValue: string
  placeholder?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>
