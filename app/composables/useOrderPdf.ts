// PDF generation composable for order invoices
// Uses jsPDF for native PDF generation (NOT HTML-to-PDF conversion)

import { type OrderDetail } from '~/types/order'
import { PDF_CONFIG, formatCurrency, LOGO_CONFIG, A4_WIDTH, A4_HEIGHT } from '~/config/pdfConfig'
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

interface UseOrderPdfReturn {
  generateOrderPdf: (order: OrderDetail) => Promise<void>
  isGenerating: Ref<boolean>
  error: Ref<string | null>
}

export function useOrderPdf(): UseOrderPdfReturn {
  const isGenerating = ref(false)
  const error = ref<string | null>(null)

  /**
   * Generate and download PDF invoice for an order
   * This creates a native PDF document from scratch, not an HTML conversion
   */
  async function generateOrderPdf(order: OrderDetail): Promise<void> {
    isGenerating.value = true
    error.value = null

    try {
      // Create new PDF document (A4, portrait, millimeters)
      const doc = new jsPDF({
        orientation: PDF_CONFIG.document.orientation,
        unit: PDF_CONFIG.document.unit,
        format: PDF_CONFIG.document.format
      })

      // Load and set Bengali fonts for Unicode support
      await loadAndAddFonts(doc)
      doc.setFont('HindSiliguri', 'normal')

      // Track current Y position for layout
      let currentY = PDF_CONFIG.document.margins.top

      // Add header section with logo
      currentY = await addHeader(doc, order, currentY)

      // Add customer details section
      currentY = addCustomerDetails(doc, order, currentY)

      // Add order items table
      currentY = addItemsTable(doc, order, currentY)

      // Add summary section
      currentY = addSummary(doc, order, currentY)

      // Add footer
      addFooter(doc)

      // Generate filename: order-{id}-{date}.pdf
      const orderDate = new Date(order.created_at).toISOString().split('T')[0]
      const filename = `order-${order.id}-${orderDate}.pdf`

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
   * Add header section with logo, company details, and invoice info
   */
  async function addHeader(doc: any, order: OrderDetail, startY: number): Promise<number> {
    const { company, fonts, document } = PDF_CONFIG

    // Layout: Logo on left, company details next to it, invoice info on right
    const logoRightX = document.margins.left + LOGO_CONFIG.maxWidth
    const companyStartX = logoRightX + 8

    // Load and add logo
    try {
      const logoResponse = await fetch(LOGO_CONFIG.path)
      const logoBlob = await logoResponse.blob()
      const logoDataUrl = await blobToDataUrl(logoBlob)

      // Add logo to top-left
      doc.addImage(logoDataUrl, 'PNG', document.margins.left, startY, LOGO_CONFIG.maxWidth, LOGO_CONFIG.maxHeight)
    } catch (err) {
      // Fallback: if logo fails to load, just add company name as text
      doc.setFontSize(fonts.header)
      doc.setTextColor(...PDF_CONFIG.colors.text)
      doc.text(company.name, document.margins.left, startY + 10)
    }

    // Add company name next to logo
    doc.setFontSize(fonts.header)
    doc.setTextColor(...PDF_CONFIG.colors.text)
    doc.text(company.name, companyStartX, startY + 8)

    // Add company details (below company name, next to logo)
    let companyY = startY + 16
    doc.setFontSize(fonts.small)
    doc.setTextColor(...PDF_CONFIG.colors.secondary)
    doc.text(company.address, companyStartX, companyY)
    companyY += 5
    doc.text(`Phone: ${company.phone}`, companyStartX, companyY)
    companyY += 5
    doc.text(`Email: ${company.email}`, companyStartX, companyY)

    // Add "INVOICE" label (right-aligned, same level as company name)
    doc.setFontSize(fonts.title)
    doc.setTextColor(...PDF_CONFIG.colors.primary)
    doc.text('INVOICE', A4_WIDTH - document.margins.right, startY + 8, { align: 'right' })

    // Add order ID and date (right-aligned, below invoice)
    doc.setFontSize(fonts.body)
    doc.setTextColor(...PDF_CONFIG.colors.text)
    const orderDate = new Date(order.created_at).toLocaleDateString()
    doc.text(`Order ID: ${order.id}`, A4_WIDTH - document.margins.right, startY + 20, { align: 'right' })
    doc.text(`Date: ${orderDate}`, A4_WIDTH - document.margins.right, startY + 26, { align: 'right' })

    // Add horizontal line below header
    const lineY = Math.max(startY + LOGO_CONFIG.maxHeight, companyY) + 10
    doc.setDrawColor(...PDF_CONFIG.colors.border)
    doc.setLineWidth(0.5)
    doc.line(document.margins.left, lineY, A4_WIDTH - document.margins.right, lineY)

    return lineY + 10 // Return Y position for next section
  }

  /**
   * Add customer details section
   */
  function addCustomerDetails(doc: any, order: OrderDetail, startY: number): number {
    const { fonts, document } = PDF_CONFIG

    // Section title
    doc.setFontSize(fonts.header)
    doc.setTextColor(...PDF_CONFIG.colors.text)
    doc.text('Bill To', document.margins.left, startY)

    // Customer details
    doc.setFontSize(fonts.body)
    doc.setTextColor(...PDF_CONFIG.colors.secondary)

    let currentY = startY + 7

    // Customer name
    const customerName = order.shipping_address.full_name || 'N/A'
    doc.text(`Name: ${customerName}`, document.margins.left, currentY)
    currentY += 6

    // Phone number
    doc.text(`Phone: ${order.shipping_address.mobile}`, document.margins.left, currentY)
    currentY += 6

    // Shipping address (with proper text wrapping)
    const address = order.shipping_address.address
    const addressLines = doc.splitTextToSize(`Address: ${address}`, 100)
    doc.text(addressLines, document.margins.left, currentY)
    currentY += (addressLines.length * 5) + 2

    // Add location details if available
    if (order.shipping_address.division_name) {
      const locationParts = [
        order.shipping_address.upazila_name,
        order.shipping_address.district_name,
        order.shipping_address.division_name
      ].filter(Boolean)

      if (locationParts.length > 0) {
        const locationText = locationParts.join(', ')
        const locationLines = doc.splitTextToSize(locationText, 100)
        doc.text(locationLines, document.margins.left, currentY)
        currentY += (locationLines.length * 5) + 2
      }
    }

    // No border line after customer details
    return currentY + 10 // Return Y position for next section
  }

  /**
   * Add order items table using autoTable plugin
   */
  function addItemsTable(doc: any, order: OrderDetail, startY: number): number {
    const { fonts, document } = PDF_CONFIG

    // Prepare table data
    const tableData = order.order_items.map(item => {
      const unitPrice = typeof item.price_at_purchase === 'string'
        ? parseFloat(item.price_at_purchase)
        : item.price_at_purchase
      const quantity = typeof item.quantity === 'string'
        ? parseInt(item.quantity, 10)
        : item.quantity
      const total = unitPrice * quantity

      return [
        item.snapshot_name || item.product?.name || 'N/A',
        quantity.toString(),
        formatCurrency(unitPrice),
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
        fontSize: fonts.body,
        cellPadding: 4,
        textColor: PDF_CONFIG.colors.text,
        lineColor: PDF_CONFIG.colors.border,
        lineWidth: 0.2
      },
      headStyles: {
        fillColor: PDF_CONFIG.colors.primary,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 11,
        cellPadding: 5
      },
      columnStyles: {
        0: { cellWidth: 75, halign: 'left' }, // Product name
        1: { cellWidth: 28, halign: 'center' }, // Quantity
        2: { cellWidth: 40, halign: 'right' }, // Unit Price
        3: { cellWidth: 40, halign: 'right', fontStyle: 'bold' }  // Total
      },
      margin: {
        left: document.margins.left,
        right: document.margins.right
      }
    })

    // Return Y position after the table with larger gap before summary
    return doc.lastAutoTable.finalY + 20
  }

  /**
   * Add summary section with subtotal, delivery charge, and total
   */
  function addSummary(doc: any, order: OrderDetail, startY: number): number {
    const { fonts, document, deliveryCharge } = PDF_CONFIG

    // Calculate subtotal
    const subtotal = order.order_items.reduce((sum, item) => {
      const price = typeof item.price_at_purchase === 'string'
        ? parseFloat(item.price_at_purchase)
        : item.price_at_purchase
      const quantity = typeof item.quantity === 'string'
        ? parseInt(item.quantity, 10)
        : item.quantity
      return sum + (price * quantity)
    }, 0)

    const total = subtotal + deliveryCharge

    // Summary data (right-aligned)
    const summaryLabelX = A4_WIDTH - document.margins.right - 40
    const summaryValueX = A4_WIDTH - document.margins.right
    let currentY = startY

    // Subtotal
    doc.setFontSize(fonts.body)
    doc.setTextColor(...PDF_CONFIG.colors.text)
    doc.text('Subtotal:', summaryLabelX, currentY, { align: 'right' })
    doc.text(formatCurrency(subtotal), summaryValueX, currentY, { align: 'right' })
    currentY += 7

    // Delivery Charge
    doc.text('Delivery Charge:', summaryLabelX, currentY, { align: 'right' })
    doc.text(formatCurrency(deliveryCharge), summaryValueX, currentY, { align: 'right' })
    currentY += 7

    // Horizontal line before total
    doc.setDrawColor(...PDF_CONFIG.colors.border)
    doc.setLineWidth(0.5)
    doc.line(summaryLabelX - 5, currentY, summaryValueX, currentY)
    currentY += 7

    // Total (bold, larger)
    doc.setFontSize(fonts.header)
    doc.setFont('HindSiliguri', 'bold')
    doc.setTextColor(...PDF_CONFIG.colors.primary)
    doc.text('Total:', summaryLabelX, currentY, { align: 'right' })
    doc.text(formatCurrency(total), summaryValueX, currentY, { align: 'right' })

    // Reset font
    doc.setFont('HindSiliguri', 'normal')

    return currentY + 15
  }

  /**
   * Add footer with thank you message and page numbers
   */
  function addFooter(doc: any): void {
    const { fonts, document, company } = PDF_CONFIG
    const pageCount = doc.getNumberOfPages()

    // Add footer to each page
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      const footerY = A4_HEIGHT - document.margins.bottom

      // Thank you message
      doc.setFontSize(fonts.small)
      doc.setTextColor(...PDF_CONFIG.colors.secondary)
      doc.text(
        'Thank you for your order!',
        A4_WIDTH / 2,
        footerY - 10,
        { align: 'center' }
      )

      // Company contact info
      doc.text(
        `${company.phone} | ${company.email}`,
        A4_WIDTH / 2,
        footerY - 5,
        { align: 'center' }
      )

      // Page number (if multi-page)
      if (pageCount > 1) {
        doc.text(
          `Page ${i} of ${pageCount}`,
          A4_WIDTH / 2,
          footerY,
          { align: 'center' }
        )
      }
    }
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
      // Load Regular Font
      const regRes = await fetch('/fonts/HindSiliguri-Regular.ttf')
      const regBlob = await regRes.blob()
      const regDataUrl = await blobToDataUrl(regBlob)
      const regBase64 = regDataUrl.split(',')[1]
      doc.addFileToVFS('HindSiliguri-Regular.ttf', regBase64)
      doc.addFont('HindSiliguri-Regular.ttf', 'HindSiliguri', 'normal')

      // Load Bold Font
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
    generateOrderPdf,
    isGenerating,
    error
  }
}
