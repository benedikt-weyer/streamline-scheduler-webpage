"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import { authClient } from "@/server/better-auth/client";
import { Calendar, Loader2, ExternalLink, LogOut, CreditCard } from "lucide-react";
import { env } from "@/env";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface Subscription {
  plan: string;
  status: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await authClient.getSession();
        
        if (!session?.data?.user) {
          router.push("/login");
          return;
        }

        setUser(session.data.user);

        // Fetch subscription status
        try {
          const subResponse = await fetch("/api/subscription/status");
          if (subResponse.ok) {
            const subData = await subResponse.json();
            setSubscription(subData.subscription);
          }
        } catch (error) {
          console.error("Failed to fetch subscription:", error);
        }
      } catch (error) {
        console.error("Failed to get session:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.push("/");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  const handleLaunchScheduler = () => {
    // Open the scheduler in a new tab
    const schedulerUrl = env.NEXT_PUBLIC_STREAMLINE_SCHEDULER_URL;
    window.open(schedulerUrl, "_blank");
  };

  const handleManageBilling = async () => {
    setIsLoadingPortal(true);
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create portal session");
      }
    } catch (error) {
      console.error("Portal error:", error);
      alert("Failed to open billing portal. Please try again.");
      setIsLoadingPortal(false);
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

    const config = statusConfig[status] || { label: status, variant: "outline" };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPlanName = (plan: string) => {
    const planNames: Record<string, string> = {
      PERSONAL_MANAGED_MONTHLY: "Personal (Monthly)",
      PERSONAL_MANAGED_YEARLY: "Personal (Yearly)",
      BUSINESS_MANAGED: "Business Managed",
      BUSINESS_SELFHOSTED: "Business Self-Hosted",
    };
    return planNames[plan] || plan;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <div className="container mx-auto flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <div className="container mx-auto max-w-screen-xl px-4 py-20">
        {/* Profile Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Applications Section */}
        <div>
          <h2 className="mb-6 text-2xl font-semibold">Your Applications</h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Streamline Scheduler App Card */}
            <Card className="group transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Streamline Scheduler</CardTitle>
                <CardDescription>
                  Manage your calendar and tasks with end-to-end encryption
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full gap-2 group-hover:bg-primary/90" 
                  onClick={handleLaunchScheduler}
                >
                  Launch Application
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Placeholder for future apps */}
            <Card className="border-dashed opacity-50">
              <CardHeader>
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-muted">
                  <span className="text-2xl">+</span>
                </div>
                <CardTitle>More Apps Coming Soon</CardTitle>
                <CardDescription>
                  Stay tuned for more Streamline applications
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Subscription Section */}
        {subscription && (
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-semibold">Subscription</h2>
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{getPlanName(subscription.plan)}</CardTitle>
                    <CardDescription>
                      {subscription.cancelAtPeriodEnd 
                        ? `Cancels on ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}` 
                        : `Renews on ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`}
                    </CardDescription>
                  </div>
                  {getStatusBadge(subscription.status)}
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleManageBilling}
                  disabled={isLoadingPortal}
                  className="gap-2"
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
              </CardContent>
            </Card>
          </div>
        )}

        {/* Account Settings Section */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-semibold">Account Settings</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Your account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-lg">{user.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-lg">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Account ID</p>
                <p className="font-mono text-sm text-muted-foreground">{user.id}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

