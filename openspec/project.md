# Project Context

## Purpose

An e-commerce website frontend for selling products.

## Tech Stack

- Nuxt 4
- Tailwind CSS
- Pinia
- Supabase
- Motion for Vue (https://motion.dev/docs/vue)

## Project Conventions

### Code Style

- Use TypeScript everywhere
- Use Composition API and `<script lang="ts" setup>`
- camelCase for variables and functions
- PascalCase for components
- Middleware names are in kebab-case
- One component per file
- Prefer composables for reusable logic
- Avoid unnecessary comments and boilerplate
- Keep components small and focused
- Pinia should use `Setup Stores` Similar to the Vue Composition API's setup function. In Setup Stores:
  - ref()s become state properties
  - computed()s become getters
  - function()s become actions
- composables use Pinia stores, components import composables not the stores.
- Use nested slot to avoid props drilling. Like, <Nav> <NavItems></NavItems></Nav>
- Use $fetch for api call

### Architecture Patterns

- The app/ directory is the main directory of the Nuxt application. It contains the following subdirectories:
  assets/: website's assets that the build tool (Vite or webpack) will process
  components/: Vue components of the application
  composables/: all logics composables
  layouts/: Vue components that wrap around your pages and avoid re-rendering between pages
  middleware/: run code before navigating to a particular route
  pages/: file-based routing to create routes within your web application
  plugins/: use Vue plugins and more at the creation of your Nuxt application
  utils/: add functions throughout your application that can be used in your components, composables, and pages.
  network/: contains the network code of the application. Register api endpoint end-points for API calls. Stores use network functions.
- Pages are route-level components only
- `pages/admin` is the admin dashboard
- Shared state is managed with Pinia stores
- UI components should be presentational when possible
- Avoid tight coupling between components and stores
- Define types in `app/types/`
- Use Pinia for state managemen

### Testing Strategy

[Explain your testing approach and requirements]

### Git Workflow

- `main` branch is always stable
- Feature branches: `feature/<short-description>`
- Bug fixes: `fix/<short-description>`
- Commits follow conventional commits:
  - `feat:` new features
  - `fix:` bug fixes
  - `refactor:` code improvements
  - `chore:` tooling or config changes

## Domain Context

- User e-commerce website best practices.
- Brand coolor #304f5c
- The application is UI-driven and data-centric
- UX clarity and responsiveness are more important than visual effects
- The application is mobile-first and responsive
- The application is accessible
- The application is scalable, maintainable

## Important Constraints

- UI and logic are separated. No `.vue` file should contain logic. `.vue` file imports composables.
- Components should not take multiple responsibilities.
- Always show loader/skeleton-loader while data fetching or something happening.
- Do not duplicate business logic across API endpoints
- Shared logic (e.g. fetching a single user, existence checks, authorization) must live in `utils/` or `services/`
- Always use try-catch to avoid unhandled exceptions where no error handler exist.
- API handlers should only orchestrate flow, not implement core logic
- If multiple endpoints require the same validation or data-fetching, extract it into a reusable helper
- Never fetch or validate the same entity (e.g. user) differently in different endpoints
- API routes should call reusable functions instead of containing inline logic
- Utility functions must be framework-agnostic and testable
- Services and utilities must be written using **functional patterns only**
- Do **not** use class-based services or OOP-style abstractions
- Network layer handles HTTP calls only
- Pinia is the single source of truth for state
- Pinia actions call network functions
- Composables must not call network directly
- Composables may only consume Pinia stores
- Components must interact with data via composables
- State mutations must happen only inside Pinia
- Nuxt automatically imports any components, If a component in nested directories, then the component's name will be based on its own path directory and filename, with duplicate segments being removed. example,
  -| components/
  ---| base/
  -----| foo/
  -------| Button.vue
  then the component's name will be `BaseFooButton`.
- utils functions are automatically imported.
- Use the composables/ directory to auto-import in any .js, .ts and .vue files.

## External Dependencies

[Document key external services, APIs, or systems]
