# Plandera Account Integration Guide

This guide explains how to integrate Plandera applications with the centralized Plandera Account authentication system.

## Overview

The Plandera Account system provides centralized authentication for all Plandera applications. Users create a single account that can be used across multiple applications.

## Architecture

- **Authentication Server**: This Next.js application (plandera-webpage)
- **Better Auth**: Handles authentication with email/password and optional OAuth providers
- **Client Applications**: Plandera and other apps that use this authentication

## Integration Steps for Plandera

### 1. Environment Variables

In your Plandera application, add:

```bash
# .env.local
NEXT_PUBLIC_AUTH_SERVER_URL=http://localhost:3001  # URL of this auth server
```

### 2. Session Validation API

The authentication server provides an API endpoint for validating sessions:

**Endpoint**: `POST /api/auth/validate-session`

**Request**:
```json
{
  "token": "session_token_here"
}
```

**Response** (Success):
```json
{
  "valid": true,
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

**Response** (Invalid):
```json
{
  "valid": false,
  "error": "Invalid or expired session"
}
```

### 3. Client-Side Integration

In your Plandera frontend, add a "Sign in with Plandera Account" option:

```typescript
// Example integration code
import { authClient } from '@/lib/auth-client';

export async function signInWithPlandera() {
  // Redirect to the auth server login page with a callback URL
  const authServerUrl = process.env.NEXT_PUBLIC_AUTH_SERVER_URL;
  const callbackUrl = encodeURIComponent(window.location.origin + '/auth/callback');
  
  window.location.href = `${authServerUrl}/login?callback=${callbackUrl}`;
}

// On the callback page, extract the session token and validate it
export async function handleAuthCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  
  if (token) {
    // Store the token and validate it with your backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVER_URL}/api/auth/validate-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    
    const data = await response.json();
    
    if (data.valid) {
      // User is authenticated, proceed with your app logic
      return data.user;
    }
  }
  
  return null;
}
```

### 4. User Flow

1. User clicks "Sign in with Plandera Account" in the application
2. User is redirected to the auth server (this application)
3. User logs in or registers
4. User is redirected back to the application with a session token
5. Application validates the token with the auth server
6. User is authenticated in the application

## Security Considerations

- Always use HTTPS in production
- Implement CORS properly to only allow your applications
- Session tokens should be short-lived and rotated regularly
- Implement rate limiting on the validation endpoint
- Consider using JWT tokens for stateless authentication

## Future Enhancements

- OAuth 2.0 / OpenID Connect support
- Single Sign-On (SSO) across all Plandera applications
- Multi-factor authentication (MFA)
- Session management dashboard
- API key generation for third-party integrations

