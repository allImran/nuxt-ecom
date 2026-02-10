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
  sections?: Array<{
    type: string
    content?: string
    file_paths?: string[]
  }>
  category_id?: string
  business_id?: string
  youtube_url?: string
  created_at?: string
  updated_at?: string
  category?: {
    id: string
    name: string
    is_active: boolean
  }
  variants?: Array<{
    id: string
    sku: string
    price: number
    attributes: Record<string, string>
  }>
}

export interface OrderItem {
  id: string
  product: OrderProductSnapshot
  quantity: number
  price_at_purchase: number
  snapshot_name: string // Product name with variant info
  variant_id?: string
  product_id?: string
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
  business_id?: string
  status: string
  total_amount: number
  order_items: OrderItem[]
  shipping_address: ShippingAddress
  history?: OrderHistory[]
  payment_intent_id?: string | null
  created_at: string
  updated_at?: string
}

// Admin order types
export type OrderStatusType = 'pending' | 'conducted' | 'confirmed' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'returned' | 'partially_returned'

export interface AdminOrderListItem {
  id: string
  customer_name: string
  phone: string
  status: OrderStatusType
  total_amount: number
  created_at: string
  history?: OrderHistory[]
}

export interface AdminOrderDetail extends OrderDetail {
  status: OrderStatusType
}

export interface UpdateOrderStatusRequest {
  status: OrderStatusType
  comment?: string
}

export interface UpdateOrderRequest {
  items: Array<{
    id: string
    quantity: number
  }>
}
