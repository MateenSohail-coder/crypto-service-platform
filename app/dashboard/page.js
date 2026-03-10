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
  Wallet,
  Activity,
} from "lucide-react";

function StatCard({ label, value, sub, icon: Icon, gradient, delay }) {
  return (
    <div
      className={`stat-card animate-fade-in-up hover-lift`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`stat-card-icon ${gradient}`}>
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 17) return "afternoon";
    return "evening";
  };

  const quickActions = [
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
  ];

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
          Good {getGreeting()},{" "}
          <span className="text-gradient">{user?.name?.split(" ")[0]}</span> 👋
        </h1>
      </div>

      {/* Balance hero */}
      <div
        className="hero-card animate-fade-in-up"
        style={{ animationDelay: "100ms" }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Wallet size={16} className="text-violet-400" />
            <p className="text-white/50 text-xs font-medium uppercase tracking-widest">
              Available Balance
            </p>
          </div>
          <p className="text-white text-5xl font-bold tracking-tight mb-1">
            ${user?.balance?.toFixed(2) ?? "0.00"}
          </p>
          <p className="text-white/40 text-sm mb-6">
            Total earned from commissions:{" "}
            <span className="text-emerald-400 font-semibold">
              ${totalEarned.toFixed(2)}
            </span>
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/deposit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-600/25 hover:shadow-violet-500/35 hover:-translate-y-0.5"
            >
              <ArrowDownCircle size={16} />
              Deposit
            </Link>
            <Link
              href="/dashboard/services"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-sm font-semibold transition-all border border-white/10 hover:border-white/20"
            >
              <Zap size={16} />
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
          gradient="bg-gradient-to-br from-indigo-500/20 to-indigo-600/10"
          delay={200}
        />
        <StatCard
          label="Commission Earned"
          value={`$${totalEarned.toFixed(2)}`}
          sub="All time"
          icon={TrendingUp}
          color="bg-emerald-500/20"
          gradient="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10"
          delay={300}
        />
        <StatCard
          label="Subscriptions Today"
          value={`${todaySubs}/24`}
          sub="Daily limit"
          icon={Layers}
          color="bg-violet-500/20"
          gradient="bg-gradient-to-br from-violet-500/20 to-violet-600/10"
          delay={400}
        />
        <StatCard
          label="Total Subscriptions"
          value={subscriptions.length}
          sub="All time"
          icon={Activity}
          color="bg-amber-500/20"
          gradient="bg-gradient-to-br from-amber-500/20 to-amber-600/10"
          delay={500}
        />
      </div>

      {/* Quick actions */}
      <div className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
        <h3 className="section-title mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href} className="quick-action">
              <div
                className={`w-9 h-9 rounded-lg ${action.bg} flex items-center justify-center`}
              >
                <action.icon size={16} className={action.color} />
              </div>
              <span className="text-white/60 text-sm font-medium">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent deposits */}
      <div className="animate-fade-in-up" style={{ animationDelay: "400ms" }}>
        <div className="section-header">
          <h3 className="section-title">Recent Deposits</h3>
          <Link
            href="/dashboard/transactions"
            className="text-violet-400 hover:text-violet-300 text-xs transition-colors"
          >
            View all →
          </Link>
        </div>
        <div className="table-container">
          {loadingData ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
            </div>
          ) : deposits.length === 0 ? (
            <div className="empty-state">
              <ArrowDownCircle size={40} />
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
                  className="table-row flex items-center justify-between px-5 py-4"
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
    </div>
  );
}

