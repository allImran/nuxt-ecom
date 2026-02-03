// Order-related types for e-commerce functionality

import type { LocationData } from './location'

export interface OrderProduct {
  id: string
  variant_id: string | null
  quantity: number
}

export interface ShippingAddress {
  division: string            // Division ID
  division_name: string       // Division name (for display)
  district?: string           // District ID (optional)
  district_name?: string      // District name (optional)
  upazila?: string            // Upazila ID (optional)
  upazila_name?: string       // Upazila name (optional)
  address: string             // Full address text
  mobile: string              // Mobile number
  full_name?: string
}

export interface CreateOrderRequest {
  user_id?: string | null
  status: string
  full_name?: string
  phone?: string
  business_id?: string
  shipping_address: ShippingAddress
  items: Array<{
    product_id: string
    variant_id?: string | null
    quantity: number
  }>
}

// Order detail types for displaying order information
export interface OrderProductSnapshot {
  id: string
  name: string
  slug: string
  file_paths?: string[]
}

export interface OrderItem {
  id: string
  product: OrderProductSnapshot
  quantity: number
  price: number
  snapshot_name: string // Product name with variant info
}

export interface OrderHistory {
  id: string
  order_id: string
  status: string
  changed_at: string
  comment?: string
}

export interface OrderDetail {
  id: string
  user_id?: string
  status: string
  total: number
  items: OrderItem[]
  shipping_address: ShippingAddress
  order_history?: OrderHistory[]
  created_at: string
  updated_at: string
}
