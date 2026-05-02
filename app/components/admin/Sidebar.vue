<template>
  <aside class="w-64 bg-luxury-surface dark:bg-luxury-dark-surface border-r border-luxury-border dark:border-luxury-dark-border flex flex-col transition-colors duration-200 h-full">
    <div class="h-16 flex items-center justify-between px-4 border-b border-luxury-border dark:border-luxury-dark-border">
      <h1 class="text-xl font-bold text-luxury-text dark:text-luxury-dark-text tracking-luxury">DB Admin</h1>
      <!-- Close button on mobile -->
      <button
        @click="emit('close')"
        class="lg:hidden p-2 rounded-lg hover:bg-luxury-bg/50 dark:hover:bg-luxury-dark-bg/50 transition-colors"
      >
        <UiIcon name="x" :size="20" />
      </button>
    </div>

    <nav class="flex-1 overflow-y-auto py-4">
      <ul class="space-y-1 px-2">
        <li>
          <NuxtLink
            to="/admin"
            class="flex items-center px-4 py-3 text-luxury-text dark:text-luxury-dark-text hover:bg-luxury-border/10 dark:hover:bg-luxury-dark-border/20 rounded-[var(--radius-luxury)] transition-colors"
            active-class="bg-luxury-border/10 dark:bg-luxury-dark-border/20 text-luxury-gold dark:text-luxury-gold font-medium"
            @click="emit('close')"
          >
            <span class="mr-3 text-lg">🏠</span>
            <span>Home</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/admin/categories"
            class="flex items-center px-4 py-3 text-luxury-text dark:text-luxury-dark-text hover:bg-luxury-border/10 dark:hover:bg-luxury-dark-border/20 rounded-[var(--radius-luxury)] transition-colors"
            active-class="bg-luxury-border/10 dark:bg-luxury-dark-border/20 text-luxury-gold dark:text-luxury-gold font-medium"
            @click="emit('close')"
          >
            <span class="mr-3 text-lg">📂</span>
            <span>Categories</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/admin/products"
            class="flex items-center px-4 py-3 text-luxury-text dark:text-luxury-dark-text hover:bg-luxury-border/10 dark:hover:bg-luxury-dark-border/20 rounded-[var(--radius-luxury)] transition-colors"
            active-class="bg-luxury-border/10 dark:bg-luxury-dark-border/20 text-luxury-gold dark:text-luxury-gold font-medium"
            @click="emit('close')"
          >
            <span class="mr-3 text-lg">🛍️</span>
            <span>Products</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/admin/orders"
            class="flex items-center px-4 py-3 text-luxury-text dark:text-luxury-dark-text hover:bg-luxury-border/10 dark:hover:bg-luxury-dark-border/20 rounded-[var(--radius-luxury)] transition-colors"
            active-class="bg-luxury-border/10 dark:bg-luxury-dark-border/20 text-luxury-gold dark:text-luxury-gold font-medium"
            @click="emit('close')"
          >
            <span class="mr-3 text-lg">📦</span>
            <span>Orders</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <div class="p-4 border-t border-luxury-border dark:border-luxury-dark-border space-y-2">
      <!-- Dark Mode Toggle -->
      <button
        @click="toggleTheme"
        class="w-full flex items-center justify-center px-4 py-2 text-luxury-text dark:text-luxury-dark-text hover:bg-luxury-border/10 dark:hover:bg-luxury-dark-border/20 rounded-[var(--radius-luxury)] transition-colors"
      >
        <span class="mr-2 text-base">{{ isDark ? '🌞' : '🌙' }}</span>
        <span class="text-sm">{{ isDark ? 'Light' : 'Dark' }}</span>
      </button>

      <!-- Logout -->
      <button
        @click="handleLogout"
        class="w-full flex items-center justify-center px-4 py-2 text-luxury-gold hover:opacity-80 rounded-[var(--radius-luxury)] transition-colors"
      >
        <span class="mr-2 text-base">🚪</span>
        <span class="text-sm">Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
const { isDark, toggleTheme, handleLogout } = useAdminLayout()

const emit = defineEmits<{
  close: []
}>()
</script>
