## Context

The order section is a critical e-commerce feature that allows users to place orders directly from the product detail page. The design must follow the project's strict architectural patterns while introducing new capabilities for location-based address selection, bilingual support for Bangladesh geography, and order submission.

**Constraints:**

- No logic in `.vue` files - all logic in composables
- No local variables in components - use composables for all state
- DRY principle - reusable nested components to avoid props drilling
- Mobile-first responsive design
- Follow luxury theme from `app/assets/css/main.css`
- Use Pinia stores for state management
- Use $fetch for API calls
- Support Bengali and English languages for location data
- Location data (divisions, districts, upazilas) are in `/public/*.json` files

**Stakeholders:**

- End users placing orders
- Admin users managing orders
- Delivery personnel processing shipping addresses

## Goals / Non-Goals

**Goals:**

1. Allow users to select products and adjust quantities
2. Collect shipping address with Bangladesh geography support
3. Display bilingual location names based on current locale
4. Support searching locations in both Bengali and English
5. Show real-time price calculation (product subtotal + delivery fee)
6. Submit orders to `/order` API endpoint
7. Cash on Delivery payment method (disabled alternatives)
8. Mobile-responsive layout
9. Loading and error states for order submission

**Non-Goals:**

- Shopping cart persistence across pages (single-page checkout)
- User authentication integration (user_id: null initially)
- Payment gateway integration (COD only for now)
- Order history tracking
- Order confirmation page
- Address book/saved addresses
- Inventory validation

## Decisions

### Decision 1: Location Data Loading - Static JSON Import

**What**: Import location JSON files directly using static imports rather than runtime fetch.

**Why**: The location data is static and relatively small (8 divisions, ~64 districts, ~495 upazilas). Static imports enable better search performance and avoid async loading complexity.

**Implementation**:

```typescript
// In utils/location.ts
import divisionsData from "~/public/divisions.json";
import districtsData from "~/public/districts.json";
import upazilasData from "~/public/upazilas.json";

// Parse and export structured data
export const divisions: LocationData[] = parseDivisions(divisionsData);
export const districts: LocationData[] = parseDistricts(districtsData);
export const upazilas: LocationData[] = parseUpazilas(upazilasData);
```

**Alternatives considered:**

- Runtime fetch with $fetch - Rejected due to unnecessary async complexity
- Store in database - Rejected due to static nature of Bangladesh geography
- Hardcode in TypeScript - Rejected due to size and maintainability

### Decision 2: Bilingual Location Names - Current Locale Detection

**What**: Display location names based on the current locale setting (bn/en). Use `name` field for English and `bn_name` field for Bengali.

**Why**: The location JSON files contain both `name` (English) and `bn_name` (Bengali) fields. This matches the project's i18n pattern.

**Implementation**:

```typescript
// In composable
const localeStore = useLocaleStore();
const isBangla = computed(() => localeStore.isBangla);

const getDivisionName = (division: LocationData): string => {
  return isBangla.value ? division.bn_name : division.name;
};

// Search works on both fields
const searchDivisions = (query: string): LocationData[] => {
  const lowerQuery = query.toLowerCase();
  return divisions.filter(
    (d) =>
      d.name.toLowerCase().includes(lowerQuery) || d.bn_name.includes(query), // Bengali case-sensitive search
  );
};
```

**Alternatives considered:**

- Separate i18n keys for each location - Rejected due to 500+ items
- Always show both languages - Rejected, creates UI clutter

### Decision 3: Cascading Location Selectors - Dependent Filtering

**What**: Division selection filters available districts, which filters available upazilas. District and upazila are optional (can be empty).

**Why**: Bangladesh geographic hierarchy requires parent-child relationships. Optional fields accommodate areas where detailed location may not be necessary.

**Implementation**:

```typescript
// In store
const availableDistricts = computed(() => {
  if (!selectedDivision.value) return [];
  return districts.filter((d) => d.division_id === selectedDivision.value?.id);
});

const availableUpazilas = computed(() => {
  if (!selectedDistrict.value) return [];
  return upazilas.filter((u) => u.district_id === selectedDistrict.value?.id);
});
```

