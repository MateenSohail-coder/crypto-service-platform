"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 animate-pulse" />
          <p className="text-white/30 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#07070f]">
      {/* Sidebar — desktop */}
      <Sidebar />

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 px-4 lg:px-8 py-6 pb-24 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Bottom nav — mobile */}
      <BottomNav />
    </div>
  );
}
