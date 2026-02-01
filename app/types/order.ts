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
}

export interface CreateOrderRequest {
  user_id?: string | null
  status: string
  shipping_address: ShippingAddress
  products: Array<{
    id: string
    variant_id?: string | null
    quantity: number
  }>
}
