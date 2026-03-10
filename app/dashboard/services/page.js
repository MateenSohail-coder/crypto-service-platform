"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ServiceCard from "@/components/ServiceCard";
import { Layers, AlertCircle } from "lucide-react";

export default function ServicesPage() {
  const { user, updateUser } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("/api/services", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setServices(data.services);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubscribe = async (serviceId) => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/services/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ serviceId }),
    });

    const data = await res.json();

    if (!data.success) {
      showToast(data.message || "Subscription failed.", "error");
      throw new Error(data.message);
    }

    updateUser({
      balance: data.balanceAfter,
      subscriptionsToday: data.subscriptionsToday,
    });

    showToast(
      `Subscribed! Earned $${data.commissionEarned} commission. New balance: $${data.balanceAfter.toFixed(2)}`,
    );
  };

  const remaining = 24 - (user?.subscriptionsToday || 0);

  return (
    <div className="max-w-6xl space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-white/40 text-sm mb-1">Earn daily commissions</p>
          <h1 className="text-white text-2xl font-bold tracking-tight">
            Services
          </h1>
        </div>
        <div className="flex items-center gap-2 bg-[#0f0f1a] border border-white/8 rounded-xl px-4 py-2.5">
          <div className="w-2 h-2 rounded-full bg-violet-500" />
          <span className="text-white/50 text-sm">
            <span className="text-white font-semibold">{remaining}</span>{" "}
            subscriptions left today
          </span>
        </div>
      </div>

      {/* Balance warning */}
      {user?.balance === 0 && (
        <div className="animate-fade-in flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-amber-400 text-sm">
          <AlertCircle size={16} className="flex-shrink-0" />
          Your balance is $0. Please make a deposit before subscribing to
          services.
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-2xl animate-fade-in border max-w-sm text-center
            ${
              toast.type === "error"
                ? "bg-red-900/90 text-red-300 border-red-500/30"
                : "bg-emerald-900/90 text-emerald-300 border-emerald-500/30"
            }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Services grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-[#0f0f1a] border border-white/8 rounded-2xl p-5 h-52 animate-pulse"
            />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/30">
          <Layers size={40} className="mb-4 opacity-30" />
          <p className="text-sm">No services available yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, i) => (
            <div
              key={service._id}
              className={`animate-fade-in-up delay-${(i % 5) * 100}`}
            >
              <ServiceCard
                service={service}
                onSubscribe={handleSubscribe}
                userBalance={user?.balance || 0}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
