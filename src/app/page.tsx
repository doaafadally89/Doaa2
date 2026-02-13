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
  Upload,
  FileSearch,
  ClipboardCheck,
  Star,
  ExternalLink,
  AlertTriangle,
  AlertCircle,
  Info,
  MousePointer2,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-foreground">ShipCheck</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#how-it-works" className="text-sm text-muted hover:text-foreground transition-colors">How It Works</a>
            <a href="#features" className="text-sm text-muted hover:text-foreground transition-colors">Features</a>
            <a href="#integrations" className="text-sm text-muted hover:text-foreground transition-colors">Integrations</a>
            <a href="#pricing" className="text-sm text-muted hover:text-foreground transition-colors">Pricing</a>
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
              className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-all hover:shadow-lg hover:shadow-primary/25"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-24 px-6">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Zap className="h-3.5 w-3.5" />
              AI-Powered Design QA — Instant Results
            </div>
            <h1 className="mb-6 text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-7xl">
              Catch every UI bug
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                before your users do
              </span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted leading-relaxed md:text-xl">
              Upload a screenshot. Get a detailed QA report in seconds.
              ShipCheck finds visual bugs, accessibility issues, and design
              inconsistencies so you ship pixel-perfect every time.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/login?mode=signup"
                className="group flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-white hover:bg-primary-dark transition-all hover:shadow-xl hover:shadow-primary/25"
              >
                Start Your Free Scan
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <p className="text-sm text-muted">No credit card required</p>
            </div>
          </div>

          {/* Hero Product Screenshot */}
          <div className="mt-16 mx-auto max-w-5xl">
            <div className="relative rounded-2xl border border-border/60 bg-white shadow-2xl shadow-black/10 overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-border/60 bg-surface px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="mx-auto flex items-center gap-2 rounded-lg bg-white border border-border/60 px-4 py-1.5 text-xs text-muted">
                  <Shield className="h-3 w-3 text-primary" />
                  app.shipcheck.design/dashboard
                </div>
              </div>
              {/* Mock Dashboard */}
              <div className="bg-surface p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Upload side */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <Shield className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">Design QA Scanner</div>
                        <div className="text-xs text-muted">Upload a screenshot to analyze</div>
                      </div>
                    </div>
                    <div className="rounded-xl border border-border bg-white p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                          <FileSearch className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="text-xs font-medium text-foreground">checkout-screen.png</div>
                          <div className="text-[10px] text-muted">1440 x 900 — 2.4 MB</div>
                        </div>
                      </div>
                      <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 h-32 flex items-center justify-center">
                        <div className="text-center">
                          <div className="mx-auto mb-2 h-16 w-24 rounded-lg bg-white border border-indigo-200 flex items-center justify-center shadow-sm">
                            <Layout className="h-6 w-6 text-indigo-300" />
                          </div>
                          <div className="text-[10px] text-indigo-400 font-medium">Preview</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Report side */}
                  <div className="rounded-xl border border-border bg-white">
                    <div className="flex items-center justify-between border-b border-border px-4 py-3">
                      <div className="text-xs font-semibold text-foreground">QA Report</div>
                      <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-600">
                        <Star className="h-2.5 w-2.5" />
                        72/100
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <ReportIssue severity="critical" title="Low contrast on placeholder text" desc="Ratio 2.6:1 — WCAG minimum is 4.5:1" />
                      <ReportIssue severity="major" title="Missing accessible labels" desc="Icon-only buttons lack aria-label" />
                      <ReportIssue severity="minor" title="Inconsistent border radius" desc="Cards use 12px, buttons use 8px" />
                      <ReportIssue severity="suggestion" title="Add visible focus rings" desc="Tab navigation has no visible indicator" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Glow effect */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-primary/10 rounded-full blur-2xl" />
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-y border-border/50 bg-surface/50 py-10 px-6">
        <div className="mx-auto max-w-4xl">
          <p className="mb-6 text-center text-sm font-medium text-muted uppercase tracking-wider">
            Trusted by design & engineering teams
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-40">
            {["Vercel", "Linear", "Figma", "Stripe"].map((name) => (
              <div key={name} className="text-lg font-bold text-foreground tracking-tight">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <div className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
              How It Works
            </div>
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Three steps to pixel-perfect shipping
            </h2>
            <p className="text-muted text-lg">
              From screenshot to actionable report in under 30 seconds.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Upload,
                step: "01",
                title: "Upload Your Screen",
                desc: "Drag & drop a screenshot of any mobile app, web page, or component. PNG, JPG, and WEBP supported up to 20MB.",
              },
              {
                icon: FileSearch,
                step: "02",
                title: "AI Analyzes Everything",
                desc: "Our AI checks 7 critical categories: visual consistency, color contrast, typography, spacing, accessibility, interactions, and edge cases.",
              },
              {
                icon: ClipboardCheck,
                step: "03",
                title: "Get Actionable Report",
                desc: "Receive a severity-ranked report with specific fixes. Export to Markdown, or send issues directly to Jira, Notion, or Linear.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="group relative rounded-2xl border border-border bg-white p-8 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all"
              >
                <div className="absolute -top-3 -right-2 text-5xl font-black text-primary/[0.06]">
                  {item.step}
                </div>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <item.icon className="h-6 w-6" />
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

      {/* See It In Action — Before / After */}
      <section className="py-24 px-6 bg-gradient-to-b from-white via-primary/[0.02] to-surface">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <div className="mb-4 inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent uppercase tracking-wider">
              See It In Action
            </div>
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              From screenshot to{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                actionable insights
              </span>
            </h2>
            <p className="text-muted text-lg">
              Upload any UI — ShipCheck scans every pixel and highlights exactly what needs fixing.
            </p>
          </div>

          {/* Before / After comparison */}
          <div className="relative mx-auto max-w-5xl">
            <div className="relative rounded-2xl border border-border/60 bg-white shadow-2xl shadow-black/10 overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-border/60 bg-surface px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="mx-auto flex items-center gap-2 rounded-lg bg-white border border-border/60 px-4 py-1.5 text-xs text-muted">
                  <Shield className="h-3 w-3 text-primary" />
                  app.shipcheck.design/scan-results
                </div>
              </div>

              <div className="grid md:grid-cols-2">
                {/* Before — Original */}
                <div className="border-r border-border/60 p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="h-2 w-2 rounded-full bg-muted/50" />
                    <span className="text-xs font-semibold text-muted uppercase tracking-wider">Original Screenshot</span>
                  </div>
                  {/* Mock UI card */}
                  <div className="rounded-xl border border-border bg-gradient-to-br from-slate-50 to-white p-5 space-y-4">
                    {/* Mock header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-indigo-100" />
                        <div className="space-y-1">
                          <div className="h-2.5 w-24 rounded bg-foreground/80" />
                          <div className="h-2 w-16 rounded bg-muted/30" />
                        </div>
                      </div>
                      <div className="h-7 w-16 rounded-lg bg-indigo-100" />
                    </div>
                    {/* Mock form */}
                    <div className="space-y-3">
                      <div className="h-9 w-full rounded-lg border border-border bg-white flex items-center px-3">
                        <span className="text-[10px] text-muted/40">Enter your email...</span>
                      </div>
                      <div className="h-9 w-full rounded-lg border border-border bg-white flex items-center px-3">
                        <span className="text-[10px] text-muted/40">Password</span>
                      </div>
                      <div className="h-9 w-full rounded-lg bg-indigo-500 flex items-center justify-center">
                        <span className="text-[10px] text-white font-medium">Sign In</span>
                      </div>
                    </div>
                    {/* Mock footer */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="h-2 w-20 rounded bg-muted/20" />
                      <div className="flex gap-2">
                        <div className="h-6 w-6 rounded-full bg-gray-100" />
                        <div className="h-6 w-6 rounded-full bg-gray-100" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* After — Annotated */}
                <div className="p-6 md:p-8 bg-gradient-to-br from-primary/[0.02] to-transparent">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">ShipCheck Analysis</span>
                  </div>
                  {/* Same Mock UI card but with annotations */}
                  <div className="relative rounded-xl border border-primary/20 bg-gradient-to-br from-slate-50 to-white p-5 space-y-4">
                    {/* Annotation overlays */}
                    {/* Mock header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-indigo-100" />
                        <div className="space-y-1">
                          <div className="h-2.5 w-24 rounded bg-foreground/80" />
                          <div className="h-2 w-16 rounded bg-muted/30" />
                        </div>
                      </div>
                      <div className="relative h-7 w-16 rounded-lg bg-indigo-100">
                        <div className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center">
                          <span className="text-[6px] text-white font-bold">3</span>
                        </div>
                      </div>
                    </div>
                    {/* Mock form with annotations */}
                    <div className="space-y-3">
                      <div className="relative h-9 w-full rounded-lg border-2 border-red-400 bg-red-50/50 flex items-center px-3">
                        <span className="text-[10px] text-muted/40">Enter your email...</span>
                        <div className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-red-500 border-2 border-white flex items-center justify-center">
                          <span className="text-[6px] text-white font-bold">1</span>
                        </div>
                      </div>
                      <div className="relative h-9 w-full rounded-lg border-2 border-red-400 bg-red-50/50 flex items-center px-3">
                        <span className="text-[10px] text-muted/40">Password</span>
                        <div className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-red-500 border-2 border-white flex items-center justify-center">
                          <span className="text-[6px] text-white font-bold">1</span>
                        </div>
                      </div>
                      <div className="h-9 w-full rounded-lg bg-indigo-500 flex items-center justify-center">
                        <span className="text-[10px] text-white font-medium">Sign In</span>
                      </div>
                    </div>
                    {/* Mock footer with annotation */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="h-2 w-20 rounded bg-muted/20" />
                      <div className="relative flex gap-2">
                        <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-orange-400" />
                        <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-orange-400" />
                        <div className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center">
                          <span className="text-[6px] text-white font-bold">2</span>
                        </div>
                      </div>
                    </div>

                    {/* Scan line animation effect */}
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-primary to-transparent opacity-50" />
                  </div>

                  {/* Issue Summary Cards */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-100 px-3 py-2">
                      <AlertTriangle className="h-3 w-3 text-red-500 flex-shrink-0" />
                      <span className="text-[10px] text-red-700 font-medium">Low contrast placeholder text (2.6:1)</span>
                      <span className="ml-auto rounded-full bg-red-100 px-1.5 py-0.5 text-[8px] font-bold text-red-600">1</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-orange-50 border border-orange-100 px-3 py-2">
                      <AlertCircle className="h-3 w-3 text-orange-500 flex-shrink-0" />
                      <span className="text-[10px] text-orange-700 font-medium">Icon buttons missing aria-labels</span>
                      <span className="ml-auto rounded-full bg-orange-100 px-1.5 py-0.5 text-[8px] font-bold text-orange-600">2</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2">
                      <Info className="h-3 w-3 text-blue-500 flex-shrink-0" />
                      <span className="text-[10px] text-blue-700 font-medium">Inconsistent border radius (12px vs 8px)</span>
                      <span className="ml-auto rounded-full bg-blue-100 px-1.5 py-0.5 text-[8px] font-bold text-blue-600">3</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom glow */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-primary/10 rounded-full blur-2xl" />
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 mx-auto max-w-4xl">
            {[
              { value: "< 30s", label: "Average scan time" },
              { value: "7", label: "QA categories checked" },
              { value: "94%", label: "Issues caught pre-launch" },
              { value: "100", label: "Quality score scale" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-foreground md:text-3xl">{stat.value}</div>
                <div className="mt-1 text-xs text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Screenshot - Report Detail */}
      <section className="bg-gradient-to-b from-surface to-white py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <div className="mb-4 inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent uppercase tracking-wider">
                Detailed Reports
              </div>
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                Every issue, ranked by severity
              </h2>
              <p className="mb-8 text-lg text-muted leading-relaxed">
                ShipCheck doesn&apos;t just list problems — it prioritizes them.
                Critical accessibility failures surface first, while polish
                suggestions come last. Each issue includes exactly what to fix
                and where.
              </p>
              <ul className="space-y-4">
                {[
                  "Critical, Major, Minor & Suggestion severity levels",
                  "Exact location on screen for every issue",
                  "Actionable fix recommendations",
                  "Summary score out of 100",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Report mockup */}
            <div className="rounded-2xl border border-border bg-white shadow-xl shadow-black/5 overflow-hidden">
              <div className="border-b border-border px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-foreground text-sm">ShipCheck QA Report</span>
                </div>
                <div className="rounded-lg border border-border px-3 py-1 text-xs font-medium text-muted">
                  Copy Report
                </div>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-3">Color & Contrast</h3>
                  <DetailedIssue
                    severity="critical"
                    issue="Light gray placeholder text on white has contrast ratio of 2.6:1"
                    location="Email & password input fields"
                    fix="Darken placeholder to #767676 for 4.5:1 ratio"
                  />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-3">Accessibility</h3>
                  <DetailedIssue
                    severity="major"
                    issue="Interactive icons lack screen reader labels"
                    location="Navigation bar, action buttons"
                    fix="Add aria-label to all icon-only buttons"
                  />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-3">Typography</h3>
                  <DetailedIssue
                    severity="minor"
                    issue="Body text line-height at 1.2 is below WCAG recommendation"
                    location="All paragraph text"
                    fix="Increase line-height to 1.5 for body copy"
                  />
                </div>
                <div className="flex items-center justify-between rounded-xl bg-surface border border-border p-4">
                  <div>
                    <div className="text-xs text-muted mb-0.5">Summary Score</div>
                    <div className="text-2xl font-bold text-foreground">72 <span className="text-sm font-normal text-muted">/ 100</span></div>
                  </div>
                  <div className="h-10 w-10 rounded-full border-4 border-amber-400 flex items-center justify-center">
                    <span className="text-xs font-bold text-amber-600">B</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Check */}
      <section id="features" className="py-24 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <div className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
              Features
            </div>
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              7 categories. Zero blind spots.
            </h2>
            <p className="text-muted text-lg">
              Every scan covers the full spectrum of design quality — the same
              checks a senior QA engineer would run, done in seconds.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Eye,
                title: "Visual Consistency",
                desc: "Alignment, sizing, and spacing uniformity across all elements.",
                color: "bg-indigo-50 text-indigo-600",
              },
              {
                icon: Palette,
                title: "Color & Contrast",
                desc: "WCAG contrast ratios, color consistency, and theme adherence.",
                color: "bg-pink-50 text-pink-600",
              },
              {
                icon: Layout,
                title: "Spacing & Layout",
                desc: "Padding, margins, grid alignment, and responsive concerns.",
                color: "bg-blue-50 text-blue-600",
              },
              {
                icon: Accessibility,
                title: "Accessibility",
                desc: "Touch targets, focus states, ARIA labels, screen reader compat.",
                color: "bg-green-50 text-green-600",
              },
              {
                icon: Zap,
                title: "Interactive States",
                desc: "Buttons, hover effects, loading indicators, empty states.",
                color: "bg-amber-50 text-amber-600",
              },
              {
                icon: CheckCircle,
                title: "Edge Cases",
                desc: "Long text, RTL readiness, data overflow, and error states.",
                color: "bg-violet-50 text-violet-600",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl border border-border p-6 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all"
              >
                <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${item.color}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section id="integrations" className="bg-gradient-to-b from-white to-surface py-24 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <div className="mb-4 inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent uppercase tracking-wider">
              Integrations
            </div>
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Send bugs straight to your workflow
            </h2>
            <p className="text-muted text-lg">
              Connect ShipCheck to the tools your team already uses. Export QA
              issues as tasks — no copy-paste needed.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Jira",
                desc: "Create Jira tickets with severity, category, and fix recommendations auto-filled.",
                color: "bg-blue-600",
                letter: "J",
                status: "Coming Soon",
              },
              {
                name: "Notion",
                desc: "Push QA reports to a Notion database. Track issues alongside your design docs.",
                color: "bg-foreground",
                letter: "N",
                status: "Coming Soon",
              },
              {
                name: "Linear",
                desc: "File Linear issues with labels, priority, and team assignment from your QA report.",
                color: "bg-indigo-600",
                letter: "L",
                status: "Coming Soon",
              },
              {
                name: "GitHub Issues",
                desc: "Open GitHub issues with full context. Link QA findings directly to your repo.",
                color: "bg-gray-800",
                letter: "G",
                status: "Coming Soon",
              },
              {
                name: "Slack",
                desc: "Get notified in Slack when a scan completes. Share reports with your team instantly.",
                color: "bg-purple-600",
                letter: "S",
                status: "Coming Soon",
              },
              {
                name: "Asana",
                desc: "Turn QA issues into Asana tasks. Assign owners and set due dates automatically.",
                color: "bg-rose-500",
                letter: "A",
                status: "Coming Soon",
              },
            ].map((item) => (
              <div
                key={item.name}
                className="group rounded-2xl border border-border bg-white p-6 hover:border-primary/20 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.color} text-white text-lg font-bold`}>
                    {item.letter}
                  </div>
                  <span className="rounded-full bg-surface border border-border px-2.5 py-0.5 text-[10px] font-semibold text-muted uppercase tracking-wider">
                    {item.status}
                  </span>
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{item.name}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted mb-4">
              Want an integration we don&apos;t support yet?
            </p>
            <a
              href="mailto:hello@shipcheck.design"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
            >
              Let us know
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <div className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
              Pricing
            </div>
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="text-muted text-lg">
              Start free. Scale as your team grows.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 mx-auto max-w-4xl">
            {/* Free */}
            <div className="rounded-2xl border border-border bg-white p-8">
              <div className="mb-1 text-sm font-semibold text-muted uppercase tracking-wider">Free</div>
              <div className="mb-2 text-4xl font-bold text-foreground">
                $0
              </div>
              <p className="mb-6 text-sm text-muted">
                Try ShipCheck with your first scan.
              </p>
              <ul className="mb-8 space-y-3 text-sm">
                {[
                  "1 free QA scan",
                  "Full 7-category analysis",
                  "Markdown export",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <span className="text-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/login?mode=signup"
                className="block w-full rounded-full border border-border py-3 text-center text-sm font-semibold text-foreground hover:bg-surface transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Pro - Featured */}
            <div className="relative rounded-2xl border-2 border-primary bg-white p-8 shadow-xl shadow-primary/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-white">
                Most Popular
              </div>
              <div className="mb-1 text-sm font-semibold text-primary uppercase tracking-wider">Pro</div>
              <div className="mb-2 text-4xl font-bold text-foreground">
                $29<span className="text-lg font-normal text-muted">/mo</span>
              </div>
              <p className="mb-6 text-sm text-muted">
                Unlimited scans for growing teams.
              </p>
              <ul className="mb-8 space-y-3 text-sm">
                {[
                  "Unlimited QA scans",
                  "All 7 analysis categories",
                  "Priority processing",
                  "Export & integrations",
                  "Team sharing",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <span className="text-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/login?mode=signup"
                className="block w-full rounded-full bg-primary py-3 text-center text-sm font-semibold text-white hover:bg-primary-dark transition-all hover:shadow-lg hover:shadow-primary/25"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Enterprise */}
            <div className="rounded-2xl border border-border bg-white p-8">
              <div className="mb-1 text-sm font-semibold text-muted uppercase tracking-wider">Enterprise</div>
              <div className="mb-2 text-4xl font-bold text-foreground">
                Custom
              </div>
              <p className="mb-6 text-sm text-muted">
                For design systems at scale.
              </p>
              <ul className="mb-8 space-y-3 text-sm">
                {[
                  "Everything in Pro",
                  "SSO & SAML",
                  "Custom integrations",
                  "Dedicated support",
                  "SLA guarantee",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <span className="text-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="mailto:hello@shipcheck.design"
                className="block w-full rounded-full border border-border py-3 text-center text-sm font-semibold text-foreground hover:bg-surface transition-colors"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-indigo-700 px-8 py-16 text-center md:px-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
            <div className="relative">
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                Ready to ship with confidence?
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-lg text-white/80">
                Join teams who catch UI bugs before they reach production.
                Your first scan is completely free.
              </p>
              <Link
                href="/login?mode=signup"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-primary hover:bg-white/90 transition-all hover:shadow-xl"
              >
                Start Your Free Scan
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-bold text-foreground">ShipCheck</span>
              </div>
              <p className="text-sm text-muted leading-relaxed">
                AI-powered design QA that catches UI bugs before your users do.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-foreground">Product</h4>
              <ul className="space-y-2.5">
                {["Features", "Pricing", "Integrations", "Changelog"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted hover:text-foreground transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-foreground">Company</h4>
              <ul className="space-y-2.5">
                {["About", "Blog", "Careers", "Contact"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted hover:text-foreground transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-foreground">Legal</h4>
              <ul className="space-y-2.5">
                {["Privacy", "Terms", "Security"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted hover:text-foreground transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted">
              &copy; {new Date().getFullYear()} ShipCheck. Ship with confidence.
            </p>
            <div className="flex gap-6">
              {["Twitter", "GitHub", "Discord"].map((item) => (
                <a key={item} href="#" className="text-sm text-muted hover:text-foreground transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* Helper components for the screenshot mockups */

function ReportIssue({ severity, title, desc }: { severity: string; title: string; desc: string }) {
  const colors: Record<string, { bg: string; text: string; dot: string }> = {
    critical: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
    major: { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
    minor: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
    suggestion: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  };
  const c = colors[severity];

  return (
    <div className={`rounded-lg ${c.bg} p-3`}>
      <div className="flex items-center gap-2 mb-1">
        <div className={`h-2 w-2 rounded-full ${c.dot}`} />
        <span className={`text-[10px] font-semibold uppercase tracking-wider ${c.text}`}>{severity}</span>
      </div>
      <div className="text-xs font-medium text-foreground">{title}</div>
      <div className="text-[10px] text-muted mt-0.5">{desc}</div>
    </div>
  );
}

function DetailedIssue({ severity, issue, location, fix }: { severity: string; issue: string; location: string; fix: string }) {
  const colors: Record<string, { badge: string; border: string }> = {
    critical: { badge: "bg-red-100 text-red-700", border: "border-l-red-500" },
    major: { badge: "bg-orange-100 text-orange-700", border: "border-l-orange-500" },
    minor: { badge: "bg-blue-100 text-blue-700", border: "border-l-blue-500" },
    suggestion: { badge: "bg-green-100 text-green-700", border: "border-l-green-500" },
  };
  const c = colors[severity];

  return (
    <div className={`rounded-lg border border-border ${c.border} border-l-4 p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${c.badge}`}>
          {severity}
        </span>
      </div>
      <p className="text-sm text-foreground mb-2">{issue}</p>
      <div className="space-y-1 text-xs text-muted">
        <div><span className="font-medium text-foreground">Location:</span> {location}</div>
        <div><span className="font-medium text-foreground">Fix:</span> {fix}</div>
      </div>
    </div>
  );
}
