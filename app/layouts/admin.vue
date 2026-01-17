<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-200">
      <div class="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
        <h1 class="text-xl font-bold text-gray-800 dark:text-white">Admin Panel</h1>
      </div>

      <nav class="flex-1 overflow-y-auto py-4">
        <ul class="space-y-1 px-2">
          <li>
            <NuxtLink to="/admin" class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" active-class="bg-gray-100 dark:bg-gray-700 text-primary-600 dark:text-white font-medium">
              <span class="mr-3">🏠</span>
              Home
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/admin/categories" class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" active-class="bg-gray-100 dark:bg-gray-700 text-primary-600 dark:text-white font-medium">
              <span class="mr-3">📂</span>
              Categories
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/admin/products" class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" active-class="bg-gray-100 dark:bg-gray-700 text-primary-600 dark:text-white font-medium">
              <span class="mr-3">🛍️</span>
              Products
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <!-- Dark Mode Toggle -->
        <button @click="toggleTheme" class="w-full flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <span class="mr-3">{{ isDark ? '🌞' : '🌙' }}</span>
          {{ isDark ? 'Light Mode' : 'Dark Mode' }}
        </button>

        <!-- Logout -->
        <button @click="handleLogout" class="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
          <span class="mr-3">🚪</span>
          Logout
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div class="container mx-auto p-6">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { isDark, toggleTheme, handleLogout } = useAdminLayout()
</script>
