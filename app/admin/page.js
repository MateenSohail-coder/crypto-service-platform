"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  ArrowDownCircle,
  Clock,
  DollarSign,
  Layers,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  CheckCircle,
  XCircle,
  Wifi,
  Activity,
  BarChart3,
  Zap,
} from "lucide-react";

function StatCard({ label, value, sub, icon: Icon, accentColor, delay }) {
  return (
    <div
      className="animate-fade-in-up relative bg-[#0c0c15] border border-white/[0.07] rounded-sm p-5 overflow-hidden group hover:border-white/[0.13] transition-all duration-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Corner accent bar */}
      <div
        className={`absolute top-0 left-0 w-full h-[2px] ${accentColor} opacity-60 group-hover:opacity-100 transition-opacity`}
      />

      {/* Subtle glow */}
      <div
        className={`absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${accentColor}`}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-9 h-9 rounded-sm flex items-center justify-center bg-white/[0.04] border border-white/[0.07]`}
          >
            <Icon size={16} className="text-white/60" />
          </div>
          <Activity size={12} className="text-white/15 mt-1" />
        </div>
        <p className="text-white/35 text-[10px] font-medium uppercase tracking-[0.18em] mb-1.5">
          {label}
        </p>
        <p className="text-white text-3xl font-bold tracking-tight leading-none mb-1">
          {value}
        </p>
        {sub && <p className="text-white/25 text-[11px] mt-2">{sub}</p>}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending: {
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      icon: Clock,
    },
    approved: {
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      icon: CheckCircle,
    },
    rejected: {
      color: "text-red-400 bg-red-500/10 border-red-500/20",
      icon: XCircle,
    },
  };
  const { color, icon: Icon } = map[status] || map.pending;
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-sm border ${color}`}
    >
      <Icon size={10} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function ToastContainer({ toasts, onClose }) {
  return (
    <div className="fixed bottom-6 right-4 lg:right-6 z-[100] flex flex-col gap-2 items-end pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-sm border shadow-2xl backdrop-blur-sm max-w-sm w-full animate-fade-in-up
            ${
              t.type === "success"
                ? "bg-emerald-950/95 border-emerald-500/30 text-emerald-200"
                : t.type === "warning"
                  ? "bg-amber-950/95 border-amber-500/30 text-amber-200"
                  : t.type === "info"
                    ? "bg-indigo-950/95 border-indigo-500/30 text-indigo-200"
                    : "bg-red-950/95 border-red-500/30 text-red-200"
            }`}
        >
          <div className="flex-1 min-w-0">
            {t.title && (
              <p className="font-semibold text-sm mb-0.5">{t.title}</p>
            )}
            <p className="text-xs opacity-80 leading-relaxed">{t.message}</p>
          </div>
          <button
            onClick={() => onClose(t.id)}
            className="opacity-50 hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5 text-current"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [recentDeposits, setRecentDeposits] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [liveIndicator, setLiveIndicator] = useState(false);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-4), { ...toast, id }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      5000,
    );
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const fetchData = useCallback(async (silent = false) => {
    const token = localStorage.getItem("token");
    if (!token || token === "null") return;
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [depRes, usersRes] = await Promise.all([
        fetch("/api/deposits/approve", { headers }),
        fetch("/api/admin/users", { headers }),
      ]);

      const depData = await depRes.json();
      const usersData = await usersRes.json();

      if (depData.success) {
        const deposits = depData.deposits;
        setRecentDeposits(deposits.slice(0, 5));
        const totalDeposited = deposits
          .filter((d) => d.status === "approved")
          .reduce((sum, d) => sum + d.amount, 0);
        setStats((prev) => ({
          ...prev,
          totalDeposited,
          pendingDeposits: deposits.filter((d) => d.status === "pending")
            .length,
          totalDeposits: deposits.length,
        }));
      }

      if (usersData.success) {
        setRecentUsers(usersData.users.slice(0, 5));
        setStats((prev) => ({ ...prev, totalUsers: usersData.users.length }));
      }
    } catch (err) {
      console.error("Admin overview error:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const onNewDeposit = (e) => {
      const data = e.detail || {};
      setLiveIndicator(true);
      setTimeout(() => setLiveIndicator(false), 3000);
      addToast({
        type: "warning",
        title: "💰 New Deposit Request",
        message: `$${data.amount ?? "—"} deposit submitted and awaiting your review.`,
      });
      fetchData(true);
    };
    const onNewUser = (e) => {
      const data = e.detail || {};
      setLiveIndicator(true);
      setTimeout(() => setLiveIndicator(false), 3000);
      addToast({
        type: "info",
        title: "👤 New User Registered",
        message: `${data.name ?? "Someone"} just created an account.`,
      });
      fetchData(true);
    };
    const onDepositReviewed = () => {
      fetchData(true);
    };

    window.addEventListener("sse:new_deposit", onNewDeposit);
    window.addEventListener("sse:new_user", onNewUser);
    window.addEventListener("sse:deposit_reviewed", onDepositReviewed);
    return () => {
      window.removeEventListener("sse:new_deposit", onNewDeposit);
      window.removeEventListener("sse:new_user", onNewUser);
      window.removeEventListener("sse:deposit_reviewed", onDepositReviewed);
    };
  }, [fetchData, addToast]);

  const quickAccess = [
    {
      href: "/admin/users",
      label: "Manage Users",
      icon: Users,
      color: "text-indigo-400",
      bg: "bg-indigo-500/8",
      border: "border-indigo-500/20",
      bar: "bg-indigo-500",
    },
    {
      href: "/admin/deposits",
      label: "Review Deposits",
      icon: ArrowDownCircle,
      color: "text-amber-400",
      bg: "bg-amber-500/8",
      border: "border-amber-500/20",
      bar: "bg-amber-500",
    },
    {
      href: "/admin/services",
      label: "Manage Services",
      icon: Layers,
      color: "text-violet-400",
      bg: "bg-violet-500/8",
      border: "border-violet-500/20",
      bar: "bg-violet-500",
    },
    {
      href: "/admin/articles",
      label: "Manage Articles",
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/8",
      border: "border-emerald-500/20",
      bar: "bg-emerald-500",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* ── Header ── */}
      <div className="animate-fade-in-up flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-sm bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/25 flex items-center justify-center">
              <ShieldCheck size={20} className="text-amber-400" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#07070f]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-white text-2xl font-bold tracking-tight">
                Admin Overview
              </h1>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-sm bg-amber-500/10 border border-amber-500/20 text-amber-400 tracking-wider uppercase">
                Root
              </span>
            </div>
            <p className="text-white/35 text-sm mt-0.5">
              Platform-wide performance at a glance
            </p>
          </div>
        </div>

        {/* Live indicator */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border text-xs font-medium transition-all duration-500
          ${
            liveIndicator
              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
              : "bg-white/[0.03] border-white/[0.07] text-white/25"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${liveIndicator ? "bg-emerald-400 animate-pulse" : "bg-white/20"}`}
          />
          <Wifi size={11} />
          {liveIndicator ? "Updating..." : "Live"}
        </div>
      </div>

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Total Users"
          value={loading ? "—" : (stats?.totalUsers ?? 0)}
          sub="Registered accounts"
          icon={Users}
          accentColor="bg-indigo-500"
          delay={100}
        />
        <StatCard
          label="Total Deposited"
          value={
            loading ? "—" : `$${(stats?.totalDeposited ?? 0).toLocaleString()}`
          }
          sub="Approved deposits"
          icon={DollarSign}
          accentColor="bg-emerald-500"
          delay={200}
        />
        <StatCard
          label="Pending Deposits"
          value={loading ? "—" : (stats?.pendingDeposits ?? 0)}
          sub="Awaiting review"
          icon={Clock}
          accentColor="bg-amber-500"
          delay={300}
        />
        <StatCard
          label="Total Deposits"
          value={loading ? "—" : (stats?.totalDeposits ?? 0)}
          sub="All time"
          icon={BarChart3}
          accentColor="bg-violet-500"
          delay={400}
        />
      </div>

      {/* ── Quick access ── */}
      <div className="animate-fade-in-up" style={{ animationDelay: "350ms" }}>
        <div className="flex items-center gap-3 mb-4">
          <p className="text-white/35 text-[10px] font-medium uppercase tracking-[0.18em]">
            Quick Access
          </p>
          <div className="flex-1 h-px bg-white/[0.05]" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickAccess.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center justify-between px-4 py-4 rounded-sm border ${item.border} ${item.bg} hover:border-opacity-40 transition-all duration-200 group overflow-hidden`}
            >
              {/* Top accent */}
              <div
                className={`absolute top-0 left-0 w-full h-[2px] ${item.bar} opacity-40 group-hover:opacity-70 transition-opacity`}
              />
              <div className="flex items-center gap-3">
                <item.icon size={15} className={item.color} />
                <span className="text-white/60 text-sm font-medium group-hover:text-white/90 transition-colors">
                  {item.label}
                </span>
              </div>
              <ArrowRight
                size={13}
                className={`${item.color} opacity-30 group-hover:opacity-80 group-hover:translate-x-0.5 transition-all`}
              />
            </Link>
          ))}
        </div>
      </div>

      {/* ── Recent deposits + users ── */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Recent deposits */}
        <div className="animate-fade-in-up" style={{ animationDelay: "450ms" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <p className="text-white/35 text-[10px] font-medium uppercase tracking-[0.18em]">
                Recent Deposits
              </p>
              {!loading && (stats?.pendingDeposits ?? 0) > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-amber-500/15 border border-amber-500/25 text-amber-400">
                  {stats.pendingDeposits} pending
                </span>
              )}
            </div>
            <Link
              href="/admin/deposits"
              className="flex items-center gap-1 text-amber-400/70 hover:text-amber-400 text-[11px] font-medium transition-colors"
            >
              View all <ArrowRight size={11} />
            </Link>
          </div>

          <div className="bg-[#0c0c15] border border-white/[0.07] rounded-sm overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-3 px-5 py-2.5 border-b border-white/[0.05] bg-white/[0.02]">
              <span className="text-white/25 text-[10px] font-semibold uppercase tracking-widest">
                Amount
              </span>
              <span className="text-white/25 text-[10px] font-semibold uppercase tracking-widest">
                User
              </span>
              <span className="text-white/25 text-[10px] font-semibold uppercase tracking-widest text-right">
                Status
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-5 h-5 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
              </div>
            ) : recentDeposits.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-white/20">
                <ArrowDownCircle size={26} className="mb-2 opacity-30" />
                <p className="text-xs">No deposits yet</p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {recentDeposits.map((dep) => (
                  <div
                    key={dep._id}
                    className="grid grid-cols-3 items-center px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-sm bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                        <ArrowDownCircle size={12} className="text-amber-400" />
                      </div>
                      <span className="text-white text-sm font-bold">
                        ${dep.amount.toFixed(2)}
                      </span>
                    </div>
                    <span className="text-white/45 text-xs truncate pr-3">
                      {dep.userId?.name || "Unknown"}
                    </span>
                    <div className="flex justify-end">
                      <StatusBadge status={dep.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent users */}
        <div className="animate-fade-in-up" style={{ animationDelay: "550ms" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <p className="text-white/35 text-[10px] font-medium uppercase tracking-[0.18em]">
                Recent Users
              </p>
              {!loading && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-indigo-500/15 border border-indigo-500/25 text-indigo-400">
                  {stats?.totalUsers ?? 0} total
                </span>
              )}
            </div>
            <Link
              href="/admin/users"
              className="flex items-center gap-1 text-indigo-400/70 hover:text-indigo-400 text-[11px] font-medium transition-colors"
            >
              View all <ArrowRight size={11} />
            </Link>
          </div>

          <div className="bg-[#0c0c15] border border-white/[0.07] rounded-sm overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-3 px-5 py-2.5 border-b border-white/[0.05] bg-white/[0.02]">
              <span className="text-white/25 text-[10px] font-semibold uppercase tracking-widest col-span-2">
                User
              </span>
              <span className="text-white/25 text-[10px] font-semibold uppercase tracking-widest text-right">
                Balance
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              </div>
            ) : recentUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-white/20">
                <Users size={26} className="mb-2 opacity-30" />
                <p className="text-xs">No users yet</p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {recentUsers.map((u, i) => (
                  <div
                    key={u._id}
                    className="grid grid-cols-3 items-center px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-3 col-span-2">
                      <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-violet-500/25 to-indigo-500/25 border border-violet-500/15 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {u.name}
                        </p>
                        <p className="text-white/30 text-[11px] truncate">
                          {u.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <span className="text-emerald-400 text-sm font-bold">
                        ${u.balance?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toasts */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
