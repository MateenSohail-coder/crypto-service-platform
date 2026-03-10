"use client";

import { useEffect, useState } from "react";
import DepositForm from "@/components/DepositForm";
import {
  ArrowDownCircle,
  Clock,
  CheckCircle,
  Wallet,
  XCircle,
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

export default function DepositPage() {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeposits = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/deposits/create", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setDeposits(data.deposits);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const totalDeposited = deposits
    .filter((d) => d.status === "approved")
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="max-w-5xl space-y-8">
      <div className="animate-fade-in-up">
        <p className="text-white/40 text-sm mb-1">Fund your account</p>
        <h1 className="text-white text-2xl font-bold tracking-tight">
          Crypto Deposit
        </h1>
      </div>

      <div
        className="grid grid-cols-3 gap-4 animate-fade-in-up"
        style={{ animationDelay: "50ms" }}
      >
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <Wallet size={14} className="text-emerald-400" />
            <span className="text-white/40 text-xs">Total Deposited</span>
          </div>
          <p className="text-white text-xl font-bold">
            ${totalDeposited.toFixed(2)}
          </p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={14} className="text-amber-400" />
            <span className="text-white/40 text-xs">Pending</span>
          </div>
          <p className="text-white text-xl font-bold">
            {deposits.filter((d) => d.status === "pending").length}
          </p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={14} className="text-violet-400" />
            <span className="text-white/40 text-xs">Total Deposits</span>
          </div>
          <p className="text-white text-xl font-bold">{deposits.length}</p>
        </div>
      </div>

      <div
        className="grid lg:grid-cols-2 gap-6 animate-fade-in-up"
        style={{ animationDelay: "100ms" }}
      >
        <DepositForm onSuccess={fetchDeposits} />
        <div className="space-y-4">
          <h3 className="text-white/50 text-xs font-medium uppercase tracking-widest">
            Deposit History
          </h3>
          <div className="table-container">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
              </div>
            ) : deposits.length === 0 ? (
              <div className="empty-state">
                <ArrowDownCircle size={40} />
                <p className="text-sm">No deposits yet</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5 max-h-[520px] overflow-y-auto">
                {deposits.map((dep) => (
                  <div key={dep._id} className="table-row px-5 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white font-semibold">
                        ${dep.amount.toFixed(2)}
                      </p>
                      <StatusBadge status={dep.status} />
                    </div>
                    <p className="text-white/30 text-xs font-mono truncate">
                      {dep.txHash}
                    </p>
                    <p className="text-white/25 text-xs mt-1">
                      {new Date(dep.createdAt).toLocaleString()}
                    </p>
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

