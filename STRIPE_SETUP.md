# Stripe Payment Integration Setup Guide

This guide walks you through setting up Stripe payments for the Streamline Account platform.

## Prerequisites

- Stripe account (sign up at [stripe.com](https://stripe.com))
- Access to Stripe Dashboard
- Node.js and pnpm installed
- Database running (PostgreSQL)

## Step 1: Database Migration

First, update your database schema to include the subscription model:

```bash
cd streamline-scheduler-webpage
pnpm db:push
```

This will add:
- `stripeCustomerId` field to the User model
- New `Subscription` model for tracking subscriptions

## Step 2: Get Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **API keys**
3. Copy your keys:
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)

## Step 3: Create Products in Stripe

Create the following products in your Stripe Dashboard:

### 1. Personal Managed (Monthly)
- Go to **Products** → **Add product**
- Name: "Personal Managed (Monthly)"
- Price: €4.99
- Billing period: Monthly
- Copy the **Price ID** (starts with `price_`)

### 2. Personal Managed (Yearly)
- Name: "Personal Managed (Yearly)"
- Price: €49.00
- Billing period: Yearly
- Copy the **Price ID**

### 3. Business Managed
- Name: "Business Managed"
- Price: €19.99
- Billing period: Monthly
- Copy the **Price ID**

### 4. Business Self-Hosted
- Name: "Business Self-Hosted"
- Price: €9.99
- Billing period: Monthly
- Copy the **Price ID**

## Step 4: Configure Environment Variables

Update your `.env` file:

```bash
# Stripe Keys
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..." # We'll set this up next
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Optional: Override default price IDs
STRIPE_PRICE_PERSONAL_MANAGED_MONTHLY="price_..."
STRIPE_PRICE_PERSONAL_MANAGED_YEARLY="price_..."
STRIPE_PRICE_BUSINESS_MANAGED="price_..."
STRIPE_PRICE_BUSINESS_SELFHOSTED="price_..."
```

## Step 5: Set Up Stripe Webhook

### For Development (using Stripe CLI)

1. Install Stripe CLI:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Linux
   wget https://github.com/stripe/stripe-cli/releases/latest/download/stripe_X.X.X_linux_x86_64.tar.gz
   tar -xvf stripe_X.X.X_linux_x86_64.tar.gz
   ```

2. Login to Stripe:
   ```bash
   stripe login
   ```

3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:2999/api/stripe/webhook
   ```

4. Copy the webhook signing secret (starts with `whsec_`) and add it to `.env`:
   ```bash
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

### For Production

1. Go to **Developers** → **Webhooks** in Stripe Dashboard
2. Click **Add endpoint**
3. Set endpoint URL: `https://yourdomain.com/api/stripe/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing secret** and add to production environment variables

## Step 6: Configure Stripe Customer Portal

1. Go to **Settings** → **Billing** → **Customer portal** in Stripe Dashboard
2. Enable the customer portal
3. Configure what customers can do:
   - ✅ Update payment method
   - ✅ View invoices
   - ✅ Cancel subscription
   - ✅ Update subscription (optional)
4. Set your business information
5. Customize the portal appearance (optional)

## Step 7: Test the Integration

### Start the Development Server

```bash
# Terminal 1: Start the app
pnpm dev

# Terminal 2: Forward Stripe webhooks
stripe listen --forward-to localhost:2999/api/stripe/webhook
```

### Test Checkout Flow

1. Navigate to `http://localhost:2999/pricing`
2. Click on any "Get Started" button
3. Use Stripe test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Any postal code
4. Complete the payment
5. You should be redirected to your profile
6. Check the Stripe Dashboard to see the subscription

### Test Cards

Stripe provides test cards for different scenarios:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires authentication**: `4000 0025 0000 3155`
- **Insufficient funds**: `4000 0000 0000 9995`

See [full list of test cards](https://stripe.com/docs/testing#cards)

### Test Webhook Events

```bash
# Trigger a test webhook
stripe trigger checkout.session.completed
```

## Step 8: Verify Database

Check that subscriptions are being created:

```bash
pnpm db:studio
```

Look for records in the `subscription` table.

## API Endpoints

The integration includes these endpoints:

### `/api/stripe/checkout` (POST)
Creates a Stripe Checkout session for subscribing to a plan.

**Request:**
```json
{
  "plan": "PERSONAL_MANAGED_MONTHLY",
  "quantity": 1
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

### `/api/stripe/webhook` (POST)
Handles Stripe webhook events. This endpoint is called by Stripe, not your frontend.

### `/api/stripe/portal` (POST)
Creates a billing portal session for users to manage their subscription.

**Response:**
```json
{
  "url": "https://billing.stripe.com/..."
}
```

### `/api/subscription/status` (GET)
Returns the current user's subscription status.

**Response:**
```json
{
  "subscription": {
    "plan": "PERSONAL_MANAGED_MONTHLY",
    "status": "active",
    "currentPeriodEnd": "2025-02-10T00:00:00.000Z",
    "cancelAtPeriodEnd": false
  }
}
```

## Subscription Lifecycle

1. **User clicks "Get Started"** → Redirects to Stripe Checkout
2. **User completes payment** → Stripe fires `checkout.session.completed` webhook
3. **Webhook handler** → Creates `Subscription` record in database
4. **User returns to app** → Sees subscription on profile page
5. **User clicks "Manage Billing"** → Opens Stripe Customer Portal
6. **User modifies subscription** → Stripe fires update/delete webhooks
7. **Webhook handler** → Updates `Subscription` record

## Subscription Statuses

- `active` - Subscription is active and paid
- `trialing` - In trial period (if enabled)
- `past_due` - Payment failed, retry in progress
- `canceled` - Subscription has been canceled
- `incomplete` - Initial payment failed
- `incomplete_expired` - Initial payment failed and expired
- `unpaid` - Payment overdue beyond retry period

## Monitoring

### Stripe Dashboard

Monitor your subscriptions in real-time:
- **Payments** - View all successful and failed payments
- **Subscriptions** - See all active subscriptions
- **Customers** - View customer details
- **Logs** - Check webhook delivery logs

### Application Logs

Check your application logs for webhook processing:

```bash
# View logs in development
tail -f logs/stripe.log
```

## Troubleshooting

### Webhook Not Receiving Events

1. Check that Stripe CLI is running: `stripe listen`
2. Verify webhook secret matches in `.env`
3. Check firewall/network settings
4. Review Stripe webhook logs in Dashboard

### Payment Not Creating Subscription

1. Check webhook logs in Stripe Dashboard
2. Verify `checkout.session.completed` event was sent
3. Check application logs for errors
4. Ensure database schema is up to date

### Customer Portal Not Working

1. Verify customer portal is enabled in Stripe Dashboard
2. Check that user has `stripeCustomerId` in database
3. Ensure user has an active subscription

### Test Mode vs Live Mode

- Always use **test mode** keys (starting with `sk_test_` and `pk_test_`) during development
- Switch to **live mode** keys only in production
- Test and live mode data are completely separate

## Going to Production

Before launching:

1. ✅ Switch to live mode API keys
2. ✅ Set up production webhook endpoint
3. ✅ Test with real (small amount) transactions
4. ✅ Enable fraud protection in Stripe Dashboard
5. ✅ Set up email notifications for failed payments
6. ✅ Configure subscription email notifications
7. ✅ Add terms of service and privacy policy links
8. ✅ Test subscription cancellation flow
9. ✅ Set up monitoring and alerts
10. ✅ Document subscription management for support team

## Security Best Practices

1. **Never expose secret keys** - Only use in server-side code
2. **Validate webhook signatures** - Always verify using webhook secret
3. **Use HTTPS in production** - Required for PCI compliance
4. **Implement rate limiting** - Protect API endpoints
5. **Log but don't store** - Log events but never store full card numbers
6. **Regular key rotation** - Rotate API keys periodically
7. **Monitor for fraud** - Use Stripe Radar

## Support

- **Stripe Documentation**: [stripe.com/docs](https://stripe.com/docs)
- **Stripe Support**: support@stripe.com
- **Testing Guide**: [stripe.com/docs/testing](https://stripe.com/docs/testing)
- **API Reference**: [stripe.com/docs/api](https://stripe.com/docs/api)

## Next Steps

1. Customize email receipts in Stripe Dashboard
2. Add subscription upgrade/downgrade flows
3. Implement usage-based billing (if needed)
4. Add promotional codes support
5. Set up subscription analytics
6. Create admin dashboard for subscription management

---

**Note**: This setup uses Stripe Checkout for simplicity. For custom payment flows, consider implementing Stripe Elements or Payment Element.

