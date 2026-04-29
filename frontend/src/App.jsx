import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

function ProtectedDashboard() {
  return (
    <>
      <SignedIn>
        <Dashboard />
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<ProtectedDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
