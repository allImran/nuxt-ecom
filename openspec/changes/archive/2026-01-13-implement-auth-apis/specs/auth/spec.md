# Auth APIs Specification

## ADDED Requirements

### Requirement: User Signup

The system MUST provide an API to register new users.

#### Scenario: Successful Signup

Given a valid email `newuser@example.com` and a strong password
When a `POST` request is sent to `/api/auth/signup`
Then the system should create a new user in Supabase
And return a success response with user details
And the user should receive a confirmation email (if enabled)

#### Scenario: Existing Email

Given an email `existing@example.com` that is already registered
When a `POST` request is sent to `/api/auth/signup`
Then the system should return a 400 Bad Request or 409 Conflict error
And appropriate error message

### Login API

The system MUST provide an API to authenticate users.

#### Scenario: Successful Login

Given a registered user `user@example.com` with valid credentials
When a `POST` request is sent to `/api/auth/login`
Then the system should authenticate the user with Supabase
And return a session token/cookie
And the response status should be 200 OK

#### Scenario: Invalid Credentials

Given a user attempts to login with incorrect password
When a `POST` request is sent to `/api/auth/login`
Then the system should return a 401 Unauthorized error

### Logout API

The system MUST provide an API to log out users.

#### Scenario: Logout

Given an authenticated user
When a `POST` request is sent to `/api/auth/logout`
Then the system should invalidate the user session
And return a 200 OK response

### Password Reset API

The system MUST provide an API to reset passwords.

#### Scenario: Request Password Reset

Given a registered user email `user@example.com`
When a `POST` request is sent to `/api/auth/password-reset`
Then the system should interact with Supabase to send a reset password email
And return a 200 OK response
