import { NextResponse } from "next/server";
import { getSession } from "@/server/better-auth/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/server/db";

/**
 * Manual sync endpoint to pull subscriptions from Stripe
 * Useful when webhooks weren't set up initially
 */
export async function POST() {
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
      select: { 
        id: true,
        email: true,
        stripeCustomerId: true 
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    let customerId = user.stripeCustomerId;

    // If no customer ID, try to find customer by email
    if (!customerId) {
      const customers = await stripe.customers.list({
        email: user.email,
        limit: 1,
      });

      if (customers.data.length > 0) {
        customerId = customers.data[0]!.id;
        
        // Update user with customer ID
        await db.user.update({
          where: { id: user.id },
          data: { stripeCustomerId: customerId },
        });
      } else {
        return NextResponse.json(
          { error: "No Stripe customer found for this user" },
          { status: 404 }
        );
      }
    }

    // Fetch all subscriptions for this customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 100,
    });

    let syncedCount = 0;
    const errors: string[] = [];

    for (const subscription of subscriptions.data) {
      try {
        // Check if subscription already exists
        const existing = await db.subscription.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        });

        // Determine plan type from price ID or metadata
        const priceId = subscription.items.data[0]?.price.id;
        let plan = "PERSONAL_MANAGED_MONTHLY"; // default
        
        // Try to match price ID to plan
        if (priceId) {
          const planMapping: Record<string, string> = {
            [process.env.STRIPE_PRICE_PERSONAL_MANAGED_MONTHLY || ""]: "PERSONAL_MANAGED_MONTHLY",
            [process.env.STRIPE_PRICE_PERSONAL_MANAGED_YEARLY || ""]: "PERSONAL_MANAGED_YEARLY",
            [process.env.STRIPE_PRICE_BUSINESS_MANAGED || ""]: "BUSINESS_MANAGED",
            [process.env.STRIPE_PRICE_BUSINESS_SELFHOSTED || ""]: "BUSINESS_SELFHOSTED",
          };
          
          plan = planMapping[priceId] || subscription.metadata.plan || "PERSONAL_MANAGED_MONTHLY";
        }

        if (existing) {
          // Update existing subscription
          await db.subscription.update({
            where: { stripeSubscriptionId: subscription.id },
            data: {
              stripePriceId: subscription.items.data[0]!.price.id,
              stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
              status: subscription.status,
              plan,
              quantity: subscription.items.data[0]?.quantity || 1,
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
            },
          });
        } else {
          // Create new subscription
          await db.subscription.create({
            data: {
              userId: user.id,
              stripeSubscriptionId: subscription.id,
              stripePriceId: subscription.items.data[0]!.price.id,
              stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
              status: subscription.status,
              plan,
              quantity: subscription.items.data[0]?.quantity || 1,
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
            },
          });
        }

        syncedCount++;
      } catch (error) {
        console.error(`Failed to sync subscription ${subscription.id}:`, error);
        errors.push(`Failed to sync ${subscription.id}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${syncedCount} subscription(s)`,
      syncedCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Subscription sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync subscriptions" },
      { status: 500 }
    );
  }
}

