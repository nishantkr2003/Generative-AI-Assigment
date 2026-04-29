
import { askDocument, getChatHistory, clearChatHistory } from "../services/api";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
export default function ChatBox() {

    const { user } = useUser();

  const storageKey = user ? `chat_history_${user.id}` : "chat_history_guest";
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        // Logged-in user → MongoDB
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

        // Fallback → localStorage
        const savedChats = localStorage.getItem(storageKey);

        if (savedChats) {
          setChatHistory(JSON.parse(savedChats));
        } else {
          setChatHistory([]);
        }
      } catch (error) {
        console.error("History load failed:", error);

        // Safe fallback
        const savedChats = localStorage.getItem(storageKey);

        if (savedChats) {
          setChatHistory(JSON.parse(savedChats));
        } else {
          setChatHistory([]);
        }
      }
    };

    loadHistory();
  }, [storageKey, user]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(chatHistory));
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

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-4xl mt-10">
      <h2 className="text-2xl font-bold mb-4">Chat With Your Documents</h2>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleAsk();
          }
        }}
        placeholder="Ask something about your uploaded documents..."
        className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 min-h-[120px] mb-4"
      />

      <div className="flex items-center">
        <button
          onClick={handleAsk}
          disabled={loading}
          className="px-6 py-3 bg-white text-black rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Ask AI"}
        </button>

        <button
          onClick={async () => {
            try {
              setChatHistory([]);
              localStorage.removeItem(storageKey);

              if (user?.id) {
                await clearChatHistory(user.id);
              }
            } catch (error) {
              console.error("Clear history failed:", error);
            }
          }}
          className="ml-4 px-6 py-3 border border-gray-600 rounded-lg font-semibold"
        >
          Clear Chat
        </button>
      </div>

      {chatHistory.length === 0 && !loading && (
        <div className="mt-8 text-center text-gray-500">
          No conversation yet. Ask your first question about uploaded documents.
        </div>
      )}

      {loading && (
        <div className="mt-8 text-center text-gray-400">
          AI is analyzing your documents...
        </div>
      )}

      <div className="mt-8 space-y-6">
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className="border border-gray-800 rounded-xl p-4 bg-gray-950"
          >
            {/* User Question */}
            <div className="mb-4">
              <h3 className="font-semibold text-white">You:</h3>
              <p className="text-gray-300 whitespace-pre-wrap">
                {chat.question}
              </p>
            </div>

            {/* AI Answer */}
            <div className="mb-4">
              <h3 className="font-semibold text-white">AI:</h3>
              <p className="text-gray-300 whitespace-pre-wrap">{chat.answer}</p>
            </div>

            {/* Sources */}
            {chat.sources.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Sources:</h4>

                <ul className="space-y-2">
                  {chat.sources.map((source, sourceIndex) => (
                    <li
                      key={sourceIndex}
                      className="bg-gray-800 p-2 rounded-lg text-sm text-gray-300"
                    >
                      <strong>{source.filename}</strong> (Chunk{" "}
                      {source.chunk_id})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
