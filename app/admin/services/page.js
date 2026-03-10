"use client";

import { useEffect, useState } from "react";
import {
  Layers,
  Plus,
  Zap,
  TrendingUp,
  Loader2,
  AlertCircle,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  X,
} from "lucide-react";

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    commissionRate: "",
  });
  const [formError, setFormError] = useState("");

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

  useEffect(() => {
    fetchServices();
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError("");
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.name || !form.price || !form.commissionRate) {
      setFormError("Name, price, and commission rate are required.");
      return;
    }

    const price = parseFloat(form.price);
    const commissionRate = parseFloat(form.commissionRate);

    if (isNaN(price) || price <= 0) {
      setFormError("Price must be a positive number.");
      return;
    }
    if (isNaN(commissionRate) || commissionRate < 0 || commissionRate > 100) {
      setFormError("Commission rate must be between 0 and 100.");
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, price, commissionRate }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Service created successfully.");
        setForm({ name: "", description: "", price: "", commissionRate: "" });
        setShowForm(false);
        fetchServices();
      } else {
        setFormError(data.message || "Failed to create service.");
      }
    } catch (err) {
      setFormError("Network error.");
    } finally {
      setSubmitting(false);
    }
  };

  const totalRevenue = services.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="animate-fade-in-up flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-white/40 text-sm mb-1">Platform services</p>
          <h1 className="text-white text-2xl font-bold tracking-tight">
            Services
          </h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-600/25"
        >
          {showForm ? <X size={15} /> : <Plus size={15} />}
          {showForm ? "Cancel" : "New Service"}
        </button>
      </div>

      {/* Stats */}
      <div className="animate-fade-in-up delay-100 grid grid-cols-3 gap-3">
        {[
          {
            label: "Total Services",
            value: services.length,
            color: "text-violet-400",
          },
          {
            label: "Active Services",
            value: services.filter((s) => s.isActive).length,
            color: "text-emerald-400",
          },
          {
            label: "Avg Commission",
            value: services.length
              ? `${(services.reduce((s, v) => s + v.commissionRate, 0) / services.length).toFixed(1)}%`
              : "0%",
            color: "text-amber-400",
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-[#0f0f1a] border border-white/8 rounded-xl p-4 text-center"
          >
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-white/35 text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Create form */}
      {showForm && (
        <div className="animate-fade-in-up bg-[#0f0f1a] border border-violet-500/25 rounded-2xl p-6 space-y-5">
          <h3 className="text-white font-semibold text-sm flex items-center gap-2">
            <Plus size={16} className="text-violet-400" />
            Create New Service
          </h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">
                  Service Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Starter Plan"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Short description..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">
                  Price (USD) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="e.g. 300"
                  min="1"
                  step="0.01"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">
                  Commission Rate (%) *
                </label>
                <input
                  type="number"
                  name="commissionRate"
                  value={form.commissionRate}
                  onChange={handleChange}
                  placeholder="e.g. 8"
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
                />
              </div>
            </div>

            {/* Preview */}
            {form.price && form.commissionRate && (
              <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl px-4 py-3 text-sm text-violet-300">
                💡 User invests{" "}
                <strong>${parseFloat(form.price || 0).toFixed(2)}</strong> →
                earns{" "}
                <strong>
                  $
                  {(
                    (parseFloat(form.price || 0) *
                      parseFloat(form.commissionRate || 0)) /
                    100
                  ).toFixed(2)}
                </strong>{" "}
                commission → total return{" "}
                <strong>
                  $
                  {(
                    parseFloat(form.price || 0) *
                    (1 + parseFloat(form.commissionRate || 0) / 100)
                  ).toFixed(2)}
                </strong>
              </div>
            )}

            {formError && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <AlertCircle size={14} />
                {formError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-600/20"
            >
              {submitting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Plus size={14} />
              )}
              Create Service
            </button>
          </form>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-2xl animate-fade-in border
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
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-[#0f0f1a] border border-white/8 rounded-2xl h-44 animate-pulse"
            />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-[#0f0f1a] border border-white/8 rounded-2xl text-white/25">
          <Layers size={36} className="mb-3 opacity-30" />
          <p className="text-sm">No services yet. Create one above.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, i) => {
            const commission = (
              (service.price * service.commissionRate) /
              100
            ).toFixed(2);
            const total = (service.price + parseFloat(commission)).toFixed(2);
            return (
              <div
                key={service._id}
                className={`animate-fade-in-up delay-${(i % 5) * 100} bg-[#0f0f1a] border rounded-2xl p-5 transition-all duration-200
                  ${service.isActive ? "border-white/8 hover:border-violet-500/25" : "border-white/5 opacity-60"}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
                      <Zap size={16} className="text-violet-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">
                        {service.name}
                      </p>
                      {service.description && (
                        <p className="text-white/35 text-xs truncate max-w-[120px]">
                          {service.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border font-medium
                    ${
                      service.isActive
                        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                        : "text-white/30 bg-white/5 border-white/10"
                    }`}
                  >
                    {service.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/40">Price</span>
                    <span className="text-white font-medium">
                      ${service.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Commission</span>
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <TrendingUp size={11} />
                      {service.commissionRate}% (${commission})
                    </span>
                  </div>
                  <div className="h-px bg-white/5 my-1" />
                  <div className="flex justify-between">
                    <span className="text-white/60 font-medium">
                      Total Return
                    </span>
                    <span className="text-white font-bold">${total}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
