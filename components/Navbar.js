"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Bell, TrendingUp } from "lucide-react";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/dashboard/services": "Services",
  "/dashboard/deposit": "Deposit",
  "/dashboard/transactions": "Transactions",
  "/dashboard/articles": "Articles",
  "/dashboard/profile": "Profile",
  "/admin": "Admin Overview",
  "/admin/users": "Manage Users",
  "/admin/deposits": "Manage Deposits",
  "/admin/services": "Manage Services",
  "/admin/articles": "Manage Articles",
};

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const title = pageTitles[pathname] || "Dashboard";

  return (
    <header className="sticky top-0 z-30 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between max-w-full">
        {/* Mobile logo + Title */}
        <div className="flex items-center gap-3">
          <div className="lg:hidden w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <TrendingUp size={13} className="text-white" />
          </div>
          <h1
            className="text-white font-semibold text-lg"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            {title}
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Mobile balance */}
          {user && !pathname.startsWith("/admin") && (
            <div className="lg:hidden flex flex-col items-end">
              <span className="text-white/40 text-[10px]">Balance</span>
              <span className="text-emerald-400 font-bold text-sm">
                ${user.balance?.toFixed(2) ?? "0.00"}
              </span>
            </div>
          )}

          {/* Notification bell */}
          <button className="relative w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-violet-500" />
          </button>
        </div>
      </div>
    </header>
  );
}
