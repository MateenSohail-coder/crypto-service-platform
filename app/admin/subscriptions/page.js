"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Zap,
  TrendingUp,
  DollarSign,
  Users,
  Search,
  ChevronDown,
  Activity,
  Calendar,
} from "lucide-react";

function StatCard({ label, value, sub, icon: Icon, accentColor }) {
  return (
    <div className="relative bg-[#0c0c15] border border-white/[0.07] rounded-sm p-5 overflow-hidden group hover:border-white/[0.13] transition-all duration-300">
      <div
        className={`absolute top-0 left-0 w-full h-[2px] ${accentColor} opacity-60 group-hover:opacity-100 transition-opacity`}
      />
      <div className="w-9 h-9 rounded-sm flex items-center justify-center mb-4 bg-white/[0.04] border border-white/[0.07]">
        <Icon size={16} className="text-white/60" />
      </div>
      <p className="text-white/35 text-[10px] font-medium uppercase tracking-[0.18em] mb-1.5">
        {label}
      </p>
      <p className="text-white text-2xl font-bold tracking-tight leading-none mb-1">
        {value}
      </p>
      {sub && <p className="text-white/25 text-[11px] mt-2">{sub}</p>}
    </div>
  );
}

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "just now";
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showSort, setShowSort] = useState(false);

  const fetchSubscriptions = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token || token === "null") return;
    try {
      const res = await fetch("/api/admin/subscriptions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setSubscriptions(data.subscriptions);
        setFiltered(data.subscriptions);
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Admin subscriptions error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  useEffect(() => {
    let result = [...subscriptions];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.userId?.name?.toLowerCase().includes(q) ||
          s.userId?.email?.toLowerCase().includes(q) ||
          s.serviceName?.toLowerCase().includes(q),
      );
    }
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "highest":
        result.sort((a, b) => b.price - a.price);
        break;
      case "commission":
        result.sort((a, b) => b.commissionEarned - a.commissionEarned);
        break;
    }
    setFiltered(result);
  }, [search, sortBy, subscriptions]);

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "highest", label: "Highest Price" },
    { value: "commission", label: "Most Commission" },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="animate-fade-in-up flex items-center gap-3">
        <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20 flex items-center justify-center">
          <Activity size={18} className="text-violet-400" />
        </div>
        <div>
          <h1 className="text-white text-2xl font-bold tracking-tight">
            Subscription History
          </h1>
          <p className="text-white/40 text-sm">
            All user subscriptions across the platform
          </p>
        </div>
      </div>

      {/* Stats */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-fade-in-up"
        style={{ animationDelay: "100ms" }}
      >
        <StatCard
          label="Total Subscriptions"
          value={
            loading ? "—" : (stats?.totalSubscriptions ?? 0).toLocaleString()
          }
          sub="All time"
          icon={Zap}
          accentColor="bg-violet-500"
        />
        <StatCard
          label="Total Volume"
          value={
            loading ? "—" : `$${(stats?.totalVolume ?? 0).toLocaleString()}`
          }
          sub="Subscriptions paid"
          icon={DollarSign}
          accentColor="bg-indigo-500"
        />
        <StatCard
          label="Total Commission"
          value={loading ? "—" : `$${(stats?.totalCommission ?? 0).toFixed(2)}`}
          sub="Paid to users"
          icon={TrendingUp}
          accentColor="bg-emerald-500"
        />
        <StatCard
          label="Showing"
          value={loading ? "—" : filtered.length}
          sub={`of ${subscriptions.length} total`}
          icon={Users}
          accentColor="bg-amber-500"
        />
      </div>

      {/* Filters */}
      <div
        className="animate-fade-in-up flex flex-wrap items-center gap-3"
        style={{ animationDelay: "200ms" }}
      >
        {/* Search */}
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-sm bg-white/[0.03] border border-white/[0.08] focus-within:border-violet-500/40 transition-all flex-1 min-w-48 max-w-72">
          <Search size={14} className="text-white/30 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search user or service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-white/60 text-sm placeholder-white/25 w-full"
          />
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSort(!showSort)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-sm bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] text-white/50 hover:text-white text-sm transition-all"
          >
            <Calendar size={13} />
            {sortOptions.find((o) => o.value === sortBy)?.label}
            <ChevronDown
              size={12}
              className={`transition-transform duration-200 ${showSort ? "rotate-180" : ""}`}
            />
          </button>

          {showSort && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowSort(false)}
              />
              <div className="absolute right-0 top-[calc(100%+6px)] bg-[#0c0c15] border border-white/[0.09] rounded-sm shadow-2xl shadow-black/50 overflow-hidden z-20 min-w-44">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSortBy(opt.value);
                      setShowSort(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-white/[0.04] flex items-center justify-between gap-3 ${
                      sortBy === opt.value
                        ? "text-violet-400 bg-violet-500/5"
                        : "text-white/50"
                    }`}
                  >
                    {opt.label}
                    {sortBy === opt.value && (
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Clear */}
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-white/30 hover:text-white text-xs transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div
        className="animate-fade-in-up bg-[#0c0c15] border border-white/[0.07] rounded-sm overflow-hidden"
        style={{ animationDelay: "300ms" }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/20">
            <Activity size={32} className="mb-3 opacity-30" />
            <p className="text-sm font-medium">
              {search ? "No results found" : "No subscriptions yet"}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-2 text-violet-400 text-xs hover:text-violet-300 transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop header */}
            <div className="hidden lg:grid grid-cols-12 px-5 py-3 border-b border-white/[0.05] bg-white/[0.02]">
              <p className="col-span-3 text-white/25 text-[10px] font-semibold uppercase tracking-widest">
                User
              </p>
              <p className="col-span-3 text-white/25 text-[10px] font-semibold uppercase tracking-widest">
                Service
              </p>
              <p className="col-span-2 text-white/25 text-[10px] font-semibold uppercase tracking-widest text-right">
                Price
              </p>
              <p className="col-span-2 text-white/25 text-[10px] font-semibold uppercase tracking-widest text-right">
                Commission
              </p>
              <p className="col-span-2 text-white/25 text-[10px] font-semibold uppercase tracking-widest text-right">
                Time
              </p>
            </div>

            <div className="divide-y divide-white/[0.04]">
              {filtered.map((sub, i) => (
                <div
                  key={sub._id}
                  className="hover:bg-white/[0.02] transition-colors"
                  style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
                >
                  {/* Desktop row */}
                  <div className="hidden lg:grid grid-cols-12 px-5 py-4 items-center">
                    {/* User */}
                    <div className="col-span-3 flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-violet-500/25 to-indigo-500/25 border border-violet-500/15 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {sub.userId?.name?.charAt(0).toUpperCase() ?? "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {sub.userId?.name ?? "Deleted User"}
                        </p>
                        <p className="text-white/30 text-xs truncate">
                          {sub.userId?.email ?? "—"}
                        </p>
                      </div>
                    </div>

                    {/* Service */}
                    <div className="col-span-3 flex items-center gap-2.5 min-w-0">
                      {sub.serviceId?.image ? (
                        <img
                          src={sub.serviceId.image}
                          alt={sub.serviceName}
                          className="w-8 h-8 rounded-sm object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-sm bg-violet-500/15 border border-violet-500/15 flex items-center justify-center flex-shrink-0">
                          <Zap size={12} className="text-violet-400" />
                        </div>
                      )}
                      <p className="text-white/70 text-sm truncate">
                        {sub.serviceName}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="col-span-2 text-right">
                      <p className="text-white font-semibold text-sm">
                        ${sub.price?.toFixed(2) ?? "0.00"}
                      </p>
                    </div>

                    {/* Commission */}
                    <div className="col-span-2 text-right">
                      <span className="text-emerald-400 font-bold text-sm">
                        +${sub.commissionEarned?.toFixed(2) ?? "0.00"}
                      </span>
                    </div>

                    {/* Time */}
                    <div className="col-span-2 text-right">
                      <p className="text-white/35 text-xs">
                        {timeAgo(sub.createdAt)}
                      </p>
                      <p className="text-white/20 text-[11px] mt-0.5">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Mobile row */}
                  <div className="lg:hidden px-4 py-4 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-sm bg-gradient-to-br from-violet-500/25 to-indigo-500/25 border border-violet-500/15 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {sub.userId?.name?.charAt(0).toUpperCase() ?? "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {sub.userId?.name ?? "Deleted User"}
                        </p>
                        <p className="text-white/35 text-xs truncate">
                          {sub.serviceName}
                        </p>
                        <p className="text-white/20 text-xs mt-0.5">
                          {timeAgo(sub.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-white font-semibold text-sm">
                        ${sub.price?.toFixed(2)}
                      </p>
                      <p className="text-emerald-400 text-xs font-bold">
                        +${sub.commissionEarned?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer totals */}
            <div className="px-5 py-3.5 border-t border-white/[0.05] bg-white/[0.01] flex flex-wrap items-center justify-between gap-3">
              <p className="text-white/25 text-xs">
                {filtered.length} record{filtered.length !== 1 ? "s" : ""}
                {search && (
                  <span className="text-white/35">
                    {" "}
                    matching "<span className="text-violet-400">{search}</span>"
                  </span>
                )}
              </p>
              <div className="flex items-center gap-5 text-xs">
                <span className="text-white/25">
                  Volume:{" "}
                  <span className="text-white/55 font-semibold">
                    $
                    {filtered
                      .reduce((s, sub) => s + (sub.price || 0), 0)
                      .toFixed(2)}
                  </span>
                </span>
                <div className="w-px h-3 bg-white/[0.08]" />
                <span className="text-white/25">
                  Commission:{" "}
                  <span className="text-emerald-400 font-semibold">
                    $
                    {filtered
                      .reduce((s, sub) => s + (sub.commissionEarned || 0), 0)
                      .toFixed(2)}
                  </span>
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
