<script setup lang="ts">
interface Props {
  status: string
  getStatusColor: (status: string) => string
}

const props = defineProps<Props>()

// Capitalize first letter of status
const formattedStatus = computed(() => {
  if (!props.status) return ''
  return props.status.charAt(0).toUpperCase() + props.status.slice(1).toLowerCase()
})
</script>

<template>
  <div
    class="px-4 py-2 rounded-full text-sm font-medium"
    :class="getStatusColor(status)"
  >
    {{ formattedStatus }}
  </div>
</template>
