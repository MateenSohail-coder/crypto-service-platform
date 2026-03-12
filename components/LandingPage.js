"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  TrendingUp, ArrowRight, ShoppingBag, Users, DollarSign,
  Package, Store, BarChart3, Shield, Zap, ChevronDown,
  Star, CheckCircle, Globe, Repeat, PieChart, ArrowUpRight,
  Menu, X,
} from "lucide-react";

// ── Animated counter ──────────────────────────────────────────────────────
function Counter({ end, prefix = "", suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// ── Floating badge ────────────────────────────────────────────────────────
function FloatingBadge({ icon: Icon, text, color, delay, position }) {
  return (
    <div
      className={`absolute ${position} hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl border backdrop-blur-sm animate-fade-in-up shadow-xl ${color}`}
      style={{ animationDelay: delay }}
    >
      <Icon size={14} />
      <span className="text-xs font-semibold whitespace-nowrap">{text}</span>
    </div>
  );
}

export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const steps = [
    {
      icon: Package,
      color:  "from-blue-500/20 to-blue-600/10 border-blue-500/20",
      icolor: "text-blue-400",
      num:    "01",
      title:  "Surplus Stock Identified",
      desc:   "Our system scans Amazon, Alibaba, and AliExpress for leftover inventory — products with minimal sales or replaced by newer models — available at deeply discounted prices.",
    },
    {
      icon: Users,
      color:  "from-violet-500/20 to-violet-600/10 border-violet-500/20",
      icolor: "text-violet-400",
      num:    "02",
      title:  "Investors Fund the Purchase",
      desc:   "Registered investors on our platform pool capital to purchase this discounted stock. Each subscription earns a fixed commission return, making it low-risk and high-reward.",
    },
    {
      icon: Store,
      color:  "from-emerald-500/20 to-emerald-600/10 border-emerald-500/20",
      icolor: "text-emerald-400",
      num:    "03",
      title:  "Sold to Local Stores",
      desc:   "We connect with local retailers on platforms like Daraz and small-scale shops who buy this stock at wholesale price — cheaper than market, profitable for everyone.",
    },
    {
      icon: DollarSign,
      color:  "from-amber-500/20 to-amber-600/10 border-amber-500/20",
      icolor: "text-amber-400",
      num:    "04",
      title:  "Everyone Wins",
      desc:   "Big brands clear their surplus. Local stores get affordable inventory. Investors earn commission returns. We earn through platform fees. A complete circular economy.",
    },
  ];

  const benefits = [
    {
      icon: TrendingUp,
      color: "from-violet-500/15 to-violet-600/5 border-violet-500/20",
      ic:   "text-violet-400",
      title: "Daily Commission Returns",
      desc:  "Subscribe to investment services and earn a percentage return daily. Up to 24 subscriptions per day means consistent compounding income.",
    },
    {
      icon: Shield,
      color: "from-blue-500/15 to-blue-600/5 border-blue-500/20",
      ic:   "text-blue-400",
      title: "Verified & Secure",
      desc:  "Every deposit is manually reviewed and verified by our admin team before being approved. Your funds are always tracked transparently.",
    },
    {
      icon: Globe,
      color: "from-emerald-500/15 to-emerald-600/5 border-emerald-500/20",
      ic:   "text-emerald-400",
      title: "Global Stock Access",
      desc:  "We source discounted inventory from the world's largest marketplaces — Amazon, Alibaba, and AliExpress — giving you exposure to global trade.",
    },
    {
      icon: Repeat,
      color: "from-amber-500/15 to-amber-600/5 border-amber-500/20",
      ic:   "text-amber-400",
      title: "Circular Economy Model",
      desc:  "Our platform creates a win-win ecosystem — big retailers clear stock, small stores get cheap inventory, and investors profit through every transaction.",
    },
    {
      icon: PieChart,
      color: "from-pink-500/15 to-pink-600/5 border-pink-500/20",
      ic:   "text-pink-400",
      title: "Transparent Dashboard",
      desc:  "Track every deposit, subscription, and commission earned in real time. Your full financial history is always visible and downloadable.",
    },
    {
      icon: Zap,
      color: "from-cyan-500/15 to-cyan-600/5 border-cyan-500/20",
      ic:   "text-cyan-400",
      title: "Instant Notifications",
      desc:  "Get notified the moment your deposit is approved, your commission is credited, or a new investment opportunity becomes available.",
    },
  ];

  const platforms = [
    { name: "Amazon",     color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20"   },
    { name: "Alibaba",    color: "text-orange-400",  bg: "bg-orange-500/10 border-orange-500/20" },
    { name: "AliExpress", color: "text-red-400",     bg: "bg-red-500/10 border-red-500/20"       },
    { name: "Daraz",      color: "text-violet-400",  bg: "bg-violet-500/10 border-violet-500/20" },
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

      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#07070f]/90 backdrop-blur-xl border-b border-white/[0.06]" : ""
      }`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <TrendingUp size={18} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">NexVault</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {["How It Works", "Benefits", "Platforms", "FAQ"].map((item) => (
              
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="text-white/50 hover:text-white text-sm transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-white/60 hover:text-white text-sm font-medium transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-600/25"
            >
              Start Investing <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60"
          >
            {mobileMenu ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenu && (
          <div className="md:hidden bg-[#0f0f1a] border-t border-white/8 px-4 py-6 space-y-4">
            {["How It Works", "Benefits", "Platforms", "FAQ"].map((item) => (
              
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                onClick={() => setMobileMenu(false)}
                className="block text-white/60 hover:text-white text-sm py-2 transition-colors"
              >
                {item}
              </a>
            ))}
            <div className="flex flex-col gap-3 pt-2">
              <Link href="/login" className="text-center py-3 rounded-xl border border-white/10 text-white/60 text-sm font-medium">
                Sign In
              </Link>
              <Link href="/register" className="text-center py-3 rounded-xl bg-violet-600 text-white text-sm font-semibold">
                Start Investing
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-900/10 rounded-full blur-3xl pointer-events-none" />

        {/* Floating badges */}
        <FloatingBadge icon={Package}   text="Amazon Surplus Stock"  color="bg-amber-950/80 border-amber-500/30 text-amber-300"   delay="0.5s"  position="top-32 left-8 lg:left-24" />
        <FloatingBadge icon={Store}     text="Local Store Ready"     color="bg-emerald-950/80 border-emerald-500/30 text-emerald-300" delay="0.8s" position="top-48 right-8 lg:right-24" />
        <FloatingBadge icon={TrendingUp} text="+8% Daily Commission" color="bg-violet-950/80 border-violet-500/30 text-violet-300"  delay="1.1s" position="bottom-48 left-8 lg:left-32" />
        <FloatingBadge icon={Shield}    text="Verified Deposits"     color="bg-blue-950/80 border-blue-500/30 text-blue-300"       delay="1.4s" position="bottom-40 right-8 lg:right-28" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium mb-8 animate-fade-in-up">
            <Star size={12} className="fill-violet-400 text-violet-400" />
            Where Global Stock Meets Local Opportunity
            <Star size={12} className="fill-violet-400 text-violet-400" />
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            Invest in{" "}
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Surplus Stock
            </span>
            <br />
            Earn Real Returns
          </h1>

          {/* Subheadline */}
          <p className="text-white/50 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed mb-10 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            NexVault connects investors with discounted surplus inventory from
            <span className="text-amber-400 font-medium"> Amazon</span>,
            <span className="text-orange-400 font-medium"> Alibaba</span>, and
            <span className="text-red-400 font-medium"> AliExpress</span> —
            reselling it to local stores for consistent commission returns.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <Link
              href="/register"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all shadow-2xl shadow-violet-600/30 hover:shadow-violet-600/50 hover:-translate-y-0.5"
            >
              Start Investing Free <ArrowRight size={18} />
            </Link>
            
              href="#how-it-works"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 text-white font-semibold transition-all"
            >
              How It Works <ChevronDown size={18} />
            </a>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-3 gap-4 max-w-2xl mx-auto animate-fade-in-up"
            style={{ animationDelay: "400ms" }}
          >
            {[
              { value: 500,  suffix: "+", label: "Active Investors" },
              { value: 8,    suffix: "%", label: "Avg Daily Return",  prefix: "Up to " },
              { value: 24,   suffix: "x", label: "Daily Subscriptions" },
            ].map((stat, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/8 rounded-2xl p-4 lg:p-6">
                <p className="text-2xl lg:text-4xl font-bold text-white mb-1">
                  {stat.prefix && <span className="text-sm lg:text-base text-white/40 font-normal">{stat.prefix}</span>}
                  <Counter end={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-white/40 text-xs lg:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-white/20 text-xs">Scroll to explore</span>
          <ChevronDown size={16} className="text-white/20" />
        </div>
      </section>

      {/* ── Platform logos ──────────────────────────────────────────────── */}
      <section id="platforms" className="py-16 px-4 border-y border-white/[0.05]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white/30 text-sm font-medium uppercase tracking-widest mb-8">
            Sourcing from the world's largest marketplaces
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {platforms.map((p) => (
              <div
                key={p.name}
                className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl border ${p.bg} transition-all hover:scale-105`}
              >
                <Globe size={16} className={p.color} />
                <span className={`font-bold text-base ${p.color}`}>{p.name}</span>
              </div>
            ))}
            <div className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl border bg-white/5 border-white/10">
              <span className="text-white/40 text-sm">+ More platforms</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-violet-400 text-xs font-medium uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-4">
              How NexVault Works
            </h2>
            <p className="text-white/40 text-lg max-w-2xl mx-auto">
              A transparent 4-step model that creates value for investors, local retailers, and global brands simultaneously.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`relative bg-gradient-to-br ${step.color} border rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300`}
              >
                {/* Step number */}
                <span className="absolute top-4 right-4 text-white/10 text-5xl font-black">{step.num}</span>

                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} border flex items-center justify-center mb-5`}>
                  <step.icon size={22} className={step.icolor} />
                </div>

                <h3 className="text-white font-bold text-lg mb-3 leading-tight">{step.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>

                {/* Connector arrow */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[#0f0f1a] border border-white/10 items-center justify-center">
                    <ArrowRight size={14} className="text-white/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ────────────────────────────────────────────────────── */}
      <section id="benefits" className="py-24 px-4 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-violet-400 text-xs font-medium uppercase tracking-widest mb-3">Why Choose Us</p>
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-4">
              Built for Investors
            </h2>
            <p className="text-white/40 text-lg max-w-2xl mx-auto">
              Everything you need to invest confidently, track your returns, and grow your portfolio.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((b, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br ${b.color} border rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 group`}
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${b.color} border flex items-center justify-center mb-4`}>
                  <b.icon size={20} className={b.ic} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{b.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How earnings work ───────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-violet-900/30 via-indigo-900/20 to-[#0f0f1a] border border-violet-500/20 rounded-3xl p-8 lg:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-violet-400 text-xs font-medium uppercase tracking-widest mb-3">Earnings Example</p>
                <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                  See Your Money Work
                </h2>
                <p className="text-white/50 leading-relaxed mb-6">
                  Subscribe to an investment service once and receive your capital back plus commission — instantly. Repeat up to 24 times daily for compounding returns.
                </p>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all shadow-lg shadow-violet-600/25"
                >
                  Start Earning <ArrowUpRight size={16} />
                </Link>
              </div>

              {/* Example calculation */}
              <div className="bg-black/30 border border-white/8 rounded-2xl p-6 space-y-4">
                <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Example Calculation</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-white/50 text-sm">Service Price</span>
                    <span className="text-white font-semibold">$100.00</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-white/50 text-sm">Commission Rate</span>
                    <span className="text-emerald-400 font-semibold">8%</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-white/50 text-sm">You Receive</span>
                    <span className="text-violet-400 font-bold text-lg">$108.00</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-white/50 text-sm">Per day (×24)</span>
                    <span className="text-emerald-400 font-bold text-lg">+$192.00</span>
                  </div>
                  <div className="flex justify-between items-center py-2 bg-violet-500/10 rounded-xl px-3">
                    <span className="text-white/70 text-sm font-medium">Daily Net Profit</span>
                    <span className="text-violet-400 font-black text-xl">$192</span>
                  </div>
                </div>
                <p className="text-white/20 text-xs text-center">*Based on $100 service with 8% commission × 24 subscriptions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Who benefits ────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-violet-400 text-xs font-medium uppercase tracking-widest mb-3">Ecosystem</p>
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-4">
              Everyone Wins
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              Our circular economy model creates real value for every participant in the chain.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon:  Package,
                color: "from-amber-500/15 to-amber-600/5 border-amber-500/20",
                ic:    "text-amber-400",
                tag:   "bg-amber-500/10 border-amber-500/20 text-amber-400",
                label: "Global Brands",
                title: "Clear Surplus Inventory",
                points: [
                  "Sell slow-moving or replaced stock",
                  "Recover capital from dead inventory",
                  "Maintain brand value — no public discounting",
                ],
              },
              {
                icon:  Users,
                color: "from-violet-500/15 to-violet-600/5 border-violet-500/20",
                ic:    "text-violet-400",
                tag:   "bg-violet-500/10 border-violet-500/20 text-violet-400",
                label: "Investors",
                title: "Earn Commission Returns",
                points: [
                  "Fund stock purchases through subscriptions",
                  "Earn fixed percentage returns daily",
                  "Up to 24x returns per day",
                ],
              },
              {
                icon:  Store,
                color: "from-emerald-500/15 to-emerald-600/5 border-emerald-500/20",
                ic:    "text-emerald-400",
                tag:   "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
                label: "Local Retailers",
                title: "Get Affordable Inventory",
                points: [
                  "Buy quality products below market price",
                  "Stock up without heavy capital requirements",
                  "Compete with larger retailers",
                ],
              },
            ].map((card, i) => (
              <div key={i} className={`bg-gradient-to-br ${card.color} border rounded-2xl p-7`}>
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} border flex items-center justify-center`}>
                    <card.icon size={18} className={card.ic} />
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${card.tag}`}>
                    {card.label}
                  </span>
                </div>
                <h3 className="text-white font-bold text-xl mb-4">{card.title}</h3>
                <ul className="space-y-3">
                  {card.points.map((p, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-white/50 text-sm">
                      <CheckCircle size={15} className={`${card.ic} flex-shrink-0 mt-0.5`} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-violet-400 text-xs font-medium uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-4">
              Common Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative bg-gradient-to-br from-violet-900/40 via-indigo-900/20 to-[#0f0f1a] border border-violet-500/20 rounded-3xl px-8 py-16 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium mb-6">
                <Zap size={12} className="fill-violet-400" />
                Free to join. No hidden fees.
              </div>
              <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-4">
                Ready to Start Earning?
              </h2>
              <p className="text-white/40 text-lg mb-8 max-w-xl mx-auto">
                Join hundreds of investors already earning daily commission returns through NexVault's global stock investment platform.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all shadow-2xl shadow-violet-600/30 hover:-translate-y-0.5"
                >
                  Create Free Account <ArrowRight size={18} />
                </Link>
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 text-white font-semibold transition-all"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.05] py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <TrendingUp size={15} className="text-white" />
            </div>
            <span className="text-white font-bold">NexVault</span>
          </div>
          <p className="text-white/25 text-sm text-center">
            © {new Date().getFullYear()} NexVault. All rights reserved. Investment involves risk.
          </p>
          <div className="flex items-center gap-6 text-white/30 text-sm">
            <Link href="/login"    className="hover:text-white transition-colors">Login</Link>
            <Link href="/register" className="hover:text-white transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── FAQ Accordion ─────────────────────────────────────────────────────────
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
      open ? "border-violet-500/30 bg-violet-500/5" : "border-white/8 bg-white/[0.02]"
    }`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
      >
        <span className={`font-semibold text-sm lg:text-base transition-colors ${open ? "text-white" : "text-white/70"}`}>
          {q}
        </span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 transition-all duration-300 ${open ? "rotate-180 text-violet-400" : "text-white/30"}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5">
          <p className="text-white/50 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}