"use client";

import { useState, useEffect } from "react";;
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiMenu,
  FiX,
  FiShoppingCart,
  FiUser,
  FiSun,
  FiMoon,
  FiLogOut,
  FiSettings,
  
} from "react-icons/fi";
import { getCartCount } from "../../lib/cart"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
const [cartCount, setCartCount] = useState(0);

  const pathname = usePathname();

  // ===== CART COUNT =====
useEffect(() => {
  const updateCartCount = () => {
    setCartCount(getCartCount());
  };

  updateCartCount();

  window.addEventListener("homebite-cart-updated", updateCartCount);

  return () => {
    window.removeEventListener(
      "homebite-cart-updated",
      updateCartCount
    );
  };
}, []);

  // ===== COLORS =====
  const chocolate = "#2c0e05";
  const chocolateLight = "#f3a789";
  const gradient = "linear-gradient(90deg, #cf9d8f, #dfb79d)";

  // ===== SCROLL EFFECT =====
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ===== DARK MODE =====
 useEffect(() => {
  const savedTheme = localStorage.getItem("homebite-theme");

  if (savedTheme === "dark") {
    setIsDark(true);
    document.documentElement.classList.add("dark");
  }
}, []);

useEffect(() => {
  if (isDark) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("homebite-theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("homebite-theme", "light");
  }
}, [isDark]);

  // ===== CLOSE MENUS ON ROUTE CHANGE =====
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu"},
    { name: "Offers", href: "/offers" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  return (
    <>
      {/* =====================================================
          NAVBAR
      ====================================================== */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
        <nav
          className={`w-full max-w-8xl rounded-full transition-all duration-500 ease-out ${
            isScrolled
              ? "bg-white/85 dark:bg-gray-900/85 backdrop-blur-xl shadow-lg shadow-black/5 border border-white/50 dark:border-gray-700/50"
              : "bg-white/65 dark:bg-gray-900/65 backdrop-blur-lg border border-white/40 dark:border-gray-700/40"
          }`}
        >
          <div className="flex items-center justify-between h-14 px-4 sm:px-6">

            {/* =================================================
                LOGO
            ================================================== */}
           <Link
  href="/"
  className="flex items-center gap-3 shrink-0 group"
>
  {/* Logo */}
  <div className="w-10 h-10 shrink-0 overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-105">
    <img
      src="/images/logo.png"
      alt="HomeBite Logo"
      className="w-full h-full object-cover"
    />
  </div>

  {/* Brand Name + Tagline */}
  <div className="flex flex-col justify-center leading-none">
    <span
      className="text-[22px] font-bold tracking-[-0.02em] transition-colors duration-300"
      style={{
        color: isDark ? "#ffffff" : "#3B241C",
      }}
    >
      HomeBite
    </span>

    <span
      className="mt-1 text-[12px] font-medium tracking-[0.02em] opacity-65"
      style={{
        color: isDark ? "#ffffff" : "#6B4A40",
      }}
    >
      Made with a Homemade Heart
    </span>
  </div>
</Link>

            {/* =================================================
                DESKTOP NAV LINKS
            ================================================== */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="group relative px-4 py-2 text-[20px] font-medium tracking-[-0.01em] rounded-full transition-all duration-300"
                    style={{
                      color: isActive
                        ? chocolate
                        : isDark
                        ? "#D1D5DB"
                        : "#5F5A57",
                    }}
                  >
                    {/* Link Text */}
   <span className="transition-all duration-300 group-hover:text-[#5A2D1F]">
  {link.name}
</span>

                    {/* Active / Hover Gradient Underline */}
                    <span
                      className={`absolute bottom-1 left-4 right-4 h-[2px] rounded-full origin-center transition-all duration-300 ${
                        isActive
                          ? "opacity-100 scale-x-100"
                          : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                      }`}
                      style={{
                        background: gradient,
                      }}
                    />
                  </Link>
                );
              })}
            </div>

            {/* =================================================
                RIGHT SIDE ACTIONS
            ================================================== */}
            <div className="flex items-center gap-1.5 sm:gap-2">

              {/* DARK MODE */}
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-[#F3E8E3] dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer"
                aria-label="Toggle theme"
              >
                {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>

              {/* CART */}
              <Link
                href="/cart"
                className="relative p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-[#F3E8E3] dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer"
              >
                <FiShoppingCart size={18} />

              {cartCount > 0 && (
  <span
    className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
    style={{
      background: gradient,
    }}
  >
    {cartCount}
  </span>
)}
              </Link>

              {/* =================================================
                  LOGGED IN PROFILE
              ================================================== */}
              {isLoggedIn ? (
                <div className="relative">

                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full hover:bg-orange-200 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer"
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                      style={{
                        background: gradient,
                      }}
                    >
                      N
                    </div>

                    <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Nishat
                    </span>
                  </button>

                  {/* PROFILE DROPDOWN */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">

                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-[#F8EEEA] dark:hover:bg-gray-700/50 hover:text-[#5A2D1F] transition-all cursor-pointer"
                      >
                        <FiUser size={15} />
                        My Profile
                      </Link>

                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-[#F8EEEA] dark:hover:bg-gray-700/50 hover:text-[#5A2D1F] transition-all cursor-pointer"
                      >
                        <FiSettings size={15} />
                        Settings
                      </Link>

                      <button
                        onClick={() => setIsLoggedIn(false)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                      >
                        <FiLogOut size={15} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* =================================================
                    LOGIN + REGISTER
                ================================================== */
                <div className="hidden sm:flex items-center gap-2">

                  {/* LOGIN */}
                  <Link
                    href="/login"
                    className="px-4 py-1.5 text-sm font-medium rounded-full dark:text-gray-300 hover:bg-[#f7d7cc] dark:hover:bg-gray-800 transition-all duration-300 cursor-pointer border "
                    style={{
                      color: chocolate,
                      borderColor: "#d9c6be",

                    }}
                  >
                    <span className="transition-colors duration-300 hover:text-[#7A4433]">
                      Login
                    </span>
                  </Link>

                  {/* REGISTER */}
                  <Link
                    href="/register"
                    className="px-4 py-1.5 text-sm font-semibold text-white rounded-full transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-[1px] cursor-pointer"
                    style={{
                      background: gradient,
                    }}
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* MOBILE MENU BUTTON */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-[#F3E8E3] dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <FiX size={20} />
                ) : (
                  <FiMenu size={20} />
                )}
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* =====================================================
          MOBILE MENU
      ====================================================== */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">

          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm cursor-pointer"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* MENU CARD */}
          <div className="absolute top-20 left-4 right-4 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 ">

            {/* MOBILE LINKS */}
            <div className="px-3 py-4 space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`group relative block px-4 py-3 rounded-xl text-[15px] font-medium tracking-[-0.01em] transition-all duration-300 cursor-pointer  ${
                      isActive
                        ? "bg-[#F8EEEA]"
                        : "text-gray-700 dark:text-gray-300 hover:bg-[#F3E8E3] dark:hover:bg-gray-800"
                    }`}
                    style={{
                      color: isActive ? chocolate : undefined,
                    }}
                  >
<span className="transition-colors duration-300 group-hover:text-[#5A2D1F]">
  {link.name}
</span>

                    {/* MOBILE ACTIVE / HOVER UNDERLINE */}
                    <span
                      className={`absolute bottom-1 left-4 right-4 h-[2px] rounded-full transition-all duration-300 ${
                        isActive
                          ? "opacity-100 scale-x-100"
                          : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                      }`}
                      style={{
                        background: gradient,
                      }}
                    />
                  </Link>
                );
              })}
            </div>

            {/* MOBILE LOGIN / REGISTER */}
            {!isLoggedIn && (
              <div className="px-4 pb-5 pt-3 flex gap-3 border-t border-gray-100 dark:border-gray-700">

                {/* LOGIN */}
                <Link
                  href="/login"
                  className="flex-1 py-2.5 text-center text-sm font-medium rounded-full transition-all duration-300 cursor-pointer hover:bg-[#F3E8E3] dark:hover:bg-gray-800 "
                  style={{
                    color: chocolate,
                    border: "1px solid #D9C6BE",
                  }}
                >
                  Login
                </Link>

                {/* REGISTER */}
                <Link
                  href="/register"
                  className="flex-1 py-2.5 text-center text-sm font-semibold text-white rounded-full transition-all duration-300 cursor-pointer shadow-sm"
                  style={{
                    background: gradient,
                  }}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

    
    </>
  );
}