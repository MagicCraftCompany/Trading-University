# Authentication System Documentation

This document explains how the authentication system works in the Trading University platform.

## Overview

The authentication system supports three main paths:
1. Email/password login
2. Google OAuth login
3. YouTube membership verification

## Environment Variables

Make sure you have the following environment variables set in your `.env` file:

```
# General Auth
JWT_SECRET=your_jwt_secret_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# YouTube API
YOUTUBE_CLIENT_ID=your_youtube_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret
YOUTUBE_CHANNEL_ID=UC9RRYB9wpfAKPy95OSUdzDw

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Authentication Flow

### Email/Password Authentication

1. User enters email and password on the login page
2. Form submits to `/api/auth/login` endpoint
3. Server verifies credentials against the database
4. On successful authentication, a JWT token is generated and returned
5. Token is stored in both localStorage and cookies
6. User is redirected to the login success page

### Google OAuth Authentication

1. User clicks "Sign in with Google" button on the login page
2. User is redirected to the Google OAuth consent screen
3. After user grants permission, Google redirects back to `/api/auth/google/callback` endpoint
4. Server verifies the Google OAuth code and retrieves user information
5. Server checks if a user with the provided email exists in the database
6. If user exists, updates the user's Google ID and last login time
7. Creates a JWT token with user info and subscription status
8. Redirects to login page with success parameters, where token is stored in localStorage and cookies

### YouTube Membership Verification

1. User clicks "Login with YouTube Membership" button on the login page
2. User is redirected to Google OAuth consent screen with YouTube API scopes
3. After user grants permission, Google redirects back to `/api/auth/youtube-callback` endpoint
4. Server exchanges the authorization code for tokens
5. Retrieves the user's YouTube channel information
6. Checks if the user is a member of the specified YouTube channel (UC9RRYB9wpfAKPy95OSUdzDw)
7. If membership is verified, creates a new user account or updates the existing one
8. Creates a JWT token with YouTube membership status
9. Redirects to login page with success parameters, where token is stored

## Access Control

The middleware (`src/middleware.ts`) handles access control:

1. Public routes are accessible without authentication
2. Protected routes require a valid token
3. If a token is present but invalid, user is redirected to login
4. If subscription is expired but user has YouTube membership, access is granted
5. If neither a valid subscription nor YouTube membership is found, user is redirected to the checkout page

## User Types

1. **Regular Users**
   - Registered with email and password
   - Need an active subscription to access content

2. **Google OAuth Users**
   - Authenticated through Google
   - Still need an active subscription to access content

3. **YouTube Members**
   - Verified members of our YouTube channel
   - Can access content without a separate subscription

## Implementation Details

### JWT Structure

The JWT token payload includes:
- `userId`: The user's ID in the database
- `email`: User's email address
- `provider`: Authentication provider (GOOGLE or EMAIL)
- `youTubeMember`: Boolean flag for YouTube membership status
- `subscriptionStatus`: The status of the user's subscription

### Session Management

- JWT tokens expire after 7 days
- User's last login time is updated on each successful login
- A user's subscription status is checked on each protected route access

## Troubleshooting

### Google Authentication Not Working

1. Verify your Google OAuth credentials in the Google Cloud Console
2. Ensure the authorized redirect URIs are correctly set
3. Check the server logs for detailed error messages

### YouTube Membership Verification Not Working

1. Ensure you've enabled the YouTube Data API v3 in Google Cloud Console
2. Verify you have the correct YouTube channel ID
3. Make sure the required scopes are included in the authentication request

## Security Considerations

1. Passwords are hashed using bcrypt before storage
2. JWT tokens are signed with a secure key
3. OAuth states are used to prevent CSRF attacks
4. Access tokens are never exposed to the client
5. Sensitive operations are protected by middleware checks 