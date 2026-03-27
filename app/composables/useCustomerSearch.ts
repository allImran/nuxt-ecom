// Customer search composable
// Handles searching and selecting users for instant orders

import type { UserSearchResult, CustomerInfo } from '~/types/instantOrder'

export function useCustomerSearch() {
  const searchQuery = ref('')
  const searchResults = ref<UserSearchResult[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedUser = ref<UserSearchResult | null>(null)

  // Debounce timer
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  // Debounced search function
  async function searchUsers(query: string) {
    searchQuery.value = query

    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    // Don't search for empty or too short queries
    if (!query || query.length < 2) {
      searchResults.value = []
      return
    }

    // Set debounce timer
    debounceTimer = setTimeout(async () => {
      loading.value = true
      error.value = null

      try {
        const { adminNetwork } = await import('~/network/admin')
        const results = await adminNetwork.searchUsers(query)
        searchResults.value = results || []
      } catch (err) {
        console.error('Failed to search users:', err)
        // Graceful fallback - just show error and allow manual entry
        searchResults.value = []
        error.value = 'search_failed'
      } finally {
        loading.value = false
      }
    }, 400) // 400ms debounce
  }

  // Select a user from search results
  function selectUser(user: UserSearchResult) {
    selectedUser.value = user
    searchQuery.value = ''
    searchResults.value = []
    error.value = null
  }

  // Clear selected user
  function clearUser() {
    selectedUser.value = null
    searchQuery.value = ''
    searchResults.value = []
  }

  // Reset all state
  function reset() {
    searchQuery.value = ''
    searchResults.value = []
    loading.value = false
    error.value = null
    selectedUser.value = null
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }
  }

  // Get customer info from selected user
  function getCustomerInfo(): CustomerInfo | null {
    if (!selectedUser.value) return null
    return {
      name: selectedUser.value.name,
      phone: selectedUser.value.phone,
      address: '' // User search doesn't return address, will need manual entry
    }
  }

  // Watch search query and trigger search
  watch(searchQuery, (newQuery) => {
    if (selectedUser.value) {
      // Clear selected user if user types in search
      clearUser()
    }
    searchUsers(newQuery)
  })

  return {
    // State
    searchQuery,
    searchResults,
    loading,
    error,
    selectedUser,

    // Actions
    searchUsers,
    selectUser,
    clearUser,
    reset,
    getCustomerInfo
  }
}
