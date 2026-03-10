"use client";

import { useState } from "react";
import {
  Zap,
  TrendingUp,
  Loader2,
  CheckCircle,
  Shield,
  Clock,
} from "lucide-react";

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
    <div className="group relative bg-[#0f0f1a] border border-white/[0.08] rounded-2xl p-5 hover:border-violet-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/5 overflow-hidden">
      {/* Background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between mb-5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/10 border border-violet-500/20 flex items-center justify-center">
            <Zap size={20} className="text-violet-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">{service.name}</h3>
            {service.description && (
              <p className="text-white/35 text-xs mt-0.5 line-clamp-1">
                {service.description}
              </p>
            )}
          </div>
        </div>

        {/* Commission badge */}
        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
          <TrendingUp size={11} />
          {service.commissionRate}%
        </div>
      </div>

      {/* Price breakdown */}
      <div className="space-y-3 mb-5 relative z-10">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/40">Price</span>
          <span className="text-white font-medium">
            ${service.price.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/40">Commission</span>
          <span className="text-emerald-400 font-medium flex items-center gap-1">
            +${commission}
          </span>
        </div>
        <div className="h-px bg-white/8" />
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60 font-medium">Total Return</span>
          <span className="text-white font-bold text-lg">${totalReturn}</span>
        </div>
      </div>

      {/* Info pills */}
      <div className="flex items-center gap-2 mb-5 relative z-10">
        <div className="flex items-center gap-1 text-white/30 text-xs">
          <Shield size={11} />
          Verified
        </div>
        <div className="flex items-center gap-1 text-white/30 text-xs">
          <Clock size={11} />
          Instant
        </div>
      </div>

      {/* Subscribe button */}
      <button
        onClick={handleSubscribe}
        disabled={!canAfford || loading}
        className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 relative z-10
          ${
            subscribed
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : canAfford
                ? "bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white shadow-lg shadow-violet-600/20 hover:shadow-violet-500/30 hover:-translate-y-0.5"
                : "bg-white/[0.03] text-white/25 cursor-not-allowed border border-white/[0.08]"
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
            Subscribe Now
          </>
        ) : (
          "Insufficient Balance"
        )}
      </button>
    </div>
  );
}

