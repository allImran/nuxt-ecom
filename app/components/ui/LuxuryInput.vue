<script setup lang="ts">
interface Props {
  modelValue: string
  type?: string
  label: string
  placeholder?: string
  id: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: ''
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="relative group">
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      class="peer w-full bg-transparent border-b-2 border-luxury-border dark:border-luxury-dark-border py-3 px-1 text-luxury-text dark:text-luxury-dark-text focus:outline-none focus:border-luxury-gold transition-colors duration-300 placeholder-transparent"
      @input="updateValue"
    />
    <label
      :for="id"
      class="absolute left-1 top-3 text-luxury-text-muted dark:text-luxury-dark-text-muted text-base transition-all duration-300 
             peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
             peer-focus:-top-4 peer-focus:text-xs peer-focus:text-luxury-gold
             peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-xs"
    >
      {{ label }}
    </label>
  </div>
</template>
