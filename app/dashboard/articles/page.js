"use client";

import { useEffect, useState } from "react";
import ArticleCard from "@/components/ArticleCard";
import { BookOpen, X } from "lucide-react";

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
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
    fetchArticles();
  }, []);

  return (
    <div className="max-w-6xl space-y-8">
      <div className="animate-fade-in-up">
        <p className="text-white/40 text-sm mb-1">Stay informed</p>
        <h1 className="text-white text-2xl font-bold tracking-tight">
          Articles
        </h1>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-[#0f0f1a] border border-white/8 rounded-2xl h-64 animate-pulse"
            />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/30">
          <BookOpen size={40} className="mb-4 opacity-30" />
          <p className="text-sm">No articles published yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((article, i) => (
            <div
              key={article._id}
              className={`animate-fade-in-up delay-${(i % 5) * 100}`}
            >
              <ArticleCard article={article} onClick={setSelected} />
            </div>
          ))}
        </div>
      )}

      {/* Article modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-[#0f0f1a] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {selected.coverImage && (
              <img
                src={selected.coverImage}
                alt={selected.title}
                className="w-full h-48 object-cover rounded-t-2xl"
              />
            )}
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-white text-xl font-bold leading-snug">
                  {selected.title}
                </h2>
                <button
                  onClick={() => setSelected(null)}
                  className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex items-center gap-3 text-white/30 text-xs">
                <span>By {selected.createdBy?.name || "Admin"}</span>
                <span>·</span>
                <span>
                  {new Date(selected.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="h-px bg-white/8" />
              <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                {selected.content}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
