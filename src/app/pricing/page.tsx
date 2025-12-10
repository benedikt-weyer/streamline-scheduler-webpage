"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X, Server, Cloud, Users, Zap, Shield, HeartHandshake, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";

type PlanType = "PERSONAL_MANAGED_MONTHLY" | "PERSONAL_MANAGED_YEARLY" | "BUSINESS_MANAGED" | "BUSINESS_SELFHOSTED";

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null);

  const handleCheckout = async (plan: PlanType, quantity: number = 1) => {
    setLoadingPlan(plan);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan, quantity }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to start checkout. Please try again.");
      setLoadingPlan(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-muted/30 to-background py-20">
        <div className="container mx-auto max-w-screen-2xl px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Choose Your Plan
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Whether you prefer self-hosting or a managed solution, we have the perfect plan for you
          </p>
        </div>
      </section>

      {/* Managed Hosting Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-screen-2xl px-4">
          <div className="mb-12 text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <Cloud className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">Managed Hosting</h2>
            </div>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              We handle everything. You focus on your work.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Personal Managed */}
            <Card className="relative flex flex-col">
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <CardTitle className="text-2xl">Personal</CardTitle>
                  <Badge>Managed</Badge>
                </div>
                <CardDescription>
                  Hassle-free personal productivity, managed by us
                </CardDescription>
                <div className="mt-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">€4.99</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    or €49/year (save 18%)
                  </p>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <span>Unlimited calendars and tasks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <span>End-to-end encryption</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <span>99.9% uptime SLA</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <span>Automatic backups</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <span>5GB storage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <span>Email support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground/50" />
                    <span className="text-muted-foreground">Team features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground/50" />
                    <span className="text-muted-foreground">Custom domain</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleCheckout("PERSONAL_MANAGED_MONTHLY")}
                  disabled={loadingPlan !== null}
                >
                  {loadingPlan === "PERSONAL_MANAGED_MONTHLY" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Start Free Trial"
                  )}
                </Button>
              </CardFooter>
            </Card>

            {/* Business Managed */}
            <Card className="relative flex flex-col border-primary shadow-lg">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary px-4 py-1">Popular</Badge>
              </div>
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <CardTitle className="text-2xl">Business</CardTitle>
                  <Badge>Managed</Badge>
                </div>
                <CardDescription>
                  Enterprise-grade hosting with dedicated support
                </CardDescription>
                <div className="mt-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">€19.99</span>
                    <span className="text-muted-foreground">/user/month</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Minimum 5 users, billed annually
                  </p>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <span className="font-medium">Everything in Personal, plus:</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <span>Team collaboration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <span>50GB storage per user</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <span>Custom domain support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <span>Priority support (24/7)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <span>SSO/SAML integration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <span>Dedicated account manager</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => handleCheckout("BUSINESS_MANAGED", 5)}
                  disabled={loadingPlan !== null}
                >
                  {loadingPlan === "BUSINESS_MANAGED" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Get Started"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Self-Hosted Section */}
      <section className="border-t bg-muted/30 py-20">
        <div className="container mx-auto max-w-screen-2xl px-4">
          <div className="mb-12 text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <Server className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">Self-Hosted</h2>
            </div>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Deploy on your own infrastructure. Complete control and privacy.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Personal Self-Hosted */}
            <Card className="relative flex flex-col">
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <CardTitle className="text-2xl">Personal</CardTitle>
                  <Badge variant="secondary">Self-Hosted</Badge>
                </div>
                <CardDescription>
                  Perfect for individuals who want complete control of their data
                </CardDescription>
                <div className="mt-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">Free</span>
                    <span className="text-muted-foreground">forever</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <span>Unlimited calendars and tasks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <span>End-to-end encryption</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <span>Self-hosted on your infrastructure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <span>Community support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <span>Docker deployment included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <span>Regular updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground/50" />
                    <span className="text-muted-foreground">Priority support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground/50" />
                    <span className="text-muted-foreground">Team collaboration features</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="https://github.com/yourusername/streamline-scheduler">
                    View on GitHub
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Business Self-Hosted */}
            <Card className="relative flex flex-col">
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <CardTitle className="text-2xl">Business</CardTitle>
                  <Badge variant="secondary">Self-Hosted</Badge>
                </div>
                <CardDescription>
                  For teams and organizations requiring enterprise features
                </CardDescription>
                <div className="mt-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">€9.99</span>
                    <span className="text-muted-foreground">/user/month</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Minimum 3 users, billed monthly or annually
                  </p>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <span className="font-medium">Everything in Personal, plus:</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <span>Priority email support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <span>Team collaboration features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <span>Advanced admin controls</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <span>Multi-user management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <span>Custom branding options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <span>Setup assistance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <span>Priority updates</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => handleCheckout("BUSINESS_SELFHOSTED", 3)}
                  disabled={loadingPlan !== null}
                >
                  {loadingPlan === "BUSINESS_SELFHOSTED" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Get Started"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="border-t py-20">
        <div className="container mx-auto max-w-screen-2xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Why Choose Streamline?</h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Privacy First</h3>
              <p className="text-muted-foreground">
                End-to-end encryption ensures your data stays private, whether self-hosted or managed
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Fast & Efficient</h3>
              <p className="text-muted-foreground">
                Built with modern technologies for blazing-fast performance and real-time sync
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <HeartHandshake className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Open Source</h3>
              <p className="text-muted-foreground">
                Fully open source with an active community. Contribute, customize, and own your data
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t bg-muted/30 py-20">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-lg font-semibold">What's included in the free self-hosted version?</h3>
              <p className="text-muted-foreground">
                The free version includes all core features: unlimited calendars, tasks, end-to-end encryption, 
                and community support. Perfect for personal use.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold">How does the business subscription work?</h3>
              <p className="text-muted-foreground">
                The business subscription gives you access to enterprise features, priority support, and regular updates. 
                You can choose between monthly or annual billing (annual saves 20%). Cancel anytime.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold">Can I migrate from self-hosted to managed?</h3>
              <p className="text-muted-foreground">
                Yes! We provide migration tools to easily move your data from self-hosted to our managed platform. 
                Contact our support team for assistance with the migration process.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold">Is my data safe with end-to-end encryption?</h3>
              <p className="text-muted-foreground">
                Absolutely. All your data is encrypted on your device before being stored. Even we can't 
                read your data - only you have the encryption keys.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">
                We accept all major credit cards, PayPal, and SEPA direct debit. Business customers can also 
                choose annual invoicing for easier accounting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t py-20">
        <div className="container mx-auto max-w-screen-2xl px-4">
          <div className="rounded-lg border bg-card p-12 text-center shadow-lg">
            <h2 className="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
            <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
              Choose managed hosting for hassle-free operation, or self-host for complete control
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/register">
                  Create Free Account
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="https://github.com/yourusername/streamline-scheduler">
                  View on GitHub
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto max-w-screen-2xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2025 Streamline. Licensed for personal self-hosting.
            </p>
            <div className="flex gap-4">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                Home
              </Link>
              <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">
                Pricing
              </Link>
              <Link href="https://github.com/yourusername/streamline-scheduler" className="text-sm text-muted-foreground hover:text-foreground">
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

