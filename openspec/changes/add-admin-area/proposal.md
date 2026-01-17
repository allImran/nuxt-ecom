# Proposal: Add Admin Area

This proposal introduces a dedicated Admin Area to the Nuxt E-commerce application. It includes a protected layout, authentication middleware, and management interfaces for Businesses and Categories.

## Goal

Enable authorized users (Admin role) to manage platform resources (Businesses, Categories) through a secure and user-friendly interface.

## Scope

- **Admin Layout**: A sidebar layout with navigation, dark mode toggle, and logout.
- **Authentication**: Middleware to protect `/admin` routes.
- **Business Management**: Listing, creating, updating (title), and deleting businesses.
- **Category Management**: Listing, creating, updating, and deleting categories.
- **API Integration**: Centralized token handling for protected routes.
