"use client";

import { useEffect, useState } from "react";
import {
  ArrowDownCircle,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
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
      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-sm border ${color}`}
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

import { ArrowUpCircle } from "lucide-react";

const [withdrawals, setWithdrawals] = useState([]);

useEffect(() => {
  const fetchAll = async () => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [depRes, subRes, witRes] = await Promise.all([
        fetch("/api/deposits/create", { headers }),
        fetch("/api/services/subscribe", { headers }),
        fetch("/api/withdrawals/create", { headers }),
      ]);

      const depData = await depRes.json();
      const subData = await subRes.json();
      const witData = await witRes.json();

      if (depData.success) setDeposits(depData.deposits);
      if (subData.success) setSubscriptions(subData.subscriptions);
      if (witData.success) setWithdrawals(witData.withdrawals);
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
    key: "withdrawals",
    label: "Withdrawals",
    count: withdrawals.length,
    icon: ArrowUpCircle,
  },
  {
    key: "subscriptions",
    label: "Subscriptions",
    count: subscriptions.length,
    icon: Zap,
  },
];

const totalWithdrawn = withdrawals
  .filter((w) => w.status === "approved")
  .reduce((sum, w) => sum + w.amount, 0);

const totalDeposited = deposits
  .filter((d) => d.status === "approved")
  .reduce((sum, d) => sum + d.amount, 0);


  const totalDeposited = deposits
    .filter((d) => d.status === "approved")
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <p className="text-white/40 text-sm mb-1">Your financial activity</p>
        <h1 className="text-white text-2xl font-bold">Transactions</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0f0f1a] border border-white/10 p-4 rounded-sm">
          <p className="text-white/40 text-xs mb-1">Total Deposited</p>
          <p className="text-white text-xl font-semibold">
            ${totalDeposited.toFixed(2)}
          </p>
        </div>

        <div className="bg-[#0f0f1a] border border-white/10 p-4 rounded-sm">
          <p className="text-white/40 text-xs mb-1">Total Deposits</p>
          <p className="text-white text-xl font-semibold">{deposits.length}</p>
        </div>

        <div className="bg-[#0f0f1a] border border-white/10 p-4 rounded-sm">
          <p className="text-white/40 text-xs mb-1">Subscriptions</p>
          <p className="text-white text-xl font-semibold">
            {subscriptions.length}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border border-white/10 p-1 rounded-sm bg-[#0f0f1a] w-fit max-w-full overflow-x-auto scrollbar-none">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-sm transition whitespace-nowrap flex-shrink-0 ${
              tab === t.key
                ? "bg-violet-600 text-white"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <t.icon size={13} />
            <span className="inline">{t.label}</span>
            <span className="text-xs opacity-60">({t.count})</span>
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className="bg-[#0f0f1a] border border-white/10 rounded-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          </div>
: tab === "deposits" ? (
          deposits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-white/40">
              <ArrowDownCircle size={42} />
              <p className="mt-3 text-sm">No deposits yet</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {deposits.map((dep) => (
                <div
                  key={dep._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-sm bg-indigo-500/10 flex items-center justify-center">
                      <ArrowDownCircle size={18} className="text-indigo-400" />
                    </div>

                    <div>
                      <p className="text-white font-semibold text-sm">
                        ${dep.amount.toFixed(2)}
                      </p>
                      <p className="text-white/30 text-xs font-mono truncate max-w-[200px]">
                        {dep.txHash}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-3 sm:mt-0">
                    <StatusBadge status={dep.status} />

                    <p className="text-white/30 text-xs">
                      {new Date(dep.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : tab === "withdrawals" ? (
          withdrawals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-white/40">
              <ArrowUpCircle size={42} />
              <p className="mt-3 text-sm">No withdrawals yet</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {withdrawals.map((withdrawal) => (
                <div
                  key={withdrawal._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-sm bg-emerald-500/10 flex items-center justify-center">
                      <ArrowUpCircle size={18} className="text-emerald-400" />
                    </div>

                    <div>
                      <p className="text-white font-semibold text-sm">
                        -${withdrawal.amount.toFixed(2)}
                      </p>
                      <p className="text-white/30 text-xs font-mono truncate max-w-[200px]">
                        {withdrawal.walletAddress}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-3 sm:mt-0">
                    <StatusBadge status={withdrawal.status} />

                    <p className="text-white/30 text-xs">
                      {new Date(withdrawal.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : subscriptions.length === 0 ? (
        ) : subscriptions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-white/40">
            <Zap size={42} />
            <p className="mt-3 text-sm">No subscriptions yet</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {subscriptions.map((sub) => (
              <div
                key={sub._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-sm bg-violet-500/10 flex items-center justify-center">
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

                <div className="flex items-center gap-3 mt-3 sm:mt-0">
                  <span className="text-emerald-400 text-sm font-semibold">
                    +${sub.commissionEarned.toFixed(2)}
                  </span>

                  <p className="text-white/30 text-xs">
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
