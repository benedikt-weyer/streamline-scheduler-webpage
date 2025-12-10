import Stripe from "stripe";
import { env } from "@/env";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-11-17.clover",
  typescript: true,
});

// Stripe Product IDs and Price IDs
// These should match your Stripe Dashboard products
export const STRIPE_PLANS = {
  PERSONAL_MANAGED_MONTHLY: {
    name: "Personal Managed (Monthly)",
    priceId: process.env.STRIPE_PRICE_PERSONAL_MANAGED_MONTHLY || "price_personal_managed_monthly",
    amount: 499, // €4.99 in cents
    interval: "month" as const,
  },
  PERSONAL_MANAGED_YEARLY: {
    name: "Personal Managed (Yearly)",
    priceId: process.env.STRIPE_PRICE_PERSONAL_MANAGED_YEARLY || "price_personal_managed_yearly",
    amount: 4900, // €49 in cents
    interval: "year" as const,
  },
  BUSINESS_MANAGED: {
    name: "Business Managed",
    priceId: process.env.STRIPE_PRICE_BUSINESS_MANAGED || "price_business_managed",
    amount: 1999, // €19.99 per user in cents
    interval: "month" as const,
  },
  BUSINESS_SELFHOSTED: {
    name: "Business Self-Hosted",
    priceId: process.env.STRIPE_PRICE_BUSINESS_SELFHOSTED || "price_business_selfhosted",
    amount: 999, // €9.99 per user in cents
    interval: "month" as const,
  },
} as const;

export type PlanType = keyof typeof STRIPE_PLANS;

/**
 * Get or create a Stripe customer for a user
 */
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string
): Promise<string> {
  // First, try to find existing customer by metadata
  const customers = await stripe.customers.list({
    email,
    limit: 1,
  });

  if (customers.data.length > 0) {
    return customers.data[0]!.id;
  }

  // Create new customer
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      userId,
    },
  });

  return customer.id;
}

/**
 * Create a checkout session for a subscription
 */
export async function createCheckoutSession(params: {
  customerId: string;
  priceId: string;
  quantity?: number;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.Checkout.Session> {
  const session = await stripe.checkout.sessions.create({
    customer: params.customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: params.priceId,
        quantity: params.quantity || 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: params.metadata,
    allow_promotion_codes: true,
    billing_address_collection: "required",
  });

  return session;
}

/**
 * Create a billing portal session for managing subscriptions
 */
export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  const subscription = await stripe.subscriptions.cancel(subscriptionId);
  return subscription;
}

/**
 * Get subscription details
 */
export async function getSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription | null> {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return null;
  }
}

