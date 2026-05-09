// Network layer for Admin features
// Using useAdminFetch which handles auth headers

// Type definitions
export interface Business {
  id: string
  name: string
  slug: string
  logo?: string
  slogan?: string
  primary_color?: string
  email?: string
  social?: {
    facebook?: string
    whatsapp?: string
    youtube?: string
    instagram?: string
    twitter?: string
    linkedin?: string
  }
  address?: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

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

export type DeliveryType = 'flat' | 'per_quantity' | 'weight_based' | 'free_over_amount'

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
  business_id: string
  file_paths?: string[]
  youtube_url?: string
  sections?: ProductSection[]
  delivery_type?: DeliveryType
  delivery_charge?: number
}

export interface UpdateProductData {
  name?: string
  slug?: string
  file_paths?: string[]
  youtube_url?: string
  sections?: ProductSection[]
  delivery_type?: DeliveryType
  delivery_charge?: number
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
  fetchBusinessById: (id: string) => useAdminFetch<Business>(`/businesses/${id}`),
  createBusiness: (data: { name: string; slug: string }) => useAdminFetch('/businesses', { method: 'POST', body: data }),
  updateBusiness: (id: string, data: Partial<Business>) => useAdminFetch(`/businesses/${id}`, { method: 'PUT', body: data }),
  deleteBusiness: (id: string) => useAdminFetch(`/businesses/${id}`, { method: 'DELETE' }),

  // Business-specific endpoints
  fetchProductsByBusiness: (businessId: string) => useAdminFetch<Product[]>(`/products/business/${businessId}`),
  fetchCategoriesByBusiness: (businessId: string) => useAdminFetch<Category[]>(`/categories?business_id=${businessId}`),
  fetchOrdersByBusiness: (businessId: string, params?: { status?: string; limit?: number; offset?: number }) => {
    const query = new URLSearchParams()
    if (params?.status) query.append('status', params.status)
    if (params?.limit) query.append('limit', params.limit.toString())
    if (params?.offset) query.append('offset', params.offset.toString())
    const queryString = query.toString()
    return useAdminFetch<any[]>(`/orders/business/${businessId}${queryString ? `?${queryString}` : ''}`)
  },

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
  deleteFile: (path: string) => useAdminFetch(`/files/${encodeURIComponent(path)}`, { method: 'DELETE' }),

  // Orders - Admin endpoints
  fetchAllOrders: (params?: { status?: string; phone?: string; limit?: number; offset?: number }) => {
    const query = new URLSearchParams()
    if (params?.status) query.append('status', params.status)
    if (params?.phone) query.append('phone', params.phone)
    if (params?.limit) query.append('limit', params.limit.toString())
    if (params?.offset) query.append('offset', params.offset.toString())
    const queryString = query.toString()
    return useAdminFetch<any[]>(`/orders${queryString ? `?${queryString}` : ''}`)
  },
  fetchOrderDetail: (id: string) => useAdminFetch<any>(`/orders/${id}`),
  updateOrderStatus: (id: string, data: { status: string; comment?: string }) =>
    useAdminFetch(`/orders/${id}/status`, { method: 'PATCH', body: data }),
  updateOrder: (id: string, data: { items: Array<{ id: string; quantity: number }> }) =>
    useAdminFetch(`/orders/${id}`, { method: 'PATCH', body: data }),

  // Instant Orders
  fetchInstantOrders: (businessId: string, params?: { status?: string; search?: string; limit?: number; offset?: number }) => {
    const query = new URLSearchParams()
    query.append('business_id', businessId)
    if (params?.status) query.append('status', params.status)
    if (params?.search) query.append('queryString', params.search)
    if (params?.limit) query.append('limit', params.limit.toString())
    if (params?.offset) query.append('offset', params.offset.toString())
    const queryString = query.toString()
    return useAdminFetch<any[]>(`/instant-orders${queryString ? `?${queryString}` : ''}`)
  },
  fetchInstantOrder: (id: number) => useAdminFetch<any>(`/instant-orders/${id}`),
  createInstantOrder: (data: any) => useAdminFetch('/instant-orders', { method: 'POST', body: data }),
  updateInstantOrder: (id: number, data: any) => useAdminFetch(`/instant-orders/${id}`, { method: 'PATCH', body: data }),
  searchUsers: (query: string) => useAdminFetch<any[]>(`/temp-users/search?q=${encodeURIComponent(query)}`),

  // Courier API
  createCourierOrder: (data: {
    recipient_name: string
    recipient_phone: string
    recipient_address: string
    cod_amount: number
  }) => useAdminFetch<any>('/steadfast/create-order', { method: 'POST', body: data }),

  // Courier Status - Public endpoint (no auth, goes through API proxy)
  fetchCourierStatusByTracking: (trackingCode: string) =>
    useAdminFetch<any>(`/steadfast/delivery-status/tracking/${trackingCode}`),
  fetchCourierStatusByCid: (cid: string) =>
    useAdminFetch<any>(`/steadfast/delivery-status/cid/${cid}`)
}
