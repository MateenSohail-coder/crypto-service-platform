"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  ArrowDownCircle,
  Receipt,
  BookOpen,
  User,
} from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/services", label: "Services", icon: Layers },
  { href: "/dashboard/deposit", label: "Deposit", icon: ArrowDownCircle },
  { href: "/dashboard/transactions", label: "History", icon: Receipt },
  { href: "/dashboard/articles", label: "Articles", icon: BookOpen },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Hide on admin pages
  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/5">
      <div className="flex items-center justify-around px-2 py-2 safe-area-pb">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/dashboard"
              ? pathname === href
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[52px]"
            >
              <div
                className={`p-1.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-violet-600/25 text-violet-400"
                    : "text-white/35 hover:text-white/60"
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? "text-violet-400" : "text-white/30"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
