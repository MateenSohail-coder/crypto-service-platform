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
  ShieldCheck,
  Users,
  Activity,
} from "lucide-react";

const userLinks = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/services", label: "Services", icon: Layers },
  { href: "/dashboard/deposit", label: "Deposit", icon: ArrowDownCircle },
  { href: "/dashboard/transactions", label: "History", icon: Receipt },
  { href: "/dashboard/articles", label: "Articles", icon: BookOpen },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

const adminLinks = [
  { href: "/admin", label: "Overview", icon: ShieldCheck },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/deposits", label: "Deposits", icon: ArrowDownCircle },
  { href: "/admin/subscriptions", label: "Subs", icon: Activity },
  { href: "/admin/services", label: "Services", icon: Layers },
  { href: "/admin/articles", label: "Articles", icon: BookOpen },
];

export default function BottomNav() {
  const pathname = usePathname();

  if (
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password"
  )
    return null;

  const isAdmin = pathname.startsWith("/admin");
  const links = isAdmin ? adminLinks : userLinks;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      style={{
        background: isAdmin
          ? "linear-gradient(180deg, rgba(10,8,2,0) 0%, rgba(10,8,2,0.97) 18%)"
          : "linear-gradient(180deg, rgba(4,4,12,0) 0%, rgba(4,4,12,0.97) 18%)",
        paddingTop: "20px",
      }}
    >
      {/* Glass bar */}
      <div
        style={{
          margin: "0 10px 10px",
          borderRadius: "20px",
          border: isAdmin
            ? "1px solid rgba(251,191,36,0.12)"
            : "1px solid rgba(139,92,246,0.12)",
          background: isAdmin ? "rgba(18,14,4,0.92)" : "rgba(10,10,20,0.92)",
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          padding: "6px 4px 8px",
          boxShadow: isAdmin
            ? "0 -1px 0 rgba(251,191,36,0.08), inset 0 1px 0 rgba(251,191,36,0.06), 0 8px 32px rgba(0,0,0,0.5)"
            : "0 -1px 0 rgba(139,92,246,0.08), inset 0 1px 0 rgba(139,92,246,0.06), 0 8px 32px rgba(0,0,0,0.5)",
        }}
      >
        {/* Shimmer line on top of bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "20%",
            right: "20%",
            height: "1px",
            borderRadius: "999px",
            background: isAdmin
              ? "linear-gradient(90deg, transparent, rgba(251,191,36,0.5), transparent)"
              : "linear-gradient(90deg, transparent, rgba(167,139,250,0.5), transparent)",
          }}
        />

        <div className="flex items-stretch justify-around">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/dashboard" || href === "/admin"
                ? pathname === href
                : pathname.startsWith(href);

            const accentColor = isAdmin ? "#fbbf24" : "#a78bfa";
            const accentColor2 = isAdmin ? "#f59e0b" : "#818cf8";
            const activeBg = isAdmin
              ? "rgba(251,191,36,0.1)"
              : "rgba(167,139,250,0.1)";
            const activeRing = isAdmin
              ? "rgba(251,191,36,0.2)"
              : "rgba(167,139,250,0.2)";

            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  flex: 1,
                  padding: "6px 2px",
                  borderRadius: "14px",
                  position: "relative",
                  transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  background: isActive ? activeBg : "transparent",
                  boxShadow: isActive ? `0 0 0 1px ${activeRing}` : "none",
                  transform: isActive ? "translateY(-1px)" : "translateY(0)",
                }}
              >
                {/* Glow behind icon when active */}
                {isActive && (
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -60%)",
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: isAdmin
                        ? "radial-gradient(circle, rgba(251,191,36,0.25) 0%, transparent 70%)"
                        : "radial-gradient(circle, rgba(167,139,250,0.25) 0%, transparent 70%)",
                      pointerEvents: "none",
                    }}
                  />
                )}

                {/* Icon */}
                <div
                  style={{
                    position: "relative",
                    zIndex: 1,
                    transition:
                      "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    transform: isActive ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  <Icon
                    size={isActive ? 18 : 17}
                    strokeWidth={isActive ? 2.2 : 1.6}
                    style={{
                      color: isActive ? accentColor : "rgba(255,255,255,0.28)",
                      transition: "all 0.2s ease",
                      filter: isActive
                        ? `drop-shadow(0 0 6px ${accentColor}88)`
                        : "none",
                    }}
                  />
                </div>

                {/* Label */}
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: isActive ? 700 : 500,
                    letterSpacing: isActive ? "0.06em" : "0.04em",
                    textTransform: "uppercase",
                    color: isActive ? accentColor : "rgba(255,255,255,0.22)",
                    transition: "all 0.2s ease",
                    lineHeight: 1,
                  }}
                >
                  {label}
                </span>

                {/* Active indicator dot */}
                {isActive && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "2px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "16px",
                      height: "2px",
                      borderRadius: "999px",
                      background: `linear-gradient(90deg, ${accentColor}, ${accentColor2})`,
                      boxShadow: `0 0 6px ${accentColor}99`,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
