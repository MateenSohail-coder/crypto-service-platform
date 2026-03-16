"use client";

import { useEffect, useState, useRef } from "react";
import {
  BookOpen,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
  ImagePlus,
  X,
  Eye,
  Clock,
  ArrowRight,
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
        <div className="px-5 py-5">
          <p className="text-white/60 text-sm leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="text-white font-semibold">"{item}"</span>? This
            action cannot be undone.
          </p>
        </div>
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

// ── Article Preview Modal — Editorial Style ───────────────────────────────
function ArticlePreviewModal({ article, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Estimate read time
  const wordCount = article.content?.split(/\s+/).length || 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // Split content into paragraphs for better rendering
  const paragraphs = article.content?.split("\n").filter((p) => p.trim()) || [];

  return (
    <div className="fixed inset-0 z-50 animate-modal-enter flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl max-h-[92vh] flex flex-col bg-[#08080f] border border-white/[0.08] rounded-sm shadow-2xl shadow-black/80 overflow-hidden">
        {/* Hero image or gradient header */}
        <div className="relative flex-shrink-0">
          {article.coverImage ? (
            <div className="relative h-56 overflow-hidden">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay so title is always readable */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#08080f] via-[#08080f]/40 to-transparent" />
            </div>
          ) : (
            /* Decorative header when no image */
            <div className="relative h-32 overflow-hidden bg-gradient-to-br from-emerald-950/60 via-[#08080f] to-[#08080f]">
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
              <div className="absolute top-4 right-6 w-32 h-32 rounded-full bg-emerald-500/10 blur-3xl" />
            </div>
          )}

          {/* Close button — always top right */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-sm bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all z-10"
          >
            <X size={14} />
          </button>

          {/* Category pill */}
          <div className="absolute top-3 left-3">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-sm bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 uppercase tracking-widest backdrop-blur-sm">
              Article
            </span>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Title block — overlaps hero slightly if image exists */}
          <div
            className={`px-7 pb-0 ${article.coverImage ? "-mt-12 relative z-10" : "pt-6"}`}
          >
            {/* Meta row */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <div className="flex items-center gap-1.5 text-white/30 text-xs">
                <Clock size={11} />
                <span>{readTime} min read</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-white/15" />
              <span className="text-white/30 text-xs">
                {new Date(article.createdAt).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Title */}
            <h1
              className="text-red-500 mt-4 pt-10 font-black leading-tight "
              style={{
                fontSize: "clamp(1.35rem, 3.5vw, 1.75rem)",
                letterSpacing: "-0.03em",
              }}
            >
              {article.title}
            </h1>

            {/* Excerpt / subtitle */}
            {article.excerpt && (
              <p className="text-white/50 text-sm leading-relaxed mb-6 border-l-2 border-emerald-500/40 pl-4 italic">
                {article.excerpt}
              </p>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[2px] bg-emerald-500/60 rounded-full" />
              <div className="w-2 h-[2px] bg-emerald-500/30 rounded-full" />
              <div className="w-1 h-[2px] bg-emerald-500/15 rounded-full" />
            </div>
          </div>

          {/* Article body */}
          <div className="px-7 pb-8 space-y-4">
            {paragraphs.length > 0 ? (
              paragraphs.map((para, i) => (
                <p
                  key={i}
                  className={`leading-[1.8] ${
                    i === 0
                      ? "text-white/80 text-[15px] font-medium" // first para slightly bolder
                      : "text-white/60 text-sm"
                  }`}
                >
                  {para}
                </p>
              ))
            ) : (
              <p className="text-white/40 text-sm italic">
                No content available.
              </p>
            )}
          </div>

          {/* Footer CTA — urges engagement */}
          <div className="mx-7 mb-7 p-5 rounded-sm bg-gradient-to-br from-emerald-500/8 to-teal-500/5 border border-emerald-500/15 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
            <div className="relative z-10">
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1">
                Enjoyed this insight?
              </p>
              <p className="text-white/50 text-sm leading-relaxed">
                Explore more expert articles and investment strategies published
                for our community.
              </p>
              <div className="flex items-center gap-1.5 mt-3 text-emerald-400 text-xs font-semibold">
                <span>Browse all articles</span>
                <ArrowRight size={12} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Create Article Modal ──────────────────────────────────────────────────
function CreateArticleModal({ onClose, onCreated }) {
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const imageRef = useRef(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    coverImage: null,
  });

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
    setForm((prev) => ({ ...prev, coverImage: file }));
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setForm((prev) => ({ ...prev, coverImage: null }));
    setImagePreview(null);
    if (imageRef.current) imageRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) {
      setToast({ type: "error", message: "Title and content are required." });
      return;
    }
    setSubmitting(true);
    const token = localStorage.getItem("token");
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("excerpt", form.excerpt);
      if (form.coverImage) formData.append("coverImage", form.coverImage);
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!data.success) {
        setToast({
          type: "error",
          message: data.message || "Failed to publish.",
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
    <div className="fixed animate-modal-enter inset-0 z-50  flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-2xl pb-40 bg-[#0c0c15] border border-white/[0.09] rounded-sm shadow-2xl shadow-black/60 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07] sticky top-0 bg-[#0c0c15] z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-sm bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
              <Plus size={14} className="text-emerald-400" />
            </div>
            <h2 className="text-white font-semibold text-sm">New Article</h2>
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
              Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Article title..."
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-sm px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/15 transition-all"
            />
          </div>

          <div>
            <label className="block text-white/50 text-[10px] font-semibold mb-1.5 uppercase tracking-widest">
              Excerpt{" "}
              <span className="normal-case text-white/25">
                (optional — auto-generated if empty)
              </span>
            </label>
            <input
              type="text"
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              placeholder="Short description..."
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-sm px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-white/50 text-[10px] font-semibold mb-1.5 uppercase tracking-widest">
              Content
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Write your article here..."
              rows={8}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-sm px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/15 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-white/50 text-[10px] font-semibold mb-1.5 uppercase tracking-widest">
              Cover Image (optional)
            </label>
            {imagePreview ? (
              <div className="relative rounded-sm overflow-hidden border border-white/10">
                <img
                  src={imagePreview}
                  alt="Cover preview"
                  className="w-full h-40 object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 w-7 h-7 rounded-sm bg-black/60 hover:bg-red-500/80 flex items-center justify-center text-white transition-all"
                >
                  <X size={13} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-white/[0.08] rounded-sm cursor-pointer hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all group">
                <ImagePlus
                  size={20}
                  className="text-white/25 group-hover:text-emerald-400 transition-colors mb-2"
                />
                <span className="text-white/25 text-xs">
                  Click to upload cover
                </span>
                <span className="text-white/15 text-[11px] mt-1">
                  JPG, PNG, WEBP — max 2MB
                </span>
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
              className="flex-1 py-2.5 rounded-sm bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Publishing...
                </>
              ) : (
                <>
                  <Plus size={14} /> Publish Article
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
export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchArticles = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/articles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setArticles(data.articles);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const confirmDelete = (id, title) => setDeleteTarget({ id, title });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(deleteTarget.id);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/articles?id=${deleteTarget.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setArticles((prev) => prev.filter((a) => a._id !== deleteTarget.id));
        showToast("success", "Article deleted.");
      } else showToast("error", "Failed to delete.");
    } catch {
      showToast("error", "Failed to delete.");
    } finally {
      setDeleting(null);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="animate-fade-in-up flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 flex items-center justify-center">
            <BookOpen size={18} className="text-emerald-400" />
          </div>
          <div>
            <h1 className="text-white text-2xl font-bold tracking-tight">
              Manage Articles
            </h1>
            <p className="text-white/40 text-sm">
              Write and publish articles for users
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-sm bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all shadow-lg shadow-emerald-600/25 active:scale-95"
        >
          <Plus size={15} /> New Article
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

      {/* Articles list */}
      <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <div className="flex items-center gap-3 mb-4">
          <p className="text-white/35 text-[10px] font-medium uppercase tracking-[0.18em]">
            Published Articles ({articles.length})
          </p>
          <div className="flex-1 h-px bg-white/[0.05]" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : articles.length === 0 ? (
          <button
            onClick={() => setShowModal(true)}
            className="w-full flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/[0.08] rounded-sm hover:border-emerald-500/30 hover:bg-emerald-500/[0.03] transition-all group"
          >
            <div className="w-10 h-10 rounded-sm bg-white/[0.04] border border-white/[0.08] group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 flex items-center justify-center mb-3 transition-all">
              <Plus
                size={18}
                className="text-white/25 group-hover:text-emerald-400 transition-colors"
              />
            </div>
            <p className="text-white/35 text-sm font-medium group-hover:text-white/60 transition-colors">
              Publish your first article
            </p>
            <p className="text-white/20 text-xs mt-1">Click to get started</p>
          </button>
        ) : (
          <div className="bg-[#0c0c15] border border-white/[0.07] rounded-sm overflow-hidden">
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-[auto_1fr_160px_80px] px-5 py-3 border-b border-white/[0.05] bg-white/[0.02] gap-4 items-center">
              <div className="w-16" />
              <span className="text-white/25 text-[10px] font-semibold uppercase tracking-widest">
                Article
              </span>
              <span className="text-white/25 text-[10px] font-semibold uppercase tracking-widest">
                Published
              </span>
              <span className="text-white/25 text-[10px] font-semibold uppercase tracking-widest text-right">
                Actions
              </span>
            </div>

            <div className="divide-y divide-white/[0.04]">
              {articles.map((article) => (
                <div
                  key={article._id}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  {/* Desktop row */}
                  <div className="hidden sm:grid grid-cols-[auto_1fr_160px_80px] px-5 py-4 gap-4 items-center">
                    <div className="w-16 h-12 rounded-sm overflow-hidden flex-shrink-0">
                      {article.coverImage ? (
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center">
                          <BookOpen size={14} className="text-emerald-400/30" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-semibold truncate">
                        {article.title}
                      </p>
                      <p className="text-white/35 text-xs truncate mt-0.5">
                        {article.excerpt}
                      </p>
                    </div>
                    <p className="text-white/35 text-xs">
                      {new Date(article.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => setPreview(article)}
                        className="w-7 h-7 rounded-sm bg-white/[0.04] hover:bg-emerald-500/15 hover:border-emerald-500/25 border border-white/[0.07] flex items-center justify-center text-white/35 hover:text-emerald-400 transition-all"
                        title="Preview"
                      >
                        <Eye size={12} />
                      </button>
                      <button
                        onClick={() =>
                          confirmDelete(article._id, article.title)
                        }
                        disabled={deleting === article._id}
                        className="w-7 h-7 rounded-sm bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 flex items-center justify-center text-red-400 transition-all disabled:opacity-50"
                        title="Delete"
                      >
                        {deleting === article._id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Trash2 size={12} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Mobile card */}
                  <div className="sm:hidden flex gap-3 p-4">
                    <div className="w-16 h-14 rounded-sm overflow-hidden flex-shrink-0">
                      {article.coverImage ? (
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center">
                          <BookOpen size={14} className="text-emerald-400/30" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">
                        {article.title}
                      </p>
                      <p className="text-white/35 text-xs line-clamp-2 mt-0.5">
                        {article.excerpt}
                      </p>
                      <p className="text-white/20 text-xs mt-1.5">
                        {new Date(article.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => setPreview(article)}
                        className="w-7 h-7 rounded-sm bg-white/[0.04] hover:bg-emerald-500/15 border border-white/[0.07] flex items-center justify-center text-white/35 hover:text-emerald-400 transition-all"
                      >
                        <Eye size={12} />
                      </button>
                      <button
                        onClick={() =>
                          confirmDelete(article._id, article.title)
                        }
                        disabled={deleting === article._id}
                        className="w-7 h-7 rounded-sm bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 flex items-center justify-center text-red-400 transition-all disabled:opacity-50"
                      >
                        {deleting === article._id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Trash2 size={12} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Dashed new article row */}
              <button
                onClick={() => setShowModal(true)}
                className="w-full flex items-center justify-center gap-2 px-5 py-4 hover:bg-emerald-500/[0.03] transition-colors group border-t border-dashed border-white/[0.06]"
              >
                <div className="w-6 h-6 rounded-sm bg-white/[0.03] border border-white/[0.07] group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 flex items-center justify-center transition-all">
                  <Plus
                    size={12}
                    className="text-white/25 group-hover:text-emerald-400 transition-colors"
                  />
                </div>
                <span className="text-white/25 text-xs font-medium group-hover:text-white/50 transition-colors">
                  New article
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create modal */}
      {showModal && (
        <CreateArticleModal
          onClose={() => setShowModal(false)}
          onCreated={() => {
            fetchArticles();
            showToast("success", "Article published successfully!");
          }}
        />
      )}

      {/* Delete confirm dialog */}
      {deleteTarget && (
        <DeleteConfirmDialog
          item={deleteTarget.title}
          type="Article"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          deleting={!!deleting}
        />
      )}

      {/* Article preview modal */}
      {preview && (
        <ArticlePreviewModal
          article={preview}
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  );
}
