"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
        return;
      }
      if (user.role !== "admin") {
        router.push("/dashboard");
        return;
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 animate-pulse" />
          <p className="text-white/30 text-sm">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-[#07070f]">
      {/* Subtle amber tint to distinguish admin */}
      <div className="fixed inset-0 bg-gradient-to-br from-amber-950/10 via-transparent to-transparent pointer-events-none z-0" />
      <Sidebar />
      <div className="lg:pl-64 flex flex-col min-h-screen relative z-10">
        <Navbar />
        <main className="flex-1 px-4 lg:px-8 py-6 pb-8">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}