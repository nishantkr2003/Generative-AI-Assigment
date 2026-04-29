import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#06080f] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#090c14]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm text-cyan-300 uppercase tracking-[0.2em]">
              GenAI Doc Assistant
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              Your document intelligence hub
            </h1>
          </div>

          <SignedOut>
            <div className="flex items-center gap-3">
              <SignInButton mode="modal">
                <button className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm font-semibold text-gray-200 transition hover:border-white/20">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="rounded-lg bg-gradient-to-r from-cyan-400 to-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:brightness-110">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </SignedOut>

          <SignedIn>
            <Link to="/dashboard">
              <button className="rounded-lg bg-gradient-to-r from-cyan-400 to-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:brightness-110">
                Go to Dashboard
              </button>
            </Link>
          </SignedIn>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-sky-900/20"></div>
        <div className="relative mx-auto max-w-7xl px-6 py-20 text-center">
          <h1 className="text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
            Chat with your{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-sky-500 bg-clip-text text-transparent">
              documents
            </span>{" "}
            intelligently
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 sm:text-xl">
            Upload multiple documents, ask natural language questions, and get
            instant answers with source references. Powered by advanced AI for
            secure, personalized assistance.
          </p>

          <SignedOut>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <SignUpButton mode="modal">
                <button className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-500 px-8 py-4 text-lg font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110">
                  Get Started Free
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button className="inline-flex items-center justify-center rounded-2xl border border-gray-700 bg-gray-900 px-8 py-4 text-lg font-semibold text-gray-200 transition hover:border-white/20">
                  Sign In
                </button>
              </SignInButton>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="mt-10">
              <Link to="/dashboard">
                <button className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-500 px-8 py-4 text-lg font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110">
                  Go to Dashboard
                </button>
              </Link>
            </div>
          </SignedIn>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">
            Features
          </p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Everything you need for document intelligence
          </h2>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6 shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10">
              <svg
                className="h-6 w-6 text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-semibold">Fast Upload</h3>
            <p className="mt-2 text-gray-400">
              Upload PDFs, DOCX, TXT, and markdown files instantly. No size
              limits, secure processing.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6 shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10">
              <svg
                className="h-6 w-6 text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-semibold">Smart AI Chat</h3>
            <p className="mt-2 text-gray-400">
              Ask questions in natural language and get accurate answers with
              source citations from your documents.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6 shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10">
              <svg
                className="h-6 w-6 text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-semibold">Secure & Private</h3>
            <p className="mt-2 text-gray-400">
              Your documents are processed securely with end-to-end encryption.
              No data is stored permanently.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-[32px] border border-gray-800 bg-gradient-to-r from-cyan-500/10 to-sky-900/30 p-8 text-center shadow-[0_30px_80px_rgba(0,0,0,0.12)] backdrop-blur-xl sm:p-12">
          <h2 className="text-3xl font-semibold sm:text-4xl">
            Ready to transform your document workflow?
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Join thousands of users who are already using GenAI Doc Assistant to
            streamline their document interactions.
          </p>

          <SignedOut>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <SignUpButton mode="modal">
                <button className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-500 px-8 py-4 text-lg font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110">
                  Start Free Trial
                </button>
              </SignUpButton>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="mt-8">
              <Link to="/dashboard">
                <button className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-500 px-8 py-4 text-lg font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110">
                  Access Dashboard
                </button>
              </Link>
            </div>
          </SignedIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-[#090c14]/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-8 text-center">
          <p className="text-sm text-gray-400">
            © 2026 GenAI Doc Assistant. Built with modern AI technology.
          </p>
        </div>
      </footer>
    </div>
  );
}
