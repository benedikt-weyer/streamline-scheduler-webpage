"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function RenamedPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <div className="mx-auto max-w-2xl text-center">
        {/* Logo/Icon */}
        <div className="mb-8 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-4xl font-bold text-primary">
            P
          </div>
        </div>

        {/* Main Message */}
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          We've Got a New Name!
        </h1>
        
        <Card className="mb-8 border-primary/20 bg-card/50 backdrop-blur">
          <CardContent className="p-8">
            <p className="mb-6 text-lg text-muted-foreground">
              <span className="font-semibold text-foreground">Streamline Scheduler</span> is now{" "}
              <span className="font-bold text-primary">Plandera</span>
            </p>
            
            <p className="mb-8 text-muted-foreground">
              Same great product, new name! We're excited to continue our journey as Plandera, 
              bringing you the best open-source calendar and task management solution.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="gap-2" asChild>
                <Link href="https://plandera.com">
                  Visit Plandera.com
                  <ExternalLink className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" className="gap-2" asChild>
                <Link href="https://app.plandera.com">
                  Go to App
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="rounded-lg bg-muted/50 p-6 text-left">
          <h2 className="mb-3 font-semibold">What This Means for You:</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1 text-primary">✓</span>
              <span>All your data and settings remain unchanged</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-primary">✓</span>
              <span>Same features you love, with more to come</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-primary">✓</span>
              <span>Please update your bookmarks to plandera.com</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-primary">✓</span>
              <span>Existing accounts work seamlessly on the new domain</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

