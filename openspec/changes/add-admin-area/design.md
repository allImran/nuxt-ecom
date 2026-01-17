# Design: Admin Area Architecture

## Layout & Navigation

- **Layout**: `layouts/admin.vue`
- **Sidebar**: Fixed left sidebar (responsive considerations TBD, generic for now as per prompt).
- **Menu Items**: Home (`/admin`), Categories (`/admin/categories`), Products (`/admin/products` - placeholder for now based on prompt).
- **Features**: Dark mode toggle (using `theme` store), Logout (using `auth` store).

## Authentication & Security

- **Middleware**: `middleware/admin.ts`
  - Checks if user is authenticated.
  - Checks if user has `admin` role.
  - Redirects to `/login` if not authorized.
- **Token Handling**:
  - `modules/api` or centralized `$fetch` wrapper (e.g., in a composable or plugin) to intercept requests and attach `Authorization: Bearer <token>`.
  - User mentioned "All crud need to send bearer token except get request".
  - `GET` requests for Business/Category are public (per API_DOCS).

## Data Management

- **Composables**:
  - `useAdminBusiness`: Fetch, Add, Delete methods.
  - `useAdminCategory`: Fetch, Add, Delete methods.
- **State**:
  - Local state for forms and lists.
  - Re-fetch data after mutations (Add/Delete).

## UI/UX

- **Business/Category Home**:
  - **Header**: Search bar.
  - **Grid/List**: Card view.
  - **Add New**:
    - First card is a special "Add" card.
    - **Category Creation**: Includes a dropdown to select a Business (requires fetching simple list of businesses).
  - **Edit**: Title editable in place (or via a mode).
  - **Delete**: Button on card.
  - **Slug Generation**: Auto-generated from title on creation.

## API Integration Details

Based on `API_DOCS.md`:

- `GET /businesses` (Public)
- `POST /businesses` (Admin)
- `DELETE /businesses/:id` (Admin)
- `PUT /businesses/:id` (Admin)
- Same pattern for Categories.
