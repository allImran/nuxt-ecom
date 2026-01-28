## ADDED Requirements

### Requirement: Product Detail Page Routing

The system SHALL provide a dynamic route for product detail pages using the product slug.

#### Scenario: Navigate to product detail page

- **GIVEN** a product exists with slug "test-product"
- **WHEN** a user navigates to `/products/test-product`
- **THEN** the system shall render the product detail page
- **AND** the page shall display the product information

#### Scenario: Invalid product slug

- **GIVEN** a product does not exist with slug "nonexistent-product"
- **WHEN** a user navigates to `/products/nonexistent-product`
- **THEN** the system shall return a 404 error
- **OR** display an appropriate error message

### Requirement: Product Data Fetching

The system SHALL fetch product data from the public API endpoint using the product slug.

#### Scenario: Successful product fetch

- **GIVEN** the API endpoint `/products/slug/{slug}` returns valid product data
- **WHEN** the page loads with slug "test-product"
- **THEN** the system shall call the API endpoint
- **AND** store the product data in Pinia store
- **AND** display loading state during fetch
- **AND** remove loading state after fetch completes

#### Scenario: API error handling

- **GIVEN** the API endpoint returns an error (4xx or 5xx)
- **WHEN** the product data fetch fails
- **THEN** the system shall display an error message
- **AND** log the error for debugging
- **AND** not display the product detail page

### Requirement: Image URL Generation

The system SHALL use the `getPublicImage` utility function from `app/utils/image.ts` to generate public URLs for all product images.

#### Scenario: Generate image URL for display

- **GIVEN** a product has file_paths with Supabase storage paths
- **WHEN** rendering product images in the gallery or content sections
- **THEN** the system shall use `getPublicImage` utility with the appropriate bucket and path
- **AND** the utility shall return the complete public URL for the image
- **AND** the image shall load correctly from Supabase storage

#### Scenario: Handle missing Supabase URL

- **GIVEN** the Supabase URL is missing from runtime config
- **WHEN** `getPublicImage` is called
- **THEN** the utility shall return an empty string
- **AND** log an error to the console
- **AND** the image shall show a fallback or placeholder

### Requirement: Product Media Gallery

The system SHALL display a media gallery with the product's images and YouTube video.

#### Scenario: Media with YouTube video

- **GIVEN** a product has a YouTube URL and multiple images
- **WHEN** the product detail page renders
- **THEN** the YouTube video shall be displayed as the first media item
- **AND** the product images shall be displayed after the video
- **AND** thumbnails shall be shown for navigation

#### Scenario: Media without video

- **GIVEN** a product has only images (no YouTube URL)
- **WHEN** the product detail page renders
- **THEN** all product images shall be displayed in the gallery
- **AND** the first image shall be the default selected image

#### Scenario: Image thumbnail navigation

- **GIVEN** the media gallery is displayed with multiple images
- **WHEN** a user clicks on a thumbnail
- **THEN** the main image shall update to show the selected image
- **AND** the thumbnail shall show a selected state

#### Scenario: No media available

- **GIVEN** a product has no file_paths and no youtube_url
- **WHEN** the product detail page renders
- **THEN** the system shall display a placeholder image or empty state
- **AND** not display thumbnail navigation

### Requirement: Product Information Display

The system SHALL display essential product information including name, price, description, and category.

#### Scenario: Display basic product info

- **GIVEN** a product with name, category, and variants
- **WHEN** the product detail page renders
- **THEN** the system shall display the product name
- **AND** display the category name (if available)
- **AND** display price range or selected variant price
- **AND** display breadcrumbs navigation

#### Scenario: Price display with variants

- **GIVEN** a product has multiple variants with different prices (e.g., $12 and $120)
- **WHEN** no variant is selected
- **THEN** the system shall display the price range "$12 - $120"
- **WHEN** a variant is selected
- **THEN** the system shall display only the selected variant's price

