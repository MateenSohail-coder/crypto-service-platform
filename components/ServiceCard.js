"use client";

import { useState } from "react";
import { Zap, TrendingUp, Loader2, CheckCircle } from "lucide-react";

export default function ServiceCard({ service, onSubscribe, userBalance }) {
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const canAfford = userBalance >= service.price;
  const commission = ((service.price * service.commissionRate) / 100).toFixed(
    2,
  );
  const totalReturn = (service.price + parseFloat(commission)).toFixed(2);

  const handleSubscribe = async () => {
    if (!canAfford || loading) return;
    setLoading(true);
    try {
      await onSubscribe(service._id);
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative group bg-[#0f0f1a] border border-white/8 rounded-2xl p-5 hover:border-violet-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20 flex items-center justify-center">
            <Zap size={18} className="text-violet-400" />
          </div>
          <div>
            <h3
              className="text-white font-semibold text-sm"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              {service.name}
            </h3>
            {service.description && (
              <p className="text-white/40 text-xs mt-0.5 line-clamp-1">
                {service.description}
              </p>
            )}
          </div>
        </div>

        {/* Commission badge */}
        <span className="flex items-center gap-1 text-emerald-400 text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
          <TrendingUp size={11} />
          {service.commissionRate}%
        </span>
      </div>

      {/* Price breakdown */}
      <div className="space-y-2 mb-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/40">Price</span>
          <span className="text-white font-medium">
            ${service.price.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/40">Commission</span>
          <span className="text-emerald-400 font-medium">+${commission}</span>
        </div>
        <div className="h-px bg-white/5 my-1" />
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60 font-medium">Total Return</span>
          <span className="text-white font-bold">${totalReturn}</span>
        </div>
      </div>

      {/* Subscribe button */}
      <button
        onClick={handleSubscribe}
        disabled={!canAfford || loading}
        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2
          ${
            subscribed
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : canAfford
                ? "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/25 hover:shadow-violet-500/35"
                : "bg-white/5 text-white/25 cursor-not-allowed border border-white/10"
          }`}
      >
        {loading ? (
          <Loader2 size={15} className="animate-spin" />
        ) : subscribed ? (
          <>
            <CheckCircle size={15} />
            Subscribed!
          </>
        ) : canAfford ? (
          <>
            <Zap size={15} />
            Subscribe
          </>
        ) : (
          "Insufficient Balance"
        )}
      </button>
    </div>
  );
}
