"use client";

import Link from "next/link";
import {
  Shield,
  Eye,
  Zap,
  CheckCircle,
  ArrowRight,
  Palette,
  Accessibility,
  Layout,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-foreground">ShipCheck</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/login?mode=signup"
              className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            AI-Powered Design QA
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
            Catch every UI bug
            <br />
            <span className="text-primary">before your users do</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted leading-relaxed">
            ShipCheck scans your screens for visual inconsistencies, accessibility
            issues, and design spec violations — so you can ship with confidence.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/login?mode=signup"
              className="flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-white hover:bg-primary-dark transition-colors"
            >
              Try Your First Scan Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="text-sm text-muted">No credit card required</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-surface py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-foreground">
            How It Works
          </h2>
          <p className="mx-auto mb-14 max-w-xl text-center text-muted">
            Three steps to a pixel-perfect, accessible product.
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Upload Your Screen",
                desc: "Drop a screenshot or paste an image of any mobile or web UI.",
              },
              {
                step: "2",
                title: "AI Analyzes Everything",
                desc: "ShipCheck checks visual consistency, accessibility, spacing, typography, and more.",
              },
              {
                step: "3",
                title: "Get Your QA Report",
                desc: "Receive a detailed, prioritized report with actionable fixes — in seconds.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-border bg-white p-8 text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Check */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-foreground">
            What ShipCheck Catches
          </h2>
          <p className="mx-auto mb-14 max-w-xl text-center text-muted">
            Every scan covers the full spectrum of design quality.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Eye,
                title: "Visual Consistency",
                desc: "Alignment, sizing, and spacing uniformity across elements.",
              },
              {
                icon: Palette,
                title: "Color & Contrast",
                desc: "WCAG contrast ratios, color consistency, and theme adherence.",
              },
              {
                icon: Layout,
                title: "Spacing & Layout",
                desc: "Padding, margins, grid alignment, and responsive concerns.",
              },
              {
                icon: Accessibility,
                title: "Accessibility",
                desc: "Touch targets, focus states, screen reader compatibility.",
              },
              {
                icon: Zap,
                title: "Interactive States",
                desc: "Buttons, hover states, loading indicators, empty states.",
              },
              {
                icon: CheckCircle,
                title: "Edge Cases",
                desc: "Long text, RTL readiness, data overflow, and error states.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border p-6 hover:border-primary/30 hover:shadow-sm transition-all"
              >
                <item.icon className="mb-3 h-6 w-6 text-primary" />
                <h3 className="mb-1 font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-surface py-20 px-6">
        <div className="mx-auto max-w-md text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">Simple Pricing</h2>
          <p className="mb-10 text-muted">Start free. Pay as you grow.</p>
          <div className="rounded-2xl border border-primary/20 bg-white p-8 shadow-lg shadow-primary/5">
            <div className="mb-1 text-sm font-medium text-primary">PRO SCAN</div>
            <div className="mb-2 text-4xl font-bold text-foreground">
              $19
              <span className="text-lg font-normal text-muted">/scan</span>
            </div>
            <p className="mb-6 text-sm text-muted">
              First scan is on us — completely free.
            </p>
            <ul className="mb-8 space-y-3 text-left text-sm">
              {[
                "Full 7-category QA analysis",
                "Severity-ranked issues",
                "Actionable fix recommendations",
                "Exportable Markdown report",
                "Results in under 30 seconds",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span className="text-foreground">{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/login?mode=signup"
              className="block w-full rounded-full bg-primary py-3 text-center font-semibold text-white hover:bg-primary-dark transition-colors"
            >
              Start Your Free Scan
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">ShipCheck</span>
          </div>
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} ShipCheck. Ship with confidence.
          </p>
        </div>
      </footer>
    </div>
  );
}
