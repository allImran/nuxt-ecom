<script setup lang="ts">
interface Option {
  value: string
  label: string
  disabled?: boolean
}

interface Props {
  modelValue: string | number
  options: Option[]
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select...',
  required: false,
  disabled: false,
  error: '',
  class: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const selectClasses = computed(() => {
  const base = 'w-full bg-surface-container-low border-none focus:ring-1 focus:ring-primary rounded-lg py-3 px-4 text-on-surface appearance-none cursor-pointer transition-all'
  const errorClass = props.error ? 'ring-1 ring-error' : ''
  const disabledClass = props.disabled ? 'opacity-60 cursor-not-allowed' : ''
  return `${base} ${errorClass} ${disabledClass}`
})

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div :class="props.class" class="flex flex-col gap-1 relative">
    <label v-if="label" class="font-label-caps text-label-caps text-on-surface-variant">
      {{ label }}
      <span v-if="required" class="text-error ml-1">*</span>
    </label>
    <div class="relative">
      <select
        :class="selectClasses"
        :disabled="disabled"
        :value="modelValue"
        @change="handleChange"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>
      <span class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </div>
    <p v-if="error" class="text-body-md text-error">{{ error }}</p>
  </div>
</template>
