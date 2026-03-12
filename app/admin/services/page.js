"use client";

import { useEffect, useState, useRef } from "react";
import {
  Layers,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Percent,
  ImagePlus,
  X,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
} from "lucide-react";

// ── Delete Confirm Dialog ─────────────────────────────────────────────────
function DeleteConfirmDialog({ item, type, onConfirm, onCancel, deleting }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed animate-modal-enter inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative z-10 w-full max-w-sm bg-[#0c0c15] border border-white/[0.09] rounded-sm shadow-2xl shadow-black/60">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-sm bg-red-500/15 border border-red-500/20 flex items-center justify-center">
              <Trash2 size={13} className="text-red-400" />
            </div>
            <h2 className="text-white font-semibold text-sm">Delete {type}</h2>
          </div>
          <button
            onClick={onCancel}
            className="w-7 h-7 rounded-sm bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] flex items-center justify-center text-white/40 hover:text-white transition-all"
          >
            <X size={13} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5">
          <p className="text-white/60 text-sm leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="text-white font-semibold">"{item}"</span>? This
            action cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-sm bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] text-white/50 hover:text-white text-sm font-medium transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-sm bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
          >
            {deleting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Service Card ──────────────────────────────────────────────────────────
function ServiceCard({ service, onDelete, onToggle, deleting, toggling }) {
  return (
    <div
      className={`bg-[#0f0f1a] border rounded-sm overflow-hidden transition-all duration-300 group ${
        service.isActive
          ? "border-white/8 hover:border-white/15"
          : "border-white/4 opacity-60"
      }`}
    >
      {service.image ? (
        <div className="w-full h-40 overflow-hidden">
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="w-full h-40 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 flex items-center justify-center">
          <Layers size={32} className="text-violet-400/30" />
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-white font-semibold text-sm leading-tight">
            {service.name}
          </h3>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-sm border flex-shrink-0 ${
              service.isActive
                ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                : "text-red-400 bg-red-500/10 border-red-500/20"
            }`}
          >
            {service.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <p className="text-white/40 text-xs mb-4 line-clamp-2">
          {service.description}
        </p>

        <div className="space-y-1.5 mb-4 bg-white/[0.02] rounded-sm p-3">
          <div className="flex justify-between text-xs">
            <span className="text-white/40">Price</span>
            <span className="text-white font-semibold">
              ${service.price.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-white/40">Commission</span>
            <span className="text-emerald-400">{service.commissionRate}%</span>
          </div>
          <div className="flex justify-between text-xs border-t border-white/5 pt-1.5">
            <span className="text-white/40">Return</span>
            <span className="text-violet-400 font-bold">
              $
              {(
                service.price +
                (service.price * service.commissionRate) / 100
              ).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onToggle(service._id, !service.isActive)}
            disabled={toggling === service._id}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-sm text-xs font-medium border transition-all disabled:opacity-50 ${
              service.isActive
                ? "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
            }`}
          >
            {toggling === service._id ? (
              <Loader2 size={12} className="animate-spin" />
            ) : service.isActive ? (
              <>
                <ToggleRight size={13} /> Deactivate
              </>
            ) : (
              <>
                <ToggleLeft size={13} /> Activate
              </>
            )}
          </button>

          <button
            onClick={() => onDelete(service._id, service.name)}
            disabled={deleting === service._id}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-sm bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-medium transition-all disabled:opacity-50"
          >
            {deleting === service._id ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Trash2 size={12} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Create Service Modal ──────────────────────────────────────────────────
function CreateServiceModal({ onClose, onCreated }) {
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const imageRef = useRef(null);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    commissionRate: "",
    image: null,
  });

  const price = parseFloat(form.price) || 0;
  const commissionRate = parseFloat(form.commissionRate) || 0;
  const commission = (price * commissionRate) / 100;
  const total = price + commission;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setToast({ type: "error", message: "Image must be smaller than 2MB." });
      return;
    }
    setForm((prev) => ({ ...prev, image: file }));
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setForm((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
    if (imageRef.current) imageRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.name ||
      !form.description ||
      !form.price ||
      !form.commissionRate
    ) {
      setToast({ type: "error", message: "All fields are required." });
      return;
    }
    setSubmitting(true);
    const token = localStorage.getItem("token");
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("commissionRate", form.commissionRate);
      if (form.image) formData.append("image", form.image);
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!data.success) {
        setToast({
          type: "error",
          message: data.message || "Failed to create service.",
        });
        return;
      }
      onCreated();
      onClose();
    } catch {
      setToast({ type: "error", message: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 animate-modal-enter z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg bg-[#0c0c15] border border-white/[0.09] rounded-sm shadow-2xl shadow-black/60 max-h-[90vh] overflow-y-auto">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07] sticky top-0 bg-[#0c0c15] z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-sm bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
              <Plus size={14} className="text-violet-400" />
            </div>
            <h2 className="text-white font-semibold text-sm">New Service</h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-sm bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] flex items-center justify-center text-white/40 hover:text-white transition-all"
          >
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-white/50 text-[10px] font-semibold mb-1.5 uppercase tracking-widest">
              Service Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Gold Investment Plan"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-sm px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/15 transition-all"
            />
          </div>

          <div>
            <label className="block text-white/50 text-[10px] font-semibold mb-1.5 uppercase tracking-widest">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe this service..."
              rows={3}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-sm px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/15 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-white/50 text-[10px] font-semibold mb-1.5 uppercase tracking-widest">
                Price ($)
              </label>
              <div className="relative">
                <DollarSign
                  size={12}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                />
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-sm pl-7 pr-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-white/50 text-[10px] font-semibold mb-1.5 uppercase tracking-widest">
                Commission (%)
              </label>
              <div className="relative">
                <Percent
                  size={12}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                />
                <input
                  type="number"
                  name="commissionRate"
                  value={form.commissionRate}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-sm pl-7 pr-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-white/50 text-[10px] font-semibold mb-1.5 uppercase tracking-widest">
              Image{" "}
              <span className="normal-case text-white/25">
                (optional, max 2MB)
              </span>
            </label>
            {imagePreview ? (
              <div className="relative rounded-sm overflow-hidden border border-white/10">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-32 object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 w-6 h-6 rounded-sm bg-black/70 hover:bg-red-500/80 flex items-center justify-center text-white transition-all"
                >
                  <X size={11} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-white/[0.08] rounded-sm cursor-pointer hover:border-violet-500/40 hover:bg-violet-500/5 transition-all group">
                <ImagePlus
                  size={18}
                  className="text-white/25 group-hover:text-violet-400 transition-colors mb-1.5"
                />
                <span className="text-white/25 text-xs">Click to upload</span>
                <input
                  ref={imageRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Live preview */}
          {price > 0 && (
            <div className="bg-violet-500/5 border border-violet-500/15 rounded-sm p-3.5 space-y-1.5">
              <p className="text-violet-400 text-xs font-medium mb-2 flex items-center gap-1">
                <TrendingUp size={12} /> Return Preview
              </p>
              <div className="flex justify-between text-xs">
                <span className="text-white/40">Price</span>
                <span className="text-white">${price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/40">
                  Commission ({commissionRate}%)
                </span>
                <span className="text-emerald-400">
                  +${commission.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-xs border-t border-white/[0.07] pt-1.5">
                <span className="text-white/60">User Receives</span>
                <span className="text-violet-400 font-bold">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {toast && (
            <div
              className={`flex items-center gap-2 text-xs rounded-sm px-3 py-2.5 border ${
                toast.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-red-500/10 border-red-500/20 text-red-400"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle size={13} />
              ) : (
                <AlertCircle size={13} />
              )}
              {toast.message}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-sm bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] text-white/50 hover:text-white text-sm font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-sm bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20"
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Creating...
                </>
              ) : (
                <>
                  <Plus size={14} /> Create Service
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [toggling, setToggling] = useState(null);
  const [toast, setToast] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchServices = async () => {
    const token = localStorage.getItem("token");
    if (!token || token === "null") return;
    try {
      const res = await fetch("/api/services", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setServices(data.services);
      else showToast("error", data.message || "Failed to load services.");
    } catch {
      showToast("error", "Network error loading services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Step 1 — open dialog
  const confirmDelete = (id, name) => setDeleteTarget({ id, name });

  // Step 2 — actual delete
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(deleteTarget.id);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/services?id=${deleteTarget.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setServices((prev) => prev.filter((s) => s._id !== deleteTarget.id));
        showToast("success", "Service deleted.");
      } else showToast("error", data.message || "Failed to delete.");
    } catch {
      showToast("error", "Network error.");
    } finally {
      setDeleting(null);
      setDeleteTarget(null);
    }
  };

  const handleToggle = async (id, isActive) => {
    setToggling(id);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/services", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, isActive }),
      });
      const data = await res.json();
      if (data.success) {
        setServices((prev) =>
          prev.map((s) => (s._id === id ? { ...s, isActive } : s)),
        );
        showToast(
          "success",
          `Service ${isActive ? "activated" : "deactivated"}.`,
        );
      } else showToast("error", data.message || "Failed to update.");
    } catch {
      showToast("error", "Network error.");
    } finally {
      setToggling(null);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="animate-fade-in-up flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20 flex items-center justify-center">
            <Layers size={18} className="text-violet-400" />
          </div>
          <div>
            <h1 className="text-white text-2xl font-bold tracking-tight">
              Manage Services
            </h1>
            <p className="text-white/40 text-sm">
              {services.length} service{services.length !== 1 ? "s" : ""} total
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-sm bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-600/25 active:scale-95"
        >
          <Plus size={15} /> New Service
        </button>
      </div>

      {/* Global toast */}
      {toast && (
        <div
          className={`flex items-center gap-2 text-xs rounded-sm px-4 py-3 border w-fit ${
            toast.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle size={13} />
          ) : (
            <AlertCircle size={13} />
          )}
          {toast.message}
        </div>
      )}

      {/* Services grid */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <p className="text-white/35 text-[10px] font-medium uppercase tracking-[0.18em]">
            All Services
          </p>
          <div className="flex-1 h-px bg-white/[0.05]" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          </div>
        ) : services.length === 0 ? (
          <button
            onClick={() => setShowModal(true)}
            className="w-full flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/[0.08] rounded-sm hover:border-violet-500/30 hover:bg-violet-500/[0.03] transition-all group"
          >
            <div className="w-10 h-10 rounded-sm bg-white/[0.04] border border-white/[0.08] group-hover:border-violet-500/30 group-hover:bg-violet-500/10 flex items-center justify-center mb-3 transition-all">
              <Plus
                size={18}
                className="text-white/25 group-hover:text-violet-400 transition-colors"
              />
            </div>
            <p className="text-white/35 text-sm font-medium group-hover:text-white/60 transition-colors">
              Create new service
            </p>
            <p className="text-white/20 text-xs mt-1">Click to get started</p>
          </button>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
                onDelete={confirmDelete}
                onToggle={handleToggle}
                deleting={deleting}
                toggling={toggling}
              />
            ))}

            {/* Dashed create card */}
            <button
              onClick={() => setShowModal(true)}
              className="flex flex-col items-center justify-center min-h-[280px] border-2 border-dashed border-white/[0.07] rounded-sm hover:border-violet-500/30 hover:bg-violet-500/[0.03] transition-all group"
            >
              <div className="w-10 h-10 rounded-sm bg-white/[0.03] border border-white/[0.07] group-hover:border-violet-500/30 group-hover:bg-violet-500/10 flex items-center justify-center mb-3 transition-all">
                <Plus
                  size={18}
                  className="text-white/25 group-hover:text-violet-400 transition-colors"
                />
              </div>
              <p className="text-white/30 text-sm font-medium group-hover:text-white/55 transition-colors">
                Create new service
              </p>
            </button>
          </div>
        )}
      </div>

      {/* Create modal */}
      {showModal && (
        <CreateServiceModal
          onClose={() => setShowModal(false)}
          onCreated={() => {
            fetchServices();
            showToast("success", "Service created successfully!");
          }}
        />
      )}

      {/* Delete confirm dialog */}
      {deleteTarget && (
        <DeleteConfirmDialog
          item={deleteTarget.name}
          type="Service"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          deleting={!!deleting}
        />
      )}
    </div>
  );
}
