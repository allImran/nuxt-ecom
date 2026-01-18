<template>
  <UiBaseCard variant="dashed" hover class="h-full min-h-[160px] pb-6 !p-0">
    <div class="p-6 h-full flex flex-col justify-center">
      <div v-if="!isCreating" @click="isCreating = true" class="text-center w-full h-full flex flex-col items-center justify-center">
        <div class="w-12 h-12 rounded-full bg-luxury-border/10 dark:bg-luxury-dark-border/20 flex items-center justify-center mb-3 group-hover:bg-luxury-gold group-hover:text-white transition-colors">
          <span class="text-2xl text-luxury-gold group-hover:text-white transition-colors">+</span>
        </div>
        <span class="font-medium text-luxury-text-muted dark:text-luxury-dark-text-muted group-hover:text-luxury-text dark:group-hover:text-luxury-dark-text transition-colors">Add New Category</span>
      </div>

      <div v-else class="w-full space-y-4">
        <!-- Business Select -->
        <UiLuxurySelect
          v-model="businessId"
          :options="businessOptions"
          id="select-business"
          label="Business"
          placeholder="Select Business"
        />

        <!-- Name Input -->
        <UiLuxuryInput
          v-model="name"
          @keyup.enter="handleCreate"
          @keyup.esc="cancel"
          ref="inputRef"
          type="text"
          id="category-name"
          label="Category Name"
        />

        <div class="flex justify-end space-x-2 mt-4">
          <UiLuxuryButton 
            variant="ghost" 
            @click.stop="cancel"
            class="!py-1 !px-3 text-sm h-8"
          >
            Cancel
          </UiLuxuryButton>
          <UiLuxuryButton 
            @click.stop="handleCreate" 
            :disabled="!name.trim() || !businessId"
            class="!py-1 !px-3 text-sm h-8"
          >
            Create
          </UiLuxuryButton>
        </div>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
const props = defineProps<{
  businesses: Array<{ id: string, name: string }>
}>()

const businessOptions = computed(() => props.businesses.map(b => ({
  value: b.id,
  label: b.name
})))

const emit = defineEmits<{
  (e: 'create', payload: { name: string, businessId: string }): void
}>()

const isCreating = ref(false)
const name = ref('')
const businessId = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

const handleCreate = () => {
  if (name.value.trim() && businessId.value) {
    emit('create', { name: name.value, businessId: businessId.value })
    name.value = ''
    businessId.value = ''
    isCreating.value = false
  }
}

const cancel = () => {
  isCreating.value = false
  name.value = ''
  businessId.value = ''
}

// Focus input when opening (optional, maybe focus select first?)
watch(isCreating, async (val) => {
  if (val) {
    await nextTick()
    // inputRef.value?.focus() // Maybe better to focus the select or just let user click
  }
})
</script>
