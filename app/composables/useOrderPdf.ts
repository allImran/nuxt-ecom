// PDF generation composable for order invoices
//
// Renders the invoice as HTML and produces the PDF through the browser's own
// print pipeline (Save as PDF). This is required for correct Bengali rendering:
// jsPDF cannot perform complex-text shaping, so it mangles Bengali. The browser
// shapes the text correctly AND keeps it selectable/copyable in the PDF.

import { type OrderDetail } from '~/types/order'
import { PDF_CONFIG, formatCurrency, LOGO_CONFIG } from '~/config/pdfConfig'
import {
  escapeHtml,
  fetchImageAsDataUrl,
  renderInvoiceDocument,
  printInvoiceHtml
} from '~/utils/invoicePrint'

interface UseOrderPdfReturn {
  generateOrderPdf: (order: OrderDetail) => Promise<void>
  isGenerating: Ref<boolean>
  error: Ref<string | null>
}

/** Divider inserted between invoice sections. */
const DIVIDER = '<hr class="inv-divider" />'

/** Convert an [r, g, b] tuple to a hex color string. */
function rgbToHex([r, g, b]: [number, number, number]): string {
  const h = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0')
  return `#${h(r)}${h(g)}${h(b)}`
}

export function useOrderPdf(): UseOrderPdfReturn {
  const isGenerating = ref(false)
  const error = ref<string | null>(null)

  /**
   * Generate and open a print-to-PDF invoice for an order.
   */
  async function generateOrderPdf(order: OrderDetail): Promise<void> {
    isGenerating.value = true
    error.value = null

    try {
      const { company } = PDF_CONFIG
      const primaryColor = rgbToHex(PDF_CONFIG.colors.primary)

      // Load logo as a data URL so it renders reliably in the print frame.
      const logoDataUrl = await fetchImageAsDataUrl(LOGO_CONFIG.path)

      // --- Header ---
      const logoHtml = logoDataUrl
        ? `<img class="inv-logo" src="${logoDataUrl}" alt="" />`
        : ''
      const headerHtml = `
        <div class="inv-header">
          <div class="inv-brand">
            ${logoHtml}
            <div>
              <p class="inv-brand-name">${escapeHtml(company.name)}</p>
              <p class="inv-brand-meta">${escapeHtml(company.address)}</p>
              <p class="inv-brand-meta">Phone: ${escapeHtml(company.phone)}</p>
              <p class="inv-brand-meta">Email: ${escapeHtml(company.email)}</p>
            </div>
          </div>
          <div class="inv-meta-right">
            <p class="inv-invoice-label">INVOICE</p>
            <p class="line">Order ID: ${escapeHtml(order.id)}</p>
            <p class="line">Date: ${escapeHtml(new Date(order.created_at).toLocaleDateString())}</p>
          </div>
        </div>
        <hr class="inv-divider" />`

      // --- Customer details ---
      const addr = order.shipping_address
      const locationParts = [addr.upazila_name, addr.district_name, addr.division_name].filter(Boolean)
      const locationHtml = locationParts.length
        ? `<p>${escapeHtml(locationParts.join(', '))}</p>`
        : ''
      const customerHtml = `
        <div class="inv-cust">
          <p class="inv-section-title">Bill To</p>
          <p>Name: ${escapeHtml(addr.full_name || 'N/A')}</p>
          <p>Phone: ${escapeHtml(addr.mobile)}</p>
          <p>Address: ${escapeHtml(addr.address)}</p>
          ${locationHtml}
        </div>`

      // --- Items table ---
      let subtotal = 0
      const rowsHtml = order.order_items.map((item) => {
        const unitPrice = typeof item.price_at_purchase === 'string'
          ? parseFloat(item.price_at_purchase)
          : item.price_at_purchase
        const quantity = typeof item.quantity === 'string'
          ? parseInt(item.quantity, 10)
          : item.quantity
        const lineTotal = unitPrice * quantity
        subtotal += lineTotal
        const name = item.snapshot_name || item.product?.name || 'N/A'
        return `
          <tr>
            <td>${escapeHtml(name)}</td>
            <td class="col-qty">${escapeHtml(quantity)}</td>
            <td class="col-price">${escapeHtml(formatCurrency(unitPrice))}</td>
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
      const deliveryCharge = PDF_CONFIG.deliveryCharge
      const total = subtotal + deliveryCharge
      const summaryHtml = `
        <div class="inv-summary">
          <div class="inv-summary-row"><span>Subtotal:</span><span>${escapeHtml(formatCurrency(subtotal))}</span></div>
          <div class="inv-summary-row"><span>Delivery Charge:</span><span>${escapeHtml(formatCurrency(deliveryCharge))}</span></div>
          <div class="inv-summary-total"><span>Total:</span><span>${escapeHtml(formatCurrency(total))}</span></div>
        </div>`

      // --- Footer ---
      const footerHtml = `
        <div class="inv-footer">
          <p>Thank you for your order!</p>
          <p>${escapeHtml(company.phone)} | ${escapeHtml(company.email)}</p>
        </div>`

      const orderDate = new Date(order.created_at).toISOString().split('T')[0]
      const title = `order-${order.id}-${orderDate}`

      const html = renderInvoiceDocument({
        title,
        primaryColor,
        body: headerHtml + customerHtml + DIVIDER + tableHtml + DIVIDER + summaryHtml + footerHtml
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
    generateOrderPdf,
    isGenerating,
    error
  }
}
