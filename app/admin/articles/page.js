"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  X,
  FileText,
} from "lucide-react";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    coverImage: "",
    isPublished: true,
  });
  const [formError, setFormError] = useState("");

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

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [e.target.name]: value }));
    setFormError("");
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.title.trim() || !form.content.trim()) {
      setFormError("Title and content are required.");
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Article published successfully.");
        setForm({
          title: "",
          content: "",
          excerpt: "",
          coverImage: "",
          isPublished: true,
        });
        setShowForm(false);
        fetchArticles();
      } else {
        setFormError(data.message || "Failed to create article.");
      }
    } catch (err) {
      setFormError("Network error.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (articleId) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    setDeleting(articleId);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/articles?id=${articleId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        showToast("Article deleted.");
        fetchArticles();
      } else {
        showToast(data.message || "Delete failed.", "error");
      }
    } catch (err) {
      showToast("Network error.", "error");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="animate-fade-in-up flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-white/40 text-sm mb-1">Content management</p>
          <h1 className="text-white text-2xl font-bold tracking-tight">
            Articles
          </h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all shadow-lg shadow-emerald-600/25"
        >
          {showForm ? <X size={15} /> : <Plus size={15} />}
          {showForm ? "Cancel" : "New Article"}
        </button>
      </div>

      {/* Stats row */}
      <div className="animate-fade-in-up delay-100 flex flex-wrap gap-3">
        {[
          {
            label: `${articles.length} Total`,
            color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
          },
          {
            label: `${articles.filter((a) => a.isPublished).length} Published`,
            color: "bg-indigo-500/15 text-indigo-400 border-indigo-500/25",
          },
        ].map(({ label, color }) => (
          <span
            key={label}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${color}`}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Create form */}
      {showForm && (
        <div className="animate-fade-in-up bg-[#0f0f1a] border border-emerald-500/20 rounded-2xl p-6 space-y-5">
          <h3 className="text-white font-semibold text-sm flex items-center gap-2">
            <FileText size={16} className="text-emerald-400" />
            Write New Article
          </h3>
          <form onSubmit={handleCreate} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Article title..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">
                Excerpt{" "}
                <span className="text-white/20 normal-case">(optional)</span>
              </label>
              <input
                type="text"
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                placeholder="Short summary shown on cards..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
              />
            </div>

            {/* Cover image */}
            <div>
              <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">
                Cover Image URL{" "}
                <span className="text-white/20 normal-case">(optional)</span>
              </label>
              <input
                type="url"
                name="coverImage"
                value={form.coverImage}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">
                Content *
              </label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="Write your article content here..."
                rows={8}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all resize-none leading-relaxed"
              />
            </div>

            {/* Publish toggle */}
            <label className="flex items-center gap-3 cursor-pointer w-fit">
              <input
                type="checkbox"
                name="isPublished"
                checked={form.isPublished}
                onChange={handleChange}
                className="w-4 h-4 accent-emerald-500"
              />
              <span className="text-white/60 text-sm">Publish immediately</span>
            </label>

            {formError && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <AlertCircle size={14} />
                {formError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-semibold transition-all shadow-lg shadow-emerald-600/20"
            >
              {submitting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Plus size={14} />
              )}
              Publish Article
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

      {/* Articles list */}
      <div className="animate-fade-in-up delay-200 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-[#0f0f1a] border border-white/8 rounded-2xl text-white/25">
            <BookOpen size={36} className="mb-3 opacity-30" />
            <p className="text-sm">
              No articles yet. Write your first one above.
            </p>
          </div>
        ) : (
          articles.map((article, i) => (
            <div
              key={article._id}
              className={`animate-fade-in-up delay-${(i % 5) * 100} bg-[#0f0f1a] border border-white/8 rounded-2xl p-5 hover:border-white/15 transition-all duration-200 flex items-start justify-between gap-4`}
            >
              <div className="flex items-start gap-4 min-w-0">
                {/* Cover thumbnail */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-900/40 to-[#0f0f1a] border border-white/8 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {article.coverImage ? (
                    <img
                      src={article.coverImage}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen size={20} className="text-emerald-500/40" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-white font-semibold text-sm truncate">
                      {article.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border font-medium flex-shrink-0
                      ${
                        article.isPublished
                          ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                          : "text-white/30 bg-white/5 border-white/10"
                      }`}
                    >
                      {article.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="text-white/35 text-xs line-clamp-1">
                    {article.excerpt || article.content?.substring(0, 100)}
                  </p>
                  <p className="text-white/25 text-xs mt-1.5">
                    {new Date(article.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    {" · "}by {article.createdBy?.name || "Admin"}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleDelete(article._id)}
                  disabled={deleting === article._id}
                  className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 disabled:opacity-50 transition-all"
                >
                  {deleting === article._id ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Trash2 size={13} />
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
