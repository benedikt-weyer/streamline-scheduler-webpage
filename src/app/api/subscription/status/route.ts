import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  // Lazy load dependencies to avoid build-time initialization
  const { getSession } = await import("@/server/better-auth/server");
  const { db } = await import("@/server/db");
  
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user's active subscription
    const subscription = await db.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: {
          in: ["active", "trialing", "past_due"],
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!subscription) {
      return NextResponse.json({ subscription: null });
    }

    return NextResponse.json({
      subscription: {
        plan: subscription.plan,
        status: subscription.status,
        currentPeriodEnd: subscription.stripeCurrentPeriodEnd?.toISOString(),
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      },
    });
  } catch (error) {
    console.error("Subscription status error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}

