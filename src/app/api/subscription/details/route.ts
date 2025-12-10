import { NextResponse } from "next/server";
import { getSession } from "@/server/better-auth/server";
import { db } from "@/server/db";

export async function GET() {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get all subscriptions for the user
    const subscriptions = await db.subscription.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Find the current active subscription
    const currentSubscription = subscriptions.find((sub) =>
      ["active", "trialing", "past_due"].includes(sub.status)
    );

    // Get historical subscriptions (canceled or expired)
    const historySubscriptions = subscriptions.filter((sub) =>
      sub.id !== currentSubscription?.id &&
      ["canceled", "incomplete_expired", "unpaid"].includes(sub.status)
    );

    return NextResponse.json({
      current: currentSubscription
        ? {
            id: currentSubscription.id,
            plan: currentSubscription.plan,
            status: currentSubscription.status,
            currentPeriodEnd: currentSubscription.stripeCurrentPeriodEnd?.toISOString(),
            cancelAtPeriodEnd: currentSubscription.cancelAtPeriodEnd,
            quantity: currentSubscription.quantity,
            createdAt: currentSubscription.createdAt.toISOString(),
          }
        : null,
      history: historySubscriptions.map((sub) => ({
        id: sub.id,
        plan: sub.plan,
        status: sub.status,
        currentPeriodEnd: sub.stripeCurrentPeriodEnd?.toISOString(),
        cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
        quantity: sub.quantity,
        createdAt: sub.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Subscription details error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription details" },
      { status: 500 }
    );
  }
}

