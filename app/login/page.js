"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  ShoppingCart,
  TrendingUp,
  Store,
  BadgeDollarSign,
  ChevronRight,
} from "lucide-react";

const FLOW_STEPS = [
  {
    icon: ShoppingCart,
    color: "text-amber-400",
    accent: "bg-amber-500/10 border-amber-500/20",
    title: "Surplus Stock Sourced",
    desc: "Amazon, Alibaba & AliExpress clear old models & leftover inventory at steep discounts.",
  },
  {
    icon: TrendingUp,
    color: "text-violet-400",
    accent: "bg-violet-500/10 border-violet-500/20",
    title: "Investors Fund the Buy",
    desc: "Your capital lets us purchase bulk stock at wholesale — before it hits the open market.",
  },
  {
    icon: Store,
    color: "text-indigo-400",
    accent: "bg-indigo-500/10 border-indigo-500/20",
    title: "Resold to Local Retailers",
    desc: "We supply Daraz sellers & small shops quality goods at prices they can't find anywhere else.",
  },
  {
    icon: BadgeDollarSign,
    color: "text-emerald-400",
    accent: "bg-emerald-500/10 border-emerald-500/20",
    title: "You Earn Commission",
    desc: "Profit is shared back. Big stores clear stock. Small shops get cheap goods. You get paid.",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user) {
      router.replace(user.role === "admin" ? "/admin" : "/dashboard");
    }
  }, [user, loading, router]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Login failed.");
        return;
      }
      login(data.user, data.token);
      router.replace(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || user) {
    return (
      <div className="min-h-screen bg-[#07070f] flex items-center justify-center">
        <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-violet-500 to-indigo-600 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07070f] flex">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[54%] bg-[#08080e] border-r border-white/[0.05] p-12 relative overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-1/3 left-1/4 w-[28rem] h-[28rem] bg-violet-700/7 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/5 w-72 h-72 bg-indigo-700/7 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-60 h-60 bg-amber-600/4 rounded-full blur-[80px] pointer-events-none" />

        {/* Grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.022]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          {/* Logo Icon */}
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 via-violet-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-violet-500/30 group-hover:shadow-violet-600/50 group-hover:-translate-y-0.5 transition-all duration-300 border border-white/10">
            <TrendingUp
              size={18}
              className="text-white drop-shadow-sm"
              strokeWidth={2.2}
            />
          </div>

          {/* Brand Text */}
          <div className="leading-tight">
            <p className="text-white font-black text-[1.15rem] leading-none tracking-[-0.05em] bg-gradient-to-r from-white to-violet-100 bg-clip-text text-transparent">
              Bstock
            </p>
            <p className="text-white/25 text-[9px] font-medium tracking-[0.25em] uppercase mt-1 leading-none">
              Investment Platform
            </p>
          </div>
        </Link>

        {/* Headline + steps */}
        <div className="relative z-10 space-y-7">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-violet-400 uppercase tracking-[0.18em] mb-4">
              <span className="w-4 h-px bg-violet-500" />
              How It Works
            </span>

            <h2
              className="text-white font-black leading-[1.12] mb-3"
              style={{
                fontSize: "clamp(1.45rem, 2.4vw, 2rem)",
                letterSpacing: "-0.035em",
              }}
            >
              Buy surplus.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-400 to-violet-300">
                Sell local.
              </span>
              <br />
              Everyone profits.
            </h2>

            <p className="text-white/38 text-sm leading-relaxed max-w-[360px]">
              Massive platforms like Amazon and Alibaba leave unsold stock
              behind every season. We buy it cheap on your behalf, flip it to
              local retailers, and share the margin with you.
            </p>
          </div>

          {/* Flow steps */}
          <div className="space-y-2.5">
            {FLOW_STEPS.map((step, i) => (
              <div
                key={i}
                className="flex items-start gap-3.5 animate-fade-in-up"
                style={{ animationDelay: `${(i + 1) * 70}ms` }}
              >
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className={`w-8 h-8 rounded-sm flex items-center justify-center border ${step.accent}`}
                  >
                    <step.icon size={14} className={step.color} />
                  </div>
                  {i < FLOW_STEPS.length - 1 && (
                    <div className="w-px h-4 bg-white/[0.07] mt-1" />
                  )}
                </div>
                <div className="pb-0.5 min-w-0">
                  <p className="text-white/88 text-sm font-semibold leading-tight">
                    {step.title}
                  </p>
                  <p className="text-white/33 text-xs leading-relaxed mt-0.5">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stat strip */}
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/[0.05]" />
            <span className="text-white/20 text-[10px] uppercase tracking-widest">
              Platform
            </span>
            <div className="flex-1 h-px bg-white/[0.05]" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                value: "Amazon",
                sub: "AliExpress · Alibaba",
                label: "Source platforms",
              },
              {
                value: "Daraz+",
                sub: "Local retailers",
                label: "Resale channels",
              },
              {
                value: "8%+",
                sub: "Commission rate",
                label: "Per service plan",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-white/[0.025] border border-white/[0.05] rounded-sm px-3 py-3"
              >
                <p className="text-white font-bold text-sm leading-none mb-0.5">
                  {s.value}
                </p>
                <p className="text-white/40 text-[10px]">{s.sub}</p>
                <p className="text-white/20 text-[9px] uppercase tracking-wider mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[420px] space-y-7 animate-fade-in-up">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/20">
              <ShoppingCart size={14} className="text-white" />
            </div>
            <div className="leading-none">
              <p
                className="text-white font-black text-lg"
                style={{ letterSpacing: "-0.04em" }}
              >
                StockArb
              </p>
              <p className="text-white/25 text-[9px] tracking-widest uppercase mt-0.5">
                Investment Platform
              </p>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-1.5">
            <h1
              className="text-white font-black tracking-tight"
              style={{
                fontSize: "clamp(1.65rem, 3vw, 2rem)",
                letterSpacing: "-0.035em",
              }}
            >
              Welcome back
            </h1>
            <p className="text-white/35 text-sm">
              Sign in to manage your investments and track returns.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-white/40 text-[10px] font-bold mb-2 uppercase tracking-[0.18em]">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={13}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-sm pl-10 pr-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-white/40 text-[10px] font-bold mb-2 uppercase tracking-[0.18em]">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={13}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
                />
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-sm pl-10 pr-11 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/55 transition-colors"
                >
                  {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>

            {/* Forgot */}
            <div className="flex justify-end -mt-1">
              <Link
                href="/forgot-password"
                className="text-violet-400 hover:text-violet-300 text-xs transition-colors flex items-center gap-0.5"
              >
                Forgot password? <ChevronRight size={11} />
              </Link>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/8 border border-red-500/20 rounded-sm px-4 py-3 animate-fade-in">
                <AlertCircle size={13} className="flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-sm bg-violet-600 hover:bg-violet-500 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20 mt-1"
            >
              {submitting ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-white/20 text-[11px]">or</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Register */}
          <p className="text-center text-white/30 text-sm">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-violet-400 hover:text-violet-300 font-bold transition-colors"
            >
              Create one free
            </Link>
          </p>

          {/* Mobile explainer */}
          <div className="lg:hidden bg-white/[0.02] border border-white/[0.06] rounded-sm p-4 space-y-2.5">
            <p className="text-white/22 text-[10px] uppercase tracking-[0.18em] font-bold">
              How StockArb Works
            </p>
            {[
              "We source surplus stock from Amazon, Alibaba & AliExpress at low prices",
              "Your investment funds bulk purchases before they hit the open market",
              "Stock is resold to Daraz sellers and local small retailers",
              "You earn commission on every completed trade cycle",
            ].map((point, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-violet-500 mt-[7px] flex-shrink-0" />
                <p className="text-white/38 text-xs leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