#### Scenario: Price display with single price

- **GIVEN** a product has variants with the same price or only one variant
- **WHEN** the product detail page renders
- **THEN** the system shall display the single price (e.g., "$120")
- **AND** not display a price range

### Requirement: Product Variant Selection

The system SHALL allow users to select product variants and display variant attributes.

#### Scenario: Display available variants

- **GIVEN** a product has multiple variants with different SKUs and attributes
- **WHEN** the product detail page renders
- **THEN** the system shall display all available variants
- **AND** show variant attributes as key-value pairs (e.g., "red: #ffff")
- **AND** show variant SKU

#### Scenario: Select a variant

- **GIVEN** a product has multiple variants
- **WHEN** a user clicks on a variant
- **THEN** the system shall update the selected variant state
- **AND** update the displayed price to match the selected variant
- **AND** show visual indication of the selected variant

#### Scenario: No variants available

- **GIVEN** a product has no variants
- **WHEN** the product detail page renders
- **THEN** the system shall not display the variant selector
- **AND** display the base product information only

### Requirement: Product Content Sections

The system SHALL render product sections containing text and media content.

#### Scenario: Render text sections

- **GIVEN** a product has sections with type "text" and content
- **WHEN** the product detail page renders
- **THEN** the system shall render the text content in a readable format
- **AND** display sections in the order they appear in the API response

#### Scenario: Render media sections

- **GIVEN** a product has sections with type "media" and file_paths
- **WHEN** the product detail page renders
- **THEN** the system shall render the images in a grid or gallery layout
- **AND** display sections in the order they appear in the API response

#### Scenario: Mixed content sections

- **GIVEN** a product has both text and media sections
- **WHEN** the product detail page renders
- **THEN** the system shall render all sections in their defined order
- **AND** maintain visual separation between section types

### Requirement: Responsive Layout

The product detail page SHALL be mobile-first and responsive across all device sizes.

#### Scenario: Desktop layout

- **GIVEN** the user is on a desktop screen (1024px and above)
- **WHEN** the product detail page renders
- **THEN** the layout shall use a two-column grid (60% media, 40% product info)
- **AND** thumbnails shall be displayed vertically on the right side of the main image

#### Scenario: Mobile layout

- **GIVEN** the user is on a mobile screen (below 768px)
- **WHEN** the product detail page renders
- **THEN** the layout shall stack vertically (media first, then product info)
- **AND** thumbnails shall be displayed horizontally below the main image
- **AND** all content shall be touch-friendly

#### Scenario: Tablet layout

- **GIVEN** the user is on a tablet screen (768px - 1023px)
- **WHEN** the product detail page renders
- **THEN** the layout shall adapt to the screen width
- **AND** maintain readability and usability

### Requirement: Loading and Error States

The system SHALL provide clear visual feedback during loading and error states.

#### Scenario: Loading skeleton

- **GIVEN** a user navigates to a product detail page
- **WHEN** the product data is being fetched
- **THEN** the system shall display skeleton loaders for all major sections
- **AND** the skeleton shall match the final layout structure

#### Scenario: Network error

- **GIVEN** the API call fails due to network error
- **WHEN** the fetch completes with an error
- **THEN** the system shall display a user-friendly error message
- **AND** provide a retry button or option to navigate back

### Requirement: Theme Consistency

The product detail page components SHALL follow the luxury theme defined in the project.

#### Scenario: Light mode styling

- **GIVEN** the user has light mode selected
- **WHEN** the product detail page renders
- **THEN** all components shall use light theme colors from `main.css`
- **AND** use the luxury border radius (1.5rem)
- **AND** use luxury letter spacing (0.18em)

#### Scenario: Dark mode styling

- **GIVEN** the user has dark mode selected
- **WHEN** the product detail page renders
- **THEN** all components shall use dark theme colors from `main.css`
- **AND** maintain the same layout structure as light mode
