import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/better-auth";

interface RequestBody {
  token?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RequestBody;
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { valid: false, error: "Token is required" },
        { status: 400 }
      );
    }

    // Validate the session token using Better Auth
    const session = await auth.api.getSession({
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (!session?.user) {
      return NextResponse.json(
        { valid: false, error: "Invalid or expired session" },
        { status: 401 }
      );
    }

    // Return user information
    return NextResponse.json({
      valid: true,
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      },
    });
  } catch (error) {
    console.error("Session validation error:", error);
    return NextResponse.json(
      { valid: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Allow OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // In production, specify allowed origins
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

