"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Wallet,
  TrendingUp,
  LogOut,
  Shield,
  Calendar,
} from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
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
              <p className="text-white/40 text-xs">Full Name</p>
            </div>
            <p className="text-white font-semibold">{user?.name}</p>
          </div>

          <div className="bg-black/20 border border-white/10 p-4 rounded-sm">
            <div className="flex items-center gap-2 mb-2">
              <Mail size={14} className="text-violet-400" />
              <p className="text-white/40 text-xs">Email</p>
            </div>
            <p className="text-white font-semibold">{user?.email}</p>
          </div>

          <div className="bg-black/20 border border-white/10 p-4 rounded-sm">
            <div className="flex items-center gap-2 mb-2">
              <User size={14} className="text-violet-400" />
              <p className="text-white/40 text-xs">Role</p>
            </div>
            <p className="text-white font-semibold capitalize">{user?.role}</p>
          </div>
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
