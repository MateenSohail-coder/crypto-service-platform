"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
  TrendingUp,
  ArrowDownCircle,
  Layers,
  Receipt,
  Zap,
  Info,
  ArrowUpRight,
  Clock,
  CheckCircle,
  XCircle,
  Wallet,
  AlertTriangle,
  Activity,
  Wifi,
  CreditCard,
} from "lucide-react";

function StatCard({ label, value, sub, icon: Icon, gradient, delay }) {
  return (
    <div
      className="animate-fade-in-up bg-[#191929] border border-white/8 rounded-sm p-5 hover:border-white/15 transition-all duration-300 relative overflow-hidden group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${gradient}`}
      >
        <Icon size={18} className="text-white" />
      </div>
      <p className="text-white/40 text-xs mb-1">{label}</p>
      <p className="text-white text-2xl font-bold tracking-tight">{value}</p>
      {sub && <p className="text-white/30 text-xs mt-1">{sub}</p>}
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
      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${color}`}
    >
      <Icon size={11} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// ── inline Toast ──────────────────────────────────────────────────────────────
function ToastContainer({ toasts, onClose }) {
  return (
    <div className="fixed bottom-24 lg:bottom-6 right-4 lg:right-6 z-[100] flex flex-col gap-3 items-end pointer-events-none">
      {toasts.map((t) => {
        const styles = {
          success: {
            icon: <CheckCircle size={18} />,
            class: "bg-emerald-900/90 border-emerald-500/40 text-emerald-100",
            progress: "bg-emerald-500",
          },
          error: {
            icon: <XCircle size={18} />,
            class: "bg-red-900/90 border-red-500/40 text-red-100",
            progress: "bg-red-500",
          },
          warning: {
            icon: <AlertTriangle size={18} />,
            class: "bg-amber-900/90 border-amber-500/40 text-amber-100",
            progress: "bg-amber-500",
          },
          info: {
            icon: <Info size={18} />,
            class: "bg-indigo-900/90 border-indigo-500/40 text-indigo-100",
            progress: "bg-indigo-500",
          },
        };

        const s = styles[t.type] || styles.info;

        return (
          <div
            key={t.id}
            className={`pointer-events-auto relative overflow-hidden flex items-start gap-3 p-4 rounded-sm border backdrop-blur-md shadow-xl max-w-sm w-full animate-fade-in-up ${s.class}`}
          >
            {/* icon */}
            <div className="mt-0.5 opacity-90">{s.icon}</div>

            {/* content */}
            <div className="flex-1 min-w-0">
              {t.title && (
                <p className="font-semibold text-sm leading-tight">{t.title}</p>
              )}
              <p className="text-xs opacity-80 mt-1 leading-relaxed">
                {t.message}
              </p>
            </div>

            {/* close button */}
            <button
              onClick={() => onClose(t.id)}
              className="text-lg leading-none opacity-40 hover:opacity-100 transition"
            >
              ×
            </button>

            {/* progress bar */}
            <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/10">
              <div className={`h-full ${s.progress} animate-toast-progress`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function DashboardPage() {
  const { user, refreshUser } = useAuth();
  const [deposits, setDeposits] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [toasts, setToasts] = useState([]);

  // ── toast helpers ─────────────────────────────────────────────────────────
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

  // ── data fetcher ──────────────────────────────────────────────────────────
  const fetchData = useCallback(async (silent = false) => {
    const token = localStorage.getItem("token");
    if (!token || token === "null" || token === "undefined") {
      setLoadingData(false);
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [depRes, subRes] = await Promise.all([
        fetch("/api/deposits/create", { headers }),
        fetch("/api/services/subscribe", { headers }),
      ]);

      const depData = await depRes.json();
      const subData = await subRes.json();

      if (depData.success) setDeposits(depData.deposits);
      if (subData.success) setSubscriptions(subData.subscriptions);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      if (!silent) setLoadingData(false);
    }
  }, []);

  // initial load
  useEffect(() => {
    refreshUser();
    fetchData();
  }, []);

  // auto-refresh balance every 30s
  useEffect(() => {
    const interval = setInterval(() => refreshUser(), 30000);
    return () => clearInterval(interval);
  }, [refreshUser]);

  // ── SSE listeners ─────────────────────────────────────────────────────────
  useEffect(() => {
    // Deposit approved → toast + refresh balance + refresh deposits list
    const onApproved = async (e) => {
      const data = e.detail || {};
      addToast({
        type: "success",
        title: "Deposit Approved!",
        message: `$${data.amount} has been added to your balance. New balance: $${data.newBalance?.toFixed(2) ?? "—"}`,
      });
      await refreshUser(); // update balance in header immediately
      fetchData(true); // update deposit list silently
    };

    // Deposit rejected → toast + refresh deposits list
    const onRejected = (e) => {
      const data = e.detail || {};
      addToast({
        type: "error",
        title: "❌ Deposit Rejected",
        message: `Your deposit of $${data.amount} was rejected. Contact support if needed.`,
      });
      fetchData(true);
    };

    window.addEventListener("sse:deposit_approved", onApproved);
    window.addEventListener("sse:deposit_rejected", onRejected);

    return () => {
      window.removeEventListener("sse:deposit_approved", onApproved);
      window.removeEventListener("sse:deposit_rejected", onRejected);
    };
  }, [addToast, refreshUser, fetchData]);

  // ── computed ──────────────────────────────────────────────────────────────
  const totalDeposited = deposits
    .filter((d) => d.status === "approved")
    .reduce((sum, d) => sum + d.amount, 0);

  const totalEarned = subscriptions.reduce(
    (sum, s) => sum + s.commissionEarned,
    0,
  );
  const todaySubs = user?.subscriptionsToday || 0;

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Welcome */}
      <div className="animate-fade-in-up">
        <p className="text-white/40 text-sm mb-1">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <h1 className="text-white text-2xl font-bold tracking-tight">
          Welcome ,
          <span className="text-violet-400 py-1 px-2 rounded-sm bg-violet-500/10">
            {user?.name?.split(" ")[0]}
          </span>{" "}
        </h1>
      </div>

      {/* Balance hero — credit card */}
      <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        {/* Card */}
        <div
          className="relative w-full rounded-2xl overflow-hidden select-none group transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-[1.01]"
          style={{
            aspectRatio: "1.586 / 1",
            maxWidth: 420,
            boxShadow:
              "0 40px 80px -12px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)",
          }}
        >
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1040] via-[#110d2e] to-[#07060f]" />

          {/* Holographic shimmer */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-60 group-hover:opacity-80"
            style={{
              mixBlendMode: "screen",
              background:
                "radial-gradient(ellipse at 20% 30%, rgba(139,92,246,0.55) 0%, transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(99,102,241,0.45) 0%, transparent 55%), radial-gradient(ellipse at 60% 10%, rgba(167,139,250,0.3) 0%, transparent 45%)",
            }}
          />

          {/* Grid texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Gloss streak */}
          <div
            className="absolute pointer-events-none opacity-[0.065]"
            style={{
              top: -48,
              left: -32,
              width: "55%",
              height: "180%",
              transform: "rotate(20deg)",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent)",
            }}
          />

          {/* Hover diagonal shimmer */}
          <div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background:
                "linear-gradient(135deg, transparent 40%, rgba(167,139,250,0.1) 50%, transparent 60%)",
            }}
          />

          {/* Card content */}
          <div className="relative z-10 h-full flex flex-col justify-between p-6">
            {/* Top: logo + contactless */}
            <div className="flex items-start justify-between">
              <div>
                <p
                  className="text-white font-black text-xl leading-none"
                  style={{ letterSpacing: "-0.04em" }}
                >
                  Bstocks
                </p>
                <p className="text-violet-300/55 text-[8px] tracking-[0.25em] uppercase font-medium mt-0.5">
                  Wealth Platform
                </p>
              </div>
              <Wifi
                size={20}
                strokeWidth={1.5}
                className="text-white/55 rotate-90 mt-0.5"
              />
            </div>

            {/* Middle: chip + balance */}
            <div className="flex items-end justify-between">
              <div>
                <CreditCard
                  size={44}
                  strokeWidth={1}
                  className="text-amber-400/80"
                />
                {/* Masked PAN */}
                <p className="text-white/40 text-[10px] tracking-[0.22em] font-mono mt-2">
                  •••• &nbsp;•••• &nbsp;•••• &nbsp;4291
                </p>
              </div>

              {/* Balance */}
              <div className="text-right">
                <p className="text-white/40 text-[8px] tracking-[0.2em] uppercase font-medium mb-1">
                  Available Balance
                </p>
                <p
                  className="text-white font-black leading-none"
                  style={{
                    fontSize: "clamp(1.5rem, 5.5vw, 2.2rem)",
                    letterSpacing: "-0.03em",
                    textShadow: "0 0 30px rgba(167,139,250,0.65)",
                  }}
                >
                  ${user?.balance?.toFixed(2) ?? "0.00"}
                </p>
              </div>
            </div>

            {/* Bottom: cardholder + network */}
            <div className="flex items-end justify-between">
              <div>
                <p className="text-white/30 text-[8px] tracking-[0.2em] uppercase mb-1">
                  Card Holder
                </p>
                <p className="text-white/80 text-sm font-semibold tracking-widest uppercase">
                  {user?.name ?? user?.email?.split("@")[0] ?? "Account Holder"}
                </p>
              </div>
              {/* Network circles */}
              <div className="flex items-center">
                <div
                  className="w-[30px] h-[30px] rounded-full bg-red-500/80 -mr-2.5"
                  style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
                />
                <div
                  className="w-[30px] h-[30px] rounded-full bg-amber-400/80"
                  style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
                />
              </div>
            </div>
          </div>

          {/* Edge ring */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }}
          />
        </div>

        {/* Earned + actions */}
        <p className="text-white/35 text-xs mt-4 mb-5 pl-1">
          Total earned from commissions:{" "}
          <span className="text-emerald-400 font-semibold">
            ${totalEarned.toFixed(2)}
          </span>
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/deposit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-sm bg-violet-600 hover:bg-violet-500 active:scale-95 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-600/30"
          >
            <ArrowDownCircle size={16} /> Deposit
          </Link>
          <Link
            href="/dashboard/services"
            className="flex items-center gap-2 px-5 py-2.5 rounded-sm bg-white/[0.05] hover:bg-white/[0.1] active:scale-95 text-white text-sm font-semibold transition-all border border-white/10"
          >
            <Zap size={16} /> Subscribe
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Deposited"
          value={`$${totalDeposited.toFixed(0)}`}
          sub="Approved deposits"
          icon={ArrowDownCircle}
          gradient="bg-gradient-to-br from-indigo-500/20 to-indigo-600/10"
          delay={200}
        />
        <StatCard
          label="Commission Earned"
          value={`$${totalEarned.toFixed(2)}`}
          sub="All time"
          icon={TrendingUp}
          gradient="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10"
          delay={300}
        />
        <StatCard
          label="Subscriptions Today"
          value={`${todaySubs}/24`}
          sub="Daily limit"
          icon={Layers}
          gradient="bg-gradient-to-br from-violet-500/20 to-violet-600/10"
          delay={400}
        />
        <StatCard
          label="Total Subscriptions"
          value={subscriptions.length}
          sub="All time"
          icon={Activity}
          gradient="bg-gradient-to-br from-amber-500/20 to-amber-600/10"
          delay={500}
        />
      </div>

      {/* Quick actions */}
      <div className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
        <h3 className="text-white/40 text-xs font-medium uppercase tracking-widest mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              href: "/dashboard/deposit",
              label: "Make Deposit",
              icon: ArrowDownCircle,
              color: "text-indigo-400",
              bg: "bg-indigo-500/10",
            },
            {
              href: "/dashboard/services",
              label: "Browse Services",
              icon: Layers,
              color: "text-violet-400",
              bg: "bg-violet-500/10",
            },
            {
              href: "/dashboard/transactions",
              label: "View History",
              icon: Receipt,
              color: "text-amber-400",
              bg: "bg-amber-500/10",
            },
            {
              href: "/dashboard/articles",
              label: "Read Articles",
              icon: ArrowUpRight,
              color: "text-emerald-400",
              bg: "bg-emerald-500/10",
            },
          ].map(({ href, label, icon: Icon, color, bg }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 bg-[#0f0f1a] border border-white/8 rounded-sm px-2 md:px-4 py-3 hover:border-white/20 hover:bg-white/5 transition-all duration-200 group"
            >
              <div
                className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}
              >
                <Icon size={16} className={color} />
              </div>
              <span className="text-white/60 text-[11px] md:text-sm  group-hover:text-white transition-colors">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent deposits */}
      <div className="animate-fade-in-up" style={{ animationDelay: "400ms" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white/40 text-xs font-medium uppercase tracking-widest">
            Recent Deposits
          </h3>
          <Link
            href="/dashboard/transactions"
            className="text-violet-400 hover:text-violet-300 text-xs transition-colors"
          >
            View all →
          </Link>
        </div>
        <div className="bg-[#0f0f1a] border border-white/8 rounded-sm overflow-hidden">
          {loadingData ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
            </div>
          ) : deposits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-white/30">
              <ArrowDownCircle size={40} className="mb-3 opacity-30" />
              <p className="text-sm">No deposits yet</p>
              <Link
                href="/dashboard/deposit"
                className="mt-3 text-violet-400 hover:text-violet-300 text-xs transition-colors"
              >
                Make your first deposit →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {deposits.slice(0, 5).map((dep) => (
                <div
                  key={dep._id}
                  className="flex items-center justify-between px-5 py-4 hover:bg-white/3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                      <ArrowDownCircle size={18} className="text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">
                        ${dep.amount.toFixed(2)}
                      </p>
                      <p className="text-white/30 text-xs font-mono truncate max-w-[140px]">
                        {dep.txHash}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <StatusBadge status={dep.status} />
                    <p className="text-white/25 text-xs">
                      {new Date(dep.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toasts */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
