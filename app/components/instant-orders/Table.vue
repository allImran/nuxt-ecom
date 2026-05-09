<script setup lang="ts">
import type { InstantOrderListItem } from '~/types/instantOrder'

interface Props {
  orders: InstantOrderListItem[]
  formatPrice: (price: number) => string
  formatDate: (date: string) => string
  getStatusColor: (status: string) => string
  getStatusLabel: (status: string) => string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  'row-click': [order: InstantOrderListItem]
}>()

// Sort state - using string type for nested property access
type SortableField = 'created_at' | 'customer_name' | 'phone' | 'cod_reference' | 'status' | 'total'
const sortField = ref<SortableField>('created_at')
const sortDirection = ref<'asc' | 'desc'>('desc')

// Courier status modal state
const courierStatusModalOpen = ref(false)
const courierStatusLoading = ref(false)
const courierStatusData = ref<any>(null)
const currentTrackingCode = ref('')
const currentTrackingLink = ref('')

// Helper to get sort value from order
function getSortValue(order: InstantOrderListItem, field: SortableField): string | number {
  switch (field) {
    case 'customer_name':
      return order.customer_info?.name || ''
    case 'phone':
      return order.customer_info?.phone || ''
    case 'total':
      return order.total
    case 'cod_reference':
      return order.cod_reference ? 1 : 0
    default:
      return order[field]
  }
}

// Sorted orders
const sortedOrders = computed(() => {
  return [...props.orders].sort((a, b) => {
    const aVal = getSortValue(a, sortField.value)
    const bVal = getSortValue(b, sortField.value)

    if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })
})

// Handle column header click for sorting
function handleSort(field: SortableField) {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

// Handle row click
function handleRowClick(order: InstantOrderListItem) {
  emit('row-click', order)
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

// Handle modal refresh
async function handleRefreshCourierStatus() {
  if (!currentTrackingCode.value) return

  courierStatusLoading.value = true
  try {
    const { adminNetwork } = await import('~/network/admin')
    const response = await adminNetwork.fetchCourierStatusByTracking(currentTrackingCode.value)
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

// Handle modal close
function handleCloseCourierModal() {
  courierStatusModalOpen.value = false
}
</script>

<template>
  <div class="bg-luxury-surface dark:bg-luxury-dark-surface rounded-luxury shadow-luxury overflow-hidden">
    <!-- Loading State -->
    <div v-if="loading" class="p-8">
      <div class="space-y-4">
        <div v-for="i in 5" :key="i" class="h-16 bg-luxury-border dark:bg-luxury-dark-border rounded animate-pulse" />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="orders.length === 0" class="p-12 text-center">
      <UiIcon name="package" :size="48" class="mx-auto mb-4 text-luxury-text-muted/30 dark:text-luxury-dark-text-muted/30" />
      <h3 class="text-lg font-medium text-luxury-text dark:text-luxury-dark-text mb-2">
        No instant orders found
      </h3>
      <p class="text-luxury-text-muted dark:text-luxury-dark-text-muted">
        Try adjusting your filters or create a new instant order.
      </p>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-luxury-bg dark:bg-luxury-dark-bg border-b border-luxury-border dark:border-luxury-dark-border">
          <tr>
            <th
              v-for="field in [
                // { key: 'id', label: 'Order ID' },
                { key: 'created_at', label: 'Date' },
                { key: 'customer_name', label: 'Customer' },
                { key: 'phone', label: 'Phone' },
                { key: 'cod_reference', label: 'Delivery Status' },
                { key: 'status', label: 'Status' },
                { key: 'total', label: 'Total' },
              ] as const"
              :key="field.key"
              class="px-6 py-3 text-left text-xs font-medium text-luxury-text-muted dark:text-luxury-dark-text-muted uppercase tracking-wider cursor-pointer hover:text-luxury-gold transition-colors"
              @click="handleSort(field.key as SortableField)"
            >
              <div class="flex items-center gap-1">
                {{ field.label }}
                <UiIcon
                  v-if="sortField === field.key"
                  :name="sortDirection === 'asc' ? 'chevron-up' : 'chevron-down'"
                  :size="14"
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-luxury-border dark:divide-luxury-dark-border">
          <tr
            v-for="order in sortedOrders"
            :key="order.id"
            class="hover:bg-luxury-bg/50 dark:hover:bg-luxury-dark-bg/50 cursor-pointer transition-colors"
            @click="handleRowClick(order)"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
                {{ formatDate(order.created_at) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-sm text-luxury-text dark:text-luxury-dark-text">
                {{ order.customer_info?.name || 'N/A' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div>
                <span class="text-sm font-mono text-luxury-text-muted dark:text-luxury-dark-text-muted">
                  {{ order.customer_info?.phone || '-' }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div v-if="order.cod_reference" class="flex items-center gap-2">
                <button
                  type="button"
                  class="p-1.5 hover:bg-luxury-gold/10 rounded transition-colors"
                  :title="'Copy tracking link'"
                  @click="handleCopyTrackingLink(order.cod_reference, $event)"
                >
                  <UiIcon name="copy" :size="14" class="text-luxury-gold" />
                </button>
                <UiLuxuryButton
                  variant="ghost"
                  size="sm"
                  type="button"
                  class="py-1! px-2! text-xs!"
                  @click="handleCheckCourierStatus(order.cod_reference, $event)"
                >
                  Check
                </UiLuxuryButton>
              </div>
              <span v-else class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
                -
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <InstantOrdersStatusBadge
                :status="order.status"
                :get-status-color="getStatusColor"
                :get-status-label="getStatusLabel"
              />
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-sm font-medium text-luxury-text dark:text-luxury-dark-text">
                {{ formatPrice(order.total) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Courier Status Modal -->
    <CourierStatusModal
      :is-open="courierStatusModalOpen"
      :tracking-code="currentTrackingCode"
      :loading="courierStatusLoading"
      :status-data="courierStatusData"
      @close="handleCloseCourierModal"
      @refresh="handleRefreshCourierStatus"
    />
  </div>
</template>
