"use client";

import { useEffect, useState } from "react";
import {
  ArrowDownCircle,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Filter,
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
      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${color}`}
    >
      <Icon size={11} />
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

  const fetchDeposits = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/deposits/approve", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setDeposits(data.deposits);
        setFiltered(data.deposits);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

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
      } else {
        showToast(data.message || "Action failed.", "error");
      }
    } catch (err) {
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
        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2">
          <Clock size={14} className="text-amber-400" />
          <span className="text-amber-400 text-sm font-semibold">
            {counts.pending} pending review
          </span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="animate-fade-in-up delay-100 flex gap-2 bg-[#0f0f1a] border border-white/8 rounded-xl p-1 w-fit flex-wrap">
        {[
          { key: "all", label: "All" },
          { key: "pending", label: "Pending" },
          { key: "approved", label: "Approved" },
          { key: "rejected", label: "Rejected" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${
                tab === key
                  ? key === "pending"
                    ? "bg-amber-600 text-white shadow-lg shadow-amber-600/20"
                    : key === "approved"
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                      : key === "rejected"
                        ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                        : "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                  : "text-white/40 hover:text-white"
              }`}
          >
            {label} ({counts[key]})
          </button>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-2xl animate-fade-in border
            ${
              toast.type === "error"
                ? "bg-red-900/90 text-red-300 border-red-500/30"
                : "bg-emerald-900/90 text-emerald-300 border-emerald-500/30"
            }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Deposits list */}
      <div className="animate-fade-in-up delay-200 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-[#0f0f1a] border border-white/8 rounded-2xl text-white/25">
            <ArrowDownCircle size={36} className="mb-3 opacity-30" />
            <p className="text-sm">
              No {tab !== "all" ? tab : ""} deposits found.
            </p>
          </div>
        ) : (
          filtered.map((dep, i) => (
            <div
              key={dep._id}
              className={`animate-fade-in-up delay-${(i % 5) * 100} bg-[#0f0f1a] border rounded-2xl p-5 transition-all duration-200
                ${
                  dep.status === "pending"
                    ? "border-amber-500/15 hover:border-amber-500/30"
                    : "border-white/8 hover:border-white/15"
                }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                {/* Left info */}
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                    ${dep.status === "pending" ? "bg-amber-500/15" : dep.status === "approved" ? "bg-emerald-500/15" : "bg-red-500/15"}`}
                  >
                    <ArrowDownCircle
                      size={18}
                      className={
                        dep.status === "pending"
                          ? "text-amber-400"
                          : dep.status === "approved"
                            ? "text-emerald-400"
                            : "text-red-400"
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-white font-bold text-lg">
                        ${dep.amount.toFixed(2)}
                      </span>
                      <StatusBadge status={dep.status} />
                    </div>
                    <p className="text-white/50 text-sm">
                      <span className="font-medium text-white/70">
                        {dep.userId?.name}
                      </span>
                      <span className="text-white/30">
                        {" "}
                        · {dep.userId?.email}
                      </span>
                    </p>
                    <p className="text-white/30 text-xs font-mono">
                      {dep.txHash}
                    </p>
                    <p className="text-white/25 text-xs">
                      Submitted {new Date(dep.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Actions — only for pending */}
                {dep.status === "pending" && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleAction(dep._id, "rejected")}
                      disabled={!!actionLoading}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 disabled:opacity-50 transition-all"
                    >
                      {actionLoading === dep._id + "rejected" ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <XCircle size={14} />
                      )}
                      Reject
                    </button>
                    <button
                      onClick={() => handleAction(dep._id, "approved")}
                      disabled={!!actionLoading}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 disabled:opacity-50 transition-all"
                    >
                      {actionLoading === dep._id + "approved" ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <CheckCircle size={14} />
                      )}
                      Approve
                    </button>
                  </div>
                )}

                {/* Reviewed info */}
                {dep.status !== "pending" && dep.reviewedAt && (
                  <div className="text-right">
                    <p className="text-white/25 text-xs">
                      Reviewed {new Date(dep.reviewedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
