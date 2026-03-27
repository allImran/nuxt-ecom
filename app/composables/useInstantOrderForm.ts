// Instant order form composable
// Handles form state, validation, and operations for instant order creation/editing

import type { InstantOrderForm, OrderItemForm, CustomerInfo, InstantOrderStatus, InstantOrder } from '~/types/instantOrder'

const defaultCustomerInfo: CustomerInfo = {
  name: '',
  phone: '',
  address: ''
}

const defaultOrderItem: OrderItemForm = {
  title: '',
  price: 0,
  quantity: 1,
  unit: 'pcs',
  description: ''
}

const defaultForm: InstantOrderForm = {
  user_id: null,
  customer_info: { ...defaultCustomerInfo },
  order_items: [{ ...defaultOrderItem }],
  delivery_charge: 0,
  cod_reference: '',
  status: 'pending'
}

export function useInstantOrderForm(initialOrder?: InstantOrder) {
  // Form state
  const form = ref<InstantOrderForm>({ ...defaultForm })

  // Initialize with existing order data if provided
  if (initialOrder) {
    form.value = {
      user_id: initialOrder.user_id || null,
      customer_info: { ...initialOrder.customer_info },
      order_items: initialOrder.order_items.map(item => ({
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        unit: item.unit,
        description: item.description || ''
      })),
      delivery_charge: initialOrder.delivery_charge,
      cod_reference: initialOrder.cod_reference || '',
      status: initialOrder.status
    }
  }

  // Validation errors
  const validationErrors = ref<Record<string, string>>({})

  // Computed: Check if form is valid
  const isValid = computed(() => {
    const errors = validate()
    return Object.keys(errors).length === 0
  })

  // Computed: Calculate total amount
  const totalAmount = computed(() => {
    const itemsTotal = form.value.order_items.reduce((sum, item) => {
      return sum + (item.price * item.quantity)
    }, 0)
    return itemsTotal + (form.value.delivery_charge || 0)
  })

  // Validation function
  function validate(): Record<string, string> {
    const errors: Record<string, string> = {}

    // Check customer info or user_id
    if (!form.value.user_id) {
      if (!form.value.customer_info.name.trim()) {
        errors['customer_info.name'] = 'Customer name is required'
      }
      if (!form.value.customer_info.phone.trim()) {
        errors['customer_info.phone'] = 'Customer phone is required'
      }
      if (!form.value.customer_info.address.trim()) {
        errors['customer_info.address'] = 'Customer address is required'
      }
    }

    // Check order items
    if (form.value.order_items.length === 0) {
      errors['order_items'] = 'At least one order item is required'
    } else {
      form.value.order_items.forEach((item, index) => {
        if (!item.title.trim()) {
          errors[`order_items.${index}.title`] = 'Item title is required'
        }
        if (item.price <= 0) {
          errors[`order_items.${index}.price`] = 'Item price must be greater than 0'
        }
        if (item.quantity <= 0) {
          errors[`order_items.${index}.quantity`] = 'Item quantity must be greater than 0'
        }
        if (!item.unit.trim()) {
          errors[`order_items.${index}.unit`] = 'Item unit is required'
        }
      })
    }

    validationErrors.value = errors
    return errors
  }

  // Add new order item
  function addItem() {
    form.value.order_items.push({ ...defaultOrderItem })
  }

  // Remove order item
  function removeItem(index: number) {
    if (form.value.order_items.length > 1) {
      form.value.order_items.splice(index, 1)
    } else {
      // Clear the only item instead of removing
      form.value.order_items[0] = { ...defaultOrderItem }
    }
  }

  // Update order item field
  function updateItem(index: number, field: keyof OrderItemForm, value: any) {
    form.value.order_items[index][field] = value
  }

  // Set user (when user is selected from search)
  function setUser(user: { id: string; name: string; phone: string }) {
    form.value.user_id = user.id
    form.value.customer_info.name = user.name
    form.value.customer_info.phone = user.phone
    // Address is not provided by user search, will need manual entry
  }

  // Clear user (switch to manual customer entry)
  function clearUser() {
    form.value.user_id = null
  }

  // Update customer info field
  function updateCustomerInfo(field: keyof CustomerInfo, value: string) {
    form.value.customer_info[field] = value
  }

  // Reset form
  function reset() {
    form.value = { ...defaultForm }
    validationErrors.value = {}
  }

  // Get form data for submission
  function getFormData(): InstantOrderForm {
    return { ...form.value }
  }

  return {
    // State
    form,
    validationErrors,
    isValid,
    totalAmount,

    // Actions
    validate,
    addItem,
    removeItem,
    updateItem,
    setUser,
    clearUser,
    updateCustomerInfo,
    reset,
    getFormData
  }
}
