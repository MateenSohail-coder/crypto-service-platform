"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Bell, TrendingUp, Search, Menu } from "lucide-react";

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
    <header className="sticky top-0 z-30 bg-[#0a0a0f]/80 backdrop-blur-2xl border-b border-white/[0.05] px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between max-w-full">
        {/* Mobile logo + Title */}
        <div className="flex items-center gap-3">
          <div className="lg:hidden w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <TrendingUp size={14} className="text-white" />
          </div>
          <h1 className="text-white font-semibold text-lg tracking-tight">
            {title}
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Search (desktop) */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <Search size={14} className="text-white/30" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-white/50 text-sm placeholder-white/30 w-32 focus:w-48 transition-all duration-200"
            />
          </div>

          {/* Mobile balance */}
          {user && !pathname.startsWith("/admin") && (
            <div className="lg:hidden flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-emerald-400 font-bold text-sm">
                ${user.balance?.toFixed(2) ?? "0.00"}
              </span>
            </div>
          )}

          {/* Notification bell */}
          <button className="relative w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06] transition-all duration-200">
            <Bell size={16} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-violet-500 shadow-lg shadow-violet-500/50" />
          </button>
        </div>
      </div>
    </header>
  );
}

