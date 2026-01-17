import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
    // Initialize from localStorage or default to false (light mode)
    const isDark = ref(localStorage.theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches))
    // console.log((!("theme" in localStorage)))

    const toggleTheme = () => {
        isDark.value = !isDark.value
    }

    watch(isDark, (val) => {
        localStorage.setItem('theme', val ? 'dark' : 'light')
        if (val) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, { immediate: true }) // Run immediately to set initial state

    return {
        isDark,
        toggleTheme
    }
})
