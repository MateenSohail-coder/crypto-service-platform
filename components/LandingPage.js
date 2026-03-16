"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  ShoppingBag,
  Users,
  DollarSign,
  Package,
  Store,
  BarChart3,
  Shield,
  Zap,
  ChevronDown,
  CheckCircle,
  Globe,
  Repeat,
  PieChart,
  ArrowUpRight,
  Menu,
  X,
  ShoppingCart,
  Star,
  TrendingUp,
} from "lucide-react";

// ── Intersection Observer hook ────────────────────────────────────────────
function useReveal(options = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12, ...options },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ── Animated counter ──────────────────────────────────────────────────────
function Counter({ end, prefix = "", suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useReveal();
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [visible, end, duration]);
  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ── Reveal wrapper ────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = "", direction = "up" }) {
  const [ref, visible] = useReveal();
  const base = "transition-all duration-700 ease-out";
  const hidden = {
    up: "opacity-0 translate-y-8",
    down: "opacity-0 -translate-y-8",
    left: "opacity-0 translate-x-8",
    right: "opacity-0 -translate-x-8",
  }[direction];
  return (
    <div
      ref={ref}
      className={`${base} ${visible ? "opacity-100 translate-x-0 translate-y-0" : hidden} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

// ── FAQ Accordion ─────────────────────────────────────────────────────────
function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal delay={index * 60}>
      <div
        className={`border rounded-sm overflow-hidden transition-all duration-300 ${
          open
            ? "border-violet-500/30 bg-violet-500/[0.04]"
            : "border-white/[0.07] bg-white/[0.02]"
        }`}
      >
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
        >
          <span
            className={`font-semibold text-sm lg:text-[15px] transition-colors ${open ? "text-white" : "text-white/65"}`}
          >
            {q}
          </span>
          <ChevronDown
            size={16}
            className={`flex-shrink-0 transition-all duration-300 ${open ? "rotate-180 text-violet-400" : "text-white/25"}`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${open ? "max-h-64" : "max-h-0"}`}
        >
          <p className="text-white/45 text-sm leading-relaxed px-6 pb-5">{a}</p>
        </div>
      </div>
    </Reveal>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Active nav link tracking
  useEffect(() => {
    const sections = ["how-it-works", "benefits", "platforms", "faq"];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { threshold: 0.35 },
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const navLinks = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Benefits", href: "#benefits" },
    { label: "Platforms", href: "#platforms" },
    { label: "FAQ", href: "#faq" },
  ];

  const steps = [
    {
      icon: Package,
      color: "border-blue-500/25",
      bg: "bg-blue-500/10",
      ic: "text-blue-400",
      accent: "bg-blue-500",
      num: "01",
      title: "Surplus Stock Identified",
      desc: "Our system scans Amazon, Alibaba, and AliExpress for leftover inventory — products with minimal sales or replaced by newer models — at deeply discounted prices.",
    },
    {
      icon: Users,
      color: "border-violet-500/25",
      bg: "bg-violet-500/10",
      ic: "text-violet-400",
      accent: "bg-violet-500",
      num: "02",
      title: "Investors Fund the Purchase",
      desc: "Registered investors pool capital to purchase this discounted stock. Each subscription earns a fixed commission return, making it low-risk and high-reward.",
    },
    {
      icon: Store,
      color: "border-emerald-500/25",
      bg: "bg-emerald-500/10",
      ic: "text-emerald-400",
      accent: "bg-emerald-500",
      num: "03",
      title: "Sold to Local Stores",
      desc: "We connect with local retailers on platforms like Daraz and small shops who buy this stock at wholesale price — cheaper than market, profitable for everyone.",
    },
    {
      icon: DollarSign,
      color: "border-amber-500/25",
      bg: "bg-amber-500/10",
      ic: "text-amber-400",
      accent: "bg-amber-500",
      num: "04",
      title: "Everyone Wins",
      desc: "Big brands clear surplus. Local stores get affordable inventory. Investors earn commission returns. We earn platform fees. A complete circular economy.",
    },
  ];

  const benefits = [
    {
      icon: TrendingUp,
      color: "border-violet-500/20",
      bg: "bg-violet-500/8",
      ic: "text-violet-400",
      title: "Daily Commission Returns",
      desc: "Subscribe to investment services and earn a percentage return daily. Up to 24 subscriptions per day means consistent compounding income.",
    },
    {
      icon: Shield,
      color: "border-blue-500/20",
      bg: "bg-blue-500/8",
      ic: "text-blue-400",
      title: "Verified & Secure",
      desc: "Every deposit is manually reviewed and verified by our admin team before approval. Your funds are always tracked with full transparency.",
    },
    {
      icon: Globe,
      color: "border-emerald-500/20",
      bg: "bg-emerald-500/8",
      ic: "text-emerald-400",
      title: "Global Stock Access",
      desc: "We source discounted inventory from the world's largest marketplaces — Amazon, Alibaba, and AliExpress — giving you exposure to global trade.",
    },
    {
      icon: Repeat,
      color: "border-amber-500/20",
      bg: "bg-amber-500/8",
      ic: "text-amber-400",
      title: "Circular Economy Model",
      desc: "Our platform creates a win-win ecosystem — big retailers clear stock, small stores get cheap inventory, and investors profit every transaction.",
    },
    {
      icon: PieChart,
      color: "border-pink-500/20",
      bg: "bg-pink-500/8",
      ic: "text-pink-400",
      title: "Transparent Dashboard",
      desc: "Track every deposit, subscription, and commission earned in real time. Your full financial history is always visible and downloadable.",
    },
    {
      icon: Zap,
      color: "border-cyan-500/20",
      bg: "bg-cyan-500/8",
      ic: "text-cyan-400",
      title: "Instant Notifications",
      desc: "Get notified the moment your deposit is approved, commission is credited, or a new investment opportunity becomes available.",
    },
  ];

  const platforms = [
    {
      name: "Amazon",
      color: "text-amber-400",
      bg: "bg-amber-500/8  border-amber-500/20",
    },
    {
      name: "Alibaba",
      color: "text-orange-400",
      bg: "bg-orange-500/8 border-orange-500/20",
    },
    {
      name: "AliExpress",
      color: "text-red-400",
      bg: "bg-red-500/8    border-red-500/20",
    },
    {
      name: "Daraz",
      color: "text-violet-400",
      bg: "bg-violet-500/8 border-violet-500/20",
    },
  ];

  const faqs = [
    {
      q: "How does the investment work?",
      a: "You deposit funds into your account, then subscribe to available investment services. Each service has a fixed price and commission rate. When you subscribe, you receive your capital back plus the commission — instantly credited to your balance.",
    },
    {
      q: "Where does the commission come from?",
      a: "Our platform earns revenue by facilitating the purchase and resale of surplus stock from global marketplaces to local retailers. A portion of this margin is distributed back to investors as commission returns.",
    },
    {
      q: "How do I deposit funds?",
      a: "You submit a crypto deposit along with your transaction ID. Our admin team verifies the transaction on the blockchain and manually approves it. Once approved, your balance is updated instantly.",
    },
    {
      q: "Is there a minimum investment?",
      a: "Each investment service has its own minimum subscription price. You can view all available services and their pricing after creating a free account.",
    },
    {
      q: "How many times can I invest per day?",
      a: "You can subscribe to investment services up to 24 times per day. This limit resets at midnight, allowing you to maximize your daily returns consistently.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#07070f] text-white overflow-x-hidden">
      {/* ── Navbar ─────────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#07070f]/95 backdrop-blur-xl border-b border-white/[0.06] py-3"
            : "py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-10 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            {/* Logo Icon */}
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 via-violet-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-violet-500/30 group-hover:shadow-violet-600/50 group-hover:-translate-y-0.5 transition-all duration-300 border border-white/10">
              <TrendingUp
                size={18}
                className="text-white drop-shadow-sm"
                strokeWidth={2.2}
              />
            </div>

            {/* Brand Text */}
            <div className="leading-tight">
              <p className="text-white font-black text-[1.15rem] leading-none tracking-[-0.05em] bg-gradient-to-r from-white to-violet-100 bg-clip-text text-transparent">
                Bstock
              </p>
              <p className="text-white/25 text-[9px] font-medium tracking-[0.25em] uppercase mt-1 leading-none">
                Investment Platform
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center">
            <div
              className={`flex items-center gap-1 px-2 py-1.5 rounded-sm transition-all duration-300 ${scrolled ? "bg-white/[0.03] border border-white/[0.07]" : ""}`}
            >
              {navLinks.map((item) => {
                const id = item.href.replace("#", "");
                const isActive = activeSection === id;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`relative px-4 py-2 text-[13px] font-medium rounded-sm transition-all duration-200 ${
                      isActive
                        ? "text-white bg-white/[0.06]"
                        : "text-white/45 hover:text-white/80 hover:bg-white/[0.03]"
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-violet-400" />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-2 text-[13px] font-medium text-white/50 hover:text-white transition-colors rounded-sm hover:bg-white/[0.04]"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-1.5 px-4 py-2 rounded-sm bg-violet-600 hover:bg-violet-500 text-white text-[13px] font-bold transition-all shadow-lg shadow-violet-600/20 active:scale-[0.98]"
            >
              Start Investing <ArrowRight size={13} />
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden w-9 h-9 rounded-sm bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            {mobileMenu ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${mobileMenu ? "max-h-96 border-t border-white/[0.06]" : "max-h-0"}`}
        >
          <div className="bg-[#0a0a12] px-5 py-5 space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenu(false)}
                className="block text-white/55 hover:text-white text-sm py-2.5 px-3 rounded-sm hover:bg-white/[0.04] transition-all"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-3 border-t border-white/[0.06] mt-3">
              <Link
                href="/login"
                className="text-center py-2.5 rounded-sm border border-white/[0.09] text-white/55 text-sm font-medium hover:bg-white/[0.04] transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-center py-2.5 rounded-sm bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold transition-all"
              >
                Start Investing
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-24 pb-16 overflow-hidden">
        {/* BG glows */}
        <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-violet-700/12 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-700/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-violet-900/8 rounded-full blur-[120px] pointer-events-none" />

        {/* Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.018]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Floating badges */}
        {[
          {
            icon: Package,
            text: "Amazon Surplus Stock",
            color: "bg-amber-950/90 border-amber-500/30 text-amber-300",
            pos: "top-36 left-6 lg:left-20",
            delay: "0.6s",
          },
          {
            icon: Store,
            text: "Local Store Ready",
            color: "bg-emerald-950/90 border-emerald-500/30 text-emerald-300",
            pos: "top-52 right-6 lg:right-20",
            delay: "0.9s",
          },
          {
            icon: TrendingUp,
            text: "+8% Daily Commission",
            color: "bg-violet-950/90 border-violet-500/30 text-violet-300",
            pos: "bottom-48 left-6 lg:left-28",
            delay: "1.2s",
          },
          {
            icon: Shield,
            text: "Verified Deposits",
            color: "bg-blue-950/90 border-blue-500/30 text-blue-300",
            pos: "bottom-40 right-6 lg:right-24",
            delay: "1.5s",
          },
        ].map((b, i) => (
          <div
            key={i}
            className={`absolute ${b.pos} hidden lg:flex items-center gap-2 px-3 py-2 rounded-sm border backdrop-blur-md ${b.color} shadow-2xl`}
            style={{ animation: `fadeInUp 0.6s ease-out ${b.delay} both` }}
          >
            <b.icon size={13} />
            <span className="text-[11px] font-semibold whitespace-nowrap">
              {b.text}
            </span>
          </div>
        ))}

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Top badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold mb-8"
            style={{ animation: "fadeInUp 0.5s ease-out both" }}
          >
            <Star size={11} className="fill-violet-400 text-violet-400" />
            Where Global Stock Meets Local Opportunity
            <Star size={11} className="fill-violet-400 text-violet-400" />
          </div>

          {/* Headline */}
          <h1
            className="text-4xl sm:text-5xl lg:text-[4.5rem] font-black tracking-tight leading-[1.05] mb-6"
            style={{
              letterSpacing: "-0.04em",
              animation: "fadeInUp 0.5s ease-out 100ms both",
            }}
          >
            Invest in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-violet-400">
              Surplus Stock
            </span>
            <br />
            Earn Real Returns
          </h1>

          {/* Sub */}
          <p
            className="text-white/45 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
            style={{ animation: "fadeInUp 0.5s ease-out 200ms both" }}
          >
            StockArb connects investors with discounted surplus inventory from
            <span className="text-amber-400 font-semibold"> Amazon</span>,
            <span className="text-orange-400 font-semibold"> Alibaba</span>, and
            <span className="text-red-400 font-semibold"> AliExpress</span> —
            reselling it to local stores for consistent commission returns.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-wrap items-center justify-center gap-4 mb-16"
            style={{ animation: "fadeInUp 0.5s ease-out 300ms both" }}
          >
            <Link
              href="/register"
              className="flex items-center gap-2 px-8 py-4 rounded-sm bg-violet-600 hover:bg-violet-500 active:scale-[0.98] text-white font-bold transition-all shadow-2xl shadow-violet-600/25 hover:-translate-y-0.5 hover:shadow-violet-600/40"
            >
              Start Investing Free <ArrowRight size={16} />
            </Link>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 px-8 py-4 rounded-sm bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.09] text-white font-semibold transition-all hover:-translate-y-0.5"
            >
              How It Works <ChevronDown size={16} />
            </a>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-3 gap-3 max-w-xl mx-auto"
            style={{ animation: "fadeInUp 0.5s ease-out 400ms both" }}
          >
            {[
              { value: 500, suffix: "+", label: "Active Investors" },
              {
                value: 8,
                suffix: "%",
                label: "Avg Daily Return",
                prefix: "Up to ",
              },
              { value: 24, suffix: "x", label: "Daily Subscriptions" },
            ].map((stat, i) => (
              <div
                key={i}
                className="relative bg-white/[0.03] border border-white/[0.07] rounded-sm p-4 lg:p-5 overflow-hidden group hover:border-white/[0.12] transition-all"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-violet-500/40 group-hover:bg-violet-500/70 transition-all" />
                <p
                  className="text-2xl lg:text-3xl font-black text-white mb-1"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  {stat.prefix && (
                    <span className="text-xs lg:text-sm text-white/35 font-normal">
                      {stat.prefix}
                    </span>
                  )}
                  <Counter end={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-white/35 text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ animation: "bounce 2s infinite 2s" }}
        >
          <span className="text-white/18 text-[11px] tracking-widest uppercase">
            Scroll
          </span>
          <ChevronDown size={14} className="text-white/18" />
        </div>
      </section>

      {/* ── Platforms strip ────────────────────────────────────────── */}
      <section
        id="platforms"
        className="py-14 px-4 border-y border-white/[0.05] bg-white/[0.01]"
      >
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <p className="text-white/25 text-[10px] font-bold uppercase tracking-[0.2em] mb-7">
              Sourcing from the world's largest marketplaces
            </p>
          </Reveal>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {platforms.map((p, i) => (
              <Reveal key={p.name} delay={i * 80}>
                <div
                  className={`flex items-center gap-2 px-5 py-3 rounded-sm border ${p.bg} hover:scale-[1.03] transition-all cursor-default`}
                >
                  <Globe size={14} className={p.color} />
                  <span className={`font-bold text-sm ${p.color}`}>
                    {p.name}
                  </span>
                </div>
              </Reveal>
            ))}
            <Reveal delay={400}>
              <div className="flex items-center gap-2 px-5 py-3 rounded-sm border bg-white/[0.03] border-white/[0.07]">
                <span className="text-white/30 text-sm">+ More platforms</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────── */}
      <section id="how-it-works" className="py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Reveal>
              <p className="text-violet-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
                Simple Process
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2
                className="text-3xl lg:text-5xl font-black tracking-tight mb-4"
                style={{ letterSpacing: "-0.035em" }}
              >
                How StockArb Works
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="text-white/40 text-lg max-w-2xl mx-auto">
                A transparent 4-step model creating value for investors, local
                retailers, and global brands simultaneously.
              </p>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step, i) => (
              <Reveal key={i} delay={i * 100} direction="up">
                <div
                  className={`relative bg-[#0c0c15] border ${step.color} rounded-sm p-6 hover:border-opacity-60 hover:-translate-y-1 transition-all duration-300 group h-full`}
                >
                  <div
                    className={`absolute top-0 left-0 w-full h-[2px] ${step.accent} opacity-50 group-hover:opacity-100 transition-opacity`}
                  />
                  <span className="absolute top-4 right-4 text-white/[0.06] text-5xl font-black select-none">
                    {step.num}
                  </span>
                  <div
                    className={`w-10 h-10 rounded-sm ${step.bg} flex items-center justify-center mb-5`}
                  >
                    <step.icon size={18} className={step.ic} />
                  </div>
                  <h3 className="text-white font-bold text-[15px] mb-3 leading-tight pr-6">
                    {step.title}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                  {i < steps.length - 1 && (
                    <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-sm bg-[#0c0c15] border border-white/[0.09] items-center justify-center">
                      <ArrowRight size={11} className="text-white/25" />
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ───────────────────────────────────────────────── */}
      <section id="benefits" className="py-28 px-4 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Reveal>
              <p className="text-violet-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
                Why Choose Us
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2
                className="text-3xl lg:text-5xl font-black tracking-tight mb-4"
                style={{ letterSpacing: "-0.035em" }}
              >
                Built for Investors
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="text-white/40 text-lg max-w-2xl mx-auto">
                Everything you need to invest confidently, track your returns,
                and grow your portfolio.
              </p>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((b, i) => (
              <Reveal key={i} delay={i * 80}>
                <div
                  className={`bg-[#0c0c15] border ${b.color} rounded-sm p-6 hover:-translate-y-1 transition-all duration-300 group h-full`}
                >
                  <div
                    className={`w-10 h-10 rounded-sm ${b.bg} flex items-center justify-center mb-4`}
                  >
                    <b.icon size={17} className={b.ic} />
                  </div>
                  <h3 className="text-white font-bold text-[15px] mb-2">
                    {b.title}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Earnings calc ──────────────────────────────────────────── */}
      <section className="py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="bg-[#0c0c15] border border-violet-500/20 rounded-sm p-8 lg:p-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-violet-500/0 via-violet-500/60 to-violet-500/0" />
              <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
                <div>
                  <p className="text-violet-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
                    Earnings Example
                  </p>
                  <h2
                    className="text-3xl lg:text-4xl font-black tracking-tight mb-4"
                    style={{ letterSpacing: "-0.035em" }}
                  >
                    See Your Money Work
                  </h2>
                  <p className="text-white/45 leading-relaxed mb-6 text-sm">
                    Subscribe to an investment service and receive your capital
                    back plus commission — instantly. Repeat up to 24 times
                    daily for compounding returns.
                  </p>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-violet-600 hover:bg-violet-500 active:scale-[0.98] text-white font-bold text-sm transition-all shadow-lg shadow-violet-600/20"
                  >
                    Start Earning <ArrowUpRight size={15} />
                  </Link>
                </div>

                <div className="bg-[#08080e] border border-white/[0.07] rounded-sm p-6 space-y-1">
                  <p className="text-white/25 text-[10px] uppercase tracking-[0.18em] font-bold mb-4">
                    Example Calculation
                  </p>
                  {[
                    {
                      label: "Service Price",
                      val: "$100.00",
                      vc: "text-white",
                    },
                    {
                      label: "Commission Rate",
                      val: "8%",
                      vc: "text-emerald-400",
                    },
                    {
                      label: "You Receive",
                      val: "$108.00",
                      vc: "text-violet-400",
                    },
                    {
                      label: "Per day (×24)",
                      val: "+$192.00",
                      vc: "text-emerald-400",
                    },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-3 border-b border-white/[0.05]"
                    >
                      <span className="text-white/45 text-sm">{row.label}</span>
                      <span className={`font-bold text-sm ${row.vc}`}>
                        {row.val}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center py-3 bg-violet-500/8 rounded-sm px-3 mt-2">
                    <span className="text-white/65 text-sm font-semibold">
                      Daily Net Profit
                    </span>
                    <span
                      className="text-violet-400 font-black text-xl"
                      style={{ letterSpacing: "-0.03em" }}
                    >
                      $192
                    </span>
                  </div>
                  <p className="text-white/18 text-[10px] text-center pt-2">
                    *$100 service × 8% commission × 24 subscriptions
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Who benefits ───────────────────────────────────────────── */}
      <section className="py-28 px-4 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Reveal>
              <p className="text-violet-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
                Ecosystem
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2
                className="text-3xl lg:text-5xl font-black tracking-tight mb-4"
                style={{ letterSpacing: "-0.035em" }}
              >
                Everyone Wins
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="text-white/40 text-lg max-w-xl mx-auto">
                Our circular economy model creates real value for every
                participant in the chain.
              </p>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: Package,
                border: "border-amber-500/20",
                bg: "bg-amber-500/8",
                ic: "text-amber-400",
                tagBg: "bg-amber-500/10 border-amber-500/20 text-amber-400",
                label: "Global Brands",
                title: "Clear Surplus Inventory",
                points: [
                  "Sell slow-moving or replaced stock",
                  "Recover capital from dead inventory",
                  "Maintain brand value — no public discounting",
                ],
              },
              {
                icon: Users,
                border: "border-violet-500/20",
                bg: "bg-violet-500/8",
                ic: "text-violet-400",
                tagBg: "bg-violet-500/10 border-violet-500/20 text-violet-400",
                label: "Investors",
                title: "Earn Commission Returns",
                points: [
                  "Fund stock purchases through subscriptions",
                  "Earn fixed percentage returns daily",
                  "Up to 24x returns per day",
                ],
              },
              {
                icon: Store,
                border: "border-emerald-500/20",
                bg: "bg-emerald-500/8",
                ic: "text-emerald-400",
                tagBg:
                  "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
                label: "Local Retailers",
                title: "Get Affordable Inventory",
                points: [
                  "Buy quality products below market price",
                  "Stock up without heavy capital requirements",
                  "Compete with larger retailers",
                ],
              },
            ].map((card, i) => (
              <Reveal key={i} delay={i * 100}>
                <div
                  className={`bg-[#0c0c15] border ${card.border} rounded-sm p-7 hover:-translate-y-1 transition-all duration-300 h-full`}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className={`w-9 h-9 rounded-sm ${card.bg} flex items-center justify-center`}
                    >
                      <card.icon size={16} className={card.ic} />
                    </div>
                    <span
                      className={`text-[10px] font-bold px-3 py-1 rounded-sm border ${card.tagBg} uppercase tracking-wider`}
                    >
                      {card.label}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-4">
                    {card.title}
                  </h3>
                  <ul className="space-y-3">
                    {card.points.map((p, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2.5 text-white/45 text-sm"
                      >
                        <CheckCircle
                          size={13}
                          className={`${card.ic} flex-shrink-0 mt-0.5`}
                        />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────── */}
      <section id="faq" className="py-28 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <Reveal>
              <p className="text-violet-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
                FAQ
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2
                className="text-3xl lg:text-5xl font-black tracking-tight"
                style={{ letterSpacing: "-0.035em" }}
              >
                Common Questions
              </h2>
            </Reveal>
          </div>
          <div className="space-y-2.5">
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────── */}
      <section className="py-28 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <div className="relative bg-[#0c0c15] border border-violet-500/20 rounded-sm px-8 py-16 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-violet-500/0 via-violet-500/60 to-violet-500/0" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-violet-600/12 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold mb-6 uppercase tracking-wider">
                  <Zap size={11} className="fill-violet-400" /> Free to join. No
                  hidden fees.
                </div>
                <h2
                  className="text-3xl lg:text-5xl font-black tracking-tight mb-4"
                  style={{ letterSpacing: "-0.035em" }}
                >
                  Ready to Start Earning?
                </h2>
                <p className="text-white/40 text-lg mb-8 max-w-xl mx-auto">
                  Join hundreds of investors already earning daily commission
                  returns through StockArb's global stock investment platform.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link
                    href="/register"
                    className="flex items-center gap-2 px-8 py-4 rounded-sm bg-violet-600 hover:bg-violet-500 active:scale-[0.98] text-white font-bold transition-all shadow-2xl shadow-violet-600/25 hover:-translate-y-0.5"
                  >
                    Create Free Account <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/login"
                    className="flex items-center gap-2 px-8 py-4 rounded-sm bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.09] text-white font-semibold transition-all hover:-translate-y-0.5"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.05] py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/20">
              <ShoppingCart size={14} className="text-white" />
            </div>
            <div className="leading-none">
              <p
                className="text-white font-black text-sm"
                style={{ letterSpacing: "-0.04em" }}
              >
                StockArb
              </p>
              <p className="text-white/20 text-[8px] tracking-widest uppercase">
                Investment Platform
              </p>
            </div>
          </Link>
          <p className="text-white/20 text-xs text-center">
            © {new Date().getFullYear()} StockArb. All rights reserved.
            Investment involves risk.
          </p>
          <div className="flex items-center gap-6 text-white/30 text-sm">
            <Link href="/login" className="hover:text-white transition-colors">
              Login
            </Link>
            <Link
              href="/register"
              className="hover:text-white transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </footer>

      {/* ── Global keyframes ───────────────────────────────────────── */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </div>
  );
}
