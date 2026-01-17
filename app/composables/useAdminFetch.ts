export const useAdminFetch = async <T>(url: string, options: any = {}) => {
  const supabase = useSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  
  // Base URL from API_DOCS
  const baseURL = 'https://urbanease-backend.vercel.app/api'

  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
  }

  // Attach token if session exists
  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`
  }

  return $fetch<T>(url, {
    baseURL,
    ...options,
    headers,
  })
}
