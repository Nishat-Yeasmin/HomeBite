
"use client";

import Link from "next/link";
import { FiArrowRight, FiShoppingCart } from "react-icons/fi";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center animate-heroZoom"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=2000&q=85')",
        }}
      />

      {/* Soft Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Left-to-Right Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/10" />

      {/* Hero Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-28 pb-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">

          {/* Badge */}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-5 py-2.5 text-sm font-medium text-white shadow-lg backdrop-blur-md">
            <span className="text-[#CF9D8F]">✦</span>
            <span>From Our Kitchen to Your Heart.</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Taste the Comfort of
            <br />

            <span className="font-serif italic font-medium text-[#FFD1C4]">
              Homemade Food.
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-white/90 sm:text-lg sm:leading-8">
            Discover delicious homemade food, lovingly prepared with fresh
            ingredients and delivered straight to your doorstep.
          </p>

          {/* Button Card */}
          <div className="mx-auto mt-9 flex w-fit flex-col gap-3 rounded-2xl border border-white/30 bg-white/15 p-3 shadow-2xl backdrop-blur-xl sm:flex-row">

            {/* Explore Menu */}
            <Link
              href="/menu"
              className="group flex items-center justify-center gap-2 rounded-xl bg-[#CF9D8F] px-6 py-3.5 text-sm font-semibold text-[#2C0E05] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#b98170] hover:shadow-lg "
            >
              <span>🍴</span>
              <span>Explore Menu</span>

              <FiArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            {/* Order Now */}
            <Link
              href="/cart"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#2C0E05] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300  hover:-translate-y-1 hover:bg-[#40170C] hover:shadow-xl"
            >
              <FiShoppingCart size={18} />
              <span>Order Now</span>
            </Link>

          </div>

          {/* Small Features */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/75 sm:text-sm">
            <span>✦ Fresh Ingredients</span>
            <span className="hidden sm:inline">•</span>
            <span>✦ Homemade Quality</span>
            <span className="hidden sm:inline">•</span>
            <span>✦ Made with Love</span>
          </div>

        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FFF8F3] to-transparent" />
    </section>
  );
}
