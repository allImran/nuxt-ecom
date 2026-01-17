# Proposal: Luxury Auth Flows (Login & Signup)

## Goal

Create functional, luxury-themed Login (`/login`) and Signup (`/signup`) pages.
Both pages will support:

1.  **Google OAuth**: Handles both login and signup (upsert behavior).
2.  **Email/Phone + Password**: Direct, validation-free input submission to the backend.

## Key Changes

1.  **New Pages**:
    - `/login`: For existing users.
    - `/signup`: For new users.
2.  **Authentication Logic**:
    - **Direct Signup/Login**: No client-side validation on Email/Phone inputs. Submit directly to Supabase.
    - **Google**: "Continue with Google" button on both pages. If user doesn't exist, create them; if they do, log them in.
3.  **State Management**: Update `stores/auth.ts` to handle both flows.
4.  **Security**: Secure token storage (Supabase default).

## Rationale

User requires a distinct signup flow and a specific "validation-free" UX to reduce friction, relying on backend validation.

## Verification

- **Manual**:
  - Test Signup with new credentials (no validation error on typing, backend catches issues if any).
  - Test Google flow (new user -> creates account, existing user -> logs in).
- **Visual**: Luxury theme compliance on both pages.
