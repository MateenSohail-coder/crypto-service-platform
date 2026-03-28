"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ArrowDownCircle,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Wifi,
  Download,
  Image as ImageIcon,
} from "lucide-react";

function StatusBadge({ status }) {
  const map = {
    pending: {
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      icon: Clock,
    },
    approved: {
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      icon: CheckCircle,
    },
    rejected: {
      color: "text-red-400 bg-red-500/10 border-red-500/20",
      icon: XCircle,
    },
  };
  const { color, icon: Icon } = map[status] || map.pending;
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-sm border ${color}`}
    >
      <Icon size={10} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function ScreenshotPreview({ screenshotUrl, depositId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);
      const response = await fetch(screenshotUrl);
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `deposit-${depositId}-screenshot.${screenshotUrl.split(".").pop().split("?")[0] || "jpg"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      // Fallback to direct download
      const link = document.createElement("a");
      link.href = screenshotUrl;
      link.download = `deposit-${depositId}-screenshot.jpg`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (e) => {
    e.stopPropagation();

    // Create overlay backdrop
    const overlay = document.createElement("div");
    overlay.className = `
    fixed inset-0 z-[999] bg-black/70 backdrop-blur-md flex items-center justify-center p-4
    animate-fade-in cursor-pointer
  `;

    // Create image
    const img = document.createElement("img");
    img.src = screenshotUrl;
    img.className = `
    max-w-[95vw] max-h-[95vh] w-auto h-auto object-contain rounded-2xl shadow-2xl
    cursor-zoom-out hover:scale-105 transition-transform duration-200
  `;
    img.draggable = false;
    img.ondragstart = () => false;

    // Close handlers
    const closePreview = () => {
      document.body.removeChild(overlay);
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };

    overlay.onclick = closePreview;
    img.onclick = (e) => e.stopPropagation(); // Prevent closing when clicking image

    // Add ESC key support
    const handleKeydown = (e) => {
      if (e.key === "Escape") closePreview();
    };

    // Lock scroll
    const scrollBarWidth = window.innerWidth - document.body.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollBarWidth}px`;

    // Add event listeners
    document.addEventListener("keydown", handleKeydown);

    // Assemble and append
    overlay.appendChild(img);
    document.body.appendChild(overlay);

    // Cleanup on image load error
    img.onerror = () => {
      closePreview();
      document.addEventListener("keydown", handleKeydown);
    };
  };

  if (!screenshotUrl) return null;

  return (
    <div className="mx-auto max-w-[95%] sm:max-w-sm md:max-w-md p-0 bg-transparent border-none rounded-2xl shadow-none group relative ring-0 hover:shadow-none hover:ring-0 transition-none">
      {/* Label */}
      <div className="absolute -top-3 left-1/2 z-[1000] -translate-x-1/2 bg-gradient-to-r from-violet-500 to-purple-600 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg tracking-wide">
        Proof
      </div>

      {/* Image Container - Clean centered preview */}
      <div
        className="flex items-center justify-center relative w-full h-44 sm:h-48 md:h-44 p-0 bg-transparent border-none rounded-xl hover:bg-transparent transition-none group-hover:scale-[1.02] cursor-pointer"
        onClick={handlePreview}
      >
        {error ? (
          <div className="flex flex-col items-center justify-center h-full text-white/60 p-4 text-sm gap-1">
            <ImageIcon size={20} />
            <span>Unavailable</span>
          </div>
        ) : (
          <>
            <img
              src={screenshotUrl}
              alt="Deposit screenshot"
              className={`w-full h-full object-contain rounded-lg hover:scale-105 transition-transform duration-200 ${loading ? "opacity-60" : ""}`}
              onLoad={() => {
                setLoading(false);
                setError(false);
              }}
              onError={() => setError(true)}
              draggable={false}
            />
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center rounded bg-black/40">
                <Loader2 size={16} className="animate-spin text-violet-400" />
              </div>
            )}
          </>
        )}
      </div>

      {/* Download Button - Perfectly centered icon */}
      <button
        onClick={handleDownload}
        disabled={loading || error}
        className="absolute top-2 right-2 w-9 h-9 flex items-center justify-center backdrop-blur-sm bg-emerald-600/90 hover:bg-emerald-500 text-white rounded-lg shadow-lg hover:shadow-emerald/20 hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed z-10"
        aria-label="Download screenshot"
      >
        {loading ? (
          <Loader2 size={14} className="animate-spin flex-shrink-0" />
        ) : (
          <Download size={14} className="flex-shrink-0" />
        )}
      </button>
    </div>
  );
}

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);
  const [liveIndicator, setLiveIndicator] = useState(false);

  const fetchDeposits = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/deposits/approve", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setDeposits(data.deposits);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeposits();
  }, [fetchDeposits]);

  useEffect(() => {
    const handleNewDeposit = () => {
      setLiveIndicator(true);
      setTimeout(() => setLiveIndicator(false), 2000);
      fetchDeposits();
    };
    const handleReviewed = () => {
      fetchDeposits();
    };

    window.addEventListener("sse:new_deposit", handleNewDeposit);
    window.addEventListener("sse:deposit_reviewed", handleReviewed);
    return () => {
      window.removeEventListener("sse:new_deposit", handleNewDeposit);
      window.removeEventListener("sse:deposit_reviewed", handleReviewed);
    };
  }, [fetchDeposits]);

  useEffect(() => {
    setFiltered(
      tab === "all" ? deposits : deposits.filter((d) => d.status === tab),
    );
  }, [tab, deposits]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAction = async (depositId, action) => {
    setActionLoading(depositId + action);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/deposits/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ depositId, action }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchDeposits();
      } else showToast(data.message || "Action failed.", "error");
    } catch {
      showToast("Network error.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const counts = {
    all: deposits.length,
    pending: deposits.filter((d) => d.status === "pending").length,
    approved: deposits.filter((d) => d.status === "approved").length,
    rejected: deposits.filter((d) => d.status === "rejected").length,
  };

  const tabs = [
    {
      key: "all",
      label: "All",
      active: "bg-violet-600 text-white shadow-lg shadow-violet-600/20",
    },
    {
      key: "pending",
      label: "Pending",
      active: "bg-amber-600 text-white shadow-lg shadow-amber-600/20",
    },
    {
      key: "approved",
      label: "Approved",
      active: "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20",
    },
    {
      key: "rejected",
      label: "Rejected",
      active: "bg-red-600 text-white shadow-lg shadow-red-600/20",
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row flex-wrap items-start justify-between gap-3 sm:gap-4">
        <div>
          <p className="text-white/40 text-sm mb-1">Verify & approve</p>
          <h1 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
            Deposits
          </h1>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Live indicator */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border text-xs font-medium transition-all duration-300 ${
              liveIndicator
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                : "bg-white/[0.03] border-white/[0.07] text-white/25"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${liveIndicator ? "bg-emerald-400 animate-pulse" : "bg-white/20"}`}
            />
            <Wifi size={11} />
            {liveIndicator ? "New deposit!" : "Live"}
          </div>
          {/* Pending count */}
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-sm px-4 py-2">
            <Clock size={13} className="text-amber-400" />
            <span className="text-amber-400 text-sm font-semibold">
              {counts.pending} pending review
            </span>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div
        className="animate-fade-in-up flex flex-wrap gap-1 bg-[#0c0c15] border border-white/[0.07] rounded-lg p-2 w-full sm:w-fit"
        style={{ animationDelay: "100ms" }}
      >
        {tabs.map(({ key, label, active }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
              tab === key ? active : "text-white/35 hover:text-white/70"
            }`}
          >
            {label}
            <span
              className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
                tab === key
                  ? "bg-white/20 text-white"
                  : "bg-white/[0.06] text-white/40"
              }`}
            >
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-sm text-sm font-medium shadow-2xl animate-fade-in border ${
            toast.type === "error"
              ? "bg-red-950/95 text-red-300 border-red-500/30"
              : "bg-emerald-950/95 text-emerald-300 border-emerald-500/30"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Deposits list */}
      <div
        className="max-h-[70vh] sm:max-h-[75vh] lg:max-h-none animate-fade-in-up space-y-0 bg-[#0c0c15] border border-white/[0.07] rounded-xl overflow-y-auto scrollbar-thin scrollbar-thumb-violet/30 scrollbar-track-transparent"
        style={{ animationDelay: "200ms" }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-white/20">
            <ArrowDownCircle size={32} className="mb-3 opacity-30" />
            <p className="text-sm">
              No {tab !== "all" ? tab : ""} deposits found.
            </p>
          </div>
        ) : (
          <>
            {/* Table header — desktop */}
            <div className="hidden lg:grid lg:grid-cols-[1.5fr_1.2fr_1fr_1.5fr_160px_auto] px-4 sm:px-5 py-3 border-b border-white/[0.05] bg-white/[0.02] text-[10px] font-semibold uppercase tracking-widest text-white/25">
              <span>Amount</span>
              <span>User</span>
              <span>TXID</span>
              <span>Screenshot</span>
              <span>Submitted</span>
              <span className="text-right">Action</span>
            </div>

            <div className="divide-y divide-white/[0.04]">
              {filtered.map((dep, i) => (
                <div
                  key={dep._id}
                  className={`animate-fade-in-up transition-colors ${
                    dep.status === "pending"
                      ? "hover:bg-amber-500/[0.03]"
                      : "hover:bg-white/[0.02]"
                  }`}
                  style={{ animationDelay: `${(i % 5) * 50}ms` }}
                >
                  {/* Desktop row */}
                  <div className="hidden lg:grid lg:grid-cols-[1.5fr_1.2fr_1fr_1.5fr_160px_auto] px-5 py-5 items-start gap-4">
                    {/* Amount + status */}
                    <div className="flex items-center gap-3 pt-1">
                      <div
                        className={`w-9 h-9 rounded-sm flex items-center justify-center flex-shrink-0 ${
                          dep.status === "pending"
                            ? "bg-amber-500/15"
                            : dep.status === "approved"
                              ? "bg-emerald-500/15"
                              : "bg-red-500/15"
                        }`}
                      >
                        <ArrowDownCircle
                          size={15}
                          className={
                            dep.status === "pending"
                              ? "text-amber-400"
                              : dep.status === "approved"
                                ? "text-emerald-400"
                                : "text-red-400"
                          }
                        />
                      </div>
                      <div>
                        <p className="text-white font-bold text-lg">
                          ${dep.amount.toFixed(2)}
                        </p>
                        <StatusBadge status={dep.status} />
                      </div>
                    </div>

                    {/* User */}
                    <div>
                      <p className="text-white/80 text-sm font-medium">
                        {dep.userId?.name}
                      </p>
                      <p className="text-white/35 text-xs truncate max-w-[200px]">
                        {dep.userId?.email}
                      </p>
                    </div>

                    {/* Tx hash */}
                    <p className="text-white/30 text-xs font-mono truncate pr-2 max-w-[180px]">
                      {dep.txHash || "—"}
                    </p>

                    {/* Screenshot - Desktop */}
                    <div className="flex justify-center">
                      <ScreenshotPreview
                        screenshotUrl={dep.screenshotUrl}
                        depositId={dep._id}
                      />
                    </div>

                    {/* Date */}
                    <p className="text-white/35 text-xs whitespace-nowrap">
                      {new Date(dep.createdAt).toLocaleString()}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-2 justify-end">
                      {dep.status === "pending" ? (
                        <>
                          <button
                            onClick={() => handleAction(dep._id, "rejected")}
                            disabled={!!actionLoading}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 disabled:opacity-50 transition-all"
                          >
                            {actionLoading === dep._id + "rejected" ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <XCircle size={12} />
                            )}
                            Reject
                          </button>
                          <button
                            onClick={() => handleAction(dep._id, "approved")}
                            disabled={!!actionLoading}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 disabled:opacity-50 transition-all"
                          >
                            {actionLoading === dep._id + "approved" ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <CheckCircle size={12} />
                            )}
                            Approve
                          </button>
                        </>
                      ) : (
                        <span className="text-white/20 text-xs">
                          {dep.reviewedAt
                            ? `Reviewed ${new Date(dep.reviewedAt).toLocaleDateString()}`
                            : "—"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Mobile card */}
                  <div className="lg:hidden px-4 py-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0 ${
                            dep.status === "pending"
                              ? "bg-amber-500/15"
                              : dep.status === "approved"
                                ? "bg-emerald-500/15"
                                : "bg-red-500/15"
                          }`}
                        >
                          <ArrowDownCircle
                            size={17}
                            className={
                              dep.status === "pending"
                                ? "text-amber-400"
                                : dep.status === "approved"
                                  ? "text-emerald-400"
                                  : "text-red-400"
                            }
                          />
                        </div>
                        <div>
                          <p className="text-white font-bold text-lg">
                            ${dep.amount.toFixed(2)}
                          </p>
                          <StatusBadge status={dep.status} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <p className="text-white/60 text-sm">
                          <span className="font-medium text-white/80">
                            {dep.userId?.name}
                          </span>
                          <span className="text-white/30">
                            {" "}
                            · {dep.userId?.email}
                          </span>
                        </p>
                        {dep.txHash && (
                          <p className="text-white/25 text-xs font-mono break-all">
                            {dep.txHash}
                          </p>
                        )}
                      </div>

                      {/* Screenshot - Mobile */}
                      <ScreenshotPreview
                        screenshotUrl={dep.screenshotUrl}
                        depositId={dep._id}
                      />

                      <p className="text-white/25 text-xs">
                        {new Date(dep.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {dep.status === "pending" && (
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => handleAction(dep._id, "rejected")}
                          disabled={!!actionLoading}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
                        >
                          {actionLoading === dep._id + "rejected" ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <XCircle size={14} />
                          )}
                          Reject
                        </button>
                        <button
                          onClick={() => handleAction(dep._id, "approved")}
                          disabled={!!actionLoading}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
                        >
                          {actionLoading === dep._id + "approved" ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <CheckCircle size={14} />
                          )}
                          Approve
                        </button>
                      </div>
                    )}

                    {dep.status !== "pending" && dep.reviewedAt && (
                      <p className="text-white/20 text-xs pt-2">
                        Reviewed {new Date(dep.reviewedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
