"use client";

import { useEffect, useState } from "react";
import {
  Copy,
  CheckCheck,
  ArrowUpCircle,
  Loader2,
  AlertCircle,
  Wallet,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Status badge - REUSE from deposit
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

export default function WithdrawalPage() {
  const { user, refreshUser } = useAuth();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState(false);

  const fetchWithdrawals = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/withdrawals/create", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setWithdrawals(data.withdrawals);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const totalWithdrawn = withdrawals
    .filter((w) => w.status === "approved")
    .reduce((sum, w) => sum + w.amount, 0);
  const pendingCount = withdrawals.filter((w) => w.status === "pending").length;
  const approvedCount = withdrawals.filter((w) => w.status === "approved").length;
  const rejectedCount = withdrawals.filter((w) => w.status === "rejected").length;

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!amount || !walletAddress) {
      setError("Please fill in all fields.");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 10) {
      setError("Amount must be at least $10.");
      return;
    }

    if (walletAddress.trim().length < 26) {
      setError("Please enter a valid wallet address.");
      return;
    }

    // Client-side balance check (redundant but UX)
    if ((user?.balance ?? 0) < parsedAmount) {
      setError(`Insufficient balance. Available: $${user?.balance?.toFixed(2) || 0}`);
      return;
    }

    setFormLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/withdrawals/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: parsedAmount,
          walletAddress: walletAddress.trim(),
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Something went wrong.");
        return;
      }

      setSuccess("Withdrawal request submitted! Awaiting admin approval.");
      setAmount("");
      setWalletAddress("");
      fetchWithdrawals();
      await refreshUser();  // Refresh balance display
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <p className="text-white/40 text-sm mb-1">Request payout</p>
          <h1 className="text-white text-2xl font-bold tracking-tight">
            Crypto Withdrawal
          </h1>
        </div>

        {/* Balance display + Withdraw button */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2 bg-[#0f0f1a] border border-white/10 px-4 py-2.5 rounded-0">
            <Wallet size={16} className="text-emerald-400" />
            <span className="text-white/50 text-xs">Available</span>
            <span className="text-emerald-400 font-bold text-lg ml-1">
              ${user?.balance?.toFixed(2) ?? "0.00"}
            </span>
          </div>
          <button
            onClick={() => setShowForm(true)}
            disabled={(user?.balance ?? 0) < 10}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold w-full sm:w-auto transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Withdraw
          </button>
        </div>
      </div>

      {/* Stats - MIRROR deposit but withdrawal */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0f0f1a] border border-white/10 p-4 flex flex-col rounded-0">
          <div className="flex items-center gap-2 mb-2">
            <Wallet size={14} className="text-emerald-400" />
            <span className="text-white/40 text-xs">Total Withdrawn</span>
          </div>
          <p className="text-white text-xl font-bold">
            ${totalWithdrawn.toFixed(2)}
          </p>
        </div>
        <div className="bg-[#0f0f1a] border border-white/10 p-4 flex flex-col rounded-0">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={14} className="text-amber-400" />
            <span className="text-white/40 text-xs">Pending</span>
          </div>
          <p className="text-white text-xl font-bold">{pendingCount}</p>
        </div>
        <div className="bg-[#0f0f1a] border border-white/10 p-4 flex flex-col rounded-0">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={14} className="text-emerald-400" />
            <span className="text-white/40 text-xs">Approved</span>
          </div>
          <p className="text-white text-xl font-bold">{approvedCount}</p>
        </div>
      </div>

      {/* Withdrawal History */}
      <div className="mt-4">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-widest mb-2">
          Withdrawal History
        </h3>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : withdrawals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-white/25">
            <ArrowUpCircle size={48} className="mb-4 opacity-20" />
            <p className="text-base font-medium">No withdrawals yet</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5 max-h-[520px] overflow-y-auto rounded-0 border border-white/10">
            {withdrawals.map((withdrawal) => (
              <div
                key={withdrawal._id}
                className="px-5 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-2"
              >
                <div>
                  <p className="text-white font-semibold">
                    ${withdrawal.amount.toFixed(2)}
                  </p>
                  <p className="text-white/30 text-xs font-mono truncate">
                    {withdrawal.walletAddress}
                  </p>
                  <p className="text-white/25 text-xs mt-1">
                    {new Date(withdrawal.createdAt).toLocaleString()}
                  </p>
                </div>
                <StatusBadge status={withdrawal.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Withdrawal Form Modal - SIMPLIFIED (no payment methods) */}
      {showForm && (
        <div className="fixed animate-modal-enter inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[200] p-4 md:p-6">
          <div className="bg-[#0f0f1a] border border-white/10 w-full max-w-md p-6 relative rounded-0">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white"
            >
              ✕
            </button>

            <h2 className="text-white text-lg font-semibold mb-6">
              Request Withdrawal
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Amount */}
              <div>
                <label className="block text-white/50 text-xs mb-2 font-medium uppercase tracking-wide">
                  Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    min="10"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="10.00"
                    className="w-full bg-white/[0.03] border border-white/10 pl-10 pr-4 py-4 text-white placeholder-white/20 focus:outline-none focus:border-emerald-500 focus:bg-white/[0.05] transition-all rounded-0 text-lg"
                  />
                </div>
                <p className="text-emerald-400/70 text-xs mt-1.5">
                  Minimum: $10 | Available: <strong>${user?.balance?.toFixed(2) ?? "0.00"}</strong>
                </p>
              </div>

              {/* Wallet Address */}
              <div>
                <label className="block text-white/50 text-xs mb-2 font-medium uppercase tracking-wide">
                  Your Crypto Wallet Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh..."
                    className="w-full bg-white/[0.03] border border-white/10 pl-4 pr-10 py-4 text-white placeholder-white/20 focus:outline-none focus:border-emerald-500 focus:bg-white/[0.05] transition-all rounded-0 font-mono text-sm"
                  />
                  {walletAddress && (
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-all"
                    >
                      {copied ? (
                        <CheckCheck size={16} className="text-emerald-400" />
                      ) : (
                        <Copy size={16} className="text-white/40" />
                      )}
                    </button>
                  )}
                </div>
                <p className="text-white/40 text-xs mt-1">
                  Enter the wallet address where you want to receive funds (BTC, ETH, USDT, etc.)
                </p>
              </div>

              {/* Error / Success */}
              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/15 px-4 py-3 animate-fade-in rounded-0">
                  <AlertCircle size={15} />
                  {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/15 px-4 py-3 animate-fade-in rounded-0">
                  <CheckCheck size={15} />
                  {success}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={formLoading}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold flex items-center justify-center gap-2 transition-all duration-200 rounded-0 text-lg shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
              >
                {formLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <ArrowUpCircle size={20} />
                    Submit Withdrawal Request
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

