"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  Bell,
  TrendingUp,
  X,
  CheckCheck,
  Trash2,
  ArrowDownCircle,
  Users,
  CheckCircle,
  XCircle,
  Info,
  Loader2,
} from "lucide-react";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/dashboard/services": "Services",
  "/dashboard/deposit": "Deposit",
  "/dashboard/withdrawal": "Withdrawal",
  "/dashboard/transactions": "Transactions",
  "/dashboard/articles": "Articles",
  "/dashboard/profile": "Profile",
  "/admin": "Admin Overview",
  "/admin/users": "Manage Users",
  "/admin/deposits": "Manage Deposits",
  "/admin/withdrawals": "Withdrawals",
  "/admin/services": "Manage Services",
  "/admin/articles": "Manage Articles",
  "/admin/subscriptions": "Subscription History",
};

const typeConfig = {
  deposit_approved: {
    icon: CheckCircle,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  deposit_rejected: {
    icon: XCircle,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
  new_deposit: {
    icon: ArrowDownCircle,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  new_user: {
    icon: Users,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
  },
  general: {
    icon: Info,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
};

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [clearing, setClearing] = useState(false);
  const dropdownRef = useRef(null);
  const title = pageTitles[pathname] || "Dashboard";

  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user, fetchNotifications]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Lock body scroll when panel is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const markAllRead = async () => {
    const token = localStorage.getItem("token");

    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });

    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const markOneRead = async (id) => {
    const token = localStorage.getItem("token");

    await fetch("/api/notifications/read", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ notificationId: id }),
    });

    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
    );

    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const clearAll = async () => {
    setClearing(true);

    const token = localStorage.getItem("token");

    await fetch("/api/notifications", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setNotifications([]);
    setUnreadCount(0);

    setClearing(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/10 px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="lg:hidden w-8 h-8 rounded-sm bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <TrendingUp size={14} className="text-white" />
          </div>

          <h1 className="text-white font-semibold text-lg">{title}</h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Mobile balance */}
          {user && !pathname.startsWith("/admin") && (
            <div className="lg:hidden px-3 py-1 rounded-sm bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-emerald-400 text-sm font-bold">
                ${user.balance?.toFixed(2) ?? "0.00"}
              </span>
            </div>
          )}

          {/* Notifications */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="relative w-9 h-9 rounded-sm bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.06]"
            >
              <Bell size={16} />

              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {open && (
              <>
                {/* Mobile backdrop overlay */}
                <div className="fixed inset-0 animate-modal-enter bg-black/50 z-40 sm:hidden" />

                {/* Dropdown panel
                    - Mobile: fixed, centered horizontally, near top
                    - Desktop: absolute, anchored right of bell button
                */}
                <div
                  className="
                    fixed left-1/2 -translate-x-1/2 top-[72px] w-[92vw] z-50
                    sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:translate-x-0 sm:w-[460px]
                    md:w-[520px]
                    bg-[#0f0f1a] border border-white/10 rounded-sm shadow-2xl shadow-black/40 overflow-hidden
                  "
                >
                  {/* Header */}
                  <div className="flex flex-col gap-2 px-5 py-4 border-b border-white/10 sm:flex-row sm:items-center sm:justify-between">
                    {/* Title + unread badge */}
                    <div className="flex items-center gap-2">
                      <Bell size={15} className="text-violet-400" />
                      <span className="text-white text-sm font-semibold">
                        Notifications
                      </span>
                      {unreadCount > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-sm bg-violet-500/20 text-violet-300 border border-violet-500/30">
                          {unreadCount} new
                        </span>
                      )}
                    </div>

                    {/* Action buttons — own row on mobile, inline on sm+ */}
                    <div className="flex items-center gap-3 text-xs">
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="flex items-center gap-1 text-white/40 hover:text-violet-400 transition-colors"
                        >
                          <CheckCheck size={14} />
                          Mark as read
                        </button>
                      )}

                      {notifications.length > 0 && (
                        <button
                          onClick={clearAll}
                          disabled={clearing}
                          className="flex items-center gap-1 text-white/40 hover:text-red-400 transition-colors"
                        >
                          {clearing ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                          Clear
                        </button>
                      )}

                      {/* Close button — always visible, pushed to the right */}
                      <button
                        onClick={() => setOpen(false)}
                        className="ml-auto text-white/40 hover:text-white border border-white/40 p-1 cursor-pointer rounded-sm transition-colors sm:ml-0"
                      >
                        <X size={19} />
                      </button>
                    </div>
                  </div>

                  {/* Notifications list */}
                  <div className="max-h-[420px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-white/30">
                        <Bell size={28} className="mb-3 opacity-30" />
                        <p className="text-sm font-medium">
                          No notifications yet
                        </p>
                        <p className="text-xs opacity-60 mt-1">
                          Updates will appear here
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-white/5">
                        {notifications.map((notif) => {
                          const config =
                            typeConfig[notif.type] || typeConfig.general;
                          const Icon = config.icon;

                          return (
                            <div
                              key={notif._id}
                              onClick={() =>
                                !notif.isRead && markOneRead(notif._id)
                              }
                              className={`flex gap-3 px-5 py-4 cursor-pointer transition
                                ${
                                  !notif.isRead
                                    ? "bg-white/[0.03] hover:bg-white/[0.05]"
                                    : "hover:bg-white/[0.02] opacity-70"
                                }`}
                            >
                              <div
                                className={`w-8 h-8 rounded-sm flex items-center justify-center ${config.bg} border ${config.border}`}
                              >
                                <Icon size={14} className={config.color} />
                              </div>

                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <p
                                    className={`text-sm font-medium ${notif.isRead ? "text-white/60" : "text-white"}`}
                                  >
                                    {notif.title}
                                  </p>

                                  {!notif.isRead && (
                                    <div className="w-2 h-2 bg-violet-500 rounded-full mt-1" />
                                  )}
                                </div>

                                <p className="text-white/40 text-xs mt-1">
                                  {notif.message}
                                </p>

                                <p className="text-white/25 text-[11px] mt-1">
                                  {timeAgo(notif.createdAt)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
