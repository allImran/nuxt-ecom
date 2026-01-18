<template>
  <UiBaseCard hover class="h-full">
    <div class="flex justify-between items-start mb-4">
      <div class="flex-1">
        <input
          v-model="localName"
          @blur="handleUpdate"
          @keyup.enter="handleUpdate"
          class="text-xl font-bold text-luxury-text dark:text-luxury-dark-text bg-transparent border-b border-transparent hover:border-luxury-border dark:hover:border-luxury-dark-border focus:border-luxury-gold focus:outline-none w-full transition-colors mb-1"
        />
        <p class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted font-mono">{{ business.slug }}</p>
      </div>
      <button 
        @click="$emit('delete', business.id)" 
        class="text-red-400 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity p-1"
        title="Delete Business"
      >
        🗑️
      </button>
    </div>
    <div class="flex justify-between items-center mt-auto pt-4">
      <span class="text-xs font-medium px-2 py-1 bg-luxury-border/10 dark:bg-luxury-dark-border/20 text-luxury-gold rounded-full">
        Business
      </span>
      <span class="text-xs text-luxury-text-muted dark:text-luxury-dark-text-muted">
        ID: {{ business.id.substring(0, 8) }}...
      </span>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
const props = defineProps<{
  business: {
    id: string
    name: string
    slug: string
  }
}>()

const emit = defineEmits<{
  (e: 'update', business: any): void
  (e: 'delete', id: string): void
}>()

const localName = ref(props.business.name)

watch(() => props.business.name, (newVal) => {
  localName.value = newVal
})

const handleUpdate = () => {
  if (localName.value !== props.business.name) {
    emit('update', { ...props.business, name: localName.value })
  }
}
</script>
