"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import Navbar from "@/components/Navbar";
import { TrendingUp } from "lucide-react";

export default function DashboardLayout({ children }) {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();

  // 🔐 Protect dashboard routes
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // 🔄 Refresh user data when entering dashboard
  useEffect(() => {
    if (user) {
      refreshUser();
    }
  }, [user]);

  // ⏳ Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center animate-pulse">
            <TrendingUp size={22} className="text-white" />
          </div>

          <p className="text-white/40 text-sm tracking-wide">
            Preparing dashboard...
          </p>
        </div>
      </div>
    );
  }

  // 🚫 If user not authenticated
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#07070f] flex">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 lg:pl-64 min-h-screen">
        {/* Top Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 px-4 lg:px-8 py-6 pb-24 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
