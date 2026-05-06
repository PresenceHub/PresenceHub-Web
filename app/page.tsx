import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarDays,
  ChartNoAxesCombined,
  CheckCircle2,
  Clock,
  ImageIcon,
  Layers3,
  MessageSquareText,
  Send,
  Sparkles,
} from "lucide-react";

const features = [
  {
    title: "Visual content calendar",
    description:
      "Plan posts across channels with a clean weekly and monthly view.",
    icon: CalendarDays,
  },
  {
    title: "Schedule everywhere",
    description:
      "Create once and publish to multiple social platforms on time.",
    icon: Send,
  },
  {
    title: "AI caption ideas",
    description:
      "Generate better captions, hashtags, and post variations faster.",
    icon: Sparkles,
  },
  {
    title: "Smart analytics",
    description: "Track what performs best and improve your next campaign.",
    icon: ChartNoAxesCombined,
  },
];

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#workflow" },
  { label: "Pricing", href: "/pricing" },
];

const workflow = [
  "Connect your social accounts",
  "Create or import your content",
  "Schedule posts on the calendar",
  "Track performance and improve",
];

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <LandingHeader />

      <section className="relative overflow-hidden border-b">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div className="flex flex-col justify-center">
            <Badge className="mb-5 w-fit" variant="secondary">
              Social media scheduling made simple
            </Badge>

            <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Plan, schedule, and grow your social media from one place.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Save hours every week with a simple publishing workflow for
              creators, small businesses, and teams.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/register">Start for free</Link>
              </Button>

              <Button asChild size="lg" variant="outline">
                <Link href="/login">Login</Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                Cancel anytime
              </div>
            </div>
          </div>

          <HeroPreview />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border bg-muted/40 p-8 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            Built for creators, founders, agencies, and growing brands
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-4">
            {["Instagram", "LinkedIn", "Facebook", "X / Twitter"].map(
              (platform) => (
                <div
                  key={platform}
                  className="rounded-2xl border bg-background px-4 py-3 text-sm font-medium"
                >
                  {platform}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section
        id="features"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline">Features</Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to publish consistently.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Keep your content organized, publish on time, and understand what is
            working without juggling multiple tools.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="rounded-2xl">
              <CardHeader>
                <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <feature.icon className="size-5" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section
        id="workflow"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="grid gap-10 rounded-3xl border bg-muted/40 p-8 lg:grid-cols-2 lg:p-12">
          <div>
            <Badge variant="outline">Workflow</Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              From idea to scheduled post in minutes.
            </h2>
            <p className="mt-4 text-muted-foreground">
              A focused workflow helps users create, review, schedule, and
              measure content without unnecessary complexity.
            </p>

            <Button asChild className="mt-8">
              <Link href="/register">Create your account</Link>
            </Button>
          </div>

          <div className="space-y-4">
            {workflow.map((item, index) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-2xl border bg-background p-4"
              >
                <div className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {index + 1}
                </div>
                <p className="font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Start scheduling smarter today.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">
            Build a consistent social presence with a simple, reliable
            scheduling workflow.
          </p>

          <Button asChild size="lg" variant="secondary" className="mt-8">
            <Link href="/register">Start for free</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

function HeroPreview() {
  return (
    <div className="rounded-3xl border bg-muted/40 p-4 shadow-sm">
      <div className="rounded-2xl border bg-background p-5 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Content calendar</p>
            <p className="text-xs text-muted-foreground">This week</p>
          </div>

          <Badge>Live preview</Badge>
        </div>

        <div className="grid gap-3">
          {[
            {
              icon: ImageIcon,
              title: "Product launch post",
              time: "Today, 10:30 AM",
            },
            {
              icon: MessageSquareText,
              title: "LinkedIn founder update",
              time: "Tomorrow, 9:00 AM",
            },
            {
              icon: Clock,
              title: "Weekly tips carousel",
              time: "Friday, 6:00 PM",
            },
          ].map((post) => (
            <div
              key={post.title}
              className="flex items-center gap-4 rounded-2xl border p-4"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <post.icon className="size-5" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium">{post.title}</p>
                <p className="text-xs text-muted-foreground">{post.time}</p>
              </div>

              <Badge variant="secondary">Scheduled</Badge>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl bg-muted p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium">Posts scheduled</span>
            <span className="text-muted-foreground">24/30</span>
          </div>
          <div className="h-2 rounded-full bg-background">
            <div className="h-2 w-4/5 rounded-full bg-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}

function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Layers3 className="size-5" />
          </div>
          <span>Presencehub</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/login">Login</Link>
          </Button>

          <Button asChild>
            <Link href="/register">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
