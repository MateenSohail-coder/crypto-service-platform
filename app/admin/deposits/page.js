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

  const tabs = [
    { key: "all", label: "All", color: "bg-violet-600" },
    { key: "pending", label: "Pending", color: "bg-amber-600" },
    { key: "approved", label: "Approved", color: "bg-emerald-600" },
    { key: "rejected", label: "Rejected", color: "bg-red-600" },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
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
      <div
        className="animate-fade-in-up flex gap-2 bg-[#0f0f1a] border border-white/[0.08] rounded-xl p-1 w-fit flex-wrap"
        style={{ animationDelay: "50ms" }}
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${tab === t.key ? `${t.color} text-white shadow-lg` : "text-white/40 hover:text-white"}`}
          >
            {t.label} ({counts[t.key]})
          </button>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-2xl animate-fade-in border ${toast.type === "error" ? "bg-red-900/90 text-red-300 border-red-500/30" : "bg-emerald-900/90 text-emerald-300 border-emerald-500/30"}`}
        >
          {toast.msg}
        </div>
      )}

      {/* Deposits list */}
      <div
        className="animate-fade-in-up space-y-3"
        style={{ animationDelay: "100ms" }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <ArrowDownCircle size={40} />
            <p className="text-sm">
              No {tab !== "all" ? tab : ""} deposits found.
            </p>
          </div>
        ) : (
          filtered.map((dep, i) => (
            <div
              key={dep._id}
              className={`card p-5 transition-all duration-200 ${dep.status === "pending" ? "border-amber-500/15" : ""}`}
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${dep.status === "pending" ? "bg-amber-500/15" : dep.status === "approved" ? "bg-emerald-500/15" : "bg-red-500/15"}`}
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

