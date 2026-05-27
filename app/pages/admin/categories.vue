<template>
  <div class="space-y-6">
    <h1 class="sr-only">Categories Management</h1>

    <AdminHeader
      title="Categories"
      v-model="searchQuery"
      placeholder="Search categories..."
    />

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <AdminAddCategoryCard 
        :businesses="businesses"
        @create="handleAddCategory" 
      />

      <AdminCategoryCard
        v-for="category in filteredCategories"
        :key="category.id"
        :category="category"
        :businessName="getBusinessName(category.business_id)"
        @update="updateCategory"
        @delete="deleteCategory"
      />
    </div>

    <!-- Loading/Empty States -->
    <div v-if="loading && categories.length === 0" class="text-center py-10 text-luxury-text-muted dark:text-luxury-dark-text-muted">
      Loading...
    </div>
    <div v-else-if="filteredCategories.length === 0 && searchQuery" class="text-center py-10 text-luxury-text-muted dark:text-luxury-dark-text-muted">
      No categories found matching "{{ searchQuery }}"
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
  newCategoryName,
  newCategoryBusinessId,
  categories,
  businesses,
  loading,
  fetchBusinesses,
  fetchCategories,
  getBusinessName,
  addCategory,
  updateCategory,
  deleteCategory,
  filteredCategories
} = useCategoryViewModel()

const handleAddCategory = async (payload: { name: string, businessId: string }) => {
  newCategoryName.value = payload.name
  newCategoryBusinessId.value = payload.businessId
  await addCategory()
}

onMounted(async () => {
  loading.value = true
  await Promise.all([fetchBusinesses(), fetchCategories()])
  loading.value = false
})
</script>
