"use client";

import { BookOpen, Clock, User, ArrowRight } from "lucide-react";

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
      className="group bg-[#0f0f1a] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-violet-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/5 cursor-pointer hover:-translate-y-1"
    >
      {/* Cover image or placeholder */}
      <div className="h-40 bg-gradient-to-br from-violet-900/30 via-indigo-900/20 to-[#0f0f1a] relative overflow-hidden">
        {article.coverImage ? (
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center">
              <BookOpen size={28} className="text-violet-400/50" />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-white font-semibold text-sm leading-snug mb-2 group-hover:text-violet-300 transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-white/40 text-xs leading-relaxed line-clamp-2 mb-4">
          {article.excerpt || article.content?.substring(0, 120) + "..."}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-white/30 text-xs">
            <div className="flex items-center gap-1.5">
              <User size={11} />
              <span>{article.createdBy?.name || "Admin"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={11} />
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Read more arrow */}
          <div className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
            <ArrowRight size={12} className="text-violet-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

