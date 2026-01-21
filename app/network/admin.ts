// Network layer for Admin features
// Using useAdminFetch which handles auth headers

// Type definitions
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

export interface CreateProductData {
  name: string
  slug: string
  category_id: string
  file_paths?: string[]
  youtube_url?: string
  sections?: ProductSection[]
}

export interface UpdateProductData {
  name?: string
  slug?: string
  file_paths?: string[]
  youtube_url?: string
  sections?: ProductSection[]
}

export interface CreateVariantData {
  sku: string
  price: number
  attributes?: Record<string, string>
  product_id: string
}

export interface UpdateVariantData {
  sku?: string
  price?: number
  attributes?: Record<string, string>
}

export interface FileUploadResponse {
  url: string
  path: string
  size: number
  mimetype: string
  filename: string
}

export const adminNetwork = {
  // Businesses
  fetchBusinesses: () => useAdminFetch<any[]>('/businesses'),
  createBusiness: (data: { name: string; slug: string }) => useAdminFetch('/businesses', { method: 'POST', body: data }),
  updateBusiness: (id: string, data: { name: string; slug: string }) => useAdminFetch(`/businesses/${id}`, { method: 'PUT', body: data }),
  deleteBusiness: (id: string) => useAdminFetch(`/businesses/${id}`, { method: 'DELETE' }),

  // Categories
  fetchCategories: () => useAdminFetch<Category[]>('/categories'),
  fetchRootCategories: (businessId?: string) => {
    const query = businessId ? `?business_id=${businessId}` : ''
    return useAdminFetch<Category[]>(`/categories/roots${query}`)
  },
  createCategory: (data: { name: string; business_id: string; parent_id?: string }) => useAdminFetch('/categories', { method: 'POST', body: data }),
  updateCategory: (id: string, data: { name: string; parent_id?: string }) => useAdminFetch(`/categories/${id}`, { method: 'PUT', body: data }),
  deleteCategory: (id: string) => useAdminFetch(`/categories/${id}`, { method: 'DELETE' }),

  // Products
  fetchProducts: () => useAdminFetch<Product[]>('/products'),
  fetchProduct: (id: string) => useAdminFetch<Product>(`/products/${id}`),
  createProduct: (data: CreateProductData) => useAdminFetch<Product>('/products', { method: 'POST', body: data }),
  updateProduct: (id: string, data: UpdateProductData) => useAdminFetch<Product>(`/products/${id}`, { method: 'PUT', body: data }),
  deleteProduct: (id: string) => useAdminFetch(`/products/${id}`, { method: 'DELETE' }),

  // Product Variants
  fetchVariants: (productId: string) => useAdminFetch<ProductVariant[]>(`/products/${productId}/variants`),
  createVariant: (productId: string, data: CreateVariantData) => useAdminFetch<ProductVariant>(`/products/${productId}/variants`, { method: 'POST', body: data }),
  updateVariant: (id: string, data: UpdateVariantData) => useAdminFetch<ProductVariant>(`/products/variants/${id}`, { method: 'PUT', body: data }),
  deleteVariant: (id: string) => useAdminFetch(`/products/variants/${id}`, { method: 'DELETE' }),

  // Files
  uploadFile: async (file: File): Promise<FileUploadResponse> => {
    const supabase = useSupabase()
    const config = useRuntimeConfig()
    const { data: { session } } = await supabase.auth.getSession()
    const baseURL = config.public.apiBaseURL

    const formData = new FormData()
    formData.append('file', file)

    const headers: Record<string, string> = {}
    if (session?.access_token) {
      headers.Authorization = `Bearer ${session.access_token}`
    }

    return $fetch<FileUploadResponse>('/files/upload', {
      baseURL,
      method: 'POST',
      body: formData,
      headers,
    })
  },
  deleteFile: (path: string) => useAdminFetch(`/files/${encodeURIComponent(path)}`, { method: 'DELETE' })
}
