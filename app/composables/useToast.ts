// Simple toast notification composable

interface ToastMessage {
  id: string
  title: string
  description?: string
  type: 'success' | 'error' | 'info' | 'warning'
}

const toasts = ref<ToastMessage[]>([])

export function useToast() {
  const addToast = (message: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const toast: ToastMessage = {
      id,
      ...message
    }
    toasts.value.push(toast)

    // Auto dismiss after 3-5 seconds
    setTimeout(() => {
      removeToast(id)
    }, 4000)
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (message: { title: string; description?: string }) => {
    addToast({ ...message, type: 'success' })
  }

  const error = (message: { title: string; description?: string }) => {
    addToast({ ...message, type: 'error' })
  }

  const info = (message: { title: string; description?: string }) => {
    addToast({ ...message, type: 'info' })
  }

  const warning = (message: { title: string; description?: string }) => {
    addToast({ ...message, type: 'warning' })
  }

  return {
    toasts: readonly(toasts),
    addToast,
    removeToast,
    success,
    error,
    info,
    warning
  }
}
