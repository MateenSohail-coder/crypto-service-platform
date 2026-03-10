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
  ShieldCheck,
  ArrowRight,
  CheckCircle,
  XCircle,
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
      <p className="text-white text-3xl font-bold tracking-tight">{value}</p>
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

  const quickAccess = [
    {
      href: "/admin/users",
      label: "Manage Users",
      icon: Users,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
    },
    {
      href: "/admin/deposits",
      label: "Review Deposits",
      icon: ArrowDownCircle,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      href: "/admin/services",
      label: "Manage Services",
      icon: Layers,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      href: "/admin/articles",
      label: "Manage Articles",
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
  ];

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
          gradient="bg-gradient-to-br from-indigo-500/20 to-indigo-600/10"
          delay={100}
        />
        <StatCard
          label="Total Deposited"
          value={
            loading ? "—" : `$${(stats?.totalDeposited ?? 0).toLocaleString()}`
          }
          sub="Approved deposits"
          icon={DollarSign}
          gradient="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10"
          delay={200}
        />
        <StatCard
          label="Pending Deposits"
          value={loading ? "—" : (stats?.pendingDeposits ?? 0)}
          sub="Awaiting review"
          icon={Clock}
          gradient="bg-gradient-to-br from-amber-500/20 to-amber-600/10"
          delay={300}
        />
        <StatCard
          label="Total Deposits"
          value={loading ? "—" : (stats?.totalDeposits ?? 0)}
          sub="All time"
          icon={ArrowDownCircle}
          gradient="bg-gradient-to-br from-violet-500/20 to-violet-600/10"
          delay={400}
        />
      </div>

      {/* Quick nav cards */}
      <div className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
        <p className="section-title mb-4">Quick Access</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickAccess.map((item) => (
            <Link key={item.href} href={item.href} className="quick-action">
              <div
                className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center`}
              >
                <item.icon size={16} className={item.color} />
              </div>
              <span className="text-white/60 text-sm font-medium">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Two column: recent deposits + recent users */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent deposits */}
        <div className="animate-fade-in-up" style={{ animationDelay: "400ms" }}>
          <div className="section-header">
            <p className="section-title">Recent Deposits</p>
            <Link
              href="/admin/deposits"
              className="text-amber-400 hover:text-amber-300 text-xs transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="table-container">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-5 h-5 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
              </div>
            ) : recentDeposits.length === 0 ? (
              <div className="empty-state">
                <ArrowDownCircle size={32} />
                <p className="text-xs">No deposits yet</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {recentDeposits.map((dep) => (
                  <div
                    key={dep._id}
                    className="table-row flex items-center justify-between px-5 py-3.5"
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
        <div className="animate-fade-in-up" style={{ animationDelay: "500ms" }}>
          <div className="section-header">
            <p className="section-title">Recent Users</p>
            <Link
              href="/admin/users"
              className="text-indigo-400 hover:text-indigo-300 text-xs transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="table-container">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              </div>
            ) : recentUsers.length === 0 ? (
              <div className="empty-state">
                <Users size={32} />
                <p className="text-xs">No users yet</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {recentUsers.map((u) => (
                  <div
                    key={u._id}
                    className="table-row flex items-center justify-between px-5 py-3.5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/30 to-indigo-500/30 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
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

