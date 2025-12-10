"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/server/better-auth/client";
import { 
  Calendar, 
  CreditCard, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  ArrowRight,
  ExternalLink
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Subscription {
  id: string;
  plan: string;
  status: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  quantity: number;
  createdAt: string;
}

interface SubscriptionDetails {
  current: Subscription | null;
  history: Subscription[];
}

export default function SubscriptionsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const session = await authClient.getSession();
        
        if (!session?.data?.user) {
          router.push("/login");
          return;
        }

        setUser(session.data.user);

        // Fetch detailed subscription info
        const response = await fetch("/api/subscription/details");
        if (response.ok) {
          const data = (await response.json()) as SubscriptionDetails;
          setSubscriptionDetails(data);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, [router]);

  const handleManageBilling = async () => {
    setIsLoadingPortal(true);
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error ?? "Failed to create portal session");
      }
    } catch (error) {
      console.error("Portal error:", error);
      alert("Failed to open billing portal. Please try again.");
      setIsLoadingPortal(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "trialing":
        return <Clock className="h-5 w-5 text-blue-600" />;
      case "past_due":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case "canceled":
        return <XCircle className="h-5 w-5 text-gray-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      active: { label: "Active", variant: "default" },
      trialing: { label: "Trial", variant: "secondary" },
      past_due: { label: "Past Due", variant: "destructive" },
      canceled: { label: "Canceled", variant: "outline" },
      incomplete: { label: "Incomplete", variant: "outline" },
    };

    const config = statusConfig[status] ?? { label: status, variant: "outline" as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPlanName = (plan: string) => {
    const planNames: Record<string, string> = {
      PERSONAL_MANAGED_MONTHLY: "Personal Managed (Monthly)",
      PERSONAL_MANAGED_YEARLY: "Personal Managed (Yearly)",
      BUSINESS_MANAGED: "Business Managed",
      BUSINESS_SELFHOSTED: "Business Self-Hosted",
    };
    return planNames[plan] ?? plan;
  };

  const getPlanPrice = (plan: string) => {
    const planPrices: Record<string, string> = {
      PERSONAL_MANAGED_MONTHLY: "€4.99/month",
      PERSONAL_MANAGED_YEARLY: "€49/year",
      BUSINESS_MANAGED: "€19.99/user/month",
      BUSINESS_SELFHOSTED: "€9.99/user/month",
    };
    return planPrices[plan] ?? "";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Subscriptions</h1>
        <p className="text-muted-foreground">Manage your Streamline subscriptions and billing</p>
      </div>

      {/* Current Subscription */}
      {subscriptionDetails?.current ? (
        <div>
          <h2 className="mb-4 text-xl font-semibold">Current Subscription</h2>
            
            <Card className="border-primary/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(subscriptionDetails.current.status)}
                    <div>
                      <CardTitle className="text-2xl">
                        {getPlanName(subscriptionDetails.current.plan)}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {getPlanPrice(subscriptionDetails.current.plan)}
                        {subscriptionDetails.current.quantity > 1 && ` × ${subscriptionDetails.current.quantity} users`}
                      </CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(subscriptionDetails.current.status)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <Separator />
                
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Current Period</span>
                    </div>
                    <p className="font-medium">
                      {subscriptionDetails.current.cancelAtPeriodEnd ? "Ends" : "Renews"} on{" "}
                      {new Date(subscriptionDetails.current.currentPeriodEnd).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Started</span>
                    </div>
                    <p className="font-medium">
                      {new Date(subscriptionDetails.current.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {subscriptionDetails.current.cancelAtPeriodEnd && (
                  <div className="rounded-lg border border-yellow-600/20 bg-yellow-600/10 p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="font-medium text-yellow-600">Subscription Ending</p>
                        <p className="text-sm text-muted-foreground">
                          Your subscription will end on{" "}
                          {new Date(subscriptionDetails.current.currentPeriodEnd).toLocaleDateString()}.
                          You can reactivate it anytime before then.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={handleManageBilling}
                  disabled={isLoadingPortal}
                  className="w-full gap-2 sm:w-auto"
                >
                  {isLoadingPortal ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      Manage Billing
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full gap-2 sm:w-auto"
                  onClick={() => router.push("/pricing")}
                >
                  View All Plans
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div>
            <Card>
              <CardHeader>
                <CardTitle>No Active Subscription</CardTitle>
                <CardDescription>
                  You don&apos;t have an active subscription. Choose a plan to get started.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button onClick={() => router.push("/pricing")} className="gap-2">
                  View Plans
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

      {/* Subscription History */}
      {subscriptionDetails?.history && subscriptionDetails.history.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">Subscription History</h2>
            
            <div className="space-y-4">
              {subscriptionDetails.history.map((subscription) => (
                <Card key={subscription.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {getPlanName(subscription.plan)}
                        </CardTitle>
                        <CardDescription>
                          {new Date(subscription.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                          {" - "}
                          {new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </CardDescription>
                      </div>
                      {getStatusBadge(subscription.status)}
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Need Help?</h2>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Billing Portal</CardTitle>
                <CardDescription>
                  Update payment methods, view invoices, and manage your subscription
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  variant="outline"
                  onClick={handleManageBilling}
                  disabled={isLoadingPortal || !subscriptionDetails?.current}
                  className="w-full gap-2"
                >
                  Open Portal
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Change Plan</CardTitle>
                <CardDescription>
                  Upgrade, downgrade, or switch between plans
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  variant="outline"
                  onClick={() => router.push("/pricing")}
                  className="w-full gap-2"
                >
                  View Plans
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Support</CardTitle>
                <CardDescription>
                  Get help with billing or subscription issues
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  variant="outline"
                  asChild
                  className="w-full gap-2"
                >
                  <a href="mailto:support@streamline.com">
                    Contact Support
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </div>
      </div>
    </div>
  );
}

