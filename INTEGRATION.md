# Streamline Account Integration Guide

This guide explains how to integrate Streamline applications with the centralized Streamline Account authentication system.

## Overview

The Streamline Account system provides centralized authentication for all Streamline applications. Users create a single account that can be used across multiple applications like Streamline Scheduler, and future Streamline apps.

## Architecture

- **Authentication Server**: This Next.js application (streamline-scheduler-webpage)
- **Better Auth**: Handles authentication with email/password and optional OAuth providers
- **Client Applications**: Streamline Scheduler and other apps that use this authentication

## Integration Steps for Streamline Scheduler

### 1. Environment Variables

In your Streamline Scheduler application, add:

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

In your Streamline Scheduler frontend, add a "Sign in with Streamline Account" option:

```typescript
// Example integration code
import { authClient } from '@/lib/auth-client';

export async function signInWithStreamline() {
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

1. User clicks "Sign in with Streamline Account" in Scheduler
2. User is redirected to the auth server (this application)
3. User logs in or registers
4. User is redirected back to Scheduler with a session token
5. Scheduler validates the token with the auth server
6. User is authenticated in Scheduler

## Security Considerations

- Always use HTTPS in production
- Implement CORS properly to only allow your applications
- Session tokens should be short-lived and rotated regularly
- Implement rate limiting on the validation endpoint
- Consider using JWT tokens for stateless authentication

## Future Enhancements

- OAuth 2.0 / OpenID Connect support
- Single Sign-On (SSO) across all Streamline applications
- Multi-factor authentication (MFA)
- Session management dashboard
- API key generation for third-party integrations

