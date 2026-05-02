<template>
  <div class="flex h-screen bg-luxury-bg dark:bg-luxury-dark-bg overflow-hidden text-luxury-text dark:text-luxury-dark-text">
    <!-- Mobile Overlay -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 bg-black/50 z-40 lg:hidden"
        @click="closeSidebar"
      />
    </Transition>

    <!-- Sidebar -->
    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-300 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <AdminSidebar
        v-if="sidebarOpen"
        :class="['fixed inset-y-0 left-0 z-50 lg:static lg:translate-x-0', sidebarOpen ? 'translate-x-0' : '-translate-x-full']"
        @close="closeSidebar"
      />
    </Transition>

    <!-- Main Content -->
    <main class="flex-1 overflow-auto bg-luxury-bg dark:bg-luxury-dark-bg transition-colors duration-200 w-full">
      <!-- Mobile Header -->
      <header class="lg:hidden flex items-center justify-between p-4 border-b border-luxury-border dark:border-luxury-dark-border bg-luxury-surface dark:bg-luxury-dark-surface">
        <div class="flex items-center gap-3">
          <button
            @click="openSidebar"
            class="p-2 rounded-lg hover:bg-luxury-bg/50 dark:hover:bg-luxury-dark-bg/50 transition-colors"
          >
            <UiIcon name="menu" :size="24" />
          </button>
          <h1 class="text-lg font-bold tracking-luxury">DB Admin</h1>
        </div>
      </header>

      <div class="container mx-auto p-4 sm:p-6">
        <slot />
      </div>
    </main>

    <!-- Toast Container -->
    <AdminToastContainer />
  </div>
</template>

<script setup lang="ts">
const sidebarOpen = ref(false)

function openSidebar() {
  sidebarOpen.value = true
}

function closeSidebar() {
  sidebarOpen.value = false
}

// Close sidebar when window resizes to lg breakpoint
onMounted(() => {
  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      sidebarOpen.value = true
    } else {
      sidebarOpen.value = false
    }
  }

  // Set initial state
  handleResize()

  window.addEventListener('resize', handleResize)
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
})
</script>
