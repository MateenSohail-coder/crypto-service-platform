"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ArrowDownCircle,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Wifi,
} from "lucide-react";

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

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);
  const [liveIndicator, setLiveIndicator] = useState(false);

  const fetchDeposits = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/deposits/approve", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setDeposits(data.deposits);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeposits();
  }, [fetchDeposits]);

  useEffect(() => {
    const handleNewDeposit = () => {
      setLiveIndicator(true);
      setTimeout(() => setLiveIndicator(false), 2000);
      fetchDeposits();
    };
    const handleReviewed = () => {
      fetchDeposits();
    };

    window.addEventListener("sse:new_deposit", handleNewDeposit);
    window.addEventListener("sse:deposit_reviewed", handleReviewed);
    return () => {
      window.removeEventListener("sse:new_deposit", handleNewDeposit);
      window.removeEventListener("sse:deposit_reviewed", handleReviewed);
    };
  }, [fetchDeposits]);

  useEffect(() => {
    setFiltered(
      tab === "all" ? deposits : deposits.filter((d) => d.status === tab),
    );
  }, [tab, deposits]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAction = async (depositId, action) => {
    setActionLoading(depositId + action);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/deposits/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ depositId, action }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchDeposits();
      } else showToast(data.message || "Action failed.", "error");
    } catch {
      showToast("Network error.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const counts = {
    all: deposits.length,
    pending: deposits.filter((d) => d.status === "pending").length,
    approved: deposits.filter((d) => d.status === "approved").length,
    rejected: deposits.filter((d) => d.status === "rejected").length,
  };

  const tabs = [
    {
      key: "all",
      label: "All",
      active: "bg-violet-600 text-white shadow-lg shadow-violet-600/20",
    },
    {
      key: "pending",
      label: "Pending",
      active: "bg-amber-600 text-white shadow-lg shadow-amber-600/20",
    },
    {
      key: "approved",
      label: "Approved",
      active: "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20",
    },
    {
      key: "rejected",
      label: "Rejected",
      active: "bg-red-600 text-white shadow-lg shadow-red-600/20",
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="animate-fade-in-up flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-white/40 text-sm mb-1">Verify & approve</p>
          <h1 className="text-white text-2xl font-bold tracking-tight">
            Deposits
          </h1>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Live indicator */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border text-xs font-medium transition-all duration-300
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
            {liveIndicator ? "New deposit!" : "Live"}
          </div>
          {/* Pending count */}
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-sm px-4 py-2">
            <Clock size={13} className="text-amber-400" />
            <span className="text-amber-400 text-sm font-semibold">
              {counts.pending} pending review
            </span>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div
        className="animate-fade-in-up flex gap-1.5 bg-[#0c0c15] border border-white/[0.07] rounded-sm p-1 w-fit flex-wrap"
        style={{ animationDelay: "100ms" }}
      >
        {tabs.map(({ key, label, active }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-sm text-sm font-semibold transition-all duration-200
              ${tab === key ? active : "text-white/35 hover:text-white/70"}`}
          >
            {label}
            <span
              className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-sm
              ${tab === key ? "bg-white/20 text-white" : "bg-white/[0.06] text-white/40"}`}
            >
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-sm text-sm font-medium shadow-2xl animate-fade-in border
          ${
            toast.type === "error"
              ? "bg-red-950/95 text-red-300 border-red-500/30"
              : "bg-emerald-950/95 text-emerald-300 border-emerald-500/30"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Deposits list */}
      <div
        className="animate-fade-in-up space-y-0 bg-[#0c0c15] border border-white/[0.07] rounded-sm overflow-hidden"
        style={{ animationDelay: "200ms" }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-white/20">
            <ArrowDownCircle size={32} className="mb-3 opacity-30" />
            <p className="text-sm">
              No {tab !== "all" ? tab : ""} deposits found.
            </p>
          </div>
        ) : (
          <>
            {/* Table header — desktop */}
            <div className="hidden lg:grid grid-cols-[1fr_1fr_1fr_1fr_auto] px-5 py-3 border-b border-white/[0.05] bg-white/[0.02]">
              <span className="text-white/25 text-[10px] font-semibold uppercase tracking-widest">
                Amount
              </span>
              <span className="text-white/25 text-[10px] font-semibold uppercase tracking-widest">
                User
              </span>
              <span className="text-white/25 text-[10px] font-semibold uppercase tracking-widest">
                Tx Hash
              </span>
              <span className="text-white/25 text-[10px] font-semibold uppercase tracking-widest">
                Submitted
              </span>
              <span className="text-white/25 text-[10px] font-semibold uppercase tracking-widest text-right">
                Action
              </span>
            </div>

            <div className="divide-y divide-white/[0.04]">
              {filtered.map((dep, i) => (
                <div
                  key={dep._id}
                  className={`animate-fade-in-up transition-colors
                    ${
                      dep.status === "pending"
                        ? "hover:bg-amber-500/[0.03]"
                        : "hover:bg-white/[0.02]"
                    }`}
                  style={{ animationDelay: `${(i % 5) * 50}ms` }}
                >
                  {/* Desktop row */}
                  <div className="hidden lg:grid grid-cols-[1fr_1fr_1fr_1fr_auto] px-5 py-4 items-center gap-4">
                    {/* Amount + status */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0
                        ${
                          dep.status === "pending"
                            ? "bg-amber-500/15"
                            : dep.status === "approved"
                              ? "bg-emerald-500/15"
                              : "bg-red-500/15"
                        }`}
                      >
                        <ArrowDownCircle
                          size={14}
                          className={
                            dep.status === "pending"
                              ? "text-amber-400"
                              : dep.status === "approved"
                                ? "text-emerald-400"
                                : "text-red-400"
                          }
                        />
                      </div>
                      <div>
                        <p className="text-white font-bold">
                          ${dep.amount.toFixed(2)}
                        </p>
                        <StatusBadge status={dep.status} />
                      </div>
                    </div>

                    {/* User */}
                    <div>
                      <p className="text-white/80 text-sm font-medium">
                        {dep.userId?.name}
                      </p>
                      <p className="text-white/35 text-xs">
                        {dep.userId?.email}
                      </p>
                    </div>

                    {/* Tx hash */}
                    <p className="text-white/30 text-xs font-mono truncate pr-4">
                      {dep.txHash || "—"}
                    </p>

                    {/* Date */}
                    <p className="text-white/35 text-xs">
                      {new Date(dep.createdAt).toLocaleString()}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-2 justify-end">
                      {dep.status === "pending" ? (
                        <>
                          <button
                            onClick={() => handleAction(dep._id, "rejected")}
                            disabled={!!actionLoading}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 disabled:opacity-50 transition-all"
                          >
                            {actionLoading === dep._id + "rejected" ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <XCircle size={12} />
                            )}
                            Reject
                          </button>
                          <button
                            onClick={() => handleAction(dep._id, "approved")}
                            disabled={!!actionLoading}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 disabled:opacity-50 transition-all"
                          >
                            {actionLoading === dep._id + "approved" ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <CheckCircle size={12} />
                            )}
                            Approve
                          </button>
                        </>
                      ) : (
                        <span className="text-white/20 text-xs">
                          {dep.reviewedAt
                            ? `Reviewed ${new Date(dep.reviewedAt).toLocaleDateString()}`
                            : "—"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Mobile card */}
                  <div className="lg:hidden px-4 py-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-sm flex items-center justify-center flex-shrink-0
                          ${
                            dep.status === "pending"
                              ? "bg-amber-500/15"
                              : dep.status === "approved"
                                ? "bg-emerald-500/15"
                                : "bg-red-500/15"
                          }`}
                        >
                          <ArrowDownCircle
                            size={16}
                            className={
                              dep.status === "pending"
                                ? "text-amber-400"
                                : dep.status === "approved"
                                  ? "text-emerald-400"
                                  : "text-red-400"
                            }
                          />
                        </div>
                        <div>
                          <p className="text-white font-bold text-lg">
                            ${dep.amount.toFixed(2)}
                          </p>
                          <StatusBadge status={dep.status} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 pl-0">
                      <p className="text-white/60 text-sm">
                        <span className="font-medium text-white/80">
                          {dep.userId?.name}
                        </span>
                        <span className="text-white/30">
                          {" "}
                          · {dep.userId?.email}
                        </span>
                      </p>
                      {dep.txHash && (
                        <p className="text-white/25 text-xs font-mono break-all">
                          {dep.txHash}
                        </p>
                      )}
                      <p className="text-white/25 text-xs">
                        {new Date(dep.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {dep.status === "pending" && (
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleAction(dep._id, "rejected")}
                          disabled={!!actionLoading}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-sm text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 disabled:opacity-50 transition-all"
                        >
                          {actionLoading === dep._id + "rejected" ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <XCircle size={13} />
                          )}
                          Reject
                        </button>
                        <button
                          onClick={() => handleAction(dep._id, "approved")}
                          disabled={!!actionLoading}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-sm text-sm font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 disabled:opacity-50 transition-all"
                        >
                          {actionLoading === dep._id + "approved" ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <CheckCircle size={13} />
                          )}
                          Approve
                        </button>
                      </div>
                    )}

                    {dep.status !== "pending" && dep.reviewedAt && (
                      <p className="text-white/20 text-xs pt-1">
                        Reviewed {new Date(dep.reviewedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
