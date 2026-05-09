// PDF generation composable for instant order invoices
// Uses jsPDF for native PDF generation (NOT HTML-to-PDF conversion)

import type { InstantOrder, InstantOrderListItem } from '~/types/instantOrder'
import type { Business } from '~/network/admin'
import { formatCurrency, A4_WIDTH, A4_HEIGHT } from '~/config/pdfConfig'
import { getPublicImage } from '~/utils/image'
import jsPDF from 'jspdf'

// Import and register autoTable plugin
import { autoTable } from 'jspdf-autotable'

// Extend jsPDF type to include autoTable plugin
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => void
    lastAutoTable: {
      finalY: number
    }
  }
}

interface UseInstantOrderPdfReturn {
  generateInstantOrderPdf: (order: InstantOrder | InstantOrderListItem, business: Business) => Promise<void>
  isGenerating: Ref<boolean>
  error: Ref<string | null>
}

export function useInstantOrderPdf(): UseInstantOrderPdfReturn {
  const isGenerating = ref(false)
  const error = ref<string | null>(null)

  /**
   * Generate and download PDF invoice for an instant order
   */
  async function generateInstantOrderPdf(order: InstantOrder | InstantOrderListItem, business: Business): Promise<void> {
    isGenerating.value = true
    error.value = null

    try {
      // Create new PDF document (A4, portrait, millimeters)
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      // Load and set Bengali fonts for Unicode support
      await loadAndAddFonts(doc)
      doc.setFont('HindSiliguri', 'normal')

      const margins = { top: 15, right: 15, bottom: 15, left: 15 }
      let currentY = margins.top

      // Add header section with business logo and info
      currentY = await addHeader(doc, order, business, currentY, margins)

      // Add customer details section
      currentY = addCustomerDetails(doc, order, currentY, margins)

      // Add order items table
      currentY = addItemsTable(doc, order, currentY, margins, business)

      // Add summary section
      currentY = addSummary(doc, order, currentY, margins, business)

      // Add footer
      addFooter(doc, order, business, margins)

      // Generate filename: instant-order-{id}-{date}.pdf
      const orderDate = new Date(order.created_at).toISOString().split('T')[0]
      const filename = `instant-order-${order.id}-${orderDate}.pdf`

      // Save the PDF
      doc.save(filename)

    } catch (err) {
      console.error('PDF generation failed:', err)
      error.value = err instanceof Error ? err.message : 'Failed to generate PDF'
      throw err
    } finally {
      isGenerating.value = false
    }
  }

  /**
   * Add header section with logo, business details, and invoice info
   */
  async function addHeader(doc: any, order: InstantOrder | InstantOrderListItem, business: Business, startY: number, margins: any): Promise<number> {
    const logoMaxWidth = 22
    const logoMaxHeight = 22

    // Layout: Logo on left, business details next to it, invoice info on right
    const logoRightX = margins.left + logoMaxWidth
    const businessStartX = logoRightX + 8

    // Load and add business logo
    if (business.logo) {
      try {
        // Parse bucket and path from business.logo if it's a Supabase path
        // Format could be: "bucket/path" or just "path"
        let logoUrl = business.logo
        if (!business.logo.startsWith('http')) {
          // Assume it's a Supabase path - try to extract bucket and path
          const parts = business.logo.split('/')
          const bucket = 'product-images/uploads'
          const path = parts.length > 1 ? parts.slice(1).join('/') : business.logo
          logoUrl = getPublicImage(bucket, path)
        }

        const logoResponse = await fetch(logoUrl)
        const logoBlob = await logoResponse.blob()
        const logoDataUrl = await blobToDataUrl(logoBlob)

        // Add logo to top-left
        doc.addImage(logoDataUrl, 'PNG', margins.left, startY, logoMaxWidth, logoMaxHeight)
      } catch (err) {
        // Fallback: if logo fails to load, just add business name as text
        doc.setFontSize(14)
        doc.setTextColor(0, 0, 0)
        doc.text(business.name, margins.left, startY + 10)
      }
    } else {
      // No logo, just add business name
      doc.setFontSize(14)
      doc.setTextColor(0, 0, 0)
      doc.text(business.name, margins.left, startY + 10)
    }

    // Add business name next to logo
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text(business.name, businessStartX, startY + 8)

    // Add business details (below business name)
    let businessY = startY + 16
    doc.setFontSize(8)
    doc.setTextColor(80, 80, 80)

    if (business.address) {
      const addressLines = doc.splitTextToSize(business.address, 100)
      doc.text(addressLines, businessStartX, businessY)
      businessY += (addressLines.length * 5) + 2
    }

    // Add social links if available
    const socialLinks = getSocialLinks(business.social)
    for (const link of socialLinks) {
      doc.text(link, businessStartX, businessY)
      businessY += 5
    }

    if (business.email) {
      doc.text(`Email: ${business.email}`, businessStartX, businessY)
      businessY += 5
    }

    // Add location link (based on business slug)
    // const locationUrl = `${window.location.origin}/business/${business.slug}`
    // const locationLines = doc.splitTextToSize(`Location: ${locationUrl}`, 100)
    // doc.text(locationLines, businessStartX, businessY)

    // Add "INVOICE" label (right-aligned, same level as business name)
    // doc.setFontSize(20)
    // doc.setTextColor(175, 143, 111)
    // doc.text('INVOICE', A4_WIDTH - margins.right, startY + 8, { align: 'right' })

    // Add order ID and date (right-aligned, below invoice)
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    const orderDate = new Date(order.created_at).toLocaleDateString()
    doc.text(`Order ID: ${order.id}`, A4_WIDTH - margins.right, startY + 8, { align: 'right' })
    doc.text(`Date: ${orderDate}`, A4_WIDTH - margins.right, startY + 14, { align: 'right' })

    // Add horizontal line below header
    const lineY = Math.max(startY + logoMaxHeight, businessY) + 10
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.5)
    doc.line(margins.left, lineY, A4_WIDTH - margins.right, lineY)

    return lineY + 10
  }

  /**
   * Add customer details section
   */
  function addCustomerDetails(doc: any, order: InstantOrder | InstantOrderListItem, startY: number, margins: any): number {
    // Section title
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text('Customer Info', margins.left, startY)

    // Customer details
    doc.setFontSize(10)
    doc.setTextColor(80, 80, 80)

    let currentY = startY + 7

    // Customer name
    const customerName = order.customer_info?.name || 'N/A'
    doc.text(`Name: ${customerName}`, margins.left, currentY)
    currentY += 6

    // Phone number
    doc.text(`Phone: ${order.customer_info?.phone || '-'}`, margins.left, currentY)
    currentY += 6

    // Shipping address (with proper text wrapping)
    const address = order.customer_info?.address || 'N/A'
    const addressLines = doc.splitTextToSize(`Address: ${address}`, 100)
    doc.text(addressLines, margins.left, currentY)
    currentY += (addressLines.length * 5) + 2

    return currentY + 10
  }

  /**
   * Add order items table using autoTable plugin
   */
  function addItemsTable(doc: any, order: InstantOrder | InstantOrderListItem, startY: number, margins: any, business: Business): number {
    // Prepare table data
    const tableData = order.order_items.map(item => {
      const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price
      const quantity = typeof item.quantity === 'string' ? parseInt(item.quantity, 10) : item.quantity
      const total = price * quantity

      return [
        item.title || 'N/A',
        `${quantity} ${item.unit || 'pcs'}`,
        formatCurrency(price),
        formatCurrency(total)
      ]
    })

    // Add table using autoTable
    autoTable(doc, {
      startY: startY,
      head: [['Product Name', 'Quantity', 'Unit Price', 'Total']],
      body: tableData,
      theme: 'grid',
      styles: {
        font: 'HindSiliguri',
        fontSize: 10,
        cellPadding: 4,
        textColor: [0, 0, 0],
        lineColor: [200, 200, 200],
        lineWidth: 0.2
      },
      headStyles: {
        fillColor: hexToRgb(business.primary_color),
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 11,
        cellPadding: 5
      },
      columnStyles: {
        0: { cellWidth: 75, halign: 'left' },
        1: { cellWidth: 35, halign: 'center' },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 35, halign: 'right', fontStyle: 'bold' }
      },
      margin: {
        left: margins.left,
        right: margins.right
      }
    })

    return doc.lastAutoTable.finalY + 20
  }

  /**
   * Add summary section with subtotal, delivery charge, and total
   */
  function addSummary(doc: any, order: InstantOrder | InstantOrderListItem, startY: number, margins: any, business: Business): number {
    // Calculate subtotal
    const subtotal = order.order_items.reduce((sum, item) => {
      const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price
      const quantity = typeof item.quantity === 'string' ? parseInt(item.quantity, 10) : item.quantity
      return sum + (price * quantity)
    }, 0)

    const deliveryCharge = typeof order.delivery_charge === 'string' ? parseFloat(order.delivery_charge) : order.delivery_charge
    const total = order.total || subtotal + deliveryCharge

    // Summary data (right-aligned)
    const summaryLabelX = A4_WIDTH - margins.right - 40
    const summaryValueX = A4_WIDTH - margins.right
    let currentY = startY

    // Subtotal
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    doc.text('Subtotal:', summaryLabelX, currentY, { align: 'right' })
    doc.text(formatCurrency(subtotal), summaryValueX, currentY, { align: 'right' })
    currentY += 7

    // Delivery Charge
    doc.text('Delivery Charge:', summaryLabelX, currentY, { align: 'right' })
    doc.text(formatCurrency(deliveryCharge), summaryValueX, currentY, { align: 'right' })
    currentY += 7

    // Horizontal line before total
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.5)
    doc.line(summaryLabelX - 5, currentY, summaryValueX, currentY)
    currentY += 7

    // Total (bold, larger)
    doc.setFontSize(14)
    doc.setFont('HindSiliguri', 'bold')
    doc.setTextColor(...hexToRgb(business.primary_color))
    doc.text('Total:', summaryLabelX, currentY, { align: 'right' })
    doc.text(formatCurrency(total), summaryValueX, currentY, { align: 'right' })

    // Reset font
    doc.setFont('HindSiliguri', 'normal')

    return currentY + 15
  }

  /**
   * Add footer with consignment info
   */
  function addFooter(doc: any, order: InstantOrder | InstantOrderListItem, business: Business, margins: any): void {
    const pageCount = doc.getNumberOfPages()

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      const footerY = A4_HEIGHT - margins.bottom

      doc.setFontSize(8)
      doc.setTextColor(80, 80, 80)

      // Extract consignment_id from cod_reference if available
      let consignmentId = ''
      if (order.cod_reference) {
        try {
          const consignment = typeof order.cod_reference === 'string'
            ? JSON.parse(order.cod_reference)
            : order.cod_reference
          consignmentId = consignment?.consignment_id || ''
        } catch {
          // Not JSON, no consignment_id available
        }
      }

      // Show consignment_id or contact info
      doc.setFontSize(16)
      const footerText = consignmentId
        ? `#${consignmentId}`
        : ''

      doc.text(
        footerText,
        A4_WIDTH / 2,
        footerY - 5,
        { align: 'center' }
      )
    }
  }

  /**
   * Convert hex color to RGB array for jsPDF
   * @param hex - Hex color string (e.g., "#af8f6f" or "af8f6f")
   * @returns RGB array [r, g, b]
   */
  function hexToRgb(hex: string | undefined): [number, number, number] {
    if (!hex) return [0, 0, 0] // Fallback to black

    // Remove # if present
    const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex

    // Parse hex values
    const r = parseInt(cleanHex.substring(0, 2), 16)
    const g = parseInt(cleanHex.substring(2, 4), 16)
    const b = parseInt(cleanHex.substring(4, 6), 16)

    // Return RGB array or fallback to black if invalid
    if (isNaN(r) || isNaN(g) || isNaN(b)) return [0, 0, 0]
    return [r, g, b]
  }

  /**
   * Get formatted social links from business social object
   */
  function getSocialLinks(social: Business['social']): string[] {
    if (!social) return []

    const links: string[] = []
    const icons: Record<string, string> = {
      facebook: 'Facebook',
      instagram: 'Instagram',
      youtube: 'YouTube',
      twitter: 'Twitter',
      linkedin: 'LinkedIn',
      whatsapp: 'WhatsApp'
    }

    for (const [platform, url] of Object.entries(social)) {
      if (url) {
        const label = icons[platform] || platform.charAt(0).toUpperCase() + platform.slice(1)
        links.push(`${label}: ${url}`)
      }
    }

    return links
  }

  /**
   * Convert Blob to Data URL
   */
  async function blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  /**
   * Load and register Bengali Unicode fonts
   */
  async function loadAndAddFonts(doc: any): Promise<void> {
    try {
      const regRes = await fetch('/fonts/HindSiliguri-Regular.ttf')
      const regBlob = await regRes.blob()
      const regDataUrl = await blobToDataUrl(regBlob)
      const regBase64 = regDataUrl.split(',')[1]
      doc.addFileToVFS('HindSiliguri-Regular.ttf', regBase64)
      doc.addFont('HindSiliguri-Regular.ttf', 'HindSiliguri', 'normal')

      const boldRes = await fetch('/fonts/HindSiliguri-Bold.ttf')
      const boldBlob = await boldRes.blob()
      const boldDataUrl = await blobToDataUrl(boldBlob)
      const boldBase64 = boldDataUrl.split(',')[1]
      doc.addFileToVFS('HindSiliguri-Bold.ttf', boldBase64)
      doc.addFont('HindSiliguri-Bold.ttf', 'HindSiliguri', 'bold')
    } catch (err) {
      console.warn('Failed to load Bengali fonts:', err)
    }
  }

  return {
    generateInstantOrderPdf,
    isGenerating,
    error
  }
}
