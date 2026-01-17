# Spec: Admin Layout

## ADDED Requirements

### Requirement: Admin Layout Structure

The admin area MUST use a distinct layout with a sidebar for navigation and common utilities.

#### Scenario: Verify Sidebar Navigation

Given an authenticated admin user is on any `/admin` page
When they access the sidebar
Then they should see links for "Home" (`/admin`), "Categories" (`/admin/categories`), and "Products" (`/admin/products`).

#### Scenario: Dark Mode Toggle

Given the admin layout is active
When the user clicks the dark mode toggle
Then the application theme should switch between light and dark modes.

#### Scenario: User Logout

Given an authenticated admin user
When they click the logout button in the sidebar
Then their session should be terminated
And they should be redirected to the login page.

### Requirement: Route Protection

All `/admin` routes MUST be protected and restricted to users with the 'admin' role.

#### Scenario: Access Denied for Non-Admin

Given a user is authenticated but does not have the 'admin' role
When they attempt to access `/admin`
Then they should be redirected to the home page or shown a 403 error.

#### Scenario: Access Denied for Unauthenticated

Given a visitor is not logged in
When they attempt to access `/admin`
Then they should be redirected to the `/login` page.
