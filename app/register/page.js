"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Mail,
  Lock,
  User,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  ShoppingCart,
  Package,
  BadgeDollarSign,
} from "lucide-react";

const ONBOARDING_STEPS = [
  {
    step: "01",
    icon: User,
    color: "text-violet-400",
    accent: "bg-violet-500/10 border-violet-500/20",
    title: "Create your account",
    desc: "Free registration, no hidden fees or commitments.",
  },
  {
    step: "02",
    icon: Package,
    color: "text-amber-400",
    accent: "bg-amber-500/10 border-amber-500/20",
    title: "Deposit & activate",
    desc: "Fund your wallet via crypto. TXID-verified, admin-approved.",
  },
  {
    step: "03",
    icon: ShoppingCart,
    color: "text-indigo-400",
    accent: "bg-indigo-500/10 border-indigo-500/20",
    title: "Subscribe to a service",
    desc: "Choose a stock arbitrage plan that fits your investment size.",
  },
  {
    step: "04",
    icon: BadgeDollarSign,
    color: "text-emerald-400",
    accent: "bg-emerald-500/10 border-emerald-500/20",
    title: "Earn daily commission",
    desc: "We trade, you earn. Returns distributed every cycle automatically.",
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const { login, user, loading } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
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
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError("All fields are required.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Registration failed.");
        return;
      }
      login(data.user, data.token);
      router.replace("/dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6)
      return { label: "Too short", color: "bg-red-500", width: "w-1/4" };
    if (p.length < 8)
      return { label: "Weak", color: "bg-amber-500", width: "w-2/4" };
    if (!/[A-Z]/.test(p) || !/[0-9]/.test(p))
      return { label: "Fair", color: "bg-yellow-400", width: "w-3/4" };
    return { label: "Strong", color: "bg-emerald-500", width: "w-full" };
  };

  const strength = passwordStrength();

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
        {/* Glows */}
        <div className="absolute top-1/3 left-1/4 w-[28rem] h-[28rem] bg-violet-700/7 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-700/6 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-60 h-60 bg-amber-600/4 rounded-full blur-[80px] pointer-events-none" />

        {/* Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.022]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-sm bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <ShoppingCart size={16} className="text-white" />
          </div>
          <div className="leading-none">
            <p
              className="text-white font-black text-[1.2rem]"
              style={{ letterSpacing: "-0.04em" }}
            >
              StockArb
            </p>
            <p className="text-white/25 text-[9px] tracking-[0.22em] uppercase mt-0.5">
              Investment Platform
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="relative z-10 space-y-7">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-violet-400 uppercase tracking-[0.18em] mb-4">
              <span className="w-4 h-px bg-violet-500" />
              Get started in 4 steps
            </span>
            <h2
              className="text-white font-black leading-[1.12] mb-3"
              style={{
                fontSize: "clamp(1.45rem, 2.4vw, 2rem)",
                letterSpacing: "-0.035em",
              }}
            >
              Your path to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-400 to-violet-300">
                daily returns
              </span>
              <br />
              starts here.
            </h2>
            <p className="text-white/38 text-sm leading-relaxed max-w-[360px]">
              Create a free account, deposit funds, pick a stock arbitrage plan,
              and watch your commissions accumulate every cycle.
            </p>
          </div>

          <div className="space-y-2.5">
            {ONBOARDING_STEPS.map((step, i) => (
              <div
                key={i}
                className="flex items-start gap-3.5 animate-fade-in-up"
                style={{ animationDelay: `${(i + 1) * 70}ms` }}
              >
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className={`w-8 h-8 rounded-sm flex items-center justify-center border ${step.accent} relative`}
                  >
                    <step.icon size={13} className={step.color} />
                    <span className="absolute -top-1.5 -right-1.5 text-[8px] font-black text-white/30 leading-none">
                      {step.step}
                    </span>
                  </div>
                  {i < ONBOARDING_STEPS.length - 1 && (
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

        {/* Footer */}
        <p className="relative z-10 text-white/15 text-[11px]">
          © 2025 StockArb. All rights reserved.
        </p>
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
              Create account
            </h1>
            <p className="text-white/35 text-sm">
              Join StockArb and start earning commissions today.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-white/40 text-[10px] font-bold mb-2 uppercase tracking-[0.18em]">
                Full Name
              </label>
              <div className="relative">
                <User
                  size={13}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
                />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-sm pl-10 pr-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all"
                />
              </div>
            </div>

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
                  placeholder="Min. 6 characters"
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
              {strength && (
                <div className="mt-2 space-y-1">
                  <div className="w-full bg-white/[0.08] rounded-sm h-[3px]">
                    <div
                      className={`h-[3px] rounded-sm transition-all duration-300 ${strength.color} ${strength.width}`}
                    />
                  </div>
                  <p className="text-white/30 text-[11px]">{strength.label}</p>
                </div>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-white/40 text-[10px] font-bold mb-2 uppercase tracking-[0.18em]">
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  size={13}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
                />
                <input
                  type="password"
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-sm pl-10 pr-11 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all"
                />
                {form.confirm && form.confirm === form.password && (
                  <CheckCircle2
                    size={14}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-400"
                  />
                )}
              </div>
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
                  Create Account <ArrowRight size={14} />
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

          {/* Sign in */}
          <p className="text-center text-white/30 text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-violet-400 hover:text-violet-300 font-bold transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
