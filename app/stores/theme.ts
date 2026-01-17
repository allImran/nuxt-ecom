import { defineStore } from 'pinia'
import { ref, watch, onMounted } from 'vue'

export const useThemeStore = defineStore('theme', () => {
    // Initialize from localStorage or default to false (light mode)
    const isDark = ref(false)
    // console.log((!("theme" in localStorage)))

    const toggleTheme = () => {
        isDark.value = !isDark.value
    }

    const inWather = (val: boolean) => {
        localStorage.setItem('theme', val ? 'dark' : 'light')
        if (val) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }

    watch(isDark, (val) => {
        inWather(val)
    }) // Run immediately to set initial state

    onMounted(() => {
        isDark.value = localStorage.theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
        inWather(isDark.value)
    })

    return {
        isDark,
        toggleTheme
    }
})
