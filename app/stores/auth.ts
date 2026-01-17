
export const useAuthStore = defineStore('auth', () => {
    const supabase = useSupabase()
    const user = ref(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const login = async (emailOrPhone: string, password: string) => {
        loading.value = true
        error.value = null
        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email: emailOrPhone, // Supabase expects email, but we pass identifier. If phone is configured, it might need phone handling. 
                // For now assuming email based on "Mail/Phone" prompt but keeping it simple as requested.
                password
            })
            if (authError) throw authError
            user.value = data.user
            return { success: true }
        } catch (e: any) {
            error.value = e.message
            return { success: false, error: e.message }
        } finally {
            loading.value = false
        }
    }

    const register = async (emailOrPhone: string, password: string) => {
        loading.value = true
        error.value = null
        try {
            const { data, error: authError } = await supabase.auth.signUp({
                email: emailOrPhone,
                password,
            })
            if (authError) throw authError
            user.value = data.user
            return { success: true }
        } catch (e: any) {
            error.value = e.message
            return { success: false, error: e.message }
        } finally {
            loading.value = false
        }
    }

    const loginWithGoogle = async () => {
        loading.value = true
        error.value = null
        try {
            const { error: authError } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin, // Redirect back to home/current page
                }
            })
            if (authError) throw authError
        } catch (e: any) {
            error.value = e.message
        } finally {
            loading.value = false
        }
    }

    const logout = async () => {
        loading.value = true
        try {
            await supabase.auth.signOut()
            user.value = null
            navigateTo('/login')
        } catch (e: any) {
            error.value = e.message
        } finally {
            loading.value = false
        }
    }

    // Initialize user
    const init = async () => {
        const { data } = await supabase.auth.getSession()
        console.log(data)
        user.value = data.session?.user || null

        supabase.auth.onAuthStateChange((event: any, session: any) => {
            user.value = session?.user || null
        })
    }

    init()

    return {
        user,
        loading,
        error,
        login,
        register,
        loginWithGoogle,
        logout
    }
})
