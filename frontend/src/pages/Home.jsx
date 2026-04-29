import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white px-6">
      <h1 className="text-5xl font-bold mb-4 text-center">
        Multi-Document AI Assistant
      </h1>

      <p className="text-lg text-gray-300 mb-8 text-center max-w-2xl">
        Upload documents, chat with them intelligently, and retain session
        memory with personalized AI assistance.
      </p>

      <SignedOut>
        <div className="flex gap-4">
          <SignInButton mode="modal">
            <button className="px-6 py-3 bg-white text-black rounded-lg font-semibold">
              Sign In
            </button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button className="px-6 py-3 border border-white rounded-lg font-semibold">
              Sign Up
            </button>
          </SignUpButton>
        </div>
      </SignedOut>

      <SignedIn>
        <Link to="/dashboard">
          <button className="px-6 py-3 bg-white text-black rounded-lg font-semibold">
            Go to Dashboard
          </button>
        </Link>
      </SignedIn>
    </div>
  );
}
