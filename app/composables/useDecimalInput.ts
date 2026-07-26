/**
 * Raw-text buffer for money/decimal inputs.
 *
 * Binding an input straight to its parsed number fights the user mid-edit: a
 * stored `0` renders as "0", so typing `12` leaves you with "012", and a value
 * formatted with `toFixed(2)` snaps back to "0.00" the instant you delete a
 * character — making the leading zero impossible to remove.
 *
 * This keeps the literal text the user typed for as long as the field is being
 * edited, hands the caller only the parsed number, and drops back to the
 * formatted value on blur. Zero renders as empty so the placeholder shows
 * through instead of a digit you have to delete first.
 *
 * Fields are addressed by key, so one instance covers both a standalone input
 * and a list of them (pass the row index as the key).
 */
export function useDecimalInput() {
  const drafts = ref<Record<string, string>>({})

  /** Text to bind to the input: the in-progress draft, else the formatted value. */
  function display(key: string, value: number, format?: (n: number) => string): string {
    const draft = drafts.value[key]
    if (draft !== undefined) return draft
    if (!value) return ''
    return format ? format(value) : String(value)
  }

  /** Handle an `input` event; returns the parsed number to store. */
  function edit(key: string, event: Event): number {
    const target = event.target as HTMLInputElement
    const text = sanitize(target.value)
    // Rewrite the DOM value ourselves. When sanitising is a no-op on the bound
    // draft (typing "a" into "12"), Vue sees no change and would otherwise
    // leave the rejected character on screen.
    if (target.value !== text) target.value = text

    drafts.value = { ...drafts.value, [key]: text }
    return parseFloat(text) || 0
  }

  /** Handle a `blur` event: drop the draft so the formatted value returns. */
  function commit(key: string) {
    const { [key]: _discarded, ...rest } = drafts.value
    drafts.value = rest
  }

  /** Drop every draft — call when list rows are added/removed and keys shift. */
  function clear() {
    drafts.value = {}
  }

  return { display, edit, commit, clear }
}

/** Digits with at most one decimal point and no redundant leading zeros. */
function sanitize(raw: string): string {
  const [whole = '', ...decimals] = raw.replace(/[^\d.]/g, '').split('.')
  const trimmed = whole.replace(/^0+(?=\d)/, '')
  return decimals.length ? `${trimmed}.${decimals.join('')}` : trimmed
}
