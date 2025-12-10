import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/server/better-auth/server";
import { createBillingPortalSession } from "@/lib/stripe";
import { db } from "@/server/db";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user with Stripe customer ID
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true },
    });

    if (!user?.stripeCustomerId) {
      return NextResponse.json(
        { error: "No Stripe customer found" },
        { status: 404 }
      );
    }

    // Create billing portal session
    const origin = request.headers.get("origin") || "http://localhost:2999";
    const portalSession = await createBillingPortalSession(
      user.stripeCustomerId,
      `${origin}/profile`
    );

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Portal session error:", error);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}

