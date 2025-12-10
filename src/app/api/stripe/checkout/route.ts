import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/server/better-auth/server";
import { createCheckoutSession, getOrCreateStripeCustomer, STRIPE_PLANS, type PlanType } from "@/lib/stripe";
import { db } from "@/server/db";

interface CheckoutRequest {
  plan: PlanType;
  quantity?: number;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = (await request.json()) as CheckoutRequest;
    const { plan, quantity = 1 } = body;

    if (!plan || !(plan in STRIPE_PLANS)) {
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 }
      );
    }

    const planDetails = STRIPE_PLANS[plan];

    // Get or create Stripe customer
    const stripeCustomerId = await getOrCreateStripeCustomer(
      session.user.id,
      session.user.email,
      session.user.name
    );

    // Create checkout session
    const origin = request.headers.get("origin") || "http://localhost:2999";
    const checkoutSession = await createCheckoutSession({
      customerId: stripeCustomerId,
      priceId: planDetails.priceId,
      quantity,
      successUrl: `${origin}/profile?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/pricing?canceled=true`,
      metadata: {
        userId: session.user.id,
        plan,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

