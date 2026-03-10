"use client";

import { useEffect, useState } from "react";
import {
  ArrowDownCircle,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  ArrowRight,
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

export default function TransactionsPage() {
  const [tab, setTab] = useState("deposits");
  const [deposits, setDeposits] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
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
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const tabs = [
    {
      key: "deposits",
      label: "Deposits",
      count: deposits.length,
      icon: ArrowDownCircle,
    },
    {
      key: "subscriptions",
      label: "Subscriptions",
      count: subscriptions.length,
      icon: Zap,
    },
  ];

  return (
    <div className="max-w-4xl space-y-8">
      <div className="animate-fade-in-up">
        <p className="text-white/40 text-sm mb-1">Your financial history</p>
        <h1 className="text-white text-2xl font-bold tracking-tight">
          Transactions
        </h1>
      </div>

      {/* Tabs */}
      <div className="animate-fade-in-up" style={{ animationDelay: "50ms" }}>
        <div className="tab-list w-fit">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`tab-item flex items-center gap-2 ${tab === t.key ? "active" : ""}`}
            >
              <t.icon size={14} />
              {t.label}
              <span className="text-white/30 text-xs">({t.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div
        className="animate-fade-in-up table-container"
        style={{ animationDelay: "100ms" }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          </div>
        ) : tab === "deposits" ? (
          deposits.length === 0 ? (
            <div className="empty-state">
              <ArrowDownCircle size={40} />
              <p className="text-sm">No deposits yet</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {deposits.map((dep) => (
                <div
                  key={dep._id}
                  className="table-row flex items-center justify-between px-5 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                      <ArrowDownCircle size={18} className="text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">
                        ${dep.amount.toFixed(2)}
                      </p>
                      <p className="text-white/30 text-xs font-mono truncate max-w-[180px]">
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
          )
        ) : subscriptions.length === 0 ? (
          <div className="empty-state">
            <Zap size={40} />
            <p className="text-sm">No subscriptions yet</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {subscriptions.map((sub) => (
              <div
                key={sub._id}
                className="table-row flex items-center justify-between px-5 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                    <Zap size={18} className="text-violet-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">
                      {sub.serviceName}
                    </p>
                    <p className="text-white/30 text-xs">
                      Price: ${sub.price} · Commission: {sub.commissionRate}%
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-emerald-400 text-sm font-bold">
                    +${sub.commissionEarned.toFixed(2)}
                  </span>
                  <p className="text-white/25 text-xs">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

