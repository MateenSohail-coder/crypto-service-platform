"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import { Shield } from "lucide-react";

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
        return;
      }

      if (user.role !== "admin") {
        router.replace("/dashboard");
        return;
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          {/* Loader Box */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center animate-pulse">
            <Shield size={22} className="text-white" />
          </div>

          <p className="text-white/40 text-sm tracking-wide">
            Loading admin panel...
          </p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-[#07070f] flex">
      {/* subtle admin background tint */}
      <div className="fixed inset-0 bg-gradient-to-br from-amber-950/10 via-transparent to-transparent pointer-events-none z-0" />

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1 lg:pl-64 min-h-screen relative z-10">
        <Navbar />

        <main className="flex-1 px-4 lg:px-8 py-6 pb-24 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile navigation */}
      <BottomNav />
    </div>
  );
}
