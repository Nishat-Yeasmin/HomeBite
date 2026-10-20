"use client";

import Link from "next/link";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiLinkedin,
  FiMail,
  FiPhone,
  FiMapPin,
  FiArrowRight,
  FiHeart,
} from "react-icons/fi";

export default function Footer() {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Offers", href: "/offers" },
    { name: "Reviews", href: "/reviews" },
  ];

  const categories = [
    { name: "Cake & Bakery", href: "/menu?category=cake-bakery" },
    { name: "Pitha", href: "/menu?category=pitha" },
    { name: "Biriyani & Rice", href: "/menu?category=biriyani-rice" },
    { name: "Fast Food", href: "/menu?category=fast-food" },
    { name: "Snacks", href: "/menu?category=snacks" },
    { name: "Desserts", href: "/menu?category=desserts" },
    { name: "Homemade Drinks", href: "/menu?category=drinks" },
    { name: "Pickles & Chutney", href: "/menu?category=pickles" },
  ];

  const supportLinks = [
    { name: "Help Center", href: "/help" },
    { name: "FAQs", href: "/faq" },
    { name: "Order Tracking", href: "/orders" },
    { name: "Delivery Information", href: "/delivery" },
    { name: "Return & Refund", href: "/refund" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#3B211C] text-[#FFF8F3] rounded-xl">



      {/* Decorative Background */}
      <div className="pointer-events-none absolute -left-24 top-20 h-52 w-52 rounded-full bg-[#CF9D8F]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-64 w-64 rounded-full bg-[#E7B8A8]/10 blur-3xl" />

      {/* ================= NEWSLETTER ================= */}
      <div className="relative mx-auto max-w-7xl px-6 pt-16 sm:px-10 lg:px-16 xl:px-20">
        <div className="relative overflow-hidden rounded-3xl border border-[#CF9D8F]/20 bg-[#52312A] px-6 py-10 sm:px-10 lg:px-12">
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full border border-[#E7B8A8]/10" />
          <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full border border-[#E7B8A8]/10" />

          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            {/* Newsletter Text */}
            <div className="max-w-xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#CF9D8F]/30 bg-[#3B211C]/40 px-4 py-1.5 text-xs font-medium tracking-wide text-[#E7B8A8]">
                <FiMail className="text-sm" />
                Stay Connected
              </div>

              <h2 className="text-2xl font-semibold tracking-tight text-[#FFF8F3] sm:text-3xl">
                Fresh bites, straight to your inbox.
              </h2>

              <p className="mt-3 max-w-lg text-sm leading-6 text-[#D9C5BC] sm:text-base">
                Get updates about new dishes, special offers, homemade
                favorites, and exclusive deals from HomeBite.
              </p>
            </div>

            {/* Newsletter Form */}
            <form
              className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="relative flex-1">
                <FiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#CF9D8F]" />

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="h-12 w-full rounded-xl border border-[#CF9D8F]/20 bg-[#3B211C] pl-11 pr-4 text-sm text-[#FFF8F3] outline-none placeholder:text-[#B99E95] focus:border-[#CF9D8F] focus:ring-2 focus:ring-[#CF9D8F]/20"
                />
              </div>

              <button
                type="submit"
                className="group flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#E7B8A8] px-6 text-sm font-semibold text-[#3B211C] transition-all duration-300 hover:bg-[#F0C9BC] hover:shadow-lg hover:shadow-[#E7B8A8]/10"
              >
                Subscribe
                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ================= MAIN FOOTER ================= */}
      <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-16 sm:px-10 lg:px-16 xl:px-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* ================= BRAND ================= */}
          <div className="lg:col-span-4">
            <Link href="/" className="group inline-flex items-center gap-3">
              {/* Logo Icon */}
              {/* <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E7B8A8] text-[#3B211C] shadow-lg shadow-black/10 transition-transform duration-300 group-hover:rotate-3 rounded-2xl"> */}
                <div className="w-10 h-10 shrink-0 overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-105">
    <img
      src="/images/logo.png"
      alt="HomeBite Logo"
      className="w-full h-full object-cover"
    />
  
              </div>

              {/* Logo Text */}
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[#FFF8F3]">
                  Home<span className="text-[#E7B8A8]">Bite</span>
                </h2>
                <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#B99E95]">
                  Homemade Goodness
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-[#D9C5BC]">
              Bringing the warmth of homemade food to your doorstep. Discover
              delicious dishes prepared with care, passion, and a little
              extra love.
            </p>

            {/* Contact */}
            <div className="mt-7 space-y-3">
              <a
                href="mailto:hello@homebite.com"
                className="group flex items-center gap-3 text-sm text-[#D9C5BC] transition-colors hover:text-[#E7B8A8]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#52312A] text-[#CF9D8F] transition-colors group-hover:bg-[#CF9D8F]/20">
                  <FiMail />
                </span>
                homebite@gmail.com
              </a>

              <a
                href="tel:+8801700000000"
                className="group flex items-center gap-3 text-sm text-[#D9C5BC] transition-colors hover:text-[#E7B8A8]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#52312A] text-[#CF9D8F] transition-colors group-hover:bg-[#CF9D8F]/20">
                  <FiPhone />
                </span>
                +880 1700-000000
              </a>

              <div className="flex items-center gap-3 text-sm text-[#D9C5BC]">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#52312A] text-[#CF9D8F]">
                  <FiMapPin />
                </span>
                Sylhet, Bangladesh
              </div>
            </div>

            {/* Social Icons */}
            <div className="mt-7 flex items-center gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[#CF9D8F]/20 bg-[#52312A] text-[#D9C5BC] transition-all duration-300 hover:-translate-y-1 hover:border-[#E7B8A8] hover:bg-[#E7B8A8] hover:text-[#3B211C]"
              >
                <FiFacebook />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[#CF9D8F]/20 bg-[#52312A] text-[#D9C5BC] transition-all duration-300 hover:-translate-y-1 hover:border-[#E7B8A8] hover:bg-[#E7B8A8] hover:text-[#3B211C]"
              >
                <FiInstagram />
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[#CF9D8F]/20 bg-[#52312A] text-[#D9C5BC] transition-all duration-300 hover:-translate-y-1 hover:border-[#E7B8A8] hover:bg-[#E7B8A8] hover:text-[#3B211C]"
              >
                <FiTwitter />
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[#CF9D8F]/20 bg-[#52312A] text-[#D9C5BC] transition-all duration-300 hover:-translate-y-1 hover:border-[#E7B8A8] hover:bg-[#E7B8A8] hover:text-[#3B211C]"
              >
                <FiLinkedin />
              </a>
            </div>
          </div>

          {/* ================= QUICK LINKS ================= */}
          <div className="lg:col-span-2">
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-[0.15em] text-[#FFF8F3]">
              Quick Links
            </h3>

            <ul className="space-y-3.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-[#D9C5BC] transition-colors hover:text-[#E7B8A8]"
                  >
                    <span className="h-px w-0 bg-[#E7B8A8] transition-all duration-300 group-hover:w-3" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ================= CATEGORIES ================= */}
          <div className="lg:col-span-3">
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-[0.15em] text-[#FFF8F3]">
              Categories
            </h3>

            <ul className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-1">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="group inline-flex items-center gap-2 text-sm text-[#D9C5BC] transition-colors hover:text-[#E7B8A8]"
                  >
                    <span className="h-px w-0 bg-[#E7B8A8] transition-all duration-300 group-hover:w-3" />
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ================= SUPPORT ================= */}
          <div className="lg:col-span-3">
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-[0.15em] text-[#FFF8F3]">
              Customer Support
            </h3>

            <ul className="space-y-3.5">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-[#D9C5BC] transition-colors hover:text-[#E7B8A8]"
                  >
                    <span className="h-px w-0 bg-[#E7B8A8] transition-all duration-300 group-hover:w-3" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Small CTA */}
            <div className="mt-7 rounded-2xl border border-[#CF9D8F]/15 bg-[#52312A] p-4">
              <p className="text-xs leading-5 text-[#B99E95]">
                Need help with your order?
              </p>

              <Link
                href="/contact"
                className="mt-2 inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-[#E7B8A8] transition-colors hover:text-[#FFF8F3]"
              >
                Talk to us
                <FiArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="relative border-t border-[#CF9D8F]/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-center sm:px-10 md:flex-row md:text-left lg:px-16 xl:px-20">
          {/* Copyright */}
          <p className="text-xs text-[#B99E95] sm:text-sm">
            © 2026 HomeBite. All rights reserved.
          </p>

          {/* Made With Love */}
          <p className="flex items-center gap-1.5 text-xs text-[#B99E95] sm:text-sm">
            Made with
            <FiHeart className="fill-[#E7B8A8] text-[#E7B8A8]" />
            for food lovers
          </p>

          {/* Legal */}
          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="text-xs text-[#B99E95] transition-colors hover:text-[#E7B8A8] sm:text-sm"
            >
              Privacy Policy
            </Link>

            <span className="h-3 w-px bg-[#CF9D8F]/20" />

            <Link
              href="/terms"
              className="text-xs text-[#B99E95] transition-colors hover:text-[#E7B8A8] sm:text-sm"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}