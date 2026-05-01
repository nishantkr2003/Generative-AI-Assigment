// UI REDESIGNED - logic unchanged
import { askDocument, getChatHistory, clearChatHistory } from "../services/api";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/clerk-react";

export default function ChatBox() {
  const { user } = useUser();
  const storageKey = user ? `chat_history_${user.id}` : "chat_history_guest";
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedSources, setExpandedSources] = useState({});
  const bottomRef = useRef(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        if (user?.id) {
          const response = await getChatHistory(user.id);
          if (response.history) {
            const formattedHistory = response.history
              .slice()
              .reverse()
              .map((chat) => ({
                question: chat.question,
                answer: chat.answer,
                sources: chat.sources || [],
              }));
            setChatHistory(formattedHistory);
            return;
          }
        }
        const savedChats = localStorage.getItem(storageKey);
        if (savedChats) setChatHistory(JSON.parse(savedChats));
        else setChatHistory([]);
      } catch (error) {
        console.error("History load failed:", error);
        const savedChats = localStorage.getItem(storageKey);
        if (savedChats) setChatHistory(JSON.parse(savedChats));
        else setChatHistory([]);
      }
    };
    loadHistory();
  }, [storageKey, user]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(chatHistory));
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, storageKey]);

  const handleAsk = async () => {
    if (!question.trim()) return;
    try {
      setLoading(true);
      const currentQuestion = question;
      setQuestion("");
      const response = await askDocument(currentQuestion, user?.id || null);
      const newChat = {
        question: currentQuestion,
        answer: response.answer,
        sources: response.sources || [],
      };
      setChatHistory((prev) => [...prev, newChat]);
    } catch (error) {
      const errorChat = {
        question,
        answer: error.response?.data?.message || "Failed to get answer.",
        sources: [],
      };
      setChatHistory((prev) => [...prev, errorChat]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    try {
      setChatHistory([]);
      localStorage.removeItem(storageKey);
      if (user?.id) await clearChatHistory(user.id);
    } catch (error) {
      console.error("Clear history failed:", error);
    }
  };

  const toggleSources = (index) => {
    setExpandedSources((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
        {/* Empty state */}
        {chatHistory.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center px-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500/15 to-sky-500/10 ring-1 ring-cyan-500/20 mb-4">
              <svg
                className="h-8 w-8 text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-base font-semibold text-white mb-1">
              No conversation yet
            </p>
            <p className="text-sm text-gray-500 max-w-xs">
              Upload a document from the sidebar, then ask your first question
              below.
            </p>
          </div>
        )}

        {/* Chat messages */}
        {chatHistory.map((chat, index) => (
          <div key={index} className="space-y-3">
            {/* User message */}
            <div className="flex items-end justify-end gap-2">
              <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-gradient-to-br from-cyan-500 to-sky-500 px-4 py-3 shadow-lg shadow-cyan-500/10">
                <p className="text-sm text-slate-950 font-medium whitespace-pre-wrap">
                  {chat.question}
                </p>
              </div>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xs font-bold text-white">
                {user?.firstName?.[0]?.toUpperCase() || "U"}
              </div>
            </div>

            {/* AI message */}
            <div className="flex items-end gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-sky-500/10 ring-1 ring-cyan-500/20">
                <svg
                  className="h-4 w-4 text-cyan-400"
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
              </div>
              <div className="max-w-[80%] space-y-2">
                <div className="rounded-2xl rounded-bl-sm border border-white/5 bg-white/[0.04] px-4 py-3 backdrop-blur-sm">
                  <p className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                    {chat.answer}
                  </p>
                </div>

                {/* Sources toggle */}
                {chat.sources?.length > 0 && (
                  <div>
                    <button
                      onClick={() => toggleSources(index)}
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-cyan-400 transition-colors duration-150"
                    >
                      <svg
                        className={`h-3 w-3 transition-transform duration-200 ${expandedSources[index] ? "rotate-90" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      {expandedSources[index] ? "Hide" : "View"}{" "}
                      {chat.sources.length} source
                      {chat.sources.length > 1 ? "s" : ""}
                    </button>

                    {expandedSources[index] && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {chat.sources.map((source, si) => (
                          <span
                            key={si}
                            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-400"
                          >
                            <svg
                              className="h-3 w-3 text-cyan-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            {source.filename} · chunk {source.chunk_id}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex items-end gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-sky-500/10 ring-1 ring-cyan-500/20">
              <svg
                className="h-4 w-4 text-cyan-400"
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
            </div>
            <div className="rounded-2xl rounded-bl-sm border border-white/5 bg-white/[0.04] px-4 py-3">
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="border-t border-white/5 bg-[#090c14]/60 backdrop-blur-xl px-4 py-4">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAsk();
                }
              }}
              placeholder="Ask something about your documents... (Enter to send)"
              rows={1}
              className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all duration-200 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700"
              style={{ minHeight: "44px" }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 128) + "px";
              }}
            />
          </div>

          {/* Send button */}
          <button
            onClick={handleAsk}
            disabled={loading || !question.trim()}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all duration-200
              ${
                loading || !question.trim()
                  ? "bg-white/5 text-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-br from-cyan-400 to-sky-500 text-slate-950 shadow-lg shadow-cyan-500/20 hover:brightness-110 hover:scale-105"
              }`}
          >
            {loading ? (
              <svg
                className="h-4 w-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            ) : (
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>

          {/* Clear button */}
          <button
            onClick={handleClear}
            disabled={chatHistory.length === 0}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-gray-500 transition-all duration-200 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Clear chat"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-600 text-center">
          Shift + Enter for new line · Enter to send
        </p>
      </div>
    </div>
  );
}
