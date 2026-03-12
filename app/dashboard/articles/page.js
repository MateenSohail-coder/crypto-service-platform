"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  X,
  Clock,
  User,
  ChevronRight,
  Search,
  FileText,
  ArrowRight,
} from "lucide-react";

/* ---------------- TIME AGO ---------------- */

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

/* ---------------- ARTICLE CARD ---------------- */

function ArticleCard({ article, onClick }) {
  return (
    <div
      onClick={() => onClick(article)}
      className="bg-[#0f0f1a] border border-white/10 rounded-sm overflow-hidden hover:border-violet-500/30 hover:shadow-xl hover:shadow-black/30 transition-all duration-300 cursor-pointer group flex flex-col"
    >
      {/* Cover Image */}
      {article.coverImage ? (
        <div className="w-full h-48 overflow-hidden">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        </div>
      ) : (
        <div className="h-48 flex items-center justify-center bg-gradient-to-br from-violet-500/10 to-indigo-500/5">
          <FileText size={30} className="text-white/20" />
        </div>
      )}

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-white font-semibold text-base mb-2 group-hover:text-violet-400 transition line-clamp-2">
          {article.title}
        </h3>

        <p className="text-white/40 text-sm mb-5 flex-1 line-clamp-3">
          {article.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-white/30">
          <div className="flex items-center gap-3">
            {article.createdBy?.name && (
              <span className="flex items-center gap-1">
                <User size={11} />
                {article.createdBy.name}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {timeAgo(article.createdAt)}
            </span>
          </div>

          <span className="flex items-center gap-1 text-violet-400">
            Read <ChevronRight size={13} />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- MAIN PAGE ---------------- */

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  /* Fetch articles */

  useEffect(() => {
    const fetchArticles = async () => {
      const token = localStorage.getItem("token");

      if (!token || token === "null") {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/articles", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (data.success) {
          setArticles(data.articles);
          setFiltered(data.articles);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  /* Search filter */

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(articles);
      return;
    }

    const q = search.toLowerCase();

    setFiltered(
      articles.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt?.toLowerCase().includes(q),
      ),
    );
  }, [search, articles]);

  /* Escape key close modal */

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setSelected(null);
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
            <BookOpen size={18} className="text-violet-400" />
          </div>

          <div>
            <h1 className="text-white text-2xl font-bold">Articles</h1>
            <p className="text-white/40 text-sm">Latest updates and guides</p>
          </div>
        </div>

        {/* Search */}

        <div className="flex items-center gap-2 px-4 py-2 border border-white/10 bg-[#0f0f1a] rounded-sm">
          <Search size={14} className="text-white/30" />

          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-white text-sm placeholder-white/30 w-40 md:w-56"
          />
        </div>
      </div>

      {/* Content */}

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        /* EMPTY STATE */

        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-sm flex items-center justify-center mb-6">
            <BookOpen size={34} className="text-white/20" />
          </div>

          <h3 className="text-white text-lg font-semibold mb-2">
            No Articles Yet
          </h3>

          <p className="text-white/40 text-sm max-w-sm">
            There are no articles available right now. Please check back later
            for updates and announcements.
          </p>

          {search && (
            <button
              onClick={() => setSearch("")}
              className="mt-6 px-4 py-2 border border-white/10 hover:border-white/20 text-white/50 hover:text-white text-sm rounded-sm transition"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((article) => (
            <ArticleCard
              key={article._id}
              article={article}
              onClick={setSelected}
            />
          ))}
        </div>
      )}

      {/* MODAL */}

      {selected && (
        <div
          className="fixed inset-0 animate-modal-enter z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
          onClick={(e) => e.target === e.currentTarget && setSelected(null)}
        >
          <div className="bg-[#08080f] border border-white/[0.08] rounded-sm w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl shadow-black/80 overflow-hidden">
            {/* Hero */}
            <div className="relative flex-shrink-0">
              {selected.coverImage ? (
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={selected.coverImage}
                    alt={selected.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08080f] via-[#08080f]/40 to-transparent" />
                </div>
              ) : (
                <div className="relative h-28 overflow-hidden bg-gradient-to-br from-emerald-950/50 via-[#08080f] to-[#08080f]">
                  <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
                      backgroundSize: "32px 32px",
                    }}
                  />
                  <div className="absolute top-2 right-6 w-28 h-28 rounded-full bg-emerald-500/10 blur-3xl" />
                </div>
              )}

              {/* Category pill */}
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-sm bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 uppercase tracking-widest backdrop-blur-sm">
                  Article
                </span>
              </div>

              {/* Close button */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-sm bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
              >
                <X size={14} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto">
              {/* Title block */}
              <div
                className={`px-7 pb-0 ${selected.coverImage ? "-mt-14 relative z-10" : "pt-6"}`}
              >
                {/* Meta */}
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  {selected.createdBy?.name && (
                    <span className="flex items-center gap-1.5 text-white/35 text-xs">
                      <User size={11} />
                      {selected.createdBy.name}
                    </span>
                  )}
                  <div className="w-1 h-1 rounded-full bg-white/15" />
                  <span className="flex items-center gap-1.5 text-white/35 text-xs">
                    <Clock size={11} />
                    {new Date(selected.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <div className="w-1 h-1 rounded-full bg-white/15" />
                  <span className="text-white/30 text-xs">
                    {Math.max(
                      1,
                      Math.ceil(
                        (selected.content?.split(/\s+/).length || 0) / 200,
                      ),
                    )}{" "}
                    min read
                  </span>
                </div>

                {/* Title */}
                <h2
                  className="text-white pt-10 font-black leading-tight mb-3"
                  style={{
                    fontSize: "clamp(1.25rem, 3.5vw, 1.65rem)",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {selected.title}
                </h2>

                {/* Excerpt */}
                {selected.excerpt && (
                  <p className="text-white/50 text-sm leading-relaxed mb-5 border-l-2 border-emerald-500/40 pl-4 italic">
                    {selected.excerpt}
                  </p>
                )}

                {/* Decorative divider */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-[2px] bg-emerald-500/60 rounded-full" />
                  <div className="w-3 h-[2px] bg-emerald-500/30 rounded-full" />
                  <div className="w-1.5 h-[2px] bg-emerald-500/15 rounded-full" />
                </div>
              </div>

              {/* Content */}
              <div className="px-7 space-y-4">
                {selected.content
                  ?.split("\n")
                  .filter((p) => p.trim())
                  .map((para, i) => (
                    <p
                      key={i}
                      className={`leading-[1.85] ${i === 0 ? "text-white/80 text-[15px] font-medium" : "text-white/60 text-sm"}`}
                    >
                      {para}
                    </p>
                  )) || (
                  <p className="text-white/40 text-sm italic">
                    No content available.
                  </p>
                )}
              </div>

              {/* CTA footer */}
              <div className="mx-7 mt-8 mb-7 p-5 rounded-sm bg-gradient-to-br from-emerald-500/8 to-teal-500/5 border border-emerald-500/15 relative overflow-hidden">
                <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
                <div className="relative z-10">
                  <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                    Enjoyed this insight?
                  </p>
                  <p className="text-white/45 text-sm leading-relaxed">
                    Explore more expert articles and investment strategies
                    published for our community.
                  </p>
                  <div className="flex items-center gap-1.5 mt-3 text-emerald-400 text-xs font-semibold">
                    <span>Browse all articles</span>
                    <ArrowRight size={11} />
                  </div>
                </div>
              </div>

              {/* Close button */}
              <div className="px-7 pb-7">
                <button
                  onClick={() => setSelected(null)}
                  className="w-full py-2.5 rounded-sm border border-white/[0.08] hover:border-white/[0.15] bg-white/[0.02] hover:bg-white/[0.05] text-white/40 hover:text-white/80 text-sm font-medium transition-all"
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
