"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeSwitcher } from "./theme-switcher";
import { Button } from "./ui/button";
import { authClient } from "@/server/better-auth/client";
import { User } from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
}

export function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await authClient.getSession();
        if (session?.data?.user) {
          setUser(session.data.user);
        }
      } catch (error) {
        console.error("Failed to get session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">Streamline</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Pricing
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          
          {!isLoading && (
            <>
              {user ? (
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => router.push("/profile")}
                >
                  <User className="h-4 w-4" />
                  {user.name}
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost"
                    onClick={() => router.push("/login")}
                  >
                    Sign In
                  </Button>
                  <Button onClick={() => router.push("/register")}>
                    Sign Up
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

