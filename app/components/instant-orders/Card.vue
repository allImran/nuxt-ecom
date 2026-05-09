<script setup lang="ts">
import type { InstantOrderListItem } from '~/types/instantOrder'
import type { Business } from '~/network/admin'

interface Props {
  order: InstantOrderListItem
  formatPrice: (price: number) => string
  formatDate: (date: string) => string
  getStatusLabel: (status: string) => string
  business?: Business | null
}

const props = withDefaults(defineProps<Props>(), {
  business: null
})

const emit = defineEmits<{
  click: [order: InstantOrderListItem]
}>()

// PDF generation composable
const { generateInstantOrderPdf, isGenerating } = useInstantOrderPdf()

// Courier status modal state
const courierStatusModalOpen = ref(false)
const courierStatusLoading = ref(false)
const courierStatusData = ref<any>(null)
const currentTrackingCode = ref('')
const currentTrackingLink = ref('')

// Format date for mobile card (e.g., "MARCH 26, 2026")
function formatCardDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).toUpperCase()
}

// Get status badge class for mobile
function getMobileStatusBadge(status: string): string {
  const statusLower = status.toLowerCase()
  switch (statusLower) {
    case 'pending':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
    case 'delivered':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
    case 'confirmed':
      return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
    case 'paid':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
    case 'shipped':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
    case 'cancelled':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  }
}

function handleClick() {
  emit('click', props.order)
}

// Extract tracking info from cod_reference
function extractTrackingInfo(codReference: any) {
  if (!codReference) return { trackingCode: '', trackingLink: '' }

  // Try to parse as JSON (consignment object)
  try {
    const consignment = typeof codReference === 'string'
      ? JSON.parse(codReference)
      : codReference
    if (consignment?.tracking_code) {
      return {
        trackingCode: consignment.tracking_code,
        trackingLink: consignment.tracking_link || ''
      }
    }
  } catch {
    // Not JSON, treat as raw tracking code (no link available)
  }

  return {
    trackingCode: String(codReference),
    trackingLink: ''
  }
}

// Copy tracking link to clipboard
async function handleCopyTrackingLink(codReference: any, event: Event) {
  event.stopPropagation()
  const { trackingLink } = extractTrackingInfo(codReference)

  if (!trackingLink) {
    const toast = useToast()
    toast.error({ title: 'No tracking link available' })
    return
  }

  try {
    await navigator.clipboard.writeText(trackingLink)
    const toast = useToast()
    toast.success({ title: 'Tracking link copied!' })
  } catch (err) {
    const toast = useToast()
    toast.error({ title: 'Failed to copy link' })
  }
}

// Open courier status modal
async function handleCheckCourierStatus(codReference: any, event: Event) {
  event.stopPropagation()
  const { trackingCode, trackingLink } = extractTrackingInfo(codReference)

  if (!trackingCode) {
    const toast = useToast()
    toast.error({ title: 'No tracking code available' })
    return
  }

  currentTrackingCode.value = trackingCode
  currentTrackingLink.value = trackingLink
  courierStatusLoading.value = true
  courierStatusModalOpen.value = true

  try {
    const { adminNetwork } = await import('~/network/admin')
    const response = await adminNetwork.fetchCourierStatusByTracking(trackingCode)
    courierStatusData.value = response
  } catch (err) {
    console.error('Failed to fetch courier status:', err)
    courierStatusData.value = {
      success: false,
      delivery_status: 'unknown'
    }
    const toast = useToast()
    toast.error({ title: 'Failed to fetch courier status' })
  } finally {
    courierStatusLoading.value = false
  }
}

// Handle print/download PDF
async function handlePrintPdf(event: Event) {
  event.stopPropagation()
  if (!props.business) {
    const toast = useToast()
    toast.error({ title: 'Business information not available' })
    return
  }
  try {
    await generateInstantOrderPdf(props.order, props.business)
  } catch (err) {
    const toast = useToast()
    toast.error({ title: 'Failed to generate PDF' })
  }
}

// Handle modal close
function handleCloseCourierModal() {
  courierStatusModalOpen.value = false
}
</script>

