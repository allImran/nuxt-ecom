<template>
  <aside class="w-64 bg-luxury-surface dark:bg-luxury-dark-surface border-r border-luxury-border dark:border-luxury-dark-border flex flex-col transition-colors duration-200">
    <div class="h-16 flex items-center justify-center border-b border-luxury-border dark:border-luxury-dark-border">
      <h1 class="text-xl font-bold text-luxury-text dark:text-luxury-dark-text tracking-luxury">Dashboard</h1>
    </div>

    <nav class="flex-1 overflow-y-auto py-4">
      <ul class="space-y-1 px-2">
        <li>
          <NuxtLink to="/admin" class="flex items-center px-4 py-3 text-luxury-text dark:text-luxury-dark-text hover:bg-luxury-border/10 dark:hover:bg-luxury-dark-border/20 rounded-[var(--radius-luxury)] transition-colors" active-class="bg-luxury-border/10 dark:bg-luxury-dark-border/20 text-luxury-gold dark:text-luxury-gold font-medium">
            <span class="mr-3">🏠</span>
            Home
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/admin/categories" class="flex items-center px-4 py-3 text-luxury-text dark:text-luxury-dark-text hover:bg-luxury-border/10 dark:hover:bg-luxury-dark-border/20 rounded-[var(--radius-luxury)] transition-colors" active-class="bg-luxury-border/10 dark:bg-luxury-dark-border/20 text-luxury-gold dark:text-luxury-gold font-medium">
            <span class="mr-3">📂</span>
            Categories
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/admin/products" class="flex items-center px-4 py-3 text-luxury-text dark:text-luxury-dark-text hover:bg-luxury-border/10 dark:hover:bg-luxury-dark-border/20 rounded-[var(--radius-luxury)] transition-colors" active-class="bg-luxury-border/10 dark:bg-luxury-dark-border/20 text-luxury-gold dark:text-luxury-gold font-medium">
            <span class="mr-3">🛍️</span>
            Products
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/admin/orders" class="flex items-center px-4 py-3 text-luxury-text dark:text-luxury-dark-text hover:bg-luxury-border/10 dark:hover:bg-luxury-dark-border/20 rounded-[var(--radius-luxury)] transition-colors" active-class="bg-luxury-border/10 dark:bg-luxury-dark-border/20 text-luxury-gold dark:text-luxury-gold font-medium">
            <span class="mr-3">📦</span>
            Orders
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <div class="p-4 border-t border-luxury-border dark:border-luxury-dark-border space-y-2">
      <!-- Dark Mode Toggle -->
      <button @click="toggleTheme" class="w-full flex items-center px-4 py-2 text-luxury-text dark:text-luxury-dark-text hover:bg-luxury-border/10 dark:hover:bg-luxury-dark-border/20 rounded-[var(--radius-luxury)] transition-colors">
        <span class="mr-3">{{ isDark ? '🌞' : '🌙' }}</span>
        {{ isDark ? 'Light' : 'Dark' }} Mode
      </button>

      <!-- Logout -->
      <button @click="handleLogout" class="w-full flex items-center px-4 py-2 text-luxury-gold hover:opacity-80 rounded-[var(--radius-luxury)] transition-colors">
        <span class="mr-3">🚪</span>
        Logout
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
const { isDark, toggleTheme, handleLogout } = useAdminLayout()
</script>
