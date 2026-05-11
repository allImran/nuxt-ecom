import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  variant?: string
  image?: string
  slug: string
}

const getInitialCart = (): CartItem[] => {
  if (import.meta.client) {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        return JSON.parse(savedCart)
      } catch {
        return []
      }
    }
  }
  return []
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(getInitialCart())

  const loadCart = () => {
    if (import.meta.client) {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        try {
          items.value = JSON.parse(savedCart)
        } catch {
          items.value = []
        }
      }
    }
  }

  const saveCart = () => {
    if (import.meta.client) {
      localStorage.setItem('cart', JSON.stringify(items.value))
    }
  }

  const addItem = (product: {
    id: string
    name: string
    price: number
    slug: string
    image?: string
    variant?: string
  }, quantity: number = 1) => {
    const existingItemIndex = items.value.findIndex(
      item => item.productId === product.id && item.variant === product.variant
    )

    if (existingItemIndex > -1) {
      items.value[existingItemIndex].quantity += quantity
    } else {
      items.value.push({
        id: `${product.id}-${product.variant || 'default'}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        variant: product.variant,
        image: product.image,
        slug: product.slug
      })
    }
    saveCart()
  }

  const removeItem = (itemId: string) => {
    items.value = items.value.filter(item => item.id !== itemId)
    saveCart()
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    const item = items.value.find(i => i.id === itemId)
    if (item) {
      item.quantity = Math.max(0, quantity)
      if (item.quantity === 0) {
        removeItem(itemId)
      } else {
        saveCart()
      }
    }
  }

  const clearCart = () => {
    items.value = []
    saveCart()
  }

  const totalItems = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  const totalPrice = computed(() => items.value.reduce((sum, item) => sum + (item.price * item.quantity), 0))

  watch(items, saveCart, { deep: true })

  return {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    loadCart
  }
})