**Alternatives considered:**

- Free-text input for all locations - Rejected, prone to errors
- Single dropdown with all locations - Rejected, poor UX with 500+ options
- Required all fields - Rejected, too restrictive for users

### Decision 4: Order Products Structure - Array with Quantities

**What**: Store order products as an array where each product has an id, variant_id, and quantity. Products with quantity 0 are excluded from submission.

**Why**: The component receives a products array and allows users to adjust quantities. This structure maps directly to the API requirement.

**Implementation**:

```typescript
interface OrderProduct {
  id: string;
  variant_id: string | null;
  quantity: number;
}

// In store
const orderProducts = ref<OrderProduct[]>([]);

const updateQuantity = (
  productId: string,
  variantId: string,
  quantity: number,
) => {
  const existing = orderProducts.value.find(
    (p) => p.id === productId && p.variant_id === variantId,
  );
  if (existing) {
    existing.quantity = quantity;
  } else {
    orderProducts.value.push({
      id: productId,
      variant_id: variantId,
      quantity,
    });
  }
};

const productsForSubmission = computed(() => {
  return orderProducts.value.filter((p) => p.quantity > 0);
});
```

**Alternatives considered:**

- Single product at a time - Rejected, users may want multiple items
- Map-based storage - Rejected, array is simpler for API submission

### Decision 5: Price Display - First Variant Price

**What**: Display product prices using the first variant's price. Calculate total as (product price × quantity) + delivery fee (100 TK).

**Why**: User requirement states "show the list of products with price from the first variant". This keeps the UI simple.

**Implementation**:

```typescript
const getProductPrice = (product: Product): number => {
  return product.variants?.[0]?.price || 0;
};

const subtotal = computed(() => {
  return orderProducts.value.reduce((sum, p) => {
    const product = products.value.find((prod) => prod.id === p.id);
    const price = product ? getProductPrice(product) : 0;
    return sum + price * p.quantity;
  }, 0);
});

const total = computed(() => subtotal.value + DELIVERY_FEE);
```

**Alternatives considered:**

- Price range display - Rejected, confusing for order calculation
- User selects variant per product - Rejected, adds complexity

### Decision 6: Component Structure - Nested Slot Pattern

**What**: Create `app/components/order/` directory with nested components using slots:

```
Order (Index.vue)
├── OrderAddressSection
│   ├── OrderDivisionSelect
│   ├── OrderDistrictSelect
│   ├── OrderUpazilaSelect
│   ├── OrderAddressInput
│   └── OrderMobileInput
├── OrderProductSection
│   ├── OrderProductItem
│   │   ├── OrderProductInfo
│   │   └── OrderQuantityControl
│   └── OrderSummary
└── OrderPaymentSection
    └── OrderPaymentMethod
```

**Why**: Follows project.md's nested slot pattern to avoid props drilling and maintain component purity.

### Decision 7: Shipping Address JSONB Structure - Flat Object

**What**: Submit shipping_address as a flat JSON object with all address fields.

**Why**: PostgreSQL JSONB fields can store structured data. A flat object is simple to query and maintain.

**Implementation**:

```typescript
interface ShippingAddress {
  division: string; // Division ID
  division_name: string; // Division name (for display)
  district?: string; // District ID (optional)
  district_name?: string; // District name (optional)
  upazila?: string; // Upazila ID (optional)
  upazila_name?: string; // Upazila name (optional)
  address: string; // Full address text
  mobile: string; // Mobile number
}

// Build for submission
const buildShippingAddress = (): ShippingAddress => {
  const division = divisions.value.find((d) => d.id === selectedDivision.value);
  const district = districts.value.find((d) => d.id === selectedDistrict.value);
  const upazila = upazilas.value.find((u) => u.id === selectedUpazila.value);

  return {
    division: selectedDivision.value || "",
    division_name: division
      ? isBangla.value
        ? division.bn_name
        : division.name
      : "",
    district: selectedDistrict.value || undefined,
    district_name: district
      ? isBangla.value
        ? district.bn_name
        : district.name
      : undefined,
    upazila: selectedUpazila.value || undefined,
    upazila_name: upazila
      ? isBangla.value
        ? upazila.bn_name
        : upazila.name
      : undefined,
    address: fullAddress.value,
    mobile: mobileNumber.value,
  };
};
```

