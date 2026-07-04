// Invoice printing utility
//
// Bengali (and other complex scripts) require OpenType complex-text shaping
// (glyph reordering + conjunct/ligature substitution via GSUB/GPOS). jsPDF /
// pdf-lib / pdfmake have NO shaping engine, so they render Bengali glyphs in raw
// storage order and mangle the text (pre-base vowels land after the consonant,
// conjuncts never form). The only way to get BOTH correct shaping AND selectable
// (copyable) text is to let the browser's own layout engine render an HTML
// invoice and produce the PDF via its print pipeline ("Save as PDF").
//
// This module builds a self-contained HTML document and prints it through a
// hidden iframe.

/** Escape a value for safe interpolation into HTML text/attributes. */
export function escapeHtml(value: unknown): string {
  const s = value == null ? '' : String(value)
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Fetch an image URL and return a data URL, or null on failure. */
export async function fetchImageAsDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const blob = await res.blob()
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

/**
 * Wrap an invoice body in a full, self-contained HTML document with the print
 * stylesheet and embedded Bengali font (Hind Siliguri). `primaryColor` themes the
 * table header and total (hex string, e.g. "#af8f6f").
 */
export function renderInvoiceDocument(opts: {
  title: string
  primaryColor: string
  body: string
}): string {
  const { title, primaryColor, body } = opts
  // Resolve font URLs against the app origin — the iframe's document is
  // about:blank, so root-relative paths would not resolve correctly.
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const primary = /^#?[0-9a-fA-F]{6}$/.test(primaryColor)
    ? (primaryColor.startsWith('#') ? primaryColor : `#${primaryColor}`)
    : '#af8f6f'

  return `<!doctype html>
<html lang="bn">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(title)}</title>
<style>
  @font-face {
    font-family: 'Hind Siliguri';
    src: url('${origin}/fonts/HindSiliguri-Regular.ttf') format('truetype');
    font-weight: 400; font-style: normal; font-display: block;
  }
  @font-face {
    font-family: 'Hind Siliguri';
    src: url('${origin}/fonts/HindSiliguri-Bold.ttf') format('truetype');
    font-weight: 700; font-style: normal; font-display: block;
  }
  @page { size: A4; margin: 15mm; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: 'Hind Siliguri', system-ui, -apple-system, sans-serif;
    color: #000;
    font-size: 11px;
    line-height: 1.55;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .inv { width: 100%; }
  .inv-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
  .inv-brand { display: flex; gap: 12px; align-items: flex-start; }
  .inv-logo { width: 68px; height: 68px; object-fit: contain; border-radius: 50%; flex: 0 0 auto; }
  .inv-brand-name { font-size: 22px; font-weight: 700; margin: 0 0 4px; }
  .inv-brand-meta { font-size: 11px; color: #3c3c3c; margin: 1px 0; word-break: break-word; }
  .inv-meta-right { text-align: right; }
  .inv-meta-right .line { font-size: 12px; color: #111; margin: 1px 0; }
  .inv-invoice-label { font-size: 20px; font-weight: 700; color: ${primary}; margin: 0 0 6px; }
  .inv-cn { font-size: 20px; font-weight: 700; color: ${primary}; margin: 0 0 4px; white-space: nowrap; }
  .inv-divider { border: none; border-top: 1px solid #ddd; margin: 16px 0; }
  .inv-section-title { font-size: 16px; font-weight: 700; margin: 0 0 6px; }
  .inv-cust { max-width: 50%; }
  .inv-cust p { margin: 2px 0; font-size: 12px; color: #3c3c3c; word-break: break-word; }
  table.inv-items { width: 100%; border-collapse: collapse; margin-top: 8px; }
  table.inv-items th, table.inv-items td { border: 1px solid #c8c8c8; padding: 8px 10px; font-size: 12px; vertical-align: top; }
  table.inv-items thead th { background: ${primary}; color: #fff; text-align: left; font-weight: 700; }
  table.inv-items thead { display: table-header-group; }
  table.inv-items tr { break-inside: avoid; }
  .col-qty { text-align: center; white-space: nowrap; }
  .col-price { text-align: right; white-space: nowrap; }
  .col-total { text-align: right; white-space: nowrap; font-weight: 700; }
  .inv-summary { margin-top: 6px; margin-left: auto; width: 52%; }
  .inv-summary-row { display: flex; justify-content: space-between; padding: 3px 0; font-size: 12px; }
  .inv-summary-total { display: flex; justify-content: space-between; align-items: baseline;
    font-size: 16px; font-weight: 700; color: ${primary};
    border-top: 1px solid #ccc; padding-top: 8px; margin-top: 4px; }
  .inv-footer { margin-top: 42px; text-align: center; color: #666; font-size: 10px; }
  .inv-footer p { margin: 2px 0; }
</style>
</head>
<body>
<div class="inv">
${body}
</div>
</body>
</html>`
}

/**
 * Render `html` in a hidden iframe and open the browser's print dialog so the
 * user can save it as a PDF. Resolves once the print dialog has been dispatched;
 * cleans up the iframe afterwards.
 */
export async function printInvoiceHtml(html: string): Promise<void> {
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  const iframe = document.createElement('iframe')
  iframe.setAttribute('aria-hidden', 'true')
  iframe.style.position = 'fixed'
  iframe.style.right = '0'
  iframe.style.bottom = '0'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.border = '0'
  iframe.style.visibility = 'hidden'

  let cleanedUp = false
  const cleanup = () => {
    if (cleanedUp) return
    cleanedUp = true
    if (iframe.parentNode) iframe.parentNode.removeChild(iframe)
  }

  // Load the document via srcdoc and wait for the frame (and its embedded
  // images) to finish loading.
  iframe.srcdoc = html
  await new Promise<void>((resolve) => {
    iframe.addEventListener('load', () => resolve(), { once: true })
    document.body.appendChild(iframe)
  })

  const win = iframe.contentWindow
  const doc = iframe.contentWindow?.document
  if (!win || !doc) {
    cleanup()
    throw new Error('Unable to access print frame')
  }

  // Wait for the Bengali web font to be ready so the printed layout is shaped
  // with the correct font rather than a fallback.
  try {
    if (doc.fonts?.ready) await doc.fonts.ready
  } catch {
    // Ignore font-loading failures; the browser still shapes Bengali correctly
    // with a fallback font.
  }

  // Remove the iframe once printing is done. window.print() is blocking in
  // Chrome/Firefox/Safari, but afterprint is the reliable cleanup signal; a long
  // fallback guards against browsers that never fire it.
  win.onafterprint = cleanup
  const fallback = setTimeout(cleanup, 60000)

  try {
    win.focus()
    win.print()
  } finally {
    // print() has returned (dialog dismissed in blocking browsers). Ensure the
    // fallback timer can't leak if afterprint already ran.
    if (cleanedUp) clearTimeout(fallback)
  }
}
