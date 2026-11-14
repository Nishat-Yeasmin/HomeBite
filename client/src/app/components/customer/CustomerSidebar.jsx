
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiShoppingBag,
  FiHeart,
  FiUser,
  FiSettings,
  FiLogOut,
  FiX,
  FiMessageSquare,
  FiMapPin,
  FiHelpCircle,
  FiChevronRight,
} from "react-icons/fi";

export default function CustomerSidebar({ isOpen, onClose, user }) {
  const pathname = usePathname();

  const sections = [
    {
      title: "MY ACCOUNT",
      links: [
        { label: "Overview", href: "/dashboard", icon: FiHome },
        { label: "My Orders", href: "/dashboard/orders", icon: FiShoppingBag },
        { label: "Wishlist", href: "/dashboard/wishlist", icon: FiHeart },
      ],
    },
    {
      title: "PERSONAL",
      links: [
        { label: "My Profile", href: "/dashboard/profile", icon: FiUser },
        { label: "Saved Addresses", href: "/dashboard/addresses", icon: FiMapPin },
        { label: "My Reviews", href: "/dashboard/reviews", icon: FiMessageSquare },
        { label: "Settings", href: "/dashboard/settings", icon: FiSettings },
      ],
    },
  ];

  const firstLetter = (user?.name || user?.email || "U")
    .charAt(0)
    .toUpperCase();

  function handleLogout() {
    localStorage.removeItem("homebite-token");
    localStorage.removeItem("homebite-user");

    window.dispatchEvent(new Event("homebite-auth-changed"));
    window.location.href = "/login";
  }

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 top-[88px] z-[55] bg-black/55 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        className={`fixed bottom-0 left-0 top-[88px] z-[60] flex w-[280px]
        flex-col overflow-hidden border-r border-[#59382b] bg-[#24110c]
        text-[#f9eee6] shadow-2xl transition-transform duration-300
        lg:translate-x-0 lg:shadow-none
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Sidebar heading */}
        <div className="shrink-0 border-b border-white/10 px-5 pb-5 pt-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="font-serif text-xl font-bold tracking-wide">
                Home<span className="text-[#c49b62]">Bite</span>
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[2px] text-[#b99b88]">
                Customer Space
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-[#e8cfaa] transition hover:bg-white/10 lg:hidden"
              aria-label="Close sidebar"
            >
              <FiX size={18} />
            </button>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-[#c49b62]/20 bg-[#382017] p-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#c49b62]/50 bg-[#c49b62] font-serif text-lg font-bold text-[#24110c]">
              {firstLetter}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {user?.name || "HomeBite Customer"}
              </p>
              <p className="truncate text-[11px] text-[#c5a994]">
                {user?.email || "Welcome to HomeBite"}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable navigation */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 [scrollbar-color:#8a6748_#24110c] [scrollbar-width:thin]">
          {sections.map((section) => (
            <div key={section.title} className="mb-7">
              <p className="mb-3 px-3 text-[10px] font-bold tracking-[2px] text-[#a78b76]">
                {section.title}
              </p>

              <nav className="space-y-1.5">
                {section.links.map((link) => {
                  const Icon = link.icon;

                  const active =
                    link.href === "/dashboard"
                      ? pathname === link.href
                      : pathname === link.href ||
                        pathname.startsWith(link.href + "/");

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={onClose}
                      className={`group flex items-center justify-between rounded-xl px-3.5 py-3 text-[13px] font-medium transition-all duration-200 ${
                        active
                          ? "border border-[#c49b62]/30 bg-[#c49b62] text-[#24110c] shadow-md"
                          : "text-[#d7c5b8] hover:bg-white/8 hover:text-white"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon size={17} />
                        {link.label}
                      </span>

                      <FiChevronRight
                        size={14}
                        className={`transition-transform group-hover:translate-x-0.5 ${
                          active ? "opacity-100" : "opacity-40"
                        }`}
                      />
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}

          <Link
            href="/menu"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl border border-[#c49b62]/30 bg-[#382017] px-4 py-3 text-sm font-semibold text-[#e8cfaa] transition hover:bg-[#4a2b1e]"
          >
            <FiShoppingBag size={17} />
            Browse Menu
          </Link>
        </div>

        {/* Fixed bottom section */}
        <div className="shrink-0 border-t border-white/10 bg-[#1d0d09] p-4">
          <Link
            href="/contact"
            onClick={onClose}
            className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-[#cbb6a7] transition hover:bg-white/5 hover:text-white"
          >
            <FiHelpCircle size={16} />
            Need Help?
          </Link>

          <button
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#e8a69a] transition hover:bg-[#51251e]"
          >
            <FiLogOut size={17} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
