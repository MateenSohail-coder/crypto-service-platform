"use client";

import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSSE } from "@/hooks/useSSE";
import { CheckCircle, XCircle, ArrowDownCircle, X, Bell } from "lucide-react";

function Toast({ toast, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: (
      <CheckCircle size={18} className="text-emerald-400 flex-shrink-0" />
    ),
    error: <XCircle size={18} className="text-red-400 flex-shrink-0" />,
    info: (
      <ArrowDownCircle size={18} className="text-indigo-400 flex-shrink-0" />
    ),
    warning: <Bell size={18} className="text-amber-400 flex-shrink-0" />,
  };

  const styles = {
    success: "bg-emerald-950/95 border-emerald-500/30 text-emerald-200",
    error: "bg-red-950/95 border-red-500/30 text-red-200",
    info: "bg-indigo-950/95 border-indigo-500/30 text-indigo-200",
    warning: "bg-amber-950/95 border-amber-500/30 text-amber-200",
  };

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3.5 rounded-xl border shadow-2xl backdrop-blur-sm max-w-sm w-full animate-fade-in-up ${styles[toast.type] || styles.info}`}
    >
      {icons[toast.type] || icons.info}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="font-semibold text-sm mb-0.5">{toast.title}</p>
        )}
        <p className="text-xs opacity-80 leading-relaxed">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        className="opacity-50 hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5"
      >
        <X size={14} />
      </button>
    </div>
  );
}

let globalAddToast = null;

export function showNotification(toast) {
  if (globalAddToast) globalAddToast(toast);
}

export default function NotificationProvider({ children }) {
  const { user, refreshUser } = useAuth();
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-4), { ...toast, id }]);
  }, []);

  // Expose addToast globally
  useEffect(() => {
    globalAddToast = addToast;
    return () => {
      globalAddToast = null;
    };
  }, [addToast]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // SSE event handlers
  const handlers = useCallback(
    () => ({
      // ---- ADMIN EVENTS ----

      // Admin receives: new deposit submitted by any user
      new_deposit: (data) => {
        if (user?.role !== "admin") return;
        addToast({
          type: "warning",
          title: "New Deposit Request",
          message: `$${data.amount} deposit submitted. Review required.`,
        });
        // Trigger global event so admin deposit page refreshes
        window.dispatchEvent(
          new CustomEvent("sse:new_deposit", { detail: data }),
        );
      },

      // Admin receives: deposit was reviewed (keeps admin list in sync across tabs)
      deposit_reviewed: (data) => {
        if (user?.role !== "admin") return;
        window.dispatchEvent(
          new CustomEvent("sse:deposit_reviewed", { detail: data }),
        );
      },

      // ---- USER EVENTS ----

      // User receives: their deposit was approved
      deposit_approved: async (data) => {
        if (user?.role === "admin") return;
        addToast({
          type: "success",
          title: "Deposit Approved! 🎉",
          message: `$${data.amount} has been added to your balance. New balance: $${data.newBalance?.toFixed(2)}`,
        });
        // ✅ Instantly refresh balance in the UI
        await refreshUser();
        window.dispatchEvent(
          new CustomEvent("sse:deposit_approved", { detail: data }),
        );
      },

      // User receives: their deposit was rejected
      deposit_rejected: (data) => {
        if (user?.role === "admin") return;
        addToast({
          type: "error",
          title: "Deposit Rejected",
          message: `Your deposit of $${data.amount} was rejected. Please contact support.`,
        });
        window.dispatchEvent(
          new CustomEvent("sse:deposit_rejected", { detail: data }),
        );
      },
    }),
    [user, addToast, refreshUser],
  );

  // Only connect SSE when user is logged in
  useSSE(handlers(), !!user);

  return (
    <>
      {children}

      {/* Toast container */}
      <div className="fixed bottom-24 lg:bottom-6 right-4 lg:right-6 z-[100] flex flex-col gap-2 items-end pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onClose={() => removeToast(toast.id)} />
          </div>
        ))}
      </div>
    </>
  );
}
