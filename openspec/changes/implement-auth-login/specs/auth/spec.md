# Authentication Spec

## ADDED Requirements

### Requirement: Validation-Free Signup

The system MUST allow users to sign up using an identifier (email or phone) and password without client-side format validation.

#### Scenario: User signs up with direct input

- **Given** I am on the `/signup` page
- **When** I enter any text in the identifier field
- **And** I enter a password
- **And** I click "Sign Up"
- **Then** The system should submit the credentials to the backend
- **And** If the backend accepts it, a new user should be created
- **And** I should be authenticated

### Requirement: Validation-Free Login

The system MUST allow users to log in using their identifier and password without client-side format validation.

#### Scenario: User logs in with direct input

- **Given** I am on the `/login` page
- **When** I enter my identifier (email or phone)
- **And** I enter my password
- **And** I click "Sign In"
- **Then** The system should submit the credentials to the backend
- **And** If credentials match, I should be authenticated

### Requirement: Unified Google Auth

The system MUST provide Google authentication that serves as both login and signup.

#### Scenario: User uses Google Auth

- **Given** I am on either `/login` or `/signup` page
- **When** I click "Continue with Google"
- **Then** I should be redirected to Google
- **And** Upon return, if I am a new user, I should be registered
- **And** If I am an existing user, I should be logged in

### Requirement: Luxury UI Standard

Both authentication pages MUST adhere to the luxury design system.

#### Scenario: User views auth pages

- **Given** I access `/login` or `/signup`
- **Then** I should see the Luxury color palette (Gold/Dark/Light)
- **And** I should see the specific typography and layout defined in the design
