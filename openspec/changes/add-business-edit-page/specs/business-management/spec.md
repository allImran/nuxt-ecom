## ADDED Requirements

### Requirement: Business Edit Page

The system SHALL provide a dedicated edit page for businesses at `/business/[id]/edit` where admins can modify all business properties.

#### Scenario: Navigate to edit page

Given an authenticated admin user
When the admin navigates to `/business/[id]/edit`
Then the system should display the edit page with current business data
And the page should use the admin layout

#### Scenario: Page loads with existing data

Given a business with id `123` exists with properties `name`, `logo`, `slogan`, `email`, `social`, `address`
When the edit page loads
Then all form fields should be pre-populated with existing business data

### Requirement: Debounced Auto-Save

The system SHALL automatically save text input changes after a debounce period to prevent excessive API calls.

#### Scenario: Text field auto-save

Given an admin is editing business name field
When the admin stops typing for 800ms
Then the system should send a PUT request to `/businesses/:id` with updated data
And show a saving indicator during the request
And show a success indicator when save completes

#### Scenario: Debounce prevents rapid API calls

Given an admin is rapidly typing in the slogan field
When multiple characters are entered within 800ms
Then the system should only send one API request after typing stops
And should not send requests for each keystroke

### Requirement: Logo Upload and Instant Save

The system SHALL provide a logo upload interface that instantly uploads and saves the image when selected.

#### Scenario: Logo upload on selection

Given an admin is on the business edit page
When the admin selects an image file for the logo
Then the system should immediately upload the file via `/files/upload`
And upon successful upload, send a PUT request to `/businesses/:id` with the new logo URL
And display the uploaded logo preview

#### Scenario: Logo upload with loading state

Given an admin is uploading a logo image
When the upload is in progress
Then the system should show a loading indicator
And disable the upload button during upload
And show the new logo upon completion

### Requirement: Dynamic Social Links Management

The system SHALL allow admins to dynamically add and remove social media links.

#### Scenario: Add social link

Given an admin is editing business social links
When the admin clicks "Add Social Link"
Then the system should add a new social link row with platform selector and URL input
And the new link should be included in the social object when saved

#### Scenario: Remove social link

Given a business has social links configured
When the admin clicks remove on a social link row
Then the system should remove that link from the social object
And save the updated social object

#### Scenario: Supported platforms

Given an admin is adding social links
When viewing the platform selector
Then the system should offer: Facebook, Instagram, Twitter, LinkedIn, Website, and Other
And each platform should have an appropriate icon

### Requirement: Business Data Model

The system SHALL support the complete business data model including all fields from the API.

#### Scenario: Full business model

Given a business object
When viewing its properties
Then it should include: `id`, `name`, `slug`, `logo`, `slogan`, `primary_color`, `email`, `social`, `address`, `is_active`, `created_at`, `updated_at`

### Requirement: Reuse Existing Components

The system SHALL reuse existing UI components and patterns for consistency.

#### Scenario: Use LuxuryInput component

Given the edit page needs text input fields
When rendering name, slogan, email, and address fields
Then the system should use the existing `LuxuryInput` component

#### Scenario: Use file upload pattern

Given the edit page needs logo upload functionality
When implementing the logo uploader
Then the system should follow the pattern from `ProductImageUploader` component
