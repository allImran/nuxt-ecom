export default defineNuxtRouteMiddleware(async (to, from) => {
  const supabase = useSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  console.log(session, 'ddd')
  // 1. Check if authenticated
  if (!session) {
    return navigateTo('/login')
  }

  // 2. Check Role (Assuming role is in user_metadata or similar)
  // Note: The prompt says "user with admin role will be able to access it".
  // Usually this is in app_metadata or user_metadata.
  // For now, I'll inspect session to see where it might be, but standard Supabase RBAC often uses custom claims.
  // The API_DOCS imply RBAC exists.
  // I'll check user_metadata.role or app_metadata.role.
  // If not sure, I'll allow assuming the backend will block requests if unauthorized, but middleware should block UI access.
  // Let's assume user_metadata.role === 'admin' for now, or just allow logged in users if role structure isn't defined yet.
  // The user prompt said "user with admin role". I'll try to check it.
  
  const user = session.user
  const role = user?.user_metadata?.role || user?.app_metadata?.role
  
  // Guardrail: If role check is too strict without knowing the DB structure, I might lock myself out.
  // But strictness is requested.
  // I will check if role == 'admin'.
  
  if (role !== 'admin') {
    // Redirect to home if not admin
    return navigateTo('/')
  }
})
