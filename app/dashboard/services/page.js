"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Layers,
  Zap,
  DollarSign,
  TrendingUp,
  Loader2,
  Lock,
} from "lucide-react";

/* ───────────────── SERVICE CARD ───────────────── */

function ServiceCard({ service, openModal }) {
  return (
    <div className="bg-[#0f0f1a] border border-white/10 rounded-sm overflow-hidden hover:border-violet-500/40 transition-all duration-300 flex flex-col md:flex-row">
      {/* image */}
      <div className="w-full md:w-64 h-48 md:h-auto flex-shrink-0 overflow-hidden">
        {service.image ? (
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-500/10 to-indigo-500/10 flex items-center justify-center">
            <Layers className="text-violet-400/50" size={26} />
          </div>
        )}
      </div>

      {/* content */}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-white text-lg font-semibold">{service.name}</h3>

          <span className="text-xs px-2 py-1 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 rounded-sm">
            Active
          </span>
        </div>

        <p className="text-white/40 text-sm mb-4">{service.description}</p>

        {/* pricing */}
        <div className="bg-white/[0.03] border border-white/5 rounded-sm p-4 mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/40 flex items-center gap-1">
              <DollarSign size={13} /> Price
            </span>
            <span className="text-white font-semibold">
              ${service.price.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/40 flex items-center gap-1">
              <TrendingUp size={13} /> Commission
            </span>
            <span className="text-emerald-400 font-semibold">
              +{service.commissionRate}%
            </span>
          </div>

          <div className="flex justify-between text-sm border-t border-white/5 pt-2">
            <span className="text-white/60">You Receive</span>
            <span className="text-violet-400 font-bold">
              $
              {(
                service.price +
                (service.price * service.commissionRate) / 100
              ).toFixed(2)}
            </span>
          </div>
        </div>

        <button
          onClick={() => openModal(service)}
          className="mt-auto py-3 rounded-sm bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold flex items-center justify-center gap-2 transition"
        >
          <Zap size={15} />
          Subscribe
        </button>
      </div>
    </div>
  );
}

/* ───────────────── TOAST ───────────────── */

function ToastContainer({ toasts, onClose }) {
  return (
    <div className="fixed bottom-6 right-6 z-[300] flex flex-col gap-3">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-3 animate-fade-in-up border rounded-sm shadow-lg max-w-sm text-sm
          ${
            t.type === "success"
              ? "bg-emerald-950 border-emerald-500/30 text-emerald-200"
              : t.type === "error"
                ? "bg-red-950 border-red-500/30 text-red-200"
                : "bg-amber-950 border-amber-500/30 text-amber-200"
          }`}
        >
          <div className="flex justify-between gap-4">
            <div>
              {t.title && <p className="font-semibold mb-1">{t.title}</p>}
              <p className="text-xs opacity-80">{t.message}</p>
            </div>

            <button
              onClick={() => onClose(t.id)}
              className="opacity-50 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ───────────────── PAGE ───────────────── */

export default function ServicesPage() {
  const { user, refreshUser } = useAuth();
  const [closingModal, setClosingModal] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedService, setSelectedService] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);

  const [toasts, setToasts] = useState([]);
  const closeModal = () => {
    setClosingModal(true);

    setTimeout(() => {
      setSelectedService(null);
      setClosingModal(false);
    }, 200);
  };
  /* ───────── TOAST ───────── */

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();

    setToasts((prev) => [...prev.slice(-3), { ...toast, id }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  /* ───────── FETCH SERVICES ───────── */

  useEffect(() => {
    const fetchServices = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

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

  /* ───────── ORDER ───────── */

  const grabOrder = async () => {
    if (!selectedService) return;

    const token = localStorage.getItem("token");

    if (!token) return;

    if ((user?.balance ?? 0) < selectedService.price) {
      addToast({
        type: "error",
        title: "Insufficient Balance",
        message: "Please deposit balance first.",
      });

      return;
    }

    setLoadingOrder(true);

    try {
      const res = await fetch("/api/services/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceId: selectedService._id,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        addToast({
          type: "error",
          title: "Subscription Failed",
          message: data.message,
        });

        return;
      }

      const commission =
        (selectedService.price * selectedService.commissionRate) / 100;

      addToast({
        type: "success",
        title: "Order Completed",
        message: `You earned $${commission.toFixed(2)}`,
      });

      await refreshUser();

      setSelectedService(null);
    } catch (err) {
      addToast({
        type: "error",
        title: "Network Error",
        message: "Try again later.",
      });
    } finally {
      setLoadingOrder(false);
    }
  };

  const subsLeft = 24 - (user?.subscriptionsToday ?? 0);

  /* ───────── UI ───────── */

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* header */}

      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border border-violet-500/20 bg-violet-500/10 rounded-sm flex items-center justify-center">
            <Layers size={18} className="text-violet-400" />
          </div>

          <div>
            <h1 className="text-white text-2xl font-bold">Services</h1>
            <p className="text-white/40 text-sm">
              Subscribe and earn commissions
            </p>
          </div>
        </div>

        <div
          className={`px-4 py-2 border rounded-sm text-sm
          ${
            subsLeft > 0
              ? "border-violet-500/20 text-violet-300 bg-violet-500/10"
              : "border-red-500/20 text-red-400 bg-red-500/10"
          }`}
        >
          {subsLeft > 0
            ? `${subsLeft} subscriptions left today`
            : "Daily limit reached"}
        </div>
      </div>

      {/* balance */}

      <div className="bg-white/[0.03] border border-white/10 rounded-sm p-5 flex justify-between">
        <div>
          <p className="text-white/40 text-xs">Available Balance</p>

          <p className="text-white font-bold text-xl">
            ${user?.balance?.toFixed(2) ?? "0.00"}
          </p>
        </div>

        <div className="text-right">
          <p className="text-white/30 text-xs">Today Orders</p>

          <p className="text-white font-semibold">
            {user?.subscriptionsToday ?? 0}/24
          </p>
        </div>
      </div>

      {/* services */}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-violet-400" />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {services.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
              openModal={setSelectedService}
            />
          ))}
        </div>
      )}

      {/* modal */}

      {selectedService && (
        <div className="fixed inset-0 h-screen bg-black/70 backdrop-blur-sm flex items-center justify-center z-[200] p-4 transition-opacity duration-200">
          <div
            className={`bg-[#0f0f1a] border border-white/10 rounded-sm w-full max-w-2xl
        ${closingModal ? "animate-modal-exit" : "animate-modal-enter"}`}
          >
            <div className="flex flex-col md:flex-row p-4 md:p-6 gap-4 md:gap-6">
              {/* Left: Image */}
              {selectedService.image && (
                <div className="flex-shrink-0 w-full md:w-32 h-48 md:h-32 overflow-hidden rounded-sm">
                  <img
                    src={selectedService.image}
                    alt={selectedService.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Right: Content */}
              <div className="flex-1 flex flex-col gap-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <h2 className="text-white text-lg md:text-xl font-semibold">
                    {selectedService.name}
                  </h2>

                  <button
                    onClick={closeModal}
                    className="text-white/40 hover:text-white transition"
                  >
                    ✕
                  </button>
                </div>

                {/* Description */}
                <p className="text-white/50 text-sm md:text-sm leading-relaxed">
                  {selectedService.description}
                </p>

                {/* Details in separate rows */}
                <div className="border border-white/10 rounded-sm divide-y divide-white/10">
                  <div className="flex justify-between px-4 py-2 text-sm">
                    <span className="text-white/40">Price</span>
                    <span className="text-white font-medium">
                      ${selectedService.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between px-4 py-2 text-sm">
                    <span className="text-white/40">Commission Rate</span>
                    <span className="text-emerald-400 font-medium">
                      +{selectedService.commissionRate}%
                    </span>
                  </div>

                  <div className="flex justify-between px-4 py-2 text-sm">
                    <span className="text-white/40">Total You Receive</span>
                    <span className="text-violet-400 font-semibold">
                      $
                      {(
                        selectedService.price +
                        (selectedService.price *
                          selectedService.commissionRate) /
                          100
                      ).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between px-4 py-2 text-sm">
                    <span className="text-white/40">Daily Limit</span>
                    <span className="text-white font-medium">24 Orders</span>
                  </div>

                  <div className="flex justify-between px-4 py-2 text-sm">
                    <span className="text-white/40">Available Balance</span>
                    <span className="text-white font-medium">
                      ${user?.balance?.toFixed(2) ?? "0.00"}
                    </span>
                  </div>
                </div>

                {/* Grab Order Button */}
                <button
                  onClick={grabOrder}
                  disabled={loadingOrder}
                  className="w-full py-3 bg-violet-600 hover:bg-violet-500 rounded-sm text-white font-semibold flex items-center justify-center gap-2 transition"
                >
                  {loadingOrder ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Zap size={16} />
                  )}
                  {loadingOrder ? "Processing..." : "Grab Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
