// Network layer for Public features
// Using $fetch without auth headers for public endpoints

// Type definitions (reused from admin)
export interface Product {
  id: string
  name: string
  slug: string
  file_paths?: string[]
  youtube_url?: string
  sections?: ProductSection[]
  category_id: string
  category?: Category
  variants?: ProductVariant[]
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

export interface Category {
  id: string
  name: string
  business_id: string
  parent_id?: string
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
}
