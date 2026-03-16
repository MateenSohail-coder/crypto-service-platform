"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LandingPage from "@/components/LandingPage";
import { TrendingUp } from "lucide-react";

export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // ✅ Do NOT touch router while loading
    if (loading) return;

    // Only redirect if user is confirmed logged in
    if (user) {
      router.replace(user.role === "admin" ? "/admin" : "/dashboard");
    }

    // If no user after loading — do nothing, render LandingPage below
  }, [user, loading, router]);

  // ── Still checking auth ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-500/30">
            <TrendingUp size={24} className="text-white" />
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>
    );
  }

  // ── Auth done, user is logged in — show blank while redirect fires ────
  if (user) {
    return (
      <div className="min-h-screen bg-[#07070f] flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 animate-pulse" />
      </div>
    );
  }

  // ── Auth done, no user — show landing page ────────────────────────────
  return <LandingPage />;
}
