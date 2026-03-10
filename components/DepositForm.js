"use client";

import { useState } from "react";
import {
  Copy,
  CheckCheck,
  ArrowDownCircle,
  Loader2,
  AlertCircle,
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
    <div className="space-y-6">
      {/* Wallet address card */}
      <div className="bg-[#0f0f1a] border border-white/8 rounded-2xl p-5">
        <p className="text-white/50 text-xs font-medium uppercase tracking-widest mb-3">
          Send To This Address
        </p>
        <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl px-4 py-3">
          <span className="text-white/70 text-sm font-mono flex-1 truncate">
            {WALLET_ADDRESS}
          </span>
          <button
            onClick={handleCopy}
            className="flex-shrink-0 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            {copied ? (
              <CheckCheck size={16} className="text-emerald-400" />
            ) : (
              <Copy size={16} className="text-white/40 hover:text-white" />
            )}
          </button>
        </div>
        <p className="text-amber-400/70 text-xs mt-3 flex items-center gap-1.5">
          <AlertCircle size={12} />
          Only send crypto to this address. Sending other assets may result in
          permanent loss.
        </p>
      </div>

      {/* Deposit form */}
      <div className="bg-[#0f0f1a] border border-white/8 rounded-2xl p-5">
        <p className="text-white/50 text-xs font-medium uppercase tracking-widest mb-4">
          Submit Deposit
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
          <div>
            <label className="block text-white/60 text-xs mb-1.5 font-medium">
              Amount (USD)
            </label>
            <input
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount..."
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-all"
            />
          </div>

          {/* TX Hash */}
          <div>
            <label className="block text-white/60 text-xs mb-1.5 font-medium">
              Transaction Hash (TXID)
            </label>
            <input
              type="text"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              placeholder="Paste your transaction hash..."
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-all font-mono"
            />
          </div>

          {/* Error / Success */}
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <AlertCircle size={15} className="flex-shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
              <CheckCheck size={15} className="flex-shrink-0" />
              {success}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-violet-600/25"
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
