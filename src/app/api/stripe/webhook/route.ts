import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  // Lazy load dependencies to avoid build-time initialization
  const { stripe } = await import("@/lib/stripe");
  const { db } = await import("@/server/db");
  const { env } = await import("@/env");
  
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session, stripe, db);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription, stripe, db);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription, db);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice, stripe, db);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice, db);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
  stripe: Stripe,
  db: any
) {
  const userId = session.metadata?.userId;
  const plan = session.metadata?.plan;

  if (!userId || !plan) {
    console.error("Missing metadata in checkout session");
    return;
  }

  if (!session.subscription) {
    console.error("No subscription ID in checkout session");
    return;
  }

  const subscriptionId = typeof session.subscription === "string" 
    ? session.subscription 
    : session.subscription.id;

  // Get the subscription details from Stripe
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Create subscription record
  await db.subscription.create({
    data: {
      userId,
      stripeSubscriptionId: subscriptionId,
      stripePriceId: subscription.items.data[0]!.price.id,
      stripeCurrentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      status: subscription.status,
      plan,
      quantity: subscription.items.data[0]!.quantity || 1,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });

  console.log(`Subscription created for user ${userId}: ${subscriptionId}`);
}

async function handleSubscriptionUpdate(
  subscription: Stripe.Subscription,
  stripe: Stripe,
  db: any
) {
  const existingSubscription = await db.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!existingSubscription) {
    console.error(`Subscription not found: ${subscription.id}`);
    return;
  }

  await db.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      stripePriceId: subscription.items.data[0]!.price.id,
      stripeCurrentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      status: subscription.status,
      quantity: subscription.items.data[0]!.quantity || 1,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });

  console.log(`Subscription updated: ${subscription.id}`);
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  db: any
) {
  await db.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: "canceled",
      cancelAtPeriodEnd: false,
    },
  });

  console.log(`Subscription deleted: ${subscription.id}`);
}

async function handleInvoicePaymentSucceeded(
  invoice: Stripe.Invoice,
  stripe: Stripe,
  db: any
) {
  const sub = (invoice as any).subscription as string | Stripe.Subscription | null;
  if (!sub) {
    return;
  }

  const subscriptionId = typeof sub === "string"
    ? sub
    : sub.id;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  await db.subscription.update({
    where: { stripeSubscriptionId: subscriptionId },
    data: {
      status: subscription.status,
      stripeCurrentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
    },
  });

  console.log(`Invoice payment succeeded for subscription: ${subscriptionId}`);
}

async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice,
  db: any
) {
  const sub = (invoice as any).subscription as string | Stripe.Subscription | null;
  if (!sub) {
    return;
  }

  const subscriptionId = typeof sub === "string"
    ? sub
    : sub.id;

  await db.subscription.update({
    where: { stripeSubscriptionId: subscriptionId },
    data: {
      status: "past_due",
    },
  });

  console.log(`Invoice payment failed for subscription: ${subscriptionId}`);
}

