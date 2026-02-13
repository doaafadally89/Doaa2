"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Upload,
  Loader2,
  FileImage,
  X,
  LogOut,
  AlertTriangle,
  CheckCircle,
  Info,
  AlertCircle,
  Link as LinkIcon,
  Figma,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { signOut, getAuth, isDemoMode } from "@/lib/firebase";

type InputMode = "screenshot" | "figma";
type DevInputMode = "screenshot" | "url";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, logoutDemo } = useAuth();

  // Design (original) inputs
  const [designMode, setDesignMode] = useState<InputMode>("screenshot");
  const [designImage, setDesignImage] = useState<string | null>(null);
  const [designFileName, setDesignFileName] = useState("");
  const [designFigmaUrl, setDesignFigmaUrl] = useState("");

  // Development (implementation) inputs
  const [devMode, setDevMode] = useState<DevInputMode>("screenshot");
  const [devImage, setDevImage] = useState<string | null>(null);
  const [devFileName, setDevFileName] = useState("");
  const [devUrl, setDevUrl] = useState("");

  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [dragOverDesign, setDragOverDesign] = useState(false);
  const [dragOverDev, setDragOverDev] = useState(false);
  const [highlightedIssue, setHighlightedIssue] = useState<number | null>(null);
  const designFileRef = useRef<HTMLInputElement>(null);
  const devFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  const processDesignFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (PNG, JPG, WEBP).");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("Image must be under 20MB.");
      return;
    }
    setError("");
    setReport(null);
    setDesignFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setDesignImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const processDevFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (PNG, JPG, WEBP).");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("Image must be under 20MB.");
      return;
    }
    setError("");
    setReport(null);
    setDevFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setDevImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDesignDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOverDesign(false);
    const file = e.dataTransfer.files[0];
    if (file) processDesignFile(file);
  }, []);

  const handleDevDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOverDev(false);
    const file = e.dataTransfer.files[0];
    if (file) processDevFile(file);
  }, []);

  const handleDesignFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processDesignFile(file);
  };

  const handleDevFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processDevFile(file);
  };

  const handleAnalyze = async () => {
    // Validate that both design and dev inputs are provided
    const hasDesign = (designMode === "screenshot" && designImage) || (designMode === "figma" && designFigmaUrl);
    const hasDev = (devMode === "screenshot" && devImage) || (devMode === "url" && devUrl);

    if (!hasDesign || !hasDev) {
      setError("Please provide both design resource and developed version to compare.");
      return;
    }

    setAnalyzing(true);
    setError("");
    setReport(null);
    try {
      const payload: Record<string, unknown> = {
        design: {},
        development: {},
      };

      // Design source
      if (designMode === "screenshot" && designImage) {
        (payload.design as Record<string, unknown>).type = "screenshot";
        (payload.design as Record<string, unknown>).image = designImage;
      } else if (designMode === "figma" && designFigmaUrl) {
        (payload.design as Record<string, unknown>).type = "figma";
        (payload.design as Record<string, unknown>).figmaUrl = designFigmaUrl;
      }

      // Development source
      if (devMode === "screenshot" && devImage) {
        (payload.development as Record<string, unknown>).type = "screenshot";
        (payload.development as Record<string, unknown>).image = devImage;
      } else if (devMode === "url" && devUrl) {
        (payload.development as Record<string, unknown>).type = "url";
        (payload.development as Record<string, unknown>).url = devUrl;
      }

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setReport(data.report);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setAnalyzing(false);
    }
  };

  const clearAll = () => {
    setDesignImage(null);
    setDesignFileName("");
    setDesignFigmaUrl("");
    setDevImage(null);
    setDevFileName("");
    setDevUrl("");
    setReport(null);
    setError("");
    if (designFileRef.current) designFileRef.current.value = "";
    if (devFileRef.current) devFileRef.current.value = "";
  };

  const handleSignOut = async () => {
    if (isDemoMode) {
      logoutDemo();
    } else {
      const auth = getAuth();
      if (auth) await signOut(auth);
    }
    router.push("/");
  };

  const scrollToIssue = (issueIndex: number) => {
    const element = document.querySelector(`[data-issue-id="${issueIndex}"]`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "nearest" });
      setHighlightedIssue(issueIndex);
      // Remove highlight after 2 seconds
      setTimeout(() => setHighlightedIssue(null), 2000);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-foreground">ShipCheck</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted">{user.email}</span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Design QA Scanner</h1>
          <p className="text-muted">
            Compare your design resource with the developed version to identify visual inconsistencies and issues.
          </p>
        </div>

        {/* Action Bar */}
        <div className="mb-6 flex items-center justify-between rounded-xl border border-border bg-white p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-muted">Ready to compare</span>
            </div>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60 transition-colors"
          >
            {analyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Comparing...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4" />
                Compare & Generate Report
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-600">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Design Resource (Left Column) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-1 rounded-full bg-primary" />
              <h2 className="text-lg font-semibold text-foreground">Design Resource</h2>
            </div>
            <p className="text-xs text-muted mb-4">Upload your original design (screenshot or Figma link)</p>

            {/* Design Mode Tabs */}
            <div className="flex gap-2 rounded-xl border border-border bg-white p-1">
              <button
                onClick={() => {
                  setDesignMode("screenshot");
                  setDesignFigmaUrl("");
                  setReport(null);
                }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  designMode === "screenshot"
                    ? "bg-primary text-white"
                    : "text-muted hover:text-foreground"
                }`}
              >
                <Upload className="h-4 w-4" />
                Screenshot
              </button>
              <button
                onClick={() => {
                  setDesignMode("figma");
                  setDesignImage(null);
                  setDesignFileName("");
                  setReport(null);
                }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  designMode === "figma"
                    ? "bg-primary text-white"
                    : "text-muted hover:text-foreground"
                }`}
              >
                <Figma className="h-4 w-4" />
                Figma
              </button>
            </div>

            {/* Design Screenshot Upload */}
            {designMode === "screenshot" && !designImage && (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverDesign(true);
                }}
                onDragLeave={() => setDragOverDesign(false)}
                onDrop={handleDesignDrop}
                onClick={() => designFileRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-colors ${
                  dragOverDesign
                    ? "border-primary bg-primary/5"
                    : "border-border bg-white hover:border-primary/40"
                }`}
              >
                <Upload className="mb-3 h-8 w-8 text-muted" />
                <p className="mb-1 text-sm font-medium text-foreground">
                  Drop design screenshot
                </p>
                <p className="text-xs text-muted">
                  PNG, JPG, WEBP — up to 20MB
                </p>
                <input
                  ref={designFileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleDesignFileChange}
                  className="hidden"
                />
              </div>
            )}

            {/* Design Screenshot Preview */}
            {designMode === "screenshot" && designImage && (
              <div className="rounded-2xl border border-border bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <FileImage className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground truncate max-w-[150px]">
                      {designFileName}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setDesignImage(null);
                      setDesignFileName("");
                      setReport(null);
                      if (designFileRef.current) designFileRef.current.value = "";
                    }}
                    className="rounded-lg p-1 text-muted hover:bg-surface hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <img
                  src={designImage}
                  alt="Design screenshot"
                  className="w-full rounded-xl border border-border object-contain"
                  style={{ maxHeight: "300px" }}
                />
              </div>
            )}

            {/* Design Figma URL Input */}
            {designMode === "figma" && (
              <div className="rounded-2xl border border-border bg-white p-6">
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Figma File URL
                </label>
                <input
                  type="url"
                  value={designFigmaUrl}
                  onChange={(e) => {
                    setDesignFigmaUrl(e.target.value);
                    setReport(null);
                  }}
                  placeholder="https://www.figma.com/file/..."
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <p className="mt-2 text-xs text-muted">
                  Paste your Figma file or frame link
                </p>
              </div>
            )}
          </div>

          {/* Developed Version (Right Column) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-1 rounded-full bg-accent" />
              <h2 className="text-lg font-semibold text-foreground">Developed Version</h2>
            </div>
            <p className="text-xs text-muted mb-4">Upload screenshot or paste live URL of the implemented design</p>

            {/* Dev Mode Tabs */}
            <div className="flex gap-2 rounded-xl border border-border bg-white p-1">
              <button
                onClick={() => {
                  setDevMode("screenshot");
                  setDevUrl("");
                  setReport(null);
                }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  devMode === "screenshot"
                    ? "bg-primary text-white"
                    : "text-muted hover:text-foreground"
                }`}
              >
                <Upload className="h-4 w-4" />
                Screenshot
              </button>
              <button
                onClick={() => {
                  setDevMode("url");
                  setDevImage(null);
                  setDevFileName("");
                  setReport(null);
                }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  devMode === "url"
                    ? "bg-primary text-white"
                    : "text-muted hover:text-foreground"
                }`}
              >
                <LinkIcon className="h-4 w-4" />
                Live URL
              </button>
            </div>

            {/* Dev Screenshot Upload */}
            {devMode === "screenshot" && !devImage && (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverDev(true);
                }}
                onDragLeave={() => setDragOverDev(false)}
                onDrop={handleDevDrop}
                onClick={() => devFileRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-colors ${
                  dragOverDev
                    ? "border-primary bg-primary/5"
                    : "border-border bg-white hover:border-primary/40"
                }`}
              >
                <Upload className="mb-3 h-8 w-8 text-muted" />
                <p className="mb-1 text-sm font-medium text-foreground">
                  Drop dev screenshot
                </p>
                <p className="text-xs text-muted">
                  PNG, JPG, WEBP — up to 20MB
                </p>
                <input
                  ref={devFileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleDevFileChange}
                  className="hidden"
                />
              </div>
            )}

            {/* Dev Screenshot Preview */}
            {devMode === "screenshot" && devImage && (
              <div className="rounded-2xl border border-border bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <FileImage className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground truncate max-w-[150px]">
                      {devFileName}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setDevImage(null);
                      setDevFileName("");
                      setReport(null);
                      if (devFileRef.current) devFileRef.current.value = "";
                    }}
                    className="rounded-lg p-1 text-muted hover:bg-surface hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <img
                  src={devImage}
                  alt="Dev screenshot"
                  className="w-full rounded-xl border border-border object-contain"
                  style={{ maxHeight: "300px" }}
                />
              </div>
            )}

            {/* Dev URL Input */}
            {devMode === "url" && (
              <div className="rounded-2xl border border-border bg-white p-6">
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Live Product URL
                </label>
                <input
                  type="url"
                  value={devUrl}
                  onChange={(e) => {
                    setDevUrl(e.target.value);
                    setReport(null);
                  }}
                  placeholder="https://example.com/page"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <p className="mt-2 text-xs text-muted">
                  Enter the URL of your live product
                </p>
              </div>
            )}
          </div>
        </div>


        {/* Report Area - Full Width Below */}
        <div className="mt-8">
          {!report && !analyzing && (
            <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white p-12 text-center">
              <Shield className="mb-3 h-10 w-10 text-border" />
              <p className="text-sm font-medium text-muted">
                Comparison report will appear here
              </p>
              <p className="mt-1 text-xs text-muted/70">
                Provide both design resource and developed version, then click &quot;Compare & Generate Report&quot;
              </p>
            </div>
          )}

          {analyzing && (
            <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-border bg-white p-12 text-center">
              <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
              <p className="text-sm font-medium text-foreground">
                Comparing designs...
              </p>
              <p className="mt-1 text-xs text-muted">
                Analyzing visual consistency, accessibility, spacing & more
              </p>
            </div>
          )}

          {report && (
            <div className="h-[calc(100vh-12rem)] flex gap-4">
              {/* Left: Sticky Comparison View */}
              <div className="w-[500px] flex-shrink-0 space-y-3">
                {/* Design Screenshot */}
                {designImage && (
                  <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                    <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-violet-600" />
                      <span className="text-xs font-semibold text-slate-900">Design</span>
                    </div>
                    <div className="relative bg-slate-50 p-3">
                      <img
                        src={designImage}
                        alt="Design"
                        className="w-full rounded border border-slate-200"
                        style={{ maxHeight: "280px", objectFit: "contain" }}
                      />
                      <IssueMarkers report={report} onMarkerClick={scrollToIssue} highlightedIssue={highlightedIssue} />
                    </div>
                  </div>
                )}

                {/* Development Screenshot */}
                {devImage && (
                  <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                    <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-cyan-500" />
                      <span className="text-xs font-semibold text-slate-900">Development</span>
                    </div>
                    <div className="relative bg-slate-50 p-3">
                      <img
                        src={devImage}
                        alt="Development"
                        className="w-full rounded border border-slate-200"
                        style={{ maxHeight: "280px", objectFit: "contain" }}
                      />
                      <IssueMarkers report={report} onMarkerClick={scrollToIssue} highlightedIssue={highlightedIssue} />
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Scrollable Issues */}
              <div className="flex-1 flex flex-col bg-white rounded-lg border border-slate-200 overflow-hidden">
                {/* Header */}
                <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
                  <div>
                    <h2 className="font-semibold text-slate-900">Issues Found</h2>
                    <p className="text-xs text-slate-600 mt-0.5">Click marker or hover issue to highlight location</p>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(report)}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-white transition-colors"
                  >
                    Copy Report
                  </button>
                </div>

                {/* Issues List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <CompactIssueList content={report} highlightedIssue={highlightedIssue} onIssueHover={setHighlightedIssue} />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function MarkdownReport({ content, highlightedIssue, onIssueHover }: { content: string; highlightedIssue: number | null; onIssueHover: (index: number | null) => void }) {
  const lines = content.split("\n");
  let issueNumber = -1; // Will increment to 0 for first issue
  let inIssueBlock = false;
  let currentIssueIndex = -1;

  return (
    <div className="prose prose-sm max-w-none space-y-1">
      {lines.map((line, i) => {
        const trimmed = line.trim();

        // Check if we're starting a new issue block
        const isSeverityLine = trimmed.includes("**Severity**:");
        if (isSeverityLine) {
          issueNumber++;
          inIssueBlock = true;
          currentIssueIndex = issueNumber;
        }

        // Check if we're ending an issue block (empty line or heading after issue details)
        if (inIssueBlock && (trimmed === "" || trimmed.startsWith("##"))) {
          inIssueBlock = false;
        }

        if (trimmed.startsWith("# ")) {
          return (
            <h1 key={i} className="text-xl font-bold text-foreground mt-4 mb-2">
              {trimmed.slice(2)}
            </h1>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={i} className="text-lg font-semibold text-foreground mt-4 mb-2">
              {trimmed.slice(3)}
            </h2>
          );
        }
        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={i} className="text-base font-semibold text-foreground mt-3 mb-1">
              {trimmed.slice(4)}
            </h3>
          );
        }
        if (trimmed.startsWith("---")) {
          return <hr key={i} className="my-4 border-border" />;
        }

        // Severity badges with issue numbers
        if (trimmed.includes("**Critical**") || trimmed.includes("**Severity**: Critical")) {
          const showNumber = isSeverityLine;
          const isHighlighted = highlightedIssue === currentIssueIndex;
          return (
            <div
              key={i}
              data-issue-index={isSeverityLine ? currentIssueIndex : undefined}
              onMouseEnter={() => isSeverityLine && onIssueHover(currentIssueIndex)}
              onMouseLeave={() => isSeverityLine && onIssueHover(null)}
              className={`flex items-start gap-2 my-1 rounded-lg p-3 transition-all duration-200 cursor-pointer ${
                isHighlighted
                  ? "bg-red-50 border-2 border-red-500 shadow-sm"
                  : "hover:bg-red-50/50 border-2 border-transparent"
              }`}
            >
              {showNumber && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white flex-shrink-0">
                  {currentIssueIndex + 1}
                </div>
              )}
              {!showNumber && <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />}
              <span className="text-sm text-slate-900">
                <InlineMd text={trimmed} />
              </span>
            </div>
          );
        }
        if (trimmed.includes("**Major**") || trimmed.includes("**Severity**: Major")) {
          const showNumber = isSeverityLine;
          const isHighlighted = highlightedIssue === currentIssueIndex;
          return (
            <div
              key={i}
              data-issue-index={isSeverityLine ? currentIssueIndex : undefined}
              onMouseEnter={() => isSeverityLine && onIssueHover(currentIssueIndex)}
              onMouseLeave={() => isSeverityLine && onIssueHover(null)}
              className={`flex items-start gap-2 my-1 rounded-lg p-3 transition-all duration-200 cursor-pointer ${
                isHighlighted
                  ? "bg-orange-50 border-2 border-orange-500 shadow-sm"
                  : "hover:bg-orange-50/50 border-2 border-transparent"
              }`}
            >
              {showNumber && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white flex-shrink-0">
                  {currentIssueIndex + 1}
                </div>
              )}
              {!showNumber && <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-500" />}
              <span className="text-sm text-slate-900">
                <InlineMd text={trimmed} />
              </span>
            </div>
          );
        }
        if (trimmed.includes("**Minor**") || trimmed.includes("**Severity**: Minor")) {
          const showNumber = isSeverityLine;
          const isHighlighted = highlightedIssue === currentIssueIndex;
          return (
            <div
              key={i}
              data-issue-index={isSeverityLine ? currentIssueIndex : undefined}
              onMouseEnter={() => isSeverityLine && onIssueHover(currentIssueIndex)}
              onMouseLeave={() => isSeverityLine && onIssueHover(null)}
              className={`flex items-start gap-2 my-1 rounded-lg p-3 transition-all duration-200 cursor-pointer ${
                isHighlighted
                  ? "bg-blue-50 border-2 border-blue-500 shadow-sm"
                  : "hover:bg-blue-50/50 border-2 border-transparent"
              }`}
            >
              {showNumber && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white flex-shrink-0">
                  {currentIssueIndex + 1}
                </div>
              )}
              {!showNumber && <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" />}
              <span className="text-sm text-slate-900">
                <InlineMd text={trimmed} />
              </span>
            </div>
          );
        }
        if (trimmed.includes("**Suggestion**") || trimmed.includes("**Severity**: Suggestion")) {
          const showNumber = isSeverityLine;
          const isHighlighted = highlightedIssue === currentIssueIndex;
          return (
            <div
              key={i}
              data-issue-index={isSeverityLine ? currentIssueIndex : undefined}
              onMouseEnter={() => isSeverityLine && onIssueHover(currentIssueIndex)}
              onMouseLeave={() => isSeverityLine && onIssueHover(null)}
              className={`flex items-start gap-2 my-1 rounded-lg p-3 transition-all duration-200 cursor-pointer ${
                isHighlighted
                  ? "bg-green-50 border-2 border-green-500 shadow-sm"
                  : "hover:bg-green-50/50 border-2 border-transparent"
              }`}
            >
              {showNumber && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white flex-shrink-0">
                  {currentIssueIndex + 1}
                </div>
              )}
              {!showNumber && <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />}
              <span className="text-sm text-slate-900">
                <InlineMd text={trimmed} />
              </span>
            </div>
          );
        }

        // Highlight Gap field specially
        if (trimmed.includes("**Gap**:")) {
          return (
            <div key={i} className="flex items-start gap-2 my-1 ml-6 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2">
              <span className="text-sm font-medium text-amber-900">
                <InlineMd text={trimmed} />
              </span>
            </div>
          );
        }

        // Design and Development comparison fields
        if (trimmed.includes("**Design**:") || trimmed.includes("**Development**:")) {
          const isDesign = trimmed.includes("**Design**:");
          return (
            <div key={i} className={`flex items-start gap-2 my-1 ml-6 rounded-lg px-3 py-2 ${isDesign ? "bg-blue-50 border border-blue-200" : "bg-purple-50 border border-purple-200"}`}>
              <span className={`text-sm ${isDesign ? "text-blue-900" : "text-purple-900"}`}>
                <InlineMd text={trimmed} />
              </span>
            </div>
          );
        }

        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <div key={i} className="flex items-start gap-2 my-0.5 ml-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-muted" />
              <span className="text-sm text-foreground">
                <InlineMd text={trimmed.slice(2)} />
              </span>
            </div>
          );
        }

        if (trimmed === "") return <div key={i} className="h-2" />;

        return (
          <p key={i} className="text-sm text-foreground leading-relaxed my-0.5">
            <InlineMd text={trimmed} />
          </p>
        );
      })}
    </div>
  );
}

function InlineMd({ text }: { text: string }) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

interface ParsedIssue {
  index: number;
  severity: string;
  category: string;
  issue: string;
  design: string;
  development: string;
  gap: string;
  recommendation: string;
}

function CompactIssueList({ content, highlightedIssue, onIssueHover }: { content: string; highlightedIssue: number | null; onIssueHover: (index: number | null) => void }) {
  const issues = parseDetailedIssues(content);

  return (
    <>
      {issues.map((issue) => {
        const isHighlighted = highlightedIssue === issue.index;

        return (
          <div
            key={issue.index}
            data-issue-id={issue.index}
            onMouseEnter={() => onIssueHover(issue.index)}
            onMouseLeave={() => onIssueHover(null)}
            className={`rounded-lg border transition-all ${
              isHighlighted
                ? 'border-violet-400 bg-violet-50 shadow-md'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                {/* Number Badge */}
                <div className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-white text-sm font-bold">
                  {issue.index + 1}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-2.5">
                  {/* Header: Severity + Category + Issue */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">{issue.severity}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wide">{issue.category}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 leading-snug">
                      {issue.issue}
                    </h3>
                  </div>

                  {/* Design/Development/Gap - All visible */}
                  {issue.design && (
                    <div className="bg-slate-50 rounded px-2.5 py-2">
                      <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wide mb-1">Design</div>
                      <div className="text-xs text-slate-700 leading-relaxed">{issue.design}</div>
                    </div>
                  )}

                  {issue.development && (
                    <div className="bg-slate-50 rounded px-2.5 py-2">
                      <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wide mb-1">Development</div>
                      <div className="text-xs text-slate-700 leading-relaxed">{issue.development}</div>
                    </div>
                  )}

                  {issue.gap && (
                    <div className="bg-slate-50 rounded px-2.5 py-2 border-l-2 border-slate-300">
                      <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wide mb-1">Gap</div>
                      <div className="text-xs text-slate-900 font-medium leading-relaxed">{issue.gap}</div>
                    </div>
                  )}

                  {issue.recommendation && (
                    <div className="bg-slate-50 rounded px-2.5 py-2">
                      <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wide mb-1">Fix</div>
                      <div className="text-xs text-slate-700 font-mono leading-relaxed">{issue.recommendation}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

function parseDetailedIssues(report: string): ParsedIssue[] {
  const issues: ParsedIssue[] = [];
  const lines = report.split("\n");

  let currentIssue: Partial<ParsedIssue> = {};
  let issueIndex = -1;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.includes("**Severity**:")) {
      if (Object.keys(currentIssue).length > 0) {
        issues.push(currentIssue as ParsedIssue);
      }
      issueIndex++;
      currentIssue = { index: issueIndex };
      const match = trimmed.match(/\*\*Severity\*\*:\s*\*\*(.*?)\*\*/);
      if (match) currentIssue.severity = match[1];
    } else if (trimmed.includes("**Category**:")) {
      const match = trimmed.match(/\*\*Category\*\*:\s*(.*)/);
      if (match) currentIssue.category = match[1];
    } else if (trimmed.includes("**Issue**:")) {
      const match = trimmed.match(/\*\*Issue\*\*:\s*(.*)/);
      if (match) currentIssue.issue = match[1];
    } else if (trimmed.includes("**Design**:")) {
      const match = trimmed.match(/\*\*Design\*\*:\s*(.*)/);
      if (match) currentIssue.design = match[1];
    } else if (trimmed.includes("**Development**:")) {
      const match = trimmed.match(/\*\*Development\*\*:\s*(.*)/);
      if (match) currentIssue.development = match[1];
    } else if (trimmed.includes("**Gap**:")) {
      const match = trimmed.match(/\*\*Gap\*\*:\s*(.*)/);
      if (match) currentIssue.gap = match[1];
    } else if (trimmed.includes("**Recommendation**:")) {
      const match = trimmed.match(/\*\*Recommendation\*\*:\s*(.*)/);
      if (match) currentIssue.recommendation = match[1];
    }
  }

  if (Object.keys(currentIssue).length > 0) {
    issues.push(currentIssue as ParsedIssue);
  }

  return issues;
}

function IssueMarkers({ report, onMarkerClick, highlightedIssue }: { report: string; onMarkerClick: (index: number) => void; highlightedIssue: number | null }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Parse report to extract issues and their locations
  const issues = parseIssuesFromReport(report);

  return (
    <>
      {issues.map((issue, index) => {
        const isHighlighted = highlightedIssue === index;
        const isHovered = hoveredIndex === index;

        return (
          <div
            key={index}
            className="absolute z-10"
            style={{
              top: `${issue.y}%`,
              left: `${issue.x}%`,
              transform: "translate(-50%, -50%)",
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => onMarkerClick(index)}
          >
            {/* Issue marker pin */}
            <div className="relative">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 shadow-lg cursor-pointer transition-all duration-200 ${
                  isHighlighted
                    ? `${getSeverityColor(issue.severity)} border-white scale-125 ring-4 ring-white/50`
                    : `${getSeverityColor(issue.severity)} border-white ${isHovered ? 'scale-110' : ''}`
                }`}
              >
                <span className="text-xs font-bold text-white">{index + 1}</span>
              </div>

              {/* Tooltip on hover */}
              {isHovered && (
              <div className="fixed z-50 pointer-events-none" style={{
                left: `${issue.x}%`,
                top: `${issue.y}%`,
                transform: 'translate(-50%, calc(-100% - 45px))',
              }}>
                <div className="rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-2xl border border-gray-700 animate-in fade-in slide-in-from-bottom-2 duration-200 w-56">
                  <div className="font-bold mb-1 text-white">{issue.severity}</div>
                  <div className="text-gray-300 leading-relaxed">{issue.title}</div>
                  <div className="mt-2 text-gray-500 text-[10px] italic">Click marker to view full details</div>
                </div>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px]">
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-gray-700" />
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[2px]">
                  <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-gray-900" />
                </div>
              </div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}

interface Issue {
  severity: string;
  title: string;
  x: number;
  y: number;
}

function parseIssuesFromReport(report: string): Issue[] {
  // Extract issues from markdown report
  const issues: Issue[] = [];
  const lines = report.split("\n");

  let currentSeverity = "";
  let issueCount = 0;

  // Sample positions distributed across the image (in production, AI would provide exact coordinates)
  const positions = [
    { x: 50, y: 15 },  // Top center - headings
    { x: 30, y: 30 },  // Upper left - text
    { x: 70, y: 30 },  // Upper right - buttons
    { x: 50, y: 45 },  // Center - body text
    { x: 35, y: 60 },  // Mid left - labels
    { x: 65, y: 60 },  // Mid right - inputs
    { x: 50, y: 75 },  // Lower center - borders
    { x: 40, y: 85 },  // Bottom left
    { x: 60, y: 85 },  // Bottom right
  ];

  for (const line of lines) {
    const trimmed = line.trim();

    // Look for severity markers
    if (trimmed.includes("**Severity**:")) {
      const match = trimmed.match(/\*\*Severity\*\*:\s*\*\*(.*?)\*\*/);
      if (match) {
        currentSeverity = match[1];
      }
    }

    // Look for issue descriptions
    if (trimmed.includes("**Issue**:")) {
      const issueMatch = trimmed.match(/\*\*Issue\*\*:\s*(.*)/);
      if (issueMatch && issueCount < positions.length) {
        issues.push({
          severity: currentSeverity,
          title: issueMatch[1],
          x: positions[issueCount].x,
          y: positions[issueCount].y,
        });
        issueCount++;
      }
    }
  }

  return issues;
}

function getSeverityColor(severity: string): string {
  const normalized = severity.toLowerCase();
  if (normalized.includes("critical")) return "bg-red-500";
  if (normalized.includes("major")) return "bg-orange-500";
  if (normalized.includes("minor")) return "bg-blue-500";
  if (normalized.includes("suggestion")) return "bg-green-500";
  return "bg-gray-500";
}
