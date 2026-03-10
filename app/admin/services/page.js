"use client";

import { useEffect, useState } from "react";
import {
  Layers,
  Plus,
  Zap,
  TrendingUp,
  Loader2,
  AlertCircle,
  X,
  DollarSign,
  Percent,
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

  const avgCommission =
    services.length > 0
      ? (
          services.reduce((s, v) => s + v.commissionRate, 0) / services.length
        ).toFixed(1)
      : 0;

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="animate-fade-in-up flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-white/40 text-sm mb-1">Platform services</p>
          <h1 className="text-white text-2xl font-bold tracking-tight">
            Services
          </h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-600/20 hover:shadow-violet-500/30 hover:-translate-y-0.5"
        >
          {showForm ? <X size={15} /> : <Plus size={15} />}
          {showForm ? "Cancel" : "New Service"}
        </button>
      </div>

      {/* Stats */}
      <div
        className="animate-fade-in-up grid grid-cols-3 gap-3"
        style={{ animationDelay: "50ms" }}
      >
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <Layers size={14} className="text-violet-400" />
            <span className="text-white/40 text-xs">Total Services</span>
          </div>
          <p className="text-white text-xl font-bold">{services.length}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} className="text-emerald-400" />
            <span className="text-white/40 text-xs">Avg Commission</span>
          </div>
          <p className="text-white text-xl font-bold">{avgCommission}%</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-amber-400" />
            <span className="text-white/40 text-xs">Active</span>
          </div>
          <p className="text-white text-xl font-bold">
            {services.filter((s) => s.isActive).length}
          </p>
        </div>
      </div>

      {/* Create form */}
      {showForm && (
        <div
          className="animate-fade-in-up card border-violet-500/25 p-6 space-y-5"
          style={{ animationDelay: "100ms" }}
        >
          <h3 className="text-white font-semibold text-sm flex items-center gap-2">
            <Plus size={16} className="text-violet-400" /> Create New Service
          </h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/50 text-xs mb-2 font-medium uppercase tracking-wider">
                  Service Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Starter Plan"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-white/50 text-xs mb-2 font-medium uppercase tracking-wider">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Short description..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-white/50 text-xs mb-2 font-medium uppercase tracking-wider">
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
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-white/50 text-xs mb-2 font-medium uppercase tracking-wider">
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
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-all"
                />
              </div>
            </div>

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
              <div className="flex items-center gap-2.5 text-red-400 text-sm bg-red-500/10 border border-red-500/15 rounded-xl px-4 py-3">
                <AlertCircle size={14} /> {formError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 disabled:opacity-50 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-600/20 hover:shadow-violet-500/30 hover:-translate-y-0.5"
            >
              {submitting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Plus size={14} />
              )}{" "}
              Create Service
            </button>
          </form>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-2xl animate-fade-in border ${toast.type === "error" ? "bg-red-900/90 text-red-300 border-red-500/30" : "bg-emerald-900/90 text-emerald-300 border-emerald-500/30"}`}
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
        <div className="empty-state">
          <Layers size={40} />
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
                className="animate-fade-in-up card p-5 transition-all duration-200"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
                      <Zap size={18} className="text-violet-400" />
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
                    className={`text-xs px-2.5 py-1 rounded-full border font-medium ${service.isActive ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-white/30 bg-white/5 border-white/10"}`}
                  >
                    {service.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/40">Price</span>
                    <span className="text-white font-medium">
                      ${service.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Commission</span>
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <TrendingUp size={12} />
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

