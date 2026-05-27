<template>
  <div class="space-y-4 sm:space-y-6">
    <h1 class="sr-only">Businesses Management</h1>

    <AdminHeader
      title="Businesses"
      v-model="searchQuery"
      placeholder="Search businesses..."
    />

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <AdminAddBusinessCard @create="handleAddBusiness" />

      <AdminBusinessCard
        v-for="business in filteredBusinesses"
        :key="business.id"
        :business="business"
        @update="updateBusiness"
        @delete="deleteBusiness"
      />
    </div>

    <!-- Loading/Empty States -->
    <div v-if="loading && businesses.length === 0" class="text-center py-10 text-luxury-text-muted dark:text-luxury-dark-text-muted">
      Loading...
    </div>
    <div v-else-if="filteredBusinesses.length === 0 && searchQuery" class="text-center py-10 text-luxury-text-muted dark:text-luxury-dark-text-muted">
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
  businesses,
  loading,
  fetchBusinesses,
  addBusiness, // The VM returns addBusiness which takes 2 args, but AddBusinessCard emits name.
               // Wait, the VM `addBusiness` takes `name` and `slug`? No wait, check VM.
               // VM `addBusiness()` takes no args, uses `newBusinessName` Ref.
               // I need to update the VM or wrap it here.
               // Actually, `useBusinessViewModel` had `addBusiness` using `newBusinessName.value`.
               // But `AddBusinessCard` emits `name` string.
               // I should update the VM to accept args or wrap it.
               // Let's refactor VM later if needed, but for now I can just set the Ref and call it.
  updateBusiness,
  deleteBusiness,
  filteredBusinesses,
  newBusinessName // Need this imported to set it
} = useBusinessViewModel()

const handleAddBusiness = async (name: string) => {
    newBusinessName.value = name
    await addBusiness()
}

onMounted(() => {
  fetchBusinesses()
})
</script>
