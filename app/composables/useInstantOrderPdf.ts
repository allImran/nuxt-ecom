// PDF generation composable for instant order invoices
//
// Renders the invoice as HTML and produces the PDF through the browser's own
// print pipeline (Save as PDF). This is required for correct Bengali rendering:
// jsPDF cannot perform complex-text shaping, so it mangles Bengali. The browser
// shapes the text correctly AND keeps it selectable/copyable in the PDF.

import type { InstantOrder, InstantOrderListItem } from '~/types/instantOrder'
import type { Business } from '~/network/admin'
import { formatCurrency } from '~/config/pdfConfig'
import { getPublicImage } from '~/utils/image'
import {
  escapeHtml,
  fetchImageAsDataUrl,
  renderInvoiceDocument,
  printInvoiceHtml
} from '~/utils/invoicePrint'

interface UseInstantOrderPdfReturn {
  generateInstantOrderPdf: (order: InstantOrder | InstantOrderListItem, business: Business) => Promise<void>
  isGenerating: Ref<boolean>
  error: Ref<string | null>
}

/** Divider inserted between invoice sections. */
const DIVIDER = '<hr class="inv-divider" />'

/** Human-readable labels for known social platforms. */
const SOCIAL_LABELS: Record<string, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'YouTube',
  twitter: 'Twitter',
  linkedin: 'LinkedIn',
  whatsapp: 'WhatsApp'
}

export function useInstantOrderPdf(): UseInstantOrderPdfReturn {
  const isGenerating = ref(false)
  const error = ref<string | null>(null)

  /**
   * Generate and open a print-to-PDF invoice for an instant order.
   */
  async function generateInstantOrderPdf(
    order: InstantOrder | InstantOrderListItem,
    business: Business
  ): Promise<void> {
    isGenerating.value = true
    error.value = null

    try {
      const primaryColor = business.primary_color || '#af8f6f'

      // Resolve and load the business logo as a data URL.
      let logoDataUrl: string | null = null
      if (business.logo) {
        let logoUrl = business.logo
        if (!business.logo.startsWith('http')) {
          const parts = business.logo.split('/')
          const bucket = 'product-images/uploads'
          const path = parts.length > 1 ? parts.slice(1).join('/') : business.logo
          logoUrl = getPublicImage(bucket, path)
        }
        logoDataUrl = await fetchImageAsDataUrl(logoUrl)
      }

      // --- Header: brand meta lines (address, socials, email) ---
      const brandMeta: string[] = []
      if (business.address) brandMeta.push(business.address)
      if (business.social) {
        for (const [platform, url] of Object.entries(business.social)) {
          if (url) {
            const label = SOCIAL_LABELS[platform] || platform.charAt(0).toUpperCase() + platform.slice(1)
            brandMeta.push(`${label}: ${url}`)
          }
        }
      }
      if (business.email) brandMeta.push(`Email: ${business.email}`)

      const logoHtml = logoDataUrl
        ? `<img class="inv-logo" src="${logoDataUrl}" alt="" />`
        : ''
      const brandMetaHtml = brandMeta
        .map((line) => `<p class="inv-brand-meta">${escapeHtml(line)}</p>`)
        .join('')

      // Consignment / tracking id from cod_reference
      let consignmentId = ''
      if (order.cod_reference) {
        try {
          const consignment = typeof order.cod_reference === 'string'
            ? JSON.parse(order.cod_reference)
            : order.cod_reference
          consignmentId = consignment?.consignment_id || ''
        } catch {
          // Not JSON; no consignment id available.
        }
      }
      const cnHtml = consignmentId
        ? `<p class="inv-cn">CN#${escapeHtml(consignmentId)}</p>`
        : ''

      const headerHtml = `
        <div class="inv-header">
          <div class="inv-brand">
            ${logoHtml}
            <div>
              <p class="inv-brand-name">${escapeHtml(business.name)}</p>
              ${brandMetaHtml}
            </div>
          </div>
          <div class="inv-meta-right">
            ${cnHtml}
            <p class="line">Order ID: ${escapeHtml(order.id)}</p>
            <p class="line">Date: ${escapeHtml(new Date(order.created_at).toLocaleDateString())}</p>
          </div>
        </div>
        <hr class="inv-divider" />`

      // --- Customer details ---
      const customerHtml = `
        <div class="inv-cust">
          <p class="inv-section-title">Customer Info</p>
          <p>Name: ${escapeHtml(order.customer_info?.name || 'N/A')}</p>
          <p>Phone: ${escapeHtml(order.customer_info?.phone || '-')}</p>
          <p>Address: ${escapeHtml(order.customer_info?.address || 'N/A')}</p>
        </div>`

      // --- Items table ---
      let subtotal = 0
      const rowsHtml = order.order_items.map((item) => {
        const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price
        const quantity = typeof item.quantity === 'string' ? parseInt(item.quantity, 10) : item.quantity
        const lineTotal = price * quantity
        subtotal += lineTotal
        return `
          <tr>
            <td>${escapeHtml(item.title || 'N/A')}</td>
            <td class="col-qty">${escapeHtml(`${quantity} ${item.unit || 'pcs'}`)}</td>
            <td class="col-price">${escapeHtml(formatCurrency(price))}</td>
            <td class="col-total">${escapeHtml(formatCurrency(lineTotal))}</td>
          </tr>`
      }).join('')

      const tableHtml = `
        <table class="inv-items">
          <thead>
            <tr>
              <th>Product Name</th>
              <th class="col-qty">Quantity</th>
              <th class="col-price">Unit Price</th>
              <th class="col-total">Total</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>`

      // --- Summary ---
      const deliveryCharge = typeof order.delivery_charge === 'string'
        ? parseFloat(order.delivery_charge)
        : order.delivery_charge
      const total = order.total || subtotal + deliveryCharge
      const summaryHtml = `
        <div class="inv-summary">
          <div class="inv-summary-row"><span>Subtotal:</span><span>${escapeHtml(formatCurrency(subtotal))}</span></div>
          <div class="inv-summary-row"><span>Delivery Charge:</span><span>${escapeHtml(formatCurrency(deliveryCharge))}</span></div>
          <div class="inv-summary-total"><span>Total:</span><span>${escapeHtml(formatCurrency(total))}</span></div>
        </div>`

      const orderDate = new Date(order.created_at).toISOString().split('T')[0]
      const title = `${business?.name ? business.name + '-' : ''}Order-${order.id}-${orderDate}`

      const html = renderInvoiceDocument({
        title,
        primaryColor,
        body: headerHtml + customerHtml + DIVIDER + tableHtml + DIVIDER + summaryHtml
      })

      await printInvoiceHtml(html)
    } catch (err) {
      console.error('PDF generation failed:', err)
      error.value = err instanceof Error ? err.message : 'Failed to generate PDF'
      throw err
    } finally {
      isGenerating.value = false
    }
  }

  return {
    generateInstantOrderPdf,
    isGenerating,
    error
  }
}
