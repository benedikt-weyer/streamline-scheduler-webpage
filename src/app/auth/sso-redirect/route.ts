import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/server/better-auth/server";

/**
 * SSO Redirect endpoint
 * This handles redirecting authenticated users back to applications with their session token
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const callback = searchParams.get("callback");
  const app = searchParams.get("app");

  // Validate callback URL
  if (!callback) {
    return NextResponse.json(
      { error: "Missing callback URL" },
      { status: 400 }
    );
  }

  try {
    // Get the current session
    const session = await getSession();

    if (!session?.user) {
      // User not authenticated, redirect to login with callback preserved
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callback", callback);
      if (app) {
        loginUrl.searchParams.set("app", app);
      }
      return NextResponse.redirect(loginUrl);
    }

    // User is authenticated, redirect back to app with token
    const callbackUrl = new URL(decodeURIComponent(callback));
    
    // Get the session token to pass to the application
    // The token is typically in cookies, we need to extract it
    const cookies = request.cookies;
    const sessionToken = cookies.get("better-auth.session_token")?.value;

    if (sessionToken) {
      callbackUrl.searchParams.set("token", sessionToken);
    }

    if (app) {
      callbackUrl.searchParams.set("app", app);
    }

    return NextResponse.redirect(callbackUrl);
  } catch (error) {
    console.error("SSO redirect error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

