# Design: Luxury Login & Signup

## UI/UX Design

- **Theme**: Luxury (Gold/Dark/Light) as defined in `tailwind.config.ts`.
- **Pages**:
  - **`/login`**:
    - "Sign In" Header.
    - Input: "Email or Phone" (No client-side validation).
    - Input: "Password".
    - Button: "Sign In" (Gold).
    - Divider: "Or continue with".
    - Button: "Continue with Google".
    - Link: "New here? **Create an account**" -> goes to `/signup`.
  - **`/signup`**:
    - "Create Account" Header.
    - Input: "Email or Phone" (No client-side validation).
    - Input: "Password".
    - Button: "Sign Up" (Gold).
    - Divider: "Or continue with".
    - Button: "Continue with Google" (Same behavior: upsert).
    - Link: "Already have an account? **Sign in**" -> goes to `/login`.

## Technical Details

- **Validation**:
  - **Strictly Validation-Free**: Do not check regex for email/phone on the client.
  - Pass raw string to Supabase `signInWithPassword` or `signUp`.
  - Handle backend errors (e.g., "Invalid login credentials") by displaying a toast or alert.
- **Google Auth**:
  - Uses `supabase.auth.signInWithOAuth({ provider: 'google' })`.
  - This method handles both login and registration (upsert) automatically.
- **Components**:
  - `AuthLayout.vue` (optional): To share the centered card luxury styling.
  - `LuxuryInput.vue`: Reusable input component.
  - `LuxuryButton.vue`: Reusable button.

## Architecture

- `stores/auth.ts`: Actions for `login(email, password)`, `register(email, password)`, `loginWithGoogle()`.
