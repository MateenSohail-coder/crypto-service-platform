"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  Shield,
  Lock,
  Eye,
  EyeOff,
  RotateCcw,
  ShoppingCart,
} from "lucide-react";
import { TrendingUp } from "lucide-react";

// ── Step Indicator ────────────────────────────────────────────────────────
function Steps({ current }) {
  const steps = ["Enter Email", "Verify OTP", "New Password"];
  return (
    <div className="flex items-center gap-1 mb-8">
      {steps.map((label, i) => {
        const step = i + 1;
        const done = current > step;
        const active = current === step;
        return (
          <div key={i} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div
                className={`w-7 h-7 rounded-sm flex items-center justify-center text-xs font-bold transition-all ${
                  done
                    ? "bg-emerald-500 text-white"
                    : active
                      ? "bg-violet-600 text-white"
                      : "bg-white/[0.06] text-white/25"
                }`}
              >
                {done ? "✓" : step}
              </div>
              <span
                className={`text-[10px] whitespace-nowrap font-medium ${
                  active
                    ? "text-violet-400"
                    : done
                      ? "text-emerald-400"
                      : "text-white/20"
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-px flex-1 mx-2 mb-4 ${done ? "bg-emerald-500/35" : "bg-white/[0.08]"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Step 1 — Email ────────────────────────────────────────────────────────
function StepEmail({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Email is required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message);
        return;
      }
      onSuccess(email);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2
          className="text-white text-2xl font-black tracking-tight"
          style={{ letterSpacing: "-0.03em" }}
        >
          Forgot Password?
        </h2>
        <p className="text-white/35 text-sm mt-1 leading-relaxed">
          Enter your registered email and we'll send a 6-digit OTP code.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-sm pl-10 pr-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/8 border border-red-500/20 rounded-sm px-4 py-3">
            <AlertCircle size={13} className="flex-shrink-0" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-sm bg-violet-600 hover:bg-violet-500 active:scale-[0.99] disabled:opacity-50 text-white text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20"
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Sending OTP...
            </>
          ) : (
            <>
              Send OTP Code <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

// ── Step 2 — OTP ──────────────────────────────────────────────────────────
function StepOTP({ email, onSuccess, onBack }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [resent, setResent] = useState(false);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    setError("");
    if (value && index < 5)
      document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      document.getElementById(`otp-${index - 1}`)?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) {
      setOtp(text.split(""));
      document.getElementById("otp-5")?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Enter the complete 6-digit code.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message);
        return;
      }
      onSuccess(data.resetToken);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setOtp(["", "", "", "", "", ""]);
      setResent(true);
      setTimeout(() => setResent(false), 5000);
      document.getElementById("otp-0")?.focus();
    } catch {
      setError("Failed to resend. Try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2
          className="text-white text-2xl font-black tracking-tight"
          style={{ letterSpacing: "-0.03em" }}
        >
          Enter OTP
        </h2>
        <p className="text-white/35 text-sm mt-1">
          We sent a 6-digit code to{" "}
          <span className="text-violet-400 font-semibold">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* OTP boxes */}
        <div className="flex gap-2 justify-between" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`w-11 h-14 text-center text-white text-xl font-black rounded-sm border focus:outline-none transition-all ${
                digit
                  ? "bg-violet-500/15 border-violet-500/50 text-violet-200"
                  : "bg-white/[0.04] border-white/[0.09] focus:border-violet-500/40 focus:bg-white/[0.06]"
              }`}
              style={{ letterSpacing: 0 }}
            />
          ))}
        </div>

        {resent && (
          <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/8 border border-emerald-500/20 rounded-sm px-4 py-3">
            <CheckCircle size={13} /> New OTP sent to your email!
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/8 border border-red-500/20 rounded-sm px-4 py-3">
            <AlertCircle size={13} className="flex-shrink-0" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || otp.join("").length !== 6}
          className="w-full py-3 rounded-sm bg-violet-600 hover:bg-violet-500 active:scale-[0.99] disabled:opacity-50 text-white text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20"
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Verifying...
            </>
          ) : (
            <>
              <Shield size={14} /> Verify OTP
            </>
          )}
        </button>
      </form>

      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBack}
          className="text-white/30 hover:text-white/60 transition-colors flex items-center gap-1.5 text-xs"
        >
          <RotateCcw size={11} /> Change email
        </button>
        <button
          onClick={handleResend}
          disabled={resending}
          className="text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1.5 text-xs disabled:opacity-50"
        >
          {resending && <Loader2 size={11} className="animate-spin" />} Resend
          OTP
        </button>
      </div>
    </div>
  );
}

// ── Step 3 — New Password ─────────────────────────────────────────────────
function StepNewPassword({ resetToken, onSuccess }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getStrength = () => {
    if (!password) return null;
    if (password.length < 6)
      return { label: "Too short", color: "bg-red-500", w: "w-1/4" };
    if (password.length < 8)
      return { label: "Weak", color: "bg-amber-500", w: "w-2/4" };
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password))
      return { label: "Fair", color: "bg-yellow-400", w: "w-3/4" };
    return { label: "Strong", color: "bg-emerald-500", w: "w-full" };
  };
  const str = getStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, password }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message);
        return;
      }
      onSuccess();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2
          className="text-white text-2xl font-black tracking-tight"
          style={{ letterSpacing: "-0.03em" }}
        >
          New Password
        </h2>
        <p className="text-white/35 text-sm mt-1">
          Choose a strong password for your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white/40 text-[10px] font-bold mb-2 uppercase tracking-[0.18em]">
            New Password
          </label>
          <div className="relative">
            <Lock
              size={13}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
            />
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
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
          {str && (
            <div className="mt-2 space-y-1">
              <div className="w-full bg-white/[0.08] rounded-sm h-[3px]">
                <div
                  className={`h-[3px] rounded-sm transition-all duration-300 ${str.color} ${str.w}`}
                />
              </div>
              <p className="text-white/30 text-[11px]">{str.label}</p>
            </div>
          )}
        </div>

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
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
                setError("");
              }}
              placeholder="Re-enter password"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-sm pl-10 pr-11 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all"
            />
            {confirm && confirm === password && (
              <CheckCircle
                size={14}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-400"
              />
            )}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/8 border border-red-500/20 rounded-sm px-4 py-3">
            <AlertCircle size={13} className="flex-shrink-0" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-sm bg-violet-600 hover:bg-violet-500 active:scale-[0.99] disabled:opacity-50 text-white text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20"
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Resetting...
            </>
          ) : (
            <>
              <Lock size={14} /> Reset Password
            </>
          )}
        </button>
      </form>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [done, setDone] = useState(false);

  return (
    <div className="min-h-screen bg-[#07070f] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group m-5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
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

        {/* Card */}
        <div className="bg-[#0c0c15] border border-white/[0.07] rounded-sm p-7">
          {done ? (
            <div className="text-center space-y-5 py-4">
              <div className="w-14 h-14 rounded-sm bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <CheckCircle size={26} className="text-emerald-400" />
              </div>
              <div>
                <h2
                  className="text-white text-xl font-black"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  Password Reset!
                </h2>
                <p className="text-white/35 text-sm mt-2 leading-relaxed">
                  Your password has been updated successfully. You can now sign
                  in with your new password.
                </p>
              </div>
              <button
                onClick={() => router.push("/login")}
                className="w-full py-3 rounded-sm bg-violet-600 hover:bg-violet-500 active:scale-[0.99] text-white text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20"
              >
                Go to Login <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <>
              <Steps current={step} />
              {step === 1 && (
                <StepEmail
                  onSuccess={(e) => {
                    setEmail(e);
                    setStep(2);
                  }}
                />
              )}
              {step === 2 && (
                <StepOTP
                  email={email}
                  onSuccess={(token) => {
                    setResetToken(token);
                    setStep(3);
                  }}
                  onBack={() => setStep(1)}
                />
              )}
              {step === 3 && (
                <StepNewPassword
                  resetToken={resetToken}
                  onSuccess={() => setDone(true)}
                />
              )}
            </>
          )}
        </div>

        {!done && (
          <p className="text-center text-white/30 text-sm mt-6">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-violet-400 hover:text-violet-300 font-bold transition-colors"
            >
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
