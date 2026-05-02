// Instant Order types for admin ad-hoc order management

/**
 * Valid status values for instant orders
 * Matches regular order statuses for consistency
 */
export type InstantOrderStatus = 'pending' | 'confirmed' | 'paid' | 'shipped' | 'delivered' | 'cancelled'

/**
 * Customer information for manual entry (when user_id is not set)
 */
export interface CustomerInfo {
  name: string
  phone: string
  address: string
}

/**
 * Order item for instant orders (custom items, not tied to products)
 */
export interface OrderItemForm {
  title: string
  price: number
  quantity: number
  unit: string
  description?: string
}

/**
 * Order item as returned from API
 */
export interface InstantOrderItem {
  id?: string
  title: string
  price: number
  quantity: number
  unit: string
  description?: string
}

/**
 * Complete instant order from API
 */
export interface InstantOrder {
  id: number
  business_id: string
  user_id?: string | null
  temp_user_id?: number
  customer_info: CustomerInfo
  order_items: InstantOrderItem[]
  delivery_charge: number
  cod_reference?: any
  status: InstantOrderStatus
  total: number
  created_at: string
  updated_at: string
}

/**
 * Form data for creating/updating instant orders
 */
export interface InstantOrderForm {
  user_id: string | null
  customer_info: CustomerInfo
  order_items: OrderItemForm[]
  delivery_charge: number
  cod_reference: string
  status: InstantOrderStatus
}

/**
 * Request payload for creating an instant order
 */
export interface CreateInstantOrderRequest {
  business_id: string
  user_id?: string
  customer_info: CustomerInfo
  order_items: OrderItemForm[]
  delivery_charge: number
  cod_reference?: string
  status?: InstantOrderStatus
}

/**
 * Request payload for updating an instant order
 */
export interface UpdateInstantOrderRequest {
  user_id?: string | null
  customer_info?: CustomerInfo
  order_items?: OrderItemForm[]
  delivery_charge?: number
  cod_reference?: string | any
  status?: InstantOrderStatus
}

/**
 * List view item for instant orders table
 * Matches the actual API response structure
 */
export interface InstantOrderListItem {
  id: number
  business_id: string
  user_id: string | null
  temp_user_id?: number
  customer_info: {
    name: string
    phone: string
    address: string
  }
  delivery_charge: number
  cod_reference: any
  order_items: InstantOrderItem[]
  created_at: string
  status: InstantOrderStatus
  updated_at: string
  total: number
}

/**
 * Query parameters for fetching instant orders
 */
export interface FetchInstantOrdersParams {
  business_id: string
  status?: InstantOrderStatus
  search?: string
  limit?: number
  offset?: number
}

/**
 * User search result for customer selection
 */
export interface UserSearchResult {
  id: string
  name: string
  phone: string
  email?: string
}
