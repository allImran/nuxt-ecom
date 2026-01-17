# Spec: Category Management

## ADDED Requirements

### Requirement: List Categories

The Categories page MUST display a list of all categories.

#### Scenario: Fetch and Display

Given the admin user is on `/admin/categories`
Then a list of categories should be fetched from `GET /categories`
And displayed as cards.

### Requirement: Create Category

Admins MUST be able to create new categories.

#### Scenario: Add Category Card

Given the admin user is on `/admin/categories`
Then the first card in the grid should be an "Add Category" card
And it should contain an input field for the category Name
And it should contain a dropdown to select a Business.

#### Scenario: Creation with Business

Given the user has entered a name and selected a business
When they click the "Plus" icon
Then a `POST /categories` request should be sent with the `name` and `business_id`
And upon success, the category list should be re-fetched.

### Requirement: Update Category

Admins MUST be able to update existing categories.

#### Scenario: Edit Name

Given a category card is displayed
When the user edits the name input
Then the change should be saved via `PUT /categories/:id`.

### Requirement: Delete Category

Admins MUST be able to remove categories.

#### Scenario: Delete Action

Given a category card is displayed
When the user clicks the delete button
Then a `DELETE /categories/:id` request should be sent
And the category should be removed from the list.

### Requirement: Search Category

Admins MUST be able to filter the category list.

#### Scenario: Filter by Name

Given the category list is loaded
When the user types in the search bar
Then the displayed list should be filtered to show only matching categories.
