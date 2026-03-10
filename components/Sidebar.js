"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Layers,
  ArrowDownCircle,
  Receipt,
  BookOpen,
  User,
  ShieldCheck,
  LogOut,
  TrendingUp,
  Wallet,
} from "lucide-react";

const userLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/services", label: "Services", icon: Layers },
  { href: "/dashboard/deposit", label: "Deposit", icon: ArrowDownCircle },
  { href: "/dashboard/transactions", label: "Transactions", icon: Receipt },
  { href: "/dashboard/articles", label: "Articles", icon: BookOpen },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

const adminLinks = [
  { href: "/admin", label: "Overview", icon: ShieldCheck },
  { href: "/admin/users", label: "Users", icon: User },
  { href: "/admin/deposits", label: "Deposits", icon: ArrowDownCircle },
  { href: "/admin/services", label: "Services", icon: Layers },
  { href: "/admin/articles", label: "Articles", icon: BookOpen },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const isAdmin = pathname.startsWith("/admin");
  const links = isAdmin ? adminLinks : userLinks;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-[#0a0a0f]/95 backdrop-blur-xl border-r border-white/[0.05] fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/[0.05]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <TrendingUp size={18} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            NexVault
          </span>
        </div>
      </div>

      {/* User info */}
      {user && (
        <div className="mx-3 mt-4 p-3 rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-500/5 border border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg shadow-violet-500/20">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-sm font-semibold truncate">
                {user.name}
              </p>
              <p className="text-white/40 text-xs truncate">{user.email}</p>
            </div>
          </div>
          {!isAdmin && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Wallet size={12} className="text-emerald-400" />
                  <p className="text-white/40 text-xs">Balance</p>
                </div>
                <p className="text-emerald-400 font-bold text-sm">
                  ${user.balance?.toFixed(2) ?? "0.00"}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-5 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/dashboard" || href === "/admin"
              ? pathname === href
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${
                  isActive
                    ? "bg-gradient-to-r from-violet-600/20 to-violet-500/10 text-violet-300 border border-violet-500/20"
                    : "text-white/45 hover:text-white hover:bg-white/[0.03] border border-transparent"
                }`}
            >
              <div
                className={`p-1.5 rounded-lg transition-all duration-200 ${isActive ? "bg-violet-500/20" : "group-hover:bg-white/[0.05]"}`}
              >
                <Icon
                  size={16}
                  className={`transition-colors ${
                    isActive
                      ? "text-violet-400"
                      : "text-white/40 group-hover:text-white/70"
                  }`}
                />
              </div>
              {label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400 shadow-lg shadow-violet-400/50" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Admin toggle */}
      {user?.role === "admin" && (
        <div className="px-3 mb-2">
          <Link
            href={isAdmin ? "/dashboard" : "/admin"}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-amber-400/70 hover:text-amber-300 hover:bg-amber-500/10 transition-all duration-200 border border-amber-500/15"
          >
            <div className="p-1.5 rounded-lg">
              <ShieldCheck size={16} />
            </div>
            {isAdmin ? "User Panel" : "Admin Panel"}
          </Link>
        </div>
      )}

      {/* Logout */}
      <div className="px-3 pb-5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <div className="p-1.5 rounded-lg">
            <LogOut size={16} />
          </div>
          Sign Out
        </button>
      </div>
    </aside>
  );
}