**Alternatives considered:**

- Nested object - Rejected, flat is simpler to query
- String concatenation - Rejected, loses structured data

### Decision 8: API Contract - POST /order

**What**: Submit order via POST to `/order` endpoint with JSON body.

**Implementation**:

```typescript
interface CreateOrderRequest {
  user_id?: string | null; // null for now
  status: string; // 'pending'
  shipping_address: ShippingAddress;
  items: Array<{
    product_id: string;
    variant_id?: string | null;
    quantity: number;
  }>;
}

// In network/public.ts
createOrder: (request: CreateOrderRequest) => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBaseURL;

  return $fetch("/order", {
    baseURL,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: request,
  });
};
```

### Decision 9: Search Functionality - Client-Side Filtering

**What**: Implement search by filtering the imported location arrays in the composable.

**Why**: With ~500 upazilas, client-side filtering is fast and simple. No need for server-side search.

**Implementation**:

```typescript
const searchResults = ref<LocationData[]>([]);

const searchLocations = (
  type: "division" | "district" | "upazila",
  query: string,
) => {
  const data =
    type === "division"
      ? divisions
      : type === "district"
        ? availableDistricts.value
        : availableUpazilas.value;

  if (!query) {
    searchResults.value = data.slice(0, 50); // Limit initial display
    return;
  }

  const lowerQuery = query.toLowerCase();
  searchResults.value = data.filter(
    (item) =>
      item.name.toLowerCase().includes(lowerQuery) ||
      item.bn_name.includes(query),
  );
};
```

**Alternatives considered:**

- Server-side search API - Rejected, overkill for 500 items
- No search, just scroll - Rejected, poor UX with long lists

## Risks / Trade-offs

- **Risk**: Bengali text search may not work well with toLowerCase()
  - **Mitigation**: Keep Bengali search case-sensitive (no transformation)

- **Risk**: Location data may become outdated
  - **Mitigation**: Store in easily replaceable JSON files, can be updated independently

- **Risk**: Large location arrays may impact initial bundle size
  - **Mitigation**: Data is relatively small (<100KB total), acceptable for e-commerce

- **Risk**: No address validation
  - **Mitigation**: Add basic validation (required fields, mobile format), defer detailed validation to future

- **Trade-off**: Cash on delivery only limits payment options
  - **Justification**: Aligns with "coming soon" requirement, simpler initial implementation

- **Trade-off**: Single-page checkout (no cart persistence)
  - **Justification**: Simpler for MVP, cart can be added as separate feature

## Migration Plan

No migration needed - this is a new feature.

**Steps:**

1. Create location data utilities and types
2. Create order Pinia store
3. Create order composable with business logic
4. Create nested order components
5. Add i18n translations
6. Add API network function
7. Update Order Index.vue to use new implementation
8. Integrate with product detail page
9. Test order submission flow
10. Verify bilingual functionality

**Rollback**: Delete new files, revert Order component to placeholder.

## Open Questions

1. **Q**: Should mobile number validation include Bangladesh country code prefix?
   - **A**: Ask user for preference. Default: accept any format, add validation later.

2. **Q**: Should there be a minimum order amount?
   - **A**: Not specified. Default: no minimum.

3. **Q**: How to handle order submission success/failure?
   - **A**: Success = show success message and clear form. Failure = show error message.

4. **Q**: Should the order component accept products array as props or fetch from parent context?
   - **A**: The user mentioned "the component received a products array" - use props.
