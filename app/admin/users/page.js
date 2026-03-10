"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Search,
  TrendingUp,
  ShieldCheck,
  User,
  Mail,
  Calendar,
} from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setUsers(data.users);
          setFiltered(data.users);
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
    setFiltered(
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
      ),
    );
  }, [search, users]);

  const totalBalance = users.reduce((sum, u) => sum + (u.balance || 0), 0);
  const adminCount = users.filter((u) => u.role === "admin").length;

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
        {/* Summary chips */}
        <div className="flex flex-wrap gap-2">
          {[
            {
              label: `${users.length} Total`,
              color: "bg-indigo-500/15 text-indigo-400 border-indigo-500/25",
            },
            {
              label: `${adminCount} Admins`,
              color: "bg-amber-500/15 text-amber-400 border-amber-500/25",
            },
            {
              label: `$${totalBalance.toFixed(0)} Total Balance`,
              color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
            },
          ].map(({ label, color }) => (
            <span
              key={label}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${color}`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="animate-fade-in-up delay-100 relative max-w-sm">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-white/25 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
        />
      </div>

      {/* Users table */}
      <div className="animate-fade-in-up delay-200 bg-[#0f0f1a] border border-white/8 rounded-2xl overflow-hidden">
        {/* Table header */}
        <div className="hidden lg:grid grid-cols-5 px-5 py-3 border-b border-white/5 text-white/30 text-xs font-medium uppercase tracking-wider">
          <span>User</span>
          <span>Email</span>
          <span>Balance</span>
          <span>Role</span>
          <span>Joined</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-white/25">
            <Users size={36} className="mb-3 opacity-30" />
            <p className="text-sm">
              {search ? "No users match your search." : "No users yet."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map((u, i) => (
              <div
                key={u._id}
                className={`animate-fade-in-up delay-${(i % 5) * 100} hover:bg-white/3 transition-colors`}
              >
                {/* Desktop row */}
                <div className="hidden lg:grid grid-cols-5 px-5 py-4 items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/30 to-indigo-500/30 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white text-sm font-medium">
                      {u.name}
                    </span>
                  </div>
                  <span className="text-white/50 text-sm">{u.email}</span>
                  <span className="text-emerald-400 text-sm font-semibold">
                    ${u.balance?.toFixed(2) ?? "0.00"}
                  </span>
                  <span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize
                        ${
                          u.role === "admin"
                            ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                            : "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
                        }`}
                    >
                      {u.role}
                    </span>
                  </span>
                  <span className="text-white/30 text-xs">
                    {new Date(u.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Mobile card */}
                <div className="lg:hidden px-4 py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500/30 to-indigo-500/30 flex items-center justify-center text-white text-sm font-bold">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">
                          {u.name}
                        </p>
                        <p className="text-white/40 text-xs">{u.email}</p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize
                        ${
                          u.role === "admin"
                            ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                            : "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
                        }`}
                    >
                      {u.role}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-white/30">
                    <span>
                      Balance:{" "}
                      <span className="text-emerald-400 font-semibold">
                        ${u.balance?.toFixed(2)}
                      </span>
                    </span>
                    <span>
                      Joined {new Date(u.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
