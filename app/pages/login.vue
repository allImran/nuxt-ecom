<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const authStore = useAuthStore()
const identifier = ref('')
const password = ref('')

const handleLogin = async () => {
  const result = await authStore.login(identifier.value, password.value)
  if (result.success) {
    // Check user role to determine redirect
    const user = authStore.user as any
    const role = user?.user_metadata?.role || user?.app_metadata?.role

    if (role === 'admin' || role === 'staff') {
      navigateTo('/admin')
    } else {
      navigateTo('/')
    }
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-luxury-bg dark:bg-luxury-dark-bg px-4">
    <div class="w-full max-w-md">
      <!-- Card -->
      <div class="bg-luxury-surface dark:bg-luxury-dark-surface p-8 md:p-12 rounded-luxury shadow-luxury dark:shadow-luxury-dark transition-colors duration-300">
        
        <!-- Header -->
        <div class="text-center mb-10 ">
          <h1 class="text-3xl font-light tracking-luxury text-luxury-text dark:text-luxury-dark-text mb-2 uppercase">
            Sign In
          </h1>
          <p class="text-luxury-text-muted dark:text-luxury-dark-text-muted text-sm">
            Welcome back to luxury
          </p>
        </div>

        <!-- Error Alert -->
        <div v-if="authStore.error" class="mb-6 p-4 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-lg text-sm">
          {{ authStore.error }}
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <UiLuxuryInput
            id="identifier"
            label="Email or Phone"
            v-model="identifier"
            type="text"
            required
          />
          
          <UiLuxuryInput
            id="password"
            label="Password"
            v-model="password"
            type="password"
            required
          />

          <UiLuxuryButton
            type="submit"
            :loading="authStore.loading"
            block
          >
            SIGN IN
          </UiLuxuryButton>
        </form>

        <!-- Divider -->
        <div class="relative my-8">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-luxury-border dark:border-luxury-dark-border"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-luxury-surface dark:bg-luxury-dark-surface text-luxury-text-muted dark:text-luxury-dark-text-muted uppercase tracking-wider text-xs">
              Or continue with
            </span>
          </div>
        </div>

        <!-- Social -->
        <UiLuxuryButton
          variant="secondary"
          block
          @click="authStore.loginWithGoogle"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" class="w-4 h-4" />
          Google
        </UiLuxuryButton>

        <!-- Footer -->
        <div class="mt-8 text-center text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
          <p>
            New here?
            <NuxtLink to="/signup" class="text-luxury-gold hover:text-luxury-gold-hover font-medium transition-colors">
              Create an account
            </NuxtLink>
          </p>
        </div>

      </div>
    </div>
  </div>
</template>
