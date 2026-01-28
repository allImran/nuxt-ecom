<script setup lang="ts">
interface Props {
  name?: string
  category?: string
  price?: string | null
  description?: string | null
  loading?: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="space-y-6">
    <ProductInfoHeader
      :name="name"
      :category="category"
    />
    <ProductInfoPrice
      :price="price"
      :loading="loading"
    />
    <ProductInfoDescription
      :description="description"
    />
  </div>
</template>
