"use client";

import { useState } from "react";
import {
  Copy,
  CheckCheck,
  ArrowDownCircle,
  Loader2,
  AlertCircle,
  Wallet,
  Shield,
  ArrowRight,
} from "lucide-react";

const WALLET_ADDRESS =
  process.env.NEXT_PUBLIC_WALLET_ADDRESS || "TYourCryptoWalletAddressHere";

export default function DepositForm({ onSuccess }) {
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(WALLET_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!amount || !txHash) {
      setError("Please fill in all fields.");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (txHash.trim().length < 10) {
      setError("Please enter a valid transaction hash.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/deposits/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: parsedAmount, txHash: txHash.trim() }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Something went wrong.");
        return;
      }

      setSuccess("Deposit submitted! Awaiting admin approval.");
      setAmount("");
      setTxHash("");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Wallet address card */}
      <div className="bg-gradient-to-br from-[#0f0f1a] to-[#0a0a14] border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
            <Wallet size={16} className="text-violet-400" />
          </div>
          <p className="text-white/50 text-xs font-medium uppercase tracking-widest">
            Deposit Address
          </p>
        </div>

        <div className="flex items-center gap-3 bg-black/50 border border-white/10 rounded-xl px-4 py-3.5">
          <span className="text-white/80 text-sm font-mono flex-1 truncate">
            {WALLET_ADDRESS}
          </span>
          <button
            onClick={handleCopy}
            className="flex-shrink-0 p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
          >
            {copied ? (
              <CheckCheck size={16} className="text-emerald-400" />
            ) : (
              <Copy size={16} className="text-white/40 hover:text-white" />
            )}
          </button>
        </div>

        <div className="flex items-start gap-2 mt-4 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
          <AlertCircle
            size={14}
            className="text-amber-400 flex-shrink-0 mt-0.5"
          />
          <p className="text-amber-400/70 text-xs leading-relaxed">
            Only send crypto to this address. Sending other assets may result in
            permanent loss. Minimum deposit: $10
          </p>
        </div>
      </div>

      {/* Deposit form */}
      <div className="bg-gradient-to-br from-[#0f0f1a] to-[#0a0a14] border border-white/[0.08] rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
            <ArrowDownCircle size={16} className="text-indigo-400" />
          </div>
          <p className="text-white/50 text-xs font-medium uppercase tracking-widest">
            Submit Deposit
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
          <div>
            <label className="block text-white/50 text-xs mb-2 font-medium uppercase tracking-wider">
              Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                $
              </span>
              <input
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-8 pr-4 py-3.5 text-white text-lg placeholder-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all"
              />
            </div>
          </div>

          {/* TX Hash */}
          <div>
            <label className="block text-white/50 text-xs mb-2 font-medium uppercase tracking-wider">
              Transaction Hash (TXID)
            </label>
            <input
              type="text"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              placeholder="Paste your transaction hash..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all font-mono"
            />
          </div>

          {/* Error / Success */}
          {error && (
            <div className="flex items-center gap-2.5 text-red-400 text-sm bg-red-500/10 border border-red-500/15 rounded-xl px-4 py-3 animate-fade-in">
              <AlertCircle size={15} className="flex-shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2.5 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/15 rounded-xl px-4 py-3 animate-fade-in">
              <CheckCheck size={15} className="flex-shrink-0" />
              {success}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20 hover:shadow-violet-500/30 hover:-translate-y-0.5"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <ArrowDownCircle size={16} />
                Submit Deposit
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

