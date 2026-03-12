"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Wallet,
  TrendingUp,
  LogOut,
  Shield,
  Calendar,
  Lock,
} from "lucide-react";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const { logout } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    currentPassword: "",
    newPassword: "",
  });
  const hasChanges =
    form.name !== user?.name ||
    form.currentPassword.length > 0 ||
    form.newPassword.length > 0;

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const handleLogout = () => {
    logout();
    router.push("/login");
  };
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setMessage(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setMessage({ type: "error", text: "Name cannot be empty." });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      updateUser({ name: form.name });

      setMessage({
        type: "success",
        text: "Profile updated successfully.",
      });

      setLoading(false);
    }, 900);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}

      <div>
        <p className="text-white/40 text-sm mb-1">Account settings</p>
        <h1 className="text-white text-2xl font-bold">Profile</h1>
      </div>

      {/* Profile Header Card */}

      <div className="bg-[#0f0f1a] border border-white/10 p-6 rounded-sm flex flex-col md:flex-row items-center gap-6">
        {/* Avatar */}

        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>

        {/* User Info */}

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-white text-lg font-semibold">{user?.name}</h2>

          <p className="text-white/40 text-sm">{user?.email}</p>

          <span className="inline-block mt-2 px-3 py-1 text-xs rounded-sm bg-violet-500/10 text-violet-400 border border-violet-500/20 capitalize">
            {user?.role}
          </span>
        </div>

        {/* Stats */}

        <div className="flex gap-6 text-center">
          <div>
            <p className="text-white/30 text-xs flex items-center gap-1 justify-center">
              <Wallet size={12} />
              Balance
            </p>

            <p className="text-emerald-400 font-semibold text-lg">
              ${user?.balance?.toFixed(2) || "0.00"}
            </p>
          </div>

          <div>
            <p className="text-white/30 text-xs flex items-center gap-1 justify-center">
              <TrendingUp size={12} />
              Subs Today
            </p>

            <p className="text-violet-400 font-semibold text-lg">
              {user?.subscriptionsToday ?? 0}/24
            </p>
          </div>
        </div>
      </div>

      {/* Profile Form */}

      <div className="bg-[#0f0f1a] border border-white/10 p-6 rounded-sm space-y-6">
        <h3 className="text-white/50 text-xs uppercase tracking-widest flex items-center gap-2">
          <User size={14} />
          Profile Information
        </h3>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Name */}

          <div>
            <label className="text-white/50 text-xs mb-2 block uppercase">
              Full Name
            </label>

            <div className="relative">
              <User
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
              />

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-white/[0.03] border border-white/10 pl-10 pr-4 py-3 text-white text-sm rounded-sm focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {/* Email */}

          <div>
            <label className="text-white/50 text-xs mb-2 block uppercase">
              Email
            </label>

            <div className="relative">
              <Mail
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
              />

              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="w-full bg-white/[0.02] border border-white/10 pl-10 pr-4 py-3 text-white/40 text-sm rounded-sm cursor-not-allowed"
              />
            </div>

            <p className="text-white/25 text-xs mt-1">
              Email cannot be changed.
            </p>
          </div>

          {/* Password Section */}
          {/* 
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-white/50 text-xs mb-2 block uppercase">
                Current Password
              </label>

              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                />

                <input
                  type="password"
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  className="w-full bg-white/[0.03] border border-white/10 pl-10 pr-4 py-3 text-white text-sm rounded-sm focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div>
              <label className="text-white/50 text-xs mb-2 block uppercase">
                New Password
              </label>

              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                />

                <input
                  type="password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="w-full bg-white/[0.03] border border-white/10 pl-10 pr-4 py-3 text-white text-sm rounded-sm focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
          </div> */}

          {/* Alert Message */}

          {message && (
            <div
              className={`flex items-center gap-2 px-4 py-3 text-sm border rounded-sm ${
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

          {/* Save Button */}

          <button
            type="submit"
            disabled={loading || !hasChanges}
            className={`flex items-center gap-2 px-6 py-3 rounded-sm text-white text-sm font-semibold transition
  ${
    !hasChanges
      ? "bg-white/5 text-white/30 cursor-not-allowed"
      : "bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400"
  }`}
          >
            {loading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Save size={15} />
            )}

            {loading
              ? "Saving..."
              : hasChanges
                ? "Save Changes"
                : "No Changes Applied"}
          </button>
        </form>
      </div>

      {/* Account Info */}

      <div className="bg-[#0f0f1a] border border-white/10 p-6 rounded-sm space-y-4">
        <h3 className="text-white/50 text-xs uppercase tracking-widest flex items-center gap-2">
          <Shield size={14} />
          Account Details
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-black/20 border border-white/10 p-4 rounded-sm">
            <div className="flex items-center gap-2 mb-2">
              <User size={14} className="text-violet-400" />
              <p className="text-white/40 text-xs">Role</p>
            </div>

            <p className="text-white font-semibold capitalize">{user?.role}</p>
          </div>

          {/*  <div className="bg-black/20 border border-white/10 p-4 rounded-sm">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={14} className="text-violet-400" />
              <p className="text-white/40 text-xs">Member Since</p>
            </div>

            <p className="text-white font-semibold">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div> */}
        </div>
      </div>
      <div className="pb-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 py-2.5 px-3 text-sm font-medium hover:bg-red-500 hover:text-white active:bg-red-500 rounded-sm border border-red-500 active:text-white text-red-400 bg-red-500/10 transition-all duration-200"
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
