// Network layer for Public features
// Using $fetch without auth headers for public endpoints

import type { OrderDetail, OrderItem, OrderHistory } from '~/types/order'

// Type definitions
export type DeliveryType = 'flat' | 'per_quantity' | 'weight_based' | 'free_over_amount'

// Type definitions (reused from admin)
export interface Product {
  id: string
  name: string
  slug: string
  file_paths?: string[]
  youtube_url?: string
  sections?: ProductSection[]
  category_id: string
  business_id: string
  category?: Category
  variants?: ProductVariant[]
  delivery_type: DeliveryType
  delivery_charge: number
  created_at?: string
  updated_at?: string
}

export interface ProductSection {
  type: 'text' | 'media'
  content?: string
  file_paths?: string[]
}

export interface ProductVariant {
  id: string
  sku: string
  price: number
  attributes: Record<string, string>
  product_id: string
  created_at?: string
  updated_at?: string
}

export interface Business {
  id: string
  name: string
}

export interface Category {
  id: string
  name: string
  business_id: string
  business?: Business
  parent_id?: string
}

// Order types
export interface CreateOrderRequest {
  user_id?: string | null
  status: string
  full_name?: string
  phone?: string
  business_id?: string
  shipping_address: {
    division: string
    division_name: string
    district?: string
    district_name?: string
    upazila?: string
    upazila_name?: string
    address: string
    mobile: string
  }
  items: Array<{
    product_id: string
    variant_id?: string | null
    quantity: number
  }>
}

export const publicNetwork = {
  // Products - Public endpoints
  fetchFeaturedProducts: (limit = 8) => {
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseURL

    return $fetch<Product[]>(`/products?limit=${limit}`, {
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },

  fetchProductBySlug: (slug: string) => {
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseURL

    return $fetch<Product>(`/products/slug/${slug}`, {
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },

  // Orders - Public endpoints
  createOrder: (request: CreateOrderRequest) => {
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseURL

    return $fetch('/orders', {
      baseURL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: request
    })
  },

  fetchOrderById: (orderId: string) => {
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseURL

    return $fetch<OrderDetail>(`/orders/${orderId}`, {
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },
}
