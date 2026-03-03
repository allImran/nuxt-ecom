// PDF configuration for order invoice generation
// Contains company details and PDF document constants

export interface CompanyDetails {
  name: string
  address: string
  phone: string
  email: string
  website?: string
}

export interface PdfConfig {
  company: CompanyDetails
  document: {
    format: 'a4'
    orientation: 'portrait' | 'landscape'
    unit: 'mm' | 'pt' | 'in' | 'px'
    margins: {
      top: number
      right: number
      bottom: number
      left: number
    }
  }
  fonts: {
    title: number
    header: number
    body: number
    small: number
  }
  colors: {
    primary: [number, number, number]
    secondary: [number, number, number]
    text: [number, number, number]
    border: [number, number, number]
  }
  deliveryCharge: number
}

// Company details for the invoice
export const COMPANY_DETAILS: CompanyDetails = {
  name: 'IndoorShopping',
  address: 'Dhaka, Bangladesh',
  phone: '+880 1XXX-XXXXXX',
  email: 'support@indoorshopping.com',
  website: 'www.indoorshopping.web.app'
}

// PDF configuration
export const PDF_CONFIG: PdfConfig = {
  company: COMPANY_DETAILS,
  document: {
    format: 'a4',
    orientation: 'portrait',
    unit: 'mm',
    margins: {
      top: 15,
      right: 15,
      bottom: 15,
      left: 15
    }
  },
  fonts: {
    title: 20,
    header: 14,
    body: 10,
    small: 8
  },
  colors: {
    primary: [175, 143, 111], // Brand Color (#af8f6f)
    secondary: [60, 60, 60], // Dark Gray
    text: [0, 0, 0], // Black
    border: [200, 200, 200] // Light Gray
  },
  deliveryCharge: 100 // Fixed delivery charge in BDT
}

// A4 page dimensions in mm
export const A4_WIDTH = 210
export const A4_HEIGHT = 297

// Helper function to format currency as BDT
export function formatCurrency(amount: number): string {
  // Format: Tk. 1,234.56
  const formatted = new Intl.NumberFormat('en-BD', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
  return `Tk. ${formatted}`
}

// Logo configuration
export const LOGO_CONFIG = {
  path: '/urban-ease-logo.png',
  maxWidth: 22, // mm (approx 80px)
  maxHeight: 22 // mm (approx 80px)
}
