
// Network layer for Admin features
// Using useAdminFetch which handles auth headers

export const adminNetwork = {
    // Businesses
    fetchBusinesses: () => useAdminFetch<any[]>('/businesses'),
    createBusiness: (data: { name: string; slug: string }) => useAdminFetch('/businesses', { method: 'POST', body: data }),
    updateBusiness: (id: string, data: { name: string; slug: string }) => useAdminFetch(`/businesses/${id}`, { method: 'PUT', body: data }),
    deleteBusiness: (id: string) => useAdminFetch(`/businesses/${id}`, { method: 'DELETE' }),

    // Categories
    fetchCategories: () => useAdminFetch<any[]>('/categories'),
    createCategory: (data: { name: string; business_id: string }) => useAdminFetch('/categories', { method: 'POST', body: data }),
    updateCategory: (id: string, data: { name: string }) => useAdminFetch(`/categories/${id}`, { method: 'PUT', body: data }),
    deleteCategory: (id: string) => useAdminFetch(`/categories/${id}`, { method: 'DELETE' })
}
