"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Activity,
  Layers,
  ArrowDownCircle,
  Receipt,
  BookOpen,
  User,
  ShieldCheck,
  LogOut,
  TrendingUp,
} from "lucide-react";

import { ArrowUpCircle } from "lucide-react";

const userLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/services", label: "Services", icon: Layers },
  { href: "/dashboard/deposit", label: "Deposit", icon: ArrowDownCircle },
  { href: "/dashboard/withdrawal", label: "Withdrawal", icon: ArrowUpCircle },
  { href: "/dashboard/transactions", label: "Transactions", icon: Receipt },
  { href: "/dashboard/articles", label: "Articles", icon: BookOpen },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

const adminLinks = [
  { href: "/admin", label: "Overview", icon: ShieldCheck },
  { href: "/admin/users", label: "Users", icon: User },
  { href: "/admin/deposits", label: "Deposits", icon: ArrowDownCircle },
  { href: "/admin/withdrawals", label: "Withdrawals", icon: ArrowUpCircle },
  { href: "/admin/services", label: "Services", icon: Layers },
  { href: "/admin/articles", label: "Articles", icon: BookOpen },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: Activity },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  // ✅ Show admin links for admins, user links for users — never mixed
  const isAdmin = user?.role === "admin";
  const links = isAdmin ? adminLinks : userLinks;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-[#0a0a0f] border-r border-white/5 fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <TrendingUp size={16} className="text-white" />
          </div>
          <span
            className="text-white font-bold text-lg tracking-tight"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Bstock
          </span>
        </div>
      </div>

      {/* User info */}
      {user && (
        <Link
          href={isAdmin ? "/admin" : "/dashboard/profile"}
          className="px-4 py-4 mt-4 bg-white/5 border border-x-0 border-white/10"
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0
              ${
                isAdmin
                  ? "bg-gradient-to-br from-amber-400 to-orange-500"
                  : "bg-gradient-to-br from-violet-400 to-indigo-500"
              }`}
            >
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-2">
                <p className="text-white text-sm font-semibold truncate">
                  {user.name}
                </p>
                {/* ✅ Role badge so admin always knows their role */}
                <span
                  className={`text-[8px] font-bold px-1.5 py-0.2 rounded-md uppercase tracking-wide flex-shrink-0
                  ${
                    isAdmin
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                  }`}
                >
                  {user.role}
                </span>
              </div>
              <p className="text-white/40 text-xs truncate">{user.email}</p>
            </div>
          </div>

          {/* ✅ Only show balance for regular users — not admins */}
          {!isAdmin && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="text-white/40 text-xs mb-1">Available Balance</p>
              <p className="text-emerald-400 font-bold text-lg">
                ${user.balance?.toFixed(2) ?? "0.00"}
              </p>
            </div>
          )}
        </Link>
      )}

      {/* Navigation */}
      <nav className="flex-1 mt-4 space-y-0.5">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/dashboard" || href === "/admin"
              ? pathname === href
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 border-x-0 text-sm text-white font-medium transition-all duration-200 group
                ${
                  isActive
                    ? isAdmin
                      ? "bg-amber-600  border border-amber-500/30"
                      : "bg-violet-600  border border-violet-500/30"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
            >
              <Icon
                size={17}
                className={`flex-shrink-0 transition-colors ${
                  isActive
                    ? isAdmin
                      ? "text-white"
                      : "text-white"
                    : "text-white/40 group-hover:text-white/70"
                }`}
              />
              {label}
              {isActive && (
                <div
                  className={`ml-auto w-1.5 h-1.5 rounded-full ${isAdmin ? "bg-amber-400" : "bg-violet-400"}`}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="pb-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 py-2.5 px-3 text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}