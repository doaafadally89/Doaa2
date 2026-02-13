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
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { signOut, getAuth } from "@/lib/firebase";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  const processFile = (file: File) => {
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
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setAnalyzing(true);
    setError("");
    setReport(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
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

  const clearImage = () => {
    setImage(null);
    setFileName("");
    setReport(null);
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSignOut = async () => {
    await signOut(getAuth());
    router.push("/");
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
            Upload a screenshot and get an instant AI-powered QA report.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Upload Area */}
          <div>
            {!image ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-colors ${
                  dragOver
                    ? "border-primary bg-primary/5"
                    : "border-border bg-white hover:border-primary/40"
                }`}
              >
                <Upload className="mb-4 h-10 w-10 text-muted" />
                <p className="mb-1 text-sm font-medium text-foreground">
                  Drop your screenshot here
                </p>
                <p className="text-xs text-muted">
                  or click to browse (PNG, JPG, WEBP — up to 20MB)
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <FileImage className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground truncate max-w-[200px]">
                      {fileName}
                    </span>
                  </div>
                  <button
                    onClick={clearImage}
                    className="rounded-lg p-1 text-muted hover:bg-surface hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <img
                  src={image}
                  alt="Uploaded screenshot"
                  className="w-full rounded-xl border border-border object-contain"
                  style={{ maxHeight: "400px" }}
                />
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-white hover:bg-primary-dark disabled:opacity-60 transition-colors"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing your design...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4" />
                      Run QA Scan
                    </>
                  )}
                </button>
              </div>
            )}

            {error && (
              <div className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-600">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}
          </div>

          {/* Report Area */}
          <div>
            {!report && !analyzing && (
              <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white p-8 text-center">
                <Shield className="mb-3 h-10 w-10 text-border" />
                <p className="text-sm font-medium text-muted">
                  Your QA report will appear here
                </p>
                <p className="mt-1 text-xs text-muted/70">
                  Upload a screen and click &quot;Run QA Scan&quot;
                </p>
              </div>
            )}

            {analyzing && (
              <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl border border-border bg-white p-8 text-center">
                <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
                <p className="text-sm font-medium text-foreground">
                  Scanning your design...
                </p>
                <p className="mt-1 text-xs text-muted">
                  Checking visual consistency, accessibility, spacing & more
                </p>
              </div>
            )}

            {report && (
              <div className="rounded-2xl border border-border bg-white">
                <div className="flex items-center justify-between border-b border-border px-6 py-4">
                  <h2 className="font-semibold text-foreground">
                    ShipCheck QA Report
                  </h2>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(report);
                    }}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted hover:bg-surface transition-colors"
                  >
                    Copy Report
                  </button>
                </div>
                <div className="p-6">
                  <MarkdownReport content={report} />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function MarkdownReport({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="prose prose-sm max-w-none space-y-1">
      {lines.map((line, i) => {
        const trimmed = line.trim();

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

        // Severity badges
        if (trimmed.includes("**Critical**") || trimmed.includes("**Severity**: Critical")) {
          return (
            <div key={i} className="flex items-start gap-2 my-1">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
              <span className="text-sm text-foreground">
                <InlineMd text={trimmed} />
              </span>
            </div>
          );
        }
        if (trimmed.includes("**Major**") || trimmed.includes("**Severity**: Major")) {
          return (
            <div key={i} className="flex items-start gap-2 my-1">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-500" />
              <span className="text-sm text-foreground">
                <InlineMd text={trimmed} />
              </span>
            </div>
          );
        }
        if (trimmed.includes("**Minor**") || trimmed.includes("**Severity**: Minor")) {
          return (
            <div key={i} className="flex items-start gap-2 my-1">
              <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" />
              <span className="text-sm text-foreground">
                <InlineMd text={trimmed} />
              </span>
            </div>
          );
        }
        if (trimmed.includes("**Suggestion**") || trimmed.includes("**Severity**: Suggestion")) {
          return (
            <div key={i} className="flex items-start gap-2 my-1">
              <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
              <span className="text-sm text-foreground">
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
