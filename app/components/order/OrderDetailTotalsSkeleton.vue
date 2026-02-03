<template>
  <div class="bg-luxury-surface dark:bg-luxury-dark-surface rounded-luxury p-6 sm:p-8 shadow-luxury">
    <div class="h-6 w-32 bg-luxury-border dark:bg-luxury-dark-border rounded animate-pulse mb-6" />
    <div class="space-y-3">
      <!-- Subtotal -->
      <div class="flex justify-between items-center py-2 border-b border-luxury-border dark:border-luxury-dark-border">
        <div class="h-4 w-24 bg-luxury-border dark:bg-luxury-dark-border rounded animate-pulse" />
        <div class="h-4 w-24 bg-luxury-border dark:bg-luxury-dark-border rounded animate-pulse" />
      </div>
      <!-- Delivery Fee -->
      <div class="flex justify-between items-center py-2 border-b border-luxury-border dark:border-luxury-dark-border">
        <div class="h-4 w-28 bg-luxury-border dark:bg-luxury-dark-border rounded animate-pulse" />
        <div class="h-4 w-20 bg-luxury-border dark:bg-luxury-dark-border rounded animate-pulse" />
      </div>
      <!-- Total -->
      <div class="flex justify-between items-center py-3 mt-2">
        <div class="h-6 w-20 bg-luxury-border dark:bg-luxury-dark-border rounded animate-pulse" />
        <div class="h-7 w-28 bg-luxury-border dark:bg-luxury-dark-border rounded animate-pulse" />
      </div>
    </div>
  </div>
</template>
