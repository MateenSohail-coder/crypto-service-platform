"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Search,
  Mail,
  Calendar,
  Wallet,
  Shield,
  Hash,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          const sorted = [...data.users].sort((a, b) => {
            if (a.role === "admin" && b.role !== "admin") return -1;
            if (a.role !== "admin" && b.role === "admin") return 1;
            return 0;
          });
          setUsers(sorted);
          setFiltered(sorted);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    const results = users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
    const sorted = [...results].sort((a, b) => {
      if (a.role === "admin" && b.role !== "admin") return -1;
      if (a.role !== "admin" && b.role === "admin") return 1;
      return 0;
    });
    setFiltered(sorted);
  }, [search, users]);

  const totalBalance = users.reduce((sum, u) => sum + (u.balance || 0), 0);
  const adminCount = users.filter((u) => u.role === "admin").length;
  const toggle = (id) => setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="animate-fade-in-up flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-white/40 text-sm mb-1">Platform management</p>
          <h1 className="text-white text-2xl font-bold tracking-tight">
            Users
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-sm bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
            {users.length} Total
          </span>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-sm bg-amber-500/15 text-amber-400 border border-amber-500/25">
            {adminCount} Admins
          </span>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-sm bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
            ${totalBalance.toFixed(0)} Total Balance
          </span>
        </div>
      </div>

      {/* Search */}
      <div
        className="animate-fade-in-up relative max-w-sm"
        style={{ animationDelay: "50ms" }}
      >
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full bg-white/[0.03] border border-white/10 rounded-sm pl-10 pr-4 py-2.5 text-white text-sm placeholder-white/25 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
        />
      </div>

      {/* Table */}
      <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-white/20">
            <Users size={40} className="mb-3 opacity-30" />
            <p className="text-sm">
              {search ? "No users match your search." : "No users yet."}
            </p>
          </div>
        ) : (
          <div className="bg-[#0c0c15] border border-white/[0.07] rounded-sm overflow-hidden">
            {/* Desktop header — fixed column widths */}
            <div className="hidden lg:flex px-5 py-3 border-b border-white/[0.05] bg-white/[0.02]">
              <div className="w-[220px] shrink-0 text-white/25 text-[10px] font-semibold uppercase tracking-widest">
                User
              </div>
              <div className="w-[200px] shrink-0 text-white/25 text-[10px] font-semibold uppercase tracking-widest">
                Email
              </div>
              <div className="w-[110px] shrink-0 text-white/25 text-[10px] font-semibold uppercase tracking-widest">
                Balance
              </div>
              <div className="w-[90px] shrink-0 text-white/25 text-[10px] font-semibold uppercase tracking-widest">
                Role
              </div>
              <div className="flex-1 text-white/25 text-[10px] font-semibold uppercase tracking-widest">
                Joined
              </div>
            </div>

            <div className="divide-y divide-white/[0.04]">
              {filtered.map((u) => {
                const isOpen = expandedId === u._id;
                const isAdmin = u.role === "admin";

                return (
                  <div
                    key={u._id}
                    className={isAdmin ? "bg-amber-500/[0.03]" : ""}
                  >
                    {/* Clickable row */}
                    <div
                      onClick={() => toggle(u._id)}
                      className="cursor-pointer hover:bg-white/[0.03] transition-colors"
                    >
                      {/* Desktop row — fixed widths + truncate */}
                      <div className="hidden lg:flex px-5 py-3.5 items-center">
                        {/* Name — 220px */}
                        <div className="w-[220px] shrink-0 flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-sm flex items-center justify-center text-white text-xs font-bold flex-shrink-0
                            ${
                              isAdmin
                                ? "bg-gradient-to-br from-amber-500/30 to-orange-500/20 border border-amber-500/25"
                                : "bg-gradient-to-br from-violet-500/25 to-indigo-500/25 border border-violet-500/15"
                            }`}
                          >
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-white text-sm font-medium truncate">
                              {u.name}
                            </span>
                            {isAdmin && (
                              <Shield
                                size={11}
                                className="text-amber-400 flex-shrink-0"
                              />
                            )}
                          </div>
                        </div>

                        {/* Email — 200px */}
                        <div className="w-[200px] shrink-0 min-w-0 pr-3">
                          <span className="text-white/45 text-sm truncate block">
                            {u.email}
                          </span>
                        </div>

                        {/* Balance — 110px */}
                        <div className="w-[110px] shrink-0">
                          <span className="text-emerald-400 text-sm font-bold">
                            ${u.balance?.toFixed(2) ?? "0.00"}
                          </span>
                        </div>

                        {/* Role — 90px */}
                        <div className="w-[90px] shrink-0">
                          <span
                            className={`text-[10px] font-semibold px-2 py-1 rounded-sm border capitalize
                            ${
                              isAdmin
                                ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                                : "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
                            }`}
                          >
                            {u.role}
                          </span>
                        </div>

                        {/* Joined — flex-1 */}
                        <div className="flex-1 flex items-center justify-between min-w-0">
                          <span className="text-white/30 text-xs">
                            {new Date(u.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          {isOpen ? (
                            <ChevronUp
                              size={14}
                              className="text-white/30 flex-shrink-0"
                            />
                          ) : (
                            <ChevronDown
                              size={14}
                              className="text-white/20 flex-shrink-0"
                            />
                          )}
                        </div>
                      </div>

                      {/* Mobile card — no table, stacked layout */}
                      <div className="lg:hidden px-4 py-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-9 h-9 rounded-sm flex items-center justify-center text-white text-sm font-bold flex-shrink-0
                              ${
                                isAdmin
                                  ? "bg-gradient-to-br from-amber-500/30 to-orange-500/20 border border-amber-500/25"
                                  : "bg-gradient-to-br from-violet-500/25 to-indigo-500/25 border border-violet-500/15"
                              }`}
                            >
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="text-white text-sm font-medium truncate">
                                  {u.name}
                                </p>
                                {isAdmin && (
                                  <Shield
                                    size={11}
                                    className="text-amber-400 flex-shrink-0"
                                  />
                                )}
                              </div>
                              {/* Email truncated, never overflows */}
                              <p className="text-white/40 text-xs truncate max-w-[180px]">
                                {u.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span
                              className={`text-[10px] font-semibold px-2 py-1 rounded-sm border capitalize
                              ${
                                isAdmin
                                  ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                                  : "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
                              }`}
                            >
                              {u.role}
                            </span>
                            {isOpen ? (
                              <ChevronUp size={14} className="text-white/30" />
                            ) : (
                              <ChevronDown
                                size={14}
                                className="text-white/20"
                              />
                            )}
                          </div>
                        </div>

                        {/* Balance + date below, no overlap */}
                        <div className="flex items-center justify-between mt-2.5 pl-12">
                          <span className="text-emerald-400 text-xs font-bold">
                            ${u.balance?.toFixed(2)}
                          </span>
                          <span className="text-white/25 text-xs">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Expanded dropdown */}
                    {isOpen && (
                      <div
                        className={`border-t border-white/[0.05] px-5 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4
                        ${isAdmin ? "bg-amber-500/[0.03]" : "bg-white/[0.015]"}`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-white/30 text-[10px] uppercase tracking-widest font-medium">
                            <Hash size={10} /> User ID
                          </div>
                          <p className="text-white/55 text-xs font-mono break-all">
                            {u._id}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-white/30 text-[10px] uppercase tracking-widest font-medium">
                            <Mail size={10} /> Email
                          </div>
                          <p className="text-white/80 text-xs break-all">
                            {u.email}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-white/30 text-[10px] uppercase tracking-widest font-medium">
                            <Wallet size={10} /> Balance
                          </div>
                          <p className="text-emerald-400 text-sm font-bold">
                            ${u.balance?.toFixed(2) ?? "0.00"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-white/30 text-[10px] uppercase tracking-widest font-medium">
                            <Calendar size={10} /> Member Since
                          </div>
                          <p className="text-white/70 text-xs">
                            {new Date(u.createdAt).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
