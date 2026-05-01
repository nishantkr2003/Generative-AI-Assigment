// UI REDESIGNED - logic unchanged
import { UserButton, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import FileUploader from "../components/FileUploader";
import ChatBox from "../components/ChatBox";

export default function Dashboard() {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#06080f] text-white flex flex-col">
      {/* Ambient orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-cyan-500/8 blur-[120px]" />
        <div className="absolute top-1/2 -right-60 h-[400px] w-[400px] rounded-full bg-sky-600/8 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 sticky top-0 border-b border-white/5 bg-[#090c14]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-sky-500 shadow-lg shadow-cyan-500/20 transition group-hover:brightness-110">
              <svg
                className="h-4 w-4 text-slate-950"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-xs font-medium tracking-[0.2em] text-cyan-400 uppercase leading-none">
                GenAI
              </p>
              <p className="text-sm font-semibold text-white leading-none mt-0.5">
                Doc Assistant
              </p>
            </div>
          </button>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/5 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-400 font-medium">
                Pinecone Connected
              </span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <span className="text-sm text-gray-400 hidden sm:block">
              {user?.firstName || "User"}
            </span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      {/* Main layout */}
      <main className="relative z-10 flex flex-1 overflow-hidden">
        <div className="mx-auto flex w-full max-w-7xl flex-col lg:flex-row gap-0 px-0 lg:px-6 lg:py-6 lg:gap-6">
          {/* Left sidebar */}
          <aside className="w-full lg:w-80 xl:w-96 shrink-0 border-b lg:border-b-0 border-white/5 lg:border lg:border-white/5 lg:rounded-2xl bg-[#090c14]/60 backdrop-blur-xl p-5 flex flex-col gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 mb-3">
                Knowledge Base
              </p>
              <FileUploader />
            </div>

            {/* Tips */}
            <div className="mt-auto rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <p className="text-xs font-semibold text-gray-400 mb-2">Tips</p>
              <ul className="space-y-1.5">
                {[
                  "Upload a PDF, DOCX, TXT or MD file",
                  "Ask specific questions about the content",
                  "Sources are shown below each answer",
                ].map((tip) => (
                  <li
                    key={tip}
                    className="flex items-start gap-2 text-xs text-gray-500"
                  >
                    <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-cyan-500" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Right chat panel */}
          <section className="flex-1 min-w-0 flex flex-col lg:border lg:border-white/5 lg:rounded-2xl bg-[#090c14]/40 backdrop-blur-xl overflow-hidden">
            <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Document Chat
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Ask anything about your uploaded documents
                </p>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-cyan-500/15 bg-cyan-500/5 px-2.5 py-1">
                <svg
                  className="h-3 w-3 text-cyan-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span className="text-xs text-cyan-400 font-medium">
                  RAG Active
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <ChatBox />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
