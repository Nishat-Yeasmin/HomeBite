"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiCoffee,
  FiGrid,
  FiHome,
  FiPackage,
  FiShoppingCart,
  FiUsers,
  FiCreditCard,
  FiStar,
  FiTag,
  FiTrendingUp,
  FiSettings,
  FiGlobe,
  FiLogOut,
  FiX,
  FiChevronRight,
} from "react-icons/fi";

const mainLinks = [
  { label: "Dashboard", href: "/admin", icon: FiHome },
  { label: "Foods", href: "/admin/foods", icon: FiCoffee },
  { label: "Categories", href: "/admin/categories", icon: FiPackage },
  { label: "Orders", href: "/admin/orders", icon: FiShoppingCart, badge: "New" },
];

const managementLinks = [
  { label: "Customers", href: "/admin/customers", icon: FiUsers },
  { label: "Payments", href: "/admin/payments", icon: FiCreditCard },
  { label: "Reviews", href: "/admin/reviews", icon: FiStar },
  { label: "Coupons", href: "/admin/coupons", icon: FiTag },
  { label: "Reports", href: "/admin/reports", icon: FiTrendingUp },
];

function SidebarLink({ item, pathname, onNavigate }) {
  const Icon = item.icon;
  const active =
    item.href === "/admin"
      ? pathname === "/admin"
      : pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`group flex min-h-11 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
        active
          ? "bg-gradient-to-r from-[#B77B45] to-[#8F4B27] text-white shadow-md shadow-black/10"
          : "text-[#E9D5C4] hover:bg-white/10 hover:text-white"
      }`}
    >
      <Icon className={`h-5 w-5 shrink-0 ${active ? "text-[#FFF2D8]" : "text-[#D8A66A]"}`} />
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <span className="rounded-full bg-[#C98643] px-2.5 py-0.5 text-[10px] font-bold text-white">
          {item.badge}
        </span>
      )}
      {active && <FiChevronRight className="h-4 w-4 opacity-80" />}
    </Link>
  );
}

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/55 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col border-r border-[#6A3825] bg-gradient-to-b from-[#35170D] via-[#2A1009] to-[#1F0B06] text-white shadow-2xl transition-transform duration-300 lg:sticky lg:top-0 lg:z-30 lg:h-screen lg:translate-x-0 lg:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand stays fixed while the menu scrolls */}
        <div className="flex h-[86px] shrink-0 items-center gap-3 border-b border-white/10 px-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#C18A52]/70 bg-[#4A2618] text-[#E9B96F] shadow-inner">
            <FiCoffee className="h-7 w-7" />
          </div>
          <div>
            <p className="font-serif text-[25px] font-bold leading-tight tracking-tight">HomeBite</p>
            <p className="mt-1 text-[10px] font-semibold tracking-[0.28em] text-[#D6B69D]">ADMIN PANEL</p>
          </div>
          <button onClick={onClose} className="ml-auto rounded-lg p-2 text-white/70 hover:bg-white/10 lg:hidden" aria-label="Close sidebar">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* This section alone scrolls */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-5 [scrollbar-color:#9A7967_#2A1009] [scrollbar-width:thin]">
          <div className="flex items-center gap-3 px-3 py-5">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#C38B54] bg-[#4A2618] font-serif text-xl font-bold">
              A
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#2A1009] bg-emerald-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold">Admin</p>
              <p className="mt-0.5 text-xs text-[#D5B9A7]">Super Admin</p>
              <p className="mt-1 flex items-center gap-2 text-[11px] text-[#CDB5A4]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online
              </p>
            </div>
          </div>

          <nav className="space-y-2">
            {mainLinks.map((item) => (
              <SidebarLink key={item.href} item={item} pathname={pathname} onNavigate={onClose} />
            ))}
          </nav>

          <div className="mx-3 my-5 border-t border-white/10" />
          <p className="px-4 pb-3 text-[10px] font-bold tracking-[0.2em] text-[#B99B86]">MANAGEMENT</p>
          <nav className="space-y-2">
            {managementLinks.map((item) => (
              <SidebarLink key={item.href} item={item} pathname={pathname} onNavigate={onClose} />
            ))}
          </nav>

          <div className="mx-3 my-5 border-t border-white/10" />
          <p className="px-4 pb-3 text-[10px] font-bold tracking-[0.2em] text-[#B99B86]">SETTINGS</p>
          <nav className="space-y-2">
            <SidebarLink
              item={{ label: "Settings", href: "/admin/settings", icon: FiSettings }}
              pathname={pathname}
              onNavigate={onClose}
            />
          </nav>

          <div className="mx-3 my-5 border-t border-white/10" />
          <p className="px-4 pb-3 text-[10px] font-bold tracking-[0.2em] text-[#B99B86]">QUICK LINKS</p>
          <nav className="space-y-2">
            <a
              href="/"
              onClick={onClose}
              className="flex min-h-11 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#E9D5C4] transition hover:bg-white/10 hover:text-white"
            >
              <FiGlobe className="h-5 w-5 text-[#D8A66A]" />
              Visit Website
            </a>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (typeof window !== "undefined") window.location.href = "/";
              }}
              className="flex min-h-11 w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#E9D5C4] transition hover:bg-white/10 hover:text-white"
            >
              <FiLogOut className="h-5 w-5 text-[#D8A66A]" />
              Back to Store
            </button>
          </nav>
        </div>

        <div className="shrink-0 border-t border-white/10 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center text-[#E3B875]">
              <FiCoffee className="h-8 w-8" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#F1D2A4]">Made with care</p>
              <p className="mt-1 text-[10px] text-[#C6A996]">Homemade goodness</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
