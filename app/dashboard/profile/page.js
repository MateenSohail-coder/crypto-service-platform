"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Mail,
  Lock,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Layers,
} from "lucide-react";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    currentPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setMessage({ type: "error", text: "Name cannot be empty." });
      return;
    }
    setLoading(true);
    // Simulate a local update (extend with API if needed)
    setTimeout(() => {
      updateUser({ name: form.name });
      setMessage({ type: "success", text: "Profile updated successfully." });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div className="animate-fade-in-up">
        <p className="text-white/40 text-sm mb-1">Your account</p>
        <h1 className="text-white text-2xl font-bold tracking-tight">
          Profile
        </h1>
      </div>

      {/* Avatar + stats */}
      <div className="animate-fade-in-up delay-100 bg-[#0f0f1a] border border-white/8 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0 shadow-lg shadow-violet-500/25">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-white text-xl font-bold">{user?.name}</h2>
          <p className="text-white/40 text-sm">{user?.email}</p>
          <span className="inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/25 capitalize">
            {user?.role}
          </span>
        </div>
        <div className="flex sm:flex-col gap-4 sm:gap-2 text-center sm:text-right">
          <div>
            <p className="text-white/30 text-xs">Balance</p>
            <p className="text-emerald-400 font-bold text-lg">
              ${user?.balance?.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-white/30 text-xs">Today's Subs</p>
            <p className="text-violet-400 font-bold text-lg">
              {user?.subscriptionsToday ?? 0}/24
            </p>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="animate-fade-in-up delay-200 bg-[#0f0f1a] border border-white/8 rounded-2xl p-6 space-y-5">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-widest">
          Edit Profile
        </h3>
        <form onSubmit={handleSave} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <User
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
              />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/20 transition-all"
              />
            </div>
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
              />
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="w-full bg-white/3 border border-white/8 rounded-xl pl-10 pr-4 py-3 text-white/40 text-sm cursor-not-allowed"
              />
            </div>
            <p className="text-white/25 text-xs mt-1">
              Email cannot be changed.
            </p>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`flex items-center gap-2 text-sm rounded-xl px-4 py-3 border animate-fade-in
                ${
                  message.type === "success"
                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                    : "text-red-400 bg-red-500/10 border-red-500/20"
                }`}
            >
              {message.type === "success" ? (
                <CheckCircle size={15} />
              ) : (
                <AlertCircle size={15} />
              )}
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all shadow-lg shadow-violet-600/25"
          >
            {loading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Save size={15} />
            )}
            Save Changes
          </button>
        </form>
      </div>

      {/* Account info */}
      <div className="animate-fade-in-up delay-300 bg-[#0f0f1a] border border-white/8 rounded-2xl p-6 space-y-4">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-widest">
          Account Info
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Account Role", value: user?.role, icon: User },
            {
              label: "Balance",
              value: `$${user?.balance?.toFixed(2)}`,
              icon: TrendingUp,
            },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="bg-black/20 border border-white/5 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} className="text-violet-400" />
                <p className="text-white/40 text-xs">{label}</p>
              </div>
              <p className="text-white font-semibold text-sm capitalize">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
