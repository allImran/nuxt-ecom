<template>
  <div class="bg-luxury-surface dark:bg-luxury-dark-surface rounded-(--radius-luxury) shadow-luxury dark:shadow-luxury-dark p-6 border border-luxury-border dark:border-luxury-dark-border hover:border-luxury-gold dark:hover:border-luxury-gold transition-colors group">
    <div class="flex justify-between items-start mb-4">
      <div class="flex-1">
        <label class="text-xs text-luxury-text-muted dark:text-luxury-dark-text-muted uppercase font-semibold tracking-wider mb-1 block">Title</label>
        <input
          v-model="localName"
          @blur="handleUpdate"
          @keyup.enter="handleUpdate"
          class="text-xl font-bold text-luxury-text dark:text-luxury-dark-text bg-transparent border-b border-transparent hover:border-luxury-border dark:hover:border-luxury-dark-border focus:border-luxury-gold focus:outline-none w-full transition-colors mb-1"
        />
      </div>
      <button 
        @click="$emit('delete', category.id)" 
        class="text-red-400 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity p-1"
        title="Delete Category"
      >
        🗑️
      </button>
    </div>
    <div class="flex justify-between items-center mt-4">
      <span class="text-xs font-medium px-2 py-1 bg-luxury-border/10 dark:bg-luxury-dark-border/20 text-luxury-gold rounded-full truncate max-w-[150px]">
        🏢 {{ businessName }}
      </span>
      <span class="text-xs text-luxury-text-muted dark:text-luxury-dark-text-muted">
        ID: {{ category.id.substring(0, 8) }}...
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  category: {
    id: string
    name: string
    business_id: string
  }
  businessName: string
}>()

const emit = defineEmits<{
  (e: 'update', category: any): void
  (e: 'delete', id: string): void
}>()

const localName = ref(props.category.name)

watch(() => props.category.name, (newVal) => {
  localName.value = newVal
})

const handleUpdate = () => {
  if (localName.value !== props.category.name) {
    emit('update', { ...props.category, name: localName.value })
  }
}
</script>
