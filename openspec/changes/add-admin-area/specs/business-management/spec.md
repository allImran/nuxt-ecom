# Spec: Business Management

## ADDED Requirements

### Requirement: List Businesses

The Admin Dashboard (Home) MUST display a list of all businesses.

#### Scenario: Fetch and Display

Given the admin user is on `/admin`
Then a list of businesses should be fetched from `GET /businesses`
And displayed as cards.

### Requirement: Create Business

Admins MUST be able to create new businesses directly from the dashboard.

#### Scenario: Add Business Card

Given the admin user is on `/admin`
Then the first card in the grid should be an "Add Business" card
And it should contain an input field for the business Name.

#### Scenario: Creation and Refresh

Given the user has entered a name in the "Add Business" card
When they click the "Plus" icon
Then a `POST /businesses` request should be sent with the name and an auto-generated slug
And upon success, the business list should be re-fetched.

### Requirement: Update Business

Admins MUST be able to update existing businesses.

#### Scenario: Edit Title

Given a business card is displayed
When the user edits the title input
Then the change should be saved via `PUT /businesses/:id` (debounced or on blur/enter).

### Requirement: Delete Business

Admins MUST be able to remove businesses.

#### Scenario: Delete Action

Given a business card is displayed
When the user clicks the delete button
Then a `DELETE /businesses/:id` request should be sent
And the business should be removed from the list.

### Requirement: Search Business

Admins MUST be able to filter the business list.

#### Scenario: Filter by Name

Given the business list is loaded
When the user types in the search bar
Then the displayed list should be filtered to show only matching businesses.
