# Design

## User Experience

### Product Listing & Creation

- The product listing page will serve as the entry point.
- A "Create Product" button will trigger a modal to select the "Root Category". This is required because products must be associated with a category tree rooted in a business context.
- Upon meaningful selection, the user is redirected to the Product Edit page for the newly created product (or a draft context). _Note: The API requires a category_id on creation. We can either create an empty product immediately or pass the category_id to the new page to be sent with the first save._
  - **Decision**: We will use a "Create" modal that calls `createProduct` with the minimal required fields (Name, Slug, Category) and then redirects to the edit page. This avoids complex "draft" state on the client.

### Product Edit Page

The edit page will be divided into logical sections or tabs:

1.  **Overview**: Basic info (Name, Slug).
2.  **Media**: Image gallery management.
    - Uploading uploads to `supabase` directly or via backend API. The project has a `POST /files/upload` endpoint. We should use that.
    - Images are stored as an array of paths in `product.file_paths`.
    - Display involves `getPublicImage(bucket, path)`.
3.  **Content**: A dynamic list of "Sections".
    - User can add "Text" or "Media" sections.
    - JSON structure: `[{ type: 'text', content: '...' }, { type: 'media', file_paths: [...] }]`.
4.  **Variants**:
    - A table listing variants.
    - Add/Edit allows specifying SKU, Price, and dynamic Attributes.
    - Attributes are a JSON map: `{ "Color": "Red", "Size": "42" }`.
    - User can add new attribute keys dynamically.

## Component Architecture

- **ProductImageUploader**: Handles drag-and-drop, calls `uploadFile`, and emits updated path list.
- **ProductVariantManager**: Handles the complexity of variant CRUD and attribute management.
- **ProductSectionManager**: Renders different inputs based on section type (Text Area vs Image Uploader).

## Data Flow

- **Fetch**: On mount, fetch product by ID.
- **Save**:
  - Auto-save or Manual "Save Changes" button? Manual is safer for complex edits.
  - Updates are sent via `PUT /products/:id`.
  - Variants are managed independently? The API has specific endpoints for variants. So Variant Manager will likely make its own API calls (`POST /products/:id/variants`, `PUT /products/variants/:id`).