<template>
  <div
    class="bg-luxury-surface dark:bg-luxury-dark-surface rounded-xl p-5 shadow-sm border border-luxury-border dark:border-luxury-dark-border active:scale-[0.98] transition-transform cursor-pointer"
    @click="handleClick"
  >
    <div class="flex justify-between items-start mb-4">
      <div class="flex flex-col">
        <span class="text-xs font-semibold tracking-wider text-luxury-text-muted dark:text-luxury-dark-text-muted mb-1 uppercase">
          {{ formatCardDate(order.created_at) }}
        </span>
        <h3 class="text-lg font-semibold text-luxury-text dark:text-luxury-dark-text">
          {{ order.customer_info?.name || 'Unknown' }}
        </h3>
        <p class="text-xs text-luxury-text-muted dark:text-luxury-dark-text-muted mt-0.5">
          {{ order.customer_info?.address || 'No address' }}
        </p>
      </div>
      <span :class="['px-3 py-1 text-xs font-semibold rounded-full', getMobileStatusBadge(order.status)]">
        {{ getStatusLabel(order.status) }}
      </span>
    </div>

    <div class="h-px w-full bg-luxury-border dark:border-luxury-dark-border mb-4"></div>

    <div class="flex justify-between items-center">
      <div class="flex items-center gap-2">
        <UiIcon name="package-2" :size="18" class="text-luxury-text-muted dark:text-luxury-dark-text-muted" />
        <span class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
          {{ order.order_items?.length || 0 }} Items
        </span>
      </div>
      <div class="text-right">
        <span class="block text-xs text-luxury-text-muted dark:text-luxury-dark-text-muted">Total Amount</span>
        <span class="text-lg font-semibold text-luxury-accent dark:text-luxury-dark-accent">
          {{ formatPrice(order.total) }}
        </span>
      </div>
    </div>

    <!-- Action buttons -->
    <div v-if="order.cod_reference" class="flex items-center justify-end gap-1 mt-4 pt-4 border-t border-luxury-border dark:border-luxury-dark-border">
      <button
        type="button"
        class="p-2 hover:bg-luxury-gold/10 rounded-lg transition-colors"
        title="Copy tracking link"
        @click="handleCopyTrackingLink(order.cod_reference, $event)"
      >
        <UiIcon name="copy" :size="16" class="text-luxury-gold" />
      </button>
      <button
        type="button"
        class="p-2 hover:bg-luxury-gold/10 rounded-lg transition-colors"
        title="Check courier status"
        @click="handleCheckCourierStatus(order.cod_reference, $event)"
      >
        <UiIcon name="truck" :size="16" class="text-luxury-gold" />
      </button>
      <button
        type="button"
        class="p-2 hover:bg-luxury-gold/10 rounded-lg transition-colors"
        :disabled="isGenerating"
        :title="isGenerating ? 'Generating...' : 'Download PDF'"
        @click="handlePrintPdf($event)"
      >
        <UiIcon
          name="printer"
          :size="16"
          :class="[
            'text-luxury-gold transition-colors',
            isGenerating && 'opacity-50 animate-pulse'
          ]"
        />
      </button>
    </div>
  </div>

  <!-- Courier Status Modal -->
  <UiModal v-model:open="courierStatusModalOpen" title="Courier Status">
    <div v-if="courierStatusLoading" class="flex items-center justify-center py-8">
      <UiLoader size="md" />
    </div>
    <div v-else-if="courierStatusData" class="space-y-4">
      <div v-if="courierStatusData.success !== false" class="space-y-3">
        <div class="flex items-center justify-between py-2 border-b border-luxury-border dark:border-luxury-dark-border">
          <span class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">Status</span>
          <span class="text-sm font-medium text-luxury-text dark:text-luxury-dark-text">
            {{ courierStatusData.delivery_status || 'Unknown' }}
          </span>
        </div>
        <div v-if="currentTrackingLink" class="flex items-center justify-between py-2">
          <span class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">Tracking Link</span>
          <a
            :href="currentTrackingLink"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-luxury-gold hover:underline"
          >
            Open
          </a>
        </div>
      </div>
      <div v-else class="text-center py-4">
        <p class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
          Unable to fetch courier status
        </p>
      </div>
    </div>
  </UiModal>
</template>
