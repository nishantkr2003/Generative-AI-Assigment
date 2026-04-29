import { UserButton, useUser } from "@clerk/clerk-react";
import FileUploader from "../components/FileUploader";
import ChatBox from "../components/ChatBox";
export default function Dashboard() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="flex justify-between items-center p-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold">GenAI Doc Assistant</h1>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300">
            Welcome, {user?.firstName || "User"}
          </span>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <main className="p-8 flex flex-col items-center">
        <h2 className="text-4xl font-bold mb-4 text-center">Dashboard</h2>

        <p className="text-gray-300 mb-8 text-center">
          Upload documents, build your knowledge base, and chat intelligently.
        </p>

        <FileUploader />

        <ChatBox />
      </main>
    </div>
  );
}
