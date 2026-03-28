"use client";

import { useEffect, useState } from "react";
import {
  Copy,
  CheckCheck,
  ArrowDownCircle,
  Loader2,
  AlertCircle,
  Wallet,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

// Payment methods
const PAYMENT_METHODS = [
  {
    name: "Bitcoin",
    image: "/usdt.avif",
    address: process.env.NEXT_PUBLIC_BTC_ADDRESS || "YourBTCAddress",
    min: 10,
  },
];

// Status badge
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
      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-sm border ${color}`}
    >
      <Icon size={11} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function DepositPage() {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0]);
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState(false);

  const fetchDeposits = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/deposits/create", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setDeposits(data.deposits);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const totalDeposited = deposits
    .filter((d) => d.status === "approved")
    .reduce((sum, d) => sum + d.amount, 0);
  const pendingCount = deposits.filter((d) => d.status === "pending").length;
  const approvedCount = deposits.filter((d) => d.status === "approved").length;
  const rejectedCount = deposits.filter((d) => d.status === "rejected").length;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedMethod.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file (JPG, PNG, WEBP).");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB
        setError("Screenshot must be under 5MB.");
        return;
      }
      setScreenshot(file);
      const preview = URL.createObjectURL(file);
      setScreenshotPreview(preview);
      setError("");
    }
  };

  const removeScreenshot = () => {
    setScreenshot(null);
    setScreenshotPreview(null);
    if (document.querySelector("#screenshot-input")) {
      document.querySelector("#screenshot-input").value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!amount || !txHash || !screenshot) {
      setError("Please fill in all fields including screenshot proof.");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (txHash.trim().length < 10) {
      setError("Please enter a valid transaction hash.");
      return;
    }

    setFormLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("amount", parsedAmount);
      formData.append("txHash", txHash.trim());
      formData.append("screenshot", screenshot);

      const res = await fetch("/api/deposits/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Something went wrong.");
        return;
      }

      setSuccess("Deposit submitted! Awaiting admin approval.");
      setAmount("");
      setTxHash("");
      setScreenshot(null);
      setScreenshotPreview(null);
      fetchDeposits();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <p className="text-white/40 text-sm mb-1">Fund your account</p>
          <h1 className="text-white text-2xl font-bold tracking-tight">
            Crypto Deposit
          </h1>
        </div>

        {/* Deposit Button */}
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white font-semibold w-full md:w-auto transition-all"
        >
          Deposit
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0f0f1a] border border-white/10 p-4 flex flex-col rounded-0">
          <div className="flex items-center gap-2 mb-2">
            <Wallet size={14} className="text-emerald-400" />
            <span className="text-white/40 text-xs">Total Deposited</span>
          </div>
          <p className="text-white text-xl font-bold">
            ${totalDeposited.toFixed(2)}
          </p>
        </div>
        <div className="bg-[#0f0f1a] border border-white/10 p-4 flex flex-col rounded-0">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={14} className="text-amber-400" />
            <span className="text-white/40 text-xs">Pending</span>
          </div>
          <p className="text-white text-xl font-bold">{pendingCount}</p>
        </div>
        <div className="bg-[#0f0f1a] border border-white/10 p-4 flex flex-col rounded-0">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={14} className="text-violet-400" />
            <span className="text-white/40 text-xs">Approved</span>
          </div>
          <p className="text-white text-xl font-bold">{approvedCount}</p>
        </div>
      </div>

      {/* Wallet address always visible */}
      <div className="bg-[#0f0f1a] border border-white/10 p-4 flex flex-col  items-start justify-between gap-3 rounded-0 w-full">
        {/* Label and icon */}
        <div className="flex items-center gap-2 mb-2 md:mb-0">
          <Wallet size={18} className="text-violet-400" />
          <span className="text-white/50 text-xs font-semibold uppercase tracking-wide">
            Deposit Wallet Address
          </span>
        </div>

        {/* Address display */}
        <div className="flex items-center gap-3 bg-black/50 border border-white/10 px-4 py-3 flex-1 rounded-0 w-full md:w-auto">
          <span className="text-white/80 font-mono truncate text-sm">
            {selectedMethod.address}
          </span>
          <button
            onClick={handleCopy}
            className="flex-shrink-0 p-2 hover:bg-white/10 transition-all rounded-0"
          >
            {copied ? (
              <CheckCheck size={16} className="text-emerald-400" />
            ) : (
              <Copy size={16} className="text-white/40" />
            )}
          </button>
        </div>

        {/* Note */}
        <p className="text-amber-400/70 text-xs mt-2 md:mt-0 md:ml-4">
          <AlertCircle size={12} className="inline-block mr-1 mb-0.5" />
          This is the public wallet address where you should send funds. Only
          send crypto to this address. Minimum deposit: ${selectedMethod.min}.
        </p>
      </div>

      {/* Deposit History */}
      <div className="mt-4">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-widest mb-2">
          Deposit History
        </h3>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          </div>
        ) : deposits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-white/25">
            <ArrowDownCircle size={48} className="mb-4 opacity-20" />
            <p className="text-base font-medium">No deposits yet</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5 max-h-[520px] overflow-y-auto rounded-0 border border-white/10">
            {deposits.map((dep) => (
              <div
                key={dep._id}
                className="px-5 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-2"
              >
                <div>
                  <p className="text-white font-semibold">
                    ${dep.amount.toFixed(2)}
                  </p>
                  <p className="text-white/30 text-xs font-mono truncate">
                    {dep.txHash}
                  </p>
                  <p className="text-white/25 text-xs mt-1">
                    {new Date(dep.createdAt).toLocaleString()}
                  </p>
                </div>
                <StatusBadge status={dep.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Deposit Form Modal */}
      {showForm && (
        <div className="fixed animate-modal-enter inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[200] p-4 md:p-6">
          <div className="bg-[#0f0f1a] border border-white/10 w-full max-w-2xl p-4 md:p-6 relative rounded-0">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white"
            >
              ✕
            </button>

            <h2 className="text-white text-lg font-semibold mb-4">
              Deposit Funds
            </h2>

            {/* Payment Methods */}
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.name}
                  onClick={() => setSelectedMethod(method)}
                  className={`flex items-center gap-2 p-2 border w-full md:w-auto ${
                    selectedMethod.name === method.name
                      ? "border-violet-500 bg-violet-500/10"
                      : "border-white/10 hover:bg-white/10"
                  }`}
                >
                  <img
                    src={method.image}
                    alt={method.name}
                    className="w-6 h-6"
                  />
                  <span className="text-white text-sm">{method.name}</span>
                </button>
              ))}
            </div>

            {/* Wallet Address Card */}
            <div className="bg-black/50 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between px-4 py-3.5 mb-4 rounded-0 w-full">
              <div className="flex items-center gap-2 mb-2 md:mb-0">
                <Wallet size={18} className="text-violet-400" />
                <span className="text-white/50 text-xs font-semibold uppercase tracking-wide">
                  Deposit Wallet Address
                </span>
              </div>
              <div className="flex items-center gap-3 flex-1 w-full md:w-auto">
                <span className="text-white/80 font-mono truncate text-sm">
                  {selectedMethod.address}
                </span>
                <button
                  onClick={handleCopy}
                  className="flex-shrink-0 p-2 hover:bg-white/10 transition-all rounded-0"
                >
                  {copied ? (
                    <CheckCheck size={16} className="text-emerald-400" />
                  ) : (
                    <Copy size={16} className="text-white/40" />
                  )}
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Amount */}
              <div>
                <label className="block text-white/50 text-xs mb-2 font-medium uppercase">
                  Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                    $
                  </span>
                  <input
                    type="number"
                    min={selectedMethod.min}
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-white/[0.03] border border-white/10 pl-8 pr-4 py-3.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500 focus:bg-white/[0.05] transition-all rounded-0"
                  />
                </div>
                <p className="text-white/40 text-xs mt-1">
                  Minimum deposit: ${selectedMethod.min}
                </p>
              </div>

              {/* Transaction Hash */}
              <div>
                <label className="block text-white/50 text-xs mb-2 font-medium uppercase">
                  Transaction Hash (TXID)
                </label>
                <input
                  type="text"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder="Paste your transaction hash..."
                  className="w-full bg-white/[0.03] border border-white/10 px-4 py-3.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500 focus:bg-white/[0.05] transition-all rounded-0 font-mono"
                />
              </div>

              {/* Screenshot Proof */}
              <div>
                <label className="block text-white/50 text-xs mb-2 font-medium uppercase">
                  Payment Screenshot *REQUIRED*
                </label>
                <div className="space-y-2">
                  <input
                    id="screenshot-input"
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotChange}
                    className="w-full bg-white/[0.03] border border-white/10 px-4 py-3.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500 focus:bg-white/[0.05] transition-all rounded-0 file:bg-violet-600/50 file:backdrop-blur-sm file:border-0 file:text-white file:px-4 file:py-2 file:rounded-md file:cursor-pointer file:mr-4 file:hover:bg-violet-500 file:transition-all hover:border-violet-500/50"
                  />
                  {screenshotPreview && (
                    <div className="relative group bg-black/20 border border-white/10 p-2 rounded-md max-w-[200px]">
                      <img
                        src={screenshotPreview}
                        alt="Screenshot preview"
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={removeScreenshot}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500/90 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all"
                      />
                    </div>
                  )}
                  <p className="text-white/40 text-xs">
                    Upload screenshot proof of payment (JPG/PNG/WEBP, max 5MB)
                  </p>
                </div>
              </div>

              {/* Error / Success Messages */}
              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/15 px-4 py-3 animate-fade-in rounded-0">
                  <AlertCircle size={15} />
                  {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/15 px-4 py-3 animate-fade-in rounded-0">
                  <CheckCheck size={15} />
                  {success}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 rounded-0"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <ArrowDownCircle size={16} />
                    Submit Deposit
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
