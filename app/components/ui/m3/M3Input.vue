<script setup lang="ts">
interface Props {
  modelValue: string | number
  type?: string
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  class?: string
  prefix?: string
  rows?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  required: false,
  disabled: false,
  error: '',
  class: '',
  rows: 1
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const inputClasses = computed(() => {
  const base = 'w-full bg-surface-container-lowest border-none focus:ring-1 focus:ring-primary rounded-lg transition-all'
  const text = props.rows > 1
    ? 'py-3 px-4 text-on-surface resize-none'
    : 'py-3 px-4 text-on-surface'
  const errorClass = props.error ? 'ring-1 ring-error' : ''
  const disabledClass = props.disabled ? 'opacity-60 cursor-not-allowed' : ''
  return `${base} ${text} ${errorClass} ${disabledClass}`
})

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  let value: string | number = target.value
  if (props.type === 'number') {
    value = parseFloat(value) || 0
  }
  emit('update:modelValue', value)
}
</script>

<template>
  <div :class="props.class" class="flex flex-col gap-1">
    <label v-if="label" class="font-label-caps text-label-caps text-on-surface-variant">
      {{ label }}
      <span v-if="required" class="text-error ml-1">*</span>
    </label>
    <div class="relative">
      <span v-if="prefix" class="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
        {{ prefix }}
      </span>
      <component
        :is="rows > 1 ? 'textarea' : 'input'"
        :class="[inputClasses, { 'pl-7': prefix }]"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :rows="rows"
        @input="handleInput"
      />
    </div>
    <p v-if="error" class="text-body-md text-error">{{ error }}</p>
  </div>
</template>
