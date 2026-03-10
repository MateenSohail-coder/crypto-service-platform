"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  ArrowDownCircle,
  Clock,
  DollarSign,
  Layers,
  TrendingUp,
  CheckCircle,
  XCircle,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

function StatCard({ label, value, sub, icon: Icon, gradient, delay }) {
  return (
    <div
      className={`animate-fade-in-up bg-[#0f0f1a] border border-white/8 rounded-2xl p-5 hover:border-white/15 transition-all duration-300 delay-${delay} relative overflow-hidden group`}
    >
      <div
        className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${gradient}`}
      />
      <div className="relative z-10">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${gradient} bg-opacity-20`}
        >
          <Icon size={18} className="text-white" />
        </div>
        <p className="text-white/40 text-xs mb-1">{label}</p>
        <p className="text-white text-3xl font-bold tracking-tight">{value}</p>
        {sub && <p className="text-white/30 text-xs mt-1">{sub}</p>}
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
      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${color}`}
    >
      <Icon size={11} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [recentDeposits, setRecentDeposits] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
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
          const pendingCount = deposits.filter(
            (d) => d.status === "pending",
          ).length;

          setStats((prev) => ({
            ...prev,
            totalDeposited,
            pendingDeposits: pendingCount,
            totalDeposits: deposits.length,
          }));
        }

        if (usersData.success) {
          setRecentUsers(usersData.users.slice(0, 5));
          setStats((prev) => ({
            ...prev,
            totalUsers: usersData.users.length,
          }));
        }
      } catch (err) {
        console.error("Admin overview error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="animate-fade-in-up flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center">
          <ShieldCheck size={18} className="text-amber-400" />
        </div>
        <div>
          <h1 className="text-white text-2xl font-bold tracking-tight">
            Admin Overview
          </h1>
          <p className="text-white/40 text-sm">
            Platform-wide performance at a glance
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value={loading ? "—" : (stats?.totalUsers ?? 0)}
          sub="Registered accounts"
          icon={Users}
          gradient="bg-indigo-500/20"
          delay={100}
        />
        <StatCard
          label="Total Deposited"
          value={
            loading ? "—" : `$${(stats?.totalDeposited ?? 0).toLocaleString()}`
          }
          sub="Approved deposits"
          icon={DollarSign}
          gradient="bg-emerald-500/20"
          delay={200}
        />
        <StatCard
          label="Pending Deposits"
          value={loading ? "—" : (stats?.pendingDeposits ?? 0)}
          sub="Awaiting review"
          icon={Clock}
          gradient="bg-amber-500/20"
          delay={300}
        />
        <StatCard
          label="Total Deposits"
          value={loading ? "—" : (stats?.totalDeposits ?? 0)}
          sub="All time"
          icon={ArrowDownCircle}
          gradient="bg-violet-500/20"
          delay={400}
        />
      </div>

      {/* Quick nav cards */}
      <div className="animate-fade-in-up delay-300">
        <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-4">
          Quick Access
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              href: "/admin/users",
              label: "Manage Users",
              icon: Users,
              color: "text-indigo-400",
              bg: "bg-indigo-500/10 border-indigo-500/20",
            },
            {
              href: "/admin/deposits",
              label: "Review Deposits",
              icon: ArrowDownCircle,
              color: "text-amber-400",
              bg: "bg-amber-500/10 border-amber-500/20",
            },
            {
              href: "/admin/services",
              label: "Manage Services",
              icon: Layers,
              color: "text-violet-400",
              bg: "bg-violet-500/10 border-violet-500/20",
            },
            {
              href: "/admin/articles",
              label: "Manage Articles",
              icon: TrendingUp,
              color: "text-emerald-400",
              bg: "bg-emerald-500/10 border-emerald-500/20",
            },
          ].map(({ href, label, icon: Icon, color, bg }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center justify-between px-4 py-3.5 rounded-xl border ${bg} hover:opacity-80 transition-all duration-200 group`}
            >
              <div className="flex items-center gap-3">
                <Icon size={16} className={color} />
                <span className="text-white/70 text-sm font-medium group-hover:text-white transition-colors">
                  {label}
                </span>
              </div>
              <ArrowRight
                size={14}
                className={`${color} opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all`}
              />
            </Link>
          ))}
        </div>
      </div>

      {/* Two column: recent deposits + recent users */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent deposits */}
        <div className="animate-fade-in-up delay-400">
          <div className="flex items-center justify-between mb-4">
            <p className="text-white/40 text-xs font-medium uppercase tracking-widest">
              Recent Deposits
            </p>
            <Link
              href="/admin/deposits"
              className="text-amber-400 hover:text-amber-300 text-xs transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="bg-[#0f0f1a] border border-white/8 rounded-2xl overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-5 h-5 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
              </div>
            ) : recentDeposits.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-white/25">
                <ArrowDownCircle size={28} className="mb-2 opacity-30" />
                <p className="text-xs">No deposits yet</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {recentDeposits.map((dep) => (
                  <div
                    key={dep._id}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-white/3 transition-colors"
                  >
                    <div>
                      <p className="text-white text-sm font-semibold">
                        ${dep.amount.toFixed(2)}
                      </p>
                      <p className="text-white/35 text-xs">
                        {dep.userId?.name || "Unknown"}
                      </p>
                    </div>
                    <StatusBadge status={dep.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent users */}
        <div className="animate-fade-in-up delay-500">
          <div className="flex items-center justify-between mb-4">
            <p className="text-white/40 text-xs font-medium uppercase tracking-widest">
              Recent Users
            </p>
            <Link
              href="/admin/users"
              className="text-indigo-400 hover:text-indigo-300 text-xs transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="bg-[#0f0f1a] border border-white/8 rounded-2xl overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              </div>
            ) : recentUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-white/25">
                <Users size={28} className="mb-2 opacity-30" />
                <p className="text-xs">No users yet</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {recentUsers.map((u) => (
                  <div
                    key={u._id}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-white/3 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/30 to-indigo-500/30 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">
                          {u.name}
                        </p>
                        <p className="text-white/35 text-xs">{u.email}</p>
                      </div>
                    </div>
                    <span className="text-emerald-400 text-sm font-semibold">
                      ${u.balance?.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
