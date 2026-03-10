"use client";

import { BookOpen, Clock, User } from "lucide-react";

export default function ArticleCard({ article, onClick }) {
  const formattedDate = new Date(article.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <div
      onClick={() => onClick && onClick(article)}
      className="group bg-[#0f0f1a] border border-white/8 rounded-2xl overflow-hidden hover:border-violet-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10 cursor-pointer"
    >
      {/* Cover image or placeholder */}
      <div className="h-36 bg-gradient-to-br from-violet-900/40 via-indigo-900/30 to-[#0f0f1a] relative overflow-hidden">
        {article.coverImage ? (
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen size={32} className="text-violet-500/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3
          className="text-white font-semibold text-sm leading-snug mb-2 group-hover:text-violet-300 transition-colors line-clamp-2"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          {article.title}
        </h3>
        <p className="text-white/40 text-xs leading-relaxed line-clamp-2 mb-4">
          {article.excerpt || article.content?.substring(0, 120) + "..."}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-white/30 text-xs">
          <div className="flex items-center gap-1.5">
            <User size={11} />
            <span>{article.createdBy?.name || "Admin"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={11} />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
