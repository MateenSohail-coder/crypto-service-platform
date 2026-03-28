"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ArrowUpCircle,
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

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);
  const [liveIndicator, setLiveIndicator] = useState(false);

  const fetchWithdrawals = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/withdrawals/approve", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setWithdrawals(data.withdrawals);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWithdrawals();
  }, [fetchWithdrawals]);

  useEffect(() => {
    const handleNewWithdrawal = () => {
      setLiveIndicator(true);
      setTimeout(() => setLiveIndicator(false), 2000);
      fetchWithdrawals();
    };
    const handleReviewed = () => {
      fetchWithdrawals();
    };

    window.addEventListener("sse:new_withdrawal", handleNewWithdrawal);
    window.addEventListener("sse:withdrawal_reviewed", handleReviewed);
    return () => {
      window.removeEventListener("sse:new_withdrawal", handleNewWithdrawal);
      window.removeEventListener("sse:withdrawal_reviewed", handleReviewed);
    };
  }, [fetchWithdrawals]);

  useEffect(() => {
    setFiltered(
      tab === "all" ? withdrawals : withdrawals.filter((w) => w.status === tab),
    );
  }, [tab, withdrawals]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAction = async (withdrawalId, action) => {
    setActionLoading(withdrawalId + action);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/withdrawals/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ withdrawalId, action }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchWithdrawals();
      } else showToast(data.message || "Action failed.", "error");
    } catch {
      showToast("Network error.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const counts = {
    all: withdrawals.length,
    pending: withdrawals.filter((w) => w.status === "pending").length,
    approved: withdrawals.filter((w) => w.status === "approved").length,
    rejected: withdrawals.filter((w) => w.status === "rejected").length,
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
      {/* Header - MIRROR deposits */}
      <div className="animate-fade-in-up flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-white/40 text-sm mb-1">Review & approve</p>
          <h1 className="text-white text-2xl font-bold tracking-tight">
            Withdrawals
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
            {liveIndicator ? "New withdrawal!" : "Live"}
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

      {/* Filter tabs - IDENTICAL */}
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

      {/* Toast - IDENTICAL */}
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

      {/* List - MIRROR with withdrawal changes */}
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
            <ArrowUpCircle size={32} className="mb-3 opacity-30" />
            <p className="text-sm">
              No {tab !== "all" ? tab : ""} withdrawals found.
            </p>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="hidden lg:grid grid-cols-[1fr_1fr_1fr_1fr_auto] px-5 py-3 border-b border-white/[0.05] bg-white/[0.02]">
              <span className="text-white/25 text-[10px] font-semibold uppercase tracking-widest">
                Amount
              </span>
              <span className="text-white/25 text-[10px] font-semibold uppercase tracking-widest">
                User
              </span>
              <span className="text-white/25 text-[10px] font-semibold uppercase tracking-widest">
                Wallet Address
              </span>
              <span className="text-white/25 text-[10px] font-semibold uppercase tracking-widest">
                Submitted
              </span>
              <span className="text-white/25 text-[10px] font-semibold uppercase tracking-widest text-right">
                Action
              </span>
            </div>

            <div className="divide-y divide-white/[0.04]">
              {filtered.map((withdrawal, i) => (
                <div
                  key={withdrawal._id}
                  className={`animate-fade-in-up transition-colors
                    ${
                      withdrawal.status === "pending"
                        ? "hover:bg-amber-500/[0.03]"
                        : "hover:bg-white/[0.02]"
                    }`}
                  style={{ animationDelay: `${(i % 5) * 50}ms` }}
                >
                  {/* Desktop */}
                  <div className="hidden lg:grid grid-cols-[1fr_1fr_1fr_1fr_auto] px-5 py-4 items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0
                        ${
                          withdrawal.status === "pending"
                            ? "bg-amber-500/15"
                            : withdrawal.status === "approved"
                              ? "bg-emerald-500/15"
                              : "bg-red-500/15"
                        }`}
                      >
                        <ArrowUpCircle
                          size={14}
                          className={
                            withdrawal.status === "pending"
                              ? "text-amber-400"
                              : withdrawal.status === "approved"
                                ? "text-emerald-400"
                                : "text-red-400"
                          }
                        />
                      </div>
                      <div>
                        <p className="text-white font-bold">
                          ${withdrawal.amount.toFixed(2)}
                        </p>
                        <StatusBadge status={withdrawal.status} />
                      </div>
                    </div>

                    <div>
                      <p className="text-white/80 text-sm font-medium">
                        {withdrawal.userId?.name}
                      </p>
                      <p className="text-white/35 text-xs">
                        {withdrawal.userId?.email}
                      </p>
                    </div>

                    <p className="text-white/30 text-xs font-mono truncate pr-4">
                      {withdrawal.walletAddress || "—"}
                    </p>

                    <p className="text-white/35 text-xs">
                      {new Date(withdrawal.createdAt).toLocaleString()}
                    </p>

                    <div className="flex items-center gap-2 justify-end">
                      {withdrawal.status === "pending" ? (
                        <>
                          <button
                            onClick={() =>
                              handleAction(withdrawal._id, "rejected")
                            }
                            disabled={!!actionLoading}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 disabled:opacity-50 transition-all"
                          >
                            {actionLoading === withdrawal._id + "rejected" ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <XCircle size={12} />
                            )}
                            Reject
                          </button>
                          <button
                            onClick={() =>
                              handleAction(withdrawal._id, "approved")
                            }
                            disabled={!!actionLoading}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 disabled:opacity-50 transition-all"
                          >
                            {actionLoading === withdrawal._id + "approved" ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <CheckCircle size={12} />
                            )}
                            Approve
                          </button>
                        </>
                      ) : (
                        <span className="text-white/20 text-xs">
                          {withdrawal.reviewedAt
                            ? `Reviewed ${new Date(withdrawal.reviewedAt).toLocaleDateString()}`
                            : "—"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Mobile - MIRROR */}
                  <div className="lg:hidden px-4 py-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-sm flex items-center justify-center flex-shrink-0
                          ${
                            withdrawal.status === "pending"
                              ? "bg-amber-500/15"
                              : withdrawal.status === "approved"
                                ? "bg-emerald-500/15"
                                : "bg-red-500/15"
                          }`}
                        >
                          <ArrowUpCircle
                            size={16}
                            className={
                              withdrawal.status === "pending"
                                ? "text-amber-400"
                                : withdrawal.status === "approved"
                                  ? "text-emerald-400"
                                  : "text-red-400"
                            }
                          />
                        </div>
                        <div>
                          <p className="text-white font-bold text-lg">
                            ${withdrawal.amount.toFixed(2)}
                          </p>
                          <StatusBadge status={withdrawal.status} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-white/60 text-sm">
                        <span className="font-medium text-white/80">
                          {withdrawal.userId?.name}
                        </span>
                        <span className="text-white/30">
                          {" "}
                          {withdrawal.userId?.email}
                        </span>
                      </p>
                      {withdrawal.walletAddress && (
                        <p className="text-white/25 text-xs font-mono break-all">
                          {withdrawal.walletAddress}
                        </p>
                      )}
                      <p className="text-white/25 text-xs">
                        {new Date(withdrawal.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {withdrawal.status === "pending" && (
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() =>
                            handleAction(withdrawal._id, "rejected")
                          }
                          disabled={!!actionLoading}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-sm text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 disabled:opacity-50 transition-all"
                        >
                          {actionLoading === withdrawal._id + "rejected" ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <XCircle size={13} />
                          )}
                          Reject
                        </button>
                        <button
                          onClick={() =>
                            handleAction(withdrawal._id, "approved")
                          }
                          disabled={!!actionLoading}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-sm text-sm font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 disabled:opacity-50 transition-all"
                        >
                          {actionLoading === withdrawal._id + "approved" ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <CheckCircle size={13} />
                          )}
                          Approve
                        </button>
                      </div>
                    )}

                    {withdrawal.status !== "pending" &&
                      withdrawal.reviewedAt && (
                        <p className="text-white/20 text-xs pt-1">
                          Reviewed{" "}
                          {new Date(withdrawal.reviewedAt).toLocaleDateString()}
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
