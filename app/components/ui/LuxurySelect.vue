<script setup lang="ts">
interface Option {
  value: string | number
  label: string
  disabled?: boolean
}

interface Props {
  modelValue: string | number
  options: Option[]
  label?: string
  id: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select an option'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const updateValue = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="relative group">
    <div class="relative">
      <select
        :id="id"
        :value="modelValue"
        @change="updateValue"
        class="peer w-full bg-transparent border-b-2 border-luxury-border dark:border-luxury-dark-border py-3 px-1 text-luxury-text dark:text-luxury-dark-text focus:outline-none focus:border-luxury-gold transition-colors duration-300 appearance-none cursor-pointer"
      >
        <option value="" disabled selected>{{ placeholder }}</option>
        <option 
          v-for="opt in options" 
          :key="opt.value" 
          :value="opt.value"
          :disabled="opt.disabled"
          class="text-luxury-charcoal bg-luxury-surface dark:bg-luxury-dark-surface"
        >
          {{ opt.label }}
        </option>
      </select>
      <div class="absolute inset-y-0 right-0 flex items-center px-1 pointer-events-none text-luxury-text-muted dark:text-luxury-dark-text-muted peer-focus:text-luxury-gold transition-colors">
        <UiIcon name="chevron-down" :size="16" />
      </div>
    </div>
    <label
      v-if="label"
      :for="id"
      class="absolute left-1 top-3 text-luxury-text-muted dark:text-luxury-dark-text-muted text-base transition-all duration-300 
             -top-4 text-xs group-focus-within:text-luxury-gold"
    >
      {{ label }}
    </label>
  </div>
</template>
