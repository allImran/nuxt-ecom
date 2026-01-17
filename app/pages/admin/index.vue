<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Businesses</h2>
      <div class="relative w-full md:w-64">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search businesses..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors"
        />
        <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
      </div>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <!-- Add Business Card -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center justify-center space-y-4 hover:shadow-md transition-shadow">
        <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-200">Add New Business</h3>
        <div class="w-full relative">
           <input
            v-model="newBusinessName"
            type="text"
            placeholder="Business Name"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-center"
            @keyup.enter="addBusiness"
          />
        </div>
        <button
          @click="addBusiness"
          :disabled="!newBusinessName.trim() || loading"
          class="w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span class="text-2xl font-bold">+</span>
        </button>
      </div>

      <!-- Business Cards -->
      <div
        v-for="business in filteredBusinesses"
        :key="business.id"
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col space-y-4 hover:shadow-md transition-shadow group"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1 mr-2">
             <label class="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-1 block">Title</label>
             <input
              v-model="business.name"
              type="text"
              class="w-full px-2 py-1 -ml-2 border border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:border-primary-500 rounded bg-transparent text-lg font-bold text-gray-900 dark:text-white focus:ring-0 outline-none transition-colors"
              @blur="updateBusiness(business)"
              @keyup.enter="$event.target.blur()"
            />
          </div>
          <button
            @click="deleteBusiness(business.id)"
            class="text-gray-400 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="Delete Business"
          >
            🗑️
          </button>
        </div>
        
        <div class="text-sm text-gray-500 dark:text-gray-400">
           <span class="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">/{{ business.slug }}</span>
        </div>
      </div>

    </div>

    <!-- Loading/Empty States -->
    <div v-if="loading && businesses.length === 0" class="text-center py-10 text-gray-500">
      Loading...
    </div>
    <div v-else-if="filteredBusinesses.length === 0 && searchQuery" class="text-center py-10 text-gray-500">
      No businesses found matching "{{ searchQuery }}"
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  // middleware: 'admin'
})

const {
  searchQuery,
  newBusinessName,
  businesses,
  loading,
  fetchBusinesses,
  addBusiness,
  updateBusiness,
  deleteBusiness,
  filteredBusinesses
} = useBusinessViewModel()

onMounted(() => {
  fetchBusinesses()
})
</script>
