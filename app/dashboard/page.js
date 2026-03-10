"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
  TrendingUp,
  ArrowDownCircle,
  Layers,
  Receipt,
  Zap,
  ArrowUpRight,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

function StatCard({ label, value, sub, icon: Icon, color, delay }) {
  return (
    <div
      className={`animate-fade-in-up bg-[#0f0f1a] border border-white/8 rounded-2xl p-5 hover:border-white/15 transition-all duration-300 delay-${delay}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}
        >
          <Icon size={17} className="text-white" />
        </div>
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

export default function DashboardPage() {
  const { user, updateUser } = useAuth();
  const [deposits, setDeposits] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
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
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

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
        <h2 className="text-white/40 text-sm mb-1">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </h2>
        <h1 className="text-white text-2xl font-bold tracking-tight">
          Good{" "}
          {new Date().getHours() < 12
            ? "morning"
            : new Date().getHours() < 17
              ? "afternoon"
              : "evening"}
          , <span className="text-violet-400">{user?.name?.split(" ")[0]}</span>{" "}
          👋
        </h1>
      </div>

      {/* Balance hero */}
      <div className="animate-fade-in-up delay-100 relative bg-gradient-to-br from-violet-900/40 via-indigo-900/20 to-[#0f0f1a] border border-violet-500/20 rounded-2xl p-6 overflow-hidden animate-pulse-glow">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-2">
            Available Balance
          </p>
          <p className="text-white text-5xl font-bold tracking-tight mb-1">
            ${user?.balance?.toFixed(2) ?? "0.00"}
          </p>
          <p className="text-white/30 text-sm">
            Total earned from commissions:{" "}
            <span className="text-emerald-400 font-semibold">
              ${totalEarned.toFixed(2)}
            </span>
          </p>
          <div className="flex gap-3 mt-5">
            <Link
              href="/dashboard/deposit"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-600/25"
            >
              <ArrowDownCircle size={15} />
              Deposit
            </Link>
            <Link
              href="/dashboard/services"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-all border border-white/10"
            >
              <Zap size={15} />
              Subscribe
            </Link>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Deposited"
          value={`$${totalDeposited.toFixed(0)}`}
          sub="Approved deposits"
          icon={ArrowDownCircle}
          color="bg-indigo-500/20"
          delay={100}
        />
        <StatCard
          label="Commission Earned"
          value={`$${totalEarned.toFixed(2)}`}
          sub="All time"
          icon={TrendingUp}
          color="bg-emerald-500/20"
          delay={200}
        />
        <StatCard
          label="Subscriptions Today"
          value={`${todaySubs}/24`}
          sub="Daily limit"
          icon={Layers}
          color="bg-violet-500/20"
          delay={300}
        />
        <StatCard
          label="Total Subscriptions"
          value={subscriptions.length}
          sub="All time"
          icon={Receipt}
          color="bg-amber-500/20"
          delay={400}
        />
      </div>

      {/* Quick actions */}
      <div className="animate-fade-in-up delay-300">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-widest mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              href: "/dashboard/deposit",
              label: "Make Deposit",
              icon: ArrowDownCircle,
              color: "text-indigo-400",
            },
            {
              href: "/dashboard/services",
              label: "Browse Services",
              icon: Layers,
              color: "text-violet-400",
            },
            {
              href: "/dashboard/transactions",
              label: "View History",
              icon: Receipt,
              color: "text-amber-400",
            },
            {
              href: "/dashboard/articles",
              label: "Read Articles",
              icon: ArrowUpRight,
              color: "text-emerald-400",
            },
          ].map(({ href, label, icon: Icon, color }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 bg-[#0f0f1a] border border-white/8 rounded-xl px-4 py-3 hover:border-white/20 hover:bg-white/5 transition-all duration-200 group"
            >
              <Icon size={16} className={`${color} flex-shrink-0`} />
              <span className="text-white/60 text-sm group-hover:text-white transition-colors">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent deposits */}
      <div className="animate-fade-in-up delay-400">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white/50 text-xs font-medium uppercase tracking-widest">
            Recent Deposits
          </h3>
          <Link
            href="/dashboard/transactions"
            className="text-violet-400 hover:text-violet-300 text-xs transition-colors"
          >
            View all →
          </Link>
        </div>
        <div className="bg-[#0f0f1a] border border-white/8 rounded-2xl overflow-hidden">
          {loadingData ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
            </div>
          ) : deposits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-white/30">
              <ArrowDownCircle size={32} className="mb-3 opacity-30" />
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
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                      <ArrowDownCircle size={15} className="text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">
                        ${dep.amount.toFixed(2)}
                      </p>
                      <p className="text-white/30 text-xs font-mono truncate max-w-[140px]">
                        {dep.txHash}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
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
    </div>
  );
}
