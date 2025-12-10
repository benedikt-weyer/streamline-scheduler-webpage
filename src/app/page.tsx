"use client";

import Link from "next/link";
import { 
  Calendar, 
  CheckSquare, 
  Lock, 
  Server, 
  Palette, 
  Zap, 
  Moon, 
  FolderTree,
  Repeat,
  ArrowRight,
  Github,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto max-w-screen-2xl px-4 py-20 md:py-32">
        <div className="mx-auto max-w-5xl text-center">
          <Badge variant="secondary" className="mb-4">
            <Star className="mr-1 h-3 w-3" />
            Open Source & Self-Hosted
          </Badge>
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            Streamline Your
            <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Schedule & Tasks
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
            An open source self-hostable calendar-todolist combo with end-to-end encryption.
            Fast, efficient, and privacy-focused scheduling made simple.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="group gap-2 text-lg" asChild>
              <Link href="#get-started">
                Get Started
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 text-lg" asChild>
              <Link href="https://github.com/yourusername/streamline-scheduler" target="_blank">
                <Github className="h-5 w-5" />
                View on GitHub
              </Link>
            </Button>
          </div>
        </div>

        {/* Hero Image/Demo Section */}
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="relative rounded-xl border bg-card p-2 shadow-2xl">
            <div className="aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10">
              <div className="flex h-full items-center justify-center">
                <div className="grid grid-cols-2 gap-4 p-8">
                  <div className="flex items-center gap-3 rounded-lg border bg-background p-4">
                    <CheckSquare className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">Task Management</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border bg-background p-4">
                    <Calendar className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">Calendar View</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border bg-background p-4">
                    <Lock className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">E2E Encrypted</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border bg-background p-4">
                    <Zap className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">Real-time Sync</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/30 py-20">
        <div className="container mx-auto max-w-screen-2xl px-4">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful features designed for privacy, efficiency, and ease of use
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Calendar className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Calendar Management</CardTitle>
                <CardDescription>
                  Create, edit, and manage events with support for recurring patterns
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CheckSquare className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Todo List</CardTitle>
                <CardDescription>
                  Efficient task management with priorities, due dates, and smart scheduling
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Repeat className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Recurring Events & Tasks</CardTitle>
                <CardDescription>
                  Set up repeating events and tasks with flexible patterns
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Lock className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>End-to-End Encryption</CardTitle>
                <CardDescription>
                  All data is encrypted client-side before transmission. Zero-knowledge architecture.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Server className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Easy Self-Hosting</CardTitle>
                <CardDescription>
                  Simple deployment with Docker Compose. Own your data completely.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Palette className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Modern UI</CardTitle>
                <CardDescription>
                  Beautiful, responsive interface built with Next.js, React, and shadcn/ui
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Real-time Sync</CardTitle>
                <CardDescription>
                  WebSocket-based real-time updates across all your devices
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Moon className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Dark Mode</CardTitle>
                <CardDescription>
                  Full dark/light theme support with system preference detection
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <FolderTree className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Project Organization</CardTitle>
                <CardDescription>
                  Hierarchical project structure with drag-and-drop reordering
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-screen-2xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Built with Modern Tech
            </h2>
            <p className="mb-12 text-lg text-muted-foreground">
              Powered by industry-leading technologies for performance and security
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "Next.js 14+",
                "React 19",
                "TypeScript",
                "Tailwind CSS",
                "shadcn/ui",
                "Rust Backend",
                "PostgreSQL",
                "End-to-End Encryption",
                "Docker"
              ].map((tech) => (
                <div
                  key={tech}
                  className="rounded-lg border bg-card p-4 text-center font-medium transition-colors hover:bg-accent"
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Get Started CTA Section */}
      <section id="get-started" className="border-t bg-muted/30 py-20">
        <div className="container mx-auto max-w-screen-2xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Deploy your own instance in minutes with Docker Compose or explore the code on GitHub
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="gap-2" asChild>
                <Link href="https://github.com/yourusername/streamline-scheduler#quick-start-with-docker-compose-recommended" target="_blank">
                  <Server className="h-5 w-5" />
                  Self-Host Now
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2" asChild>
                <Link href="https://github.com/yourusername/streamline-scheduler" target="_blank">
                  <Github className="h-5 w-5" />
                  View Documentation
                </Link>
              </Button>
            </div>

            <div className="mt-12 rounded-lg border bg-card p-6">
              <p className="mb-4 text-sm font-semibold">Quick Start with Docker Compose</p>
              <div className="overflow-x-auto rounded bg-muted p-4 text-left">
                <code className="text-sm">
                  git clone https://github.com/yourusername/streamline-scheduler.git<br />
                  cd streamline-scheduler<br />
                  docker-compose up -d
                </code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto max-w-screen-2xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2025 Streamline Scheduler. Licensed for personal self-hosting only.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://github.com/yourusername/streamline-scheduler"
                target="_blank"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                GitHub
              </Link>
              <Link
                href="https://github.com/yourusername/streamline-scheduler#license"
                target="_blank"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                License
              </Link>
              <Link
                href="https://github.com/yourusername/streamline-scheduler#contributing"
                target="_blank"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Contributing
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
