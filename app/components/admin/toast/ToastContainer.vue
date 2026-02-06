<script setup lang="ts">
const { toasts, removeToast } = useToast()
</script>

<template>
  <Teleport to="body">
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <TransitionGroup
        name="toast"
        tag="div"
        class="flex flex-col gap-2"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto min-w-[300px] max-w-md p-4 rounded-luxury shadow-lg flex items-start gap-3"
          :class="{
            'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800': toast.type === 'success',
            'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800': toast.type === 'error',
            'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800': toast.type === 'info',
            'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800': toast.type === 'warning'
          }"
        >
          <!-- Icon -->
          <UiIcon
            :name="{
              success: 'check-circle',
              error: 'alert-circle',
              info: 'info',
              warning: 'alert-triangle'
            }[toast.type]"
            :size="20"
            :class="{
              'text-green-600 dark:text-green-400': toast.type === 'success',
              'text-red-600 dark:text-red-400': toast.type === 'error',
              'text-blue-600 dark:text-blue-400': toast.type === 'info',
              'text-yellow-600 dark:text-yellow-400': toast.type === 'warning'
            }"
            class="flex-shrink-0 mt-0.5"
          />

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium" :class="{
              'text-green-900 dark:text-green-100': toast.type === 'success',
              'text-red-900 dark:text-red-100': toast.type === 'error',
              'text-blue-900 dark:text-blue-100': toast.type === 'info',
              'text-yellow-900 dark:text-yellow-100': toast.type === 'warning'
            }">
              {{ toast.title }}
            </p>
            <p v-if="toast.description" class="text-sm mt-1" :class="{
              'text-green-700 dark:text-green-300': toast.type === 'success',
              'text-red-700 dark:text-red-300': toast.type === 'error',
              'text-blue-700 dark:text-blue-300': toast.type === 'info',
              'text-yellow-700 dark:text-yellow-300': toast.type === 'warning'
            }">
              {{ toast.description }}
            </p>
          </div>

          <!-- Close Button -->
          <button
            type="button"
            @click="removeToast(toast.id)"
            class="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <UiIcon name="x" :size="16" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
