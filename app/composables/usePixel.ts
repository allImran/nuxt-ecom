/**
 * Unified Meta Pixel Composable
 * Provides centralized tracking functions for Facebook/Meta Pixel events
 * All functions are safely wrapped to prevent SSR crashes during static generation
 */

export interface PixelEventParams {
  content_type?: 'product' | 'product_group'
  content_ids?: string[]
  content_name?: string
  content_category?: string
  value?: number
  currency?: string
  num_items?: number
  [key: string]: any
}

export interface PixelUserData {
  em?: string // Hashed email
  fn?: string // Hashed first name
  ln?: string // Hashed last name
  ph?: string // Hashed phone
  external_id?: string // Unique user ID
  [key: string]: any
}

/**
 * Check if fbq is available on window
 */
function isFbqAvailable(): boolean {
  if (import.meta.server) return false
  return typeof (window as any).fbq === 'function'
}

/**
 * Format value to 2 decimal places as float for Meta Pixel
 */
function formatValue(value: number | string | undefined): number {
  if (value === undefined || value === null) return 0
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return 0
  return parseFloat(num.toFixed(2))
}

/**
 * Ensure content_ids is an array of strings
 */
function formatContentIds(ids: string | string[] | undefined): string[] {
  if (!ids) return []
  if (Array.isArray(ids)) return ids.map(String)
  return [String(ids)]
}

/**
 * Standardize event parameters for Meta Pixel
 */
function standardizeParams(params?: Record<string, any>): PixelEventParams {
  if (!params) return {}

  const standardized: PixelEventParams = { ...params }

  // Format value to 2 decimal places
  if (standardized.value !== undefined) {
    standardized.value = formatValue(standardized.value)
  }

  // Ensure content_ids is an array of strings
  if (standardized.content_ids !== undefined) {
    standardized.content_ids = formatContentIds(standardized.content_ids)
  }

  return standardized
}

/**
 * Track a standard Meta Pixel event
 * @param eventName - Name of the event (e.g., 'AddToCart', 'Purchase', 'ViewContent')
 * @param params - Event parameters (will be standardized)
 * @param userData - Optional user data for advanced matching
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, any>,
  userData?: Record<string, any>
): void {
  if (!isFbqAvailable()) {
    if (import.meta.client) {
      console.debug('[Pixel] fbq not available, skipping event:', eventName)
    }
    return
  }

  const standardizedParams = standardizeParams(params)

  try {
    if (userData && Object.keys(userData).length > 0) {
      // With advanced matching data
      ;(window as any).fbq('track', eventName, standardizedParams, userData)
    } else {
      // Standard tracking
      ;(window as any).fbq('track', eventName, standardizedParams)
    }

    if (import.meta.client) {
      console.debug('[Pixel] Tracked event:', eventName, standardizedParams)
    }
  } catch (error) {
    if (import.meta.client) {
      console.error('[Pixel] Failed to track event:', eventName, error)
    }
  }
}

/**
 * Track a custom Meta Pixel event
 * @param eventName - Name of the custom event
 * @param params - Event parameters
 * @param userData - Optional user data for advanced matching
 */
export function trackCustomEvent(
  eventName: string,
  params?: Record<string, any>,
  userData?: Record<string, any>
): void {
  if (!isFbqAvailable()) {
    if (import.meta.client) {
      console.debug('[Pixel] fbq not available, skipping custom event:', eventName)
    }
    return
  }

  const standardizedParams = standardizeParams(params)

  try {
    if (userData && Object.keys(userData).length > 0) {
      ;(window as any).fbq('trackCustom', eventName, standardizedParams, userData)
    } else {
      ;(window as any).fbq('trackCustom', eventName, standardizedParams)
    }

    if (import.meta.client) {
      console.debug('[Pixel] Tracked custom event:', eventName, standardizedParams)
    }
  } catch (error) {
    if (import.meta.client) {
      console.error('[Pixel] Failed to track custom event:', eventName, error)
    }
  }
}

/**
 * Track PageView event (automatically called by Pixel init, but can be used for SPA navigation)
 */
export function trackPageView(userData?: Record<string, any>): void {
  trackEvent('PageView', undefined, userData)
}

/**
 * Track ViewContent event (product page view)
 */
export function trackViewContent(
  productId: string,
  productName: string,
  price: number,
  currency: string = 'BDT',
  category?: string,
  userData?: Record<string, any>
): void {
  trackEvent('ViewContent', {
    content_type: 'product',
    content_ids: [productId],
    content_name: productName,
    content_category: category,
    value: price,
    currency
  }, userData)
}

/**
 * Track AddToCart event
 */
export function trackAddToCart(
  productId: string | string[],
  productName?: string,
  price?: number,
  quantity: number = 1,
  currency: string = 'BDT',
  userData?: Record<string, any>
): void {
  const contentIds = formatContentIds(productId)
  trackEvent('AddToCart', {
    content_type: 'product',
    content_ids: contentIds,
    ...(productName && { content_name: productName }),
    ...(price && { value: price * quantity }),
    currency,
    num_items: quantity
  }, userData)
}

/**
 * Track Purchase event
 */
export function trackPurchase(
  orderId: string,
  value: number,
  contentIds: string[],
  numItems: number,
  currency: string = 'BDT',
  userData?: Record<string, any>
): void {
  trackEvent('Purchase', {
    content_type: 'product',
    content_ids: contentIds,
    value,
    currency,
    num_items: numItems
  }, userData)
}

/**
 * Track InitiateCheckout event
 */
export function trackInitiateCheckout(
  value: number,
  numItems: number,
  contentIds?: string[],
  currency: string = 'BDT',
  userData?: Record<string, any>
): void {
  trackEvent('InitiateCheckout', {
    content_type: 'product',
    ...(contentIds && { content_ids: contentIds }),
    value,
    currency,
    num_items: numItems
  }, userData)
}

/**
 * Track Search event
 */
export function trackSearch(
  searchString: string,
  category?: string,
  contentIds?: string[],
  value?: number,
  currency: string = 'BDT',
  userData?: Record<string, any>
): void {
  trackEvent('Search', {
    content_type: 'product',
    search_string: searchString,
    ...(category && { content_category: category }),
    ...(contentIds && { content_ids: contentIds }),
    ...(value && { value }),
    currency
  }, userData)
}

/**
 * Track Lead event
 */
export function trackLead(
  value?: number,
  currency: string = 'BDT',
  contentName?: string,
  userData?: Record<string, any>
): void {
  trackEvent('Lead', {
    ...(value && { value }),
    currency,
    ...(contentName && { content_name: contentName })
  }, userData)
}

/**
 * Composable export
 */
export function usePixel() {
  return {
    isAvailable: isFbqAvailable(),
    trackEvent,
    trackCustomEvent,
    trackPageView,
    trackViewContent,
    trackAddToCart,
    trackPurchase,
    trackInitiateCheckout,
    trackSearch,
    trackLead,
    formatValue,
    formatContentIds
  }
}
