export const useAdminLayout = () => {
    const themeStore = useThemeStore()
    const authStore = useAuthStore()
    
    const isDark = computed(() => themeStore.isDark)
    
    const toggleTheme = () => {
        themeStore.toggleTheme()
    }
    
    const handleLogout = async () => {
        await authStore.logout()
    }
    
    return {
        isDark,
        toggleTheme,
        handleLogout
    }
}
