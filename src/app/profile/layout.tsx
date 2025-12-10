"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { User, CreditCard, Settings } from "lucide-react";
import { Navbar } from "@/components/navbar";

const sidebarNavItems = [
  {
    title: "Overview",
    href: "/profile",
    icon: User,
  },
  {
    title: "Subscriptions",
    href: "/profile/subscriptions",
    icon: CreditCard,
  },
  // {
  //   title: "Settings",
  //   href: "/profile/settings",
  //   icon: Settings,
  // },
];

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <div className="container mx-auto max-w-screen-xl px-4 py-8">
        <div className="flex flex-1 flex-col gap-8 lg:flex-row">
          {/* Side Navigation */}
          <aside className="lg:w-64 lg:shrink-0">
            <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:sticky lg:top-24">
              {sidebarNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 whitespace-nowrap rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}

