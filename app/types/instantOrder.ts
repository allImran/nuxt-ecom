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
  id: string
  business_id: string
  user_id?: string | null
  customer_info: CustomerInfo
  order_items: InstantOrderItem[]
  delivery_charge: number
  cod_reference?: string
  status: InstantOrderStatus
  total_amount: number
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
  user_id?: string
  customer_info?: CustomerInfo
  order_items?: OrderItemForm[]
  delivery_charge?: number
  cod_reference?: string
  status?: InstantOrderStatus
}

/**
 * List view item for instant orders table
 */
export interface InstantOrderListItem {
  id: string
  customer_name: string
  phone: string
  status: InstantOrderStatus
  total_amount: number
  created_at: string
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
