
"use client";

import { useEffect, useRef, useState } from "react";
import {
  FiSearch,
  FiShoppingCart,
  FiCreditCard,
  FiPackage,
  FiArrowRight,
} from "react-icons/fi";

const steps = [
  {
    id: 1,
    number: "01",
    icon: FiSearch,
    title: "Discover",
    description:
      "Explore a variety of delicious homemade foods from local home chefs.",
    tag: "Find your favorite",
    label: "Explore & discover",
  },
  {
    id: 2,
    number: "02",
    icon: FiShoppingCart,
    title: "Build Your Order",
    description:
      "Choose your favorites, adjust quantities, and add them to your cart.",
    tag: "Pick & customize",
    label: "Make it yours",
  },
  {
    id: 3,
    number: "03",
    icon: FiCreditCard,
    title: "Place Order",
    description:
      "Review your order details and confirm your order with a simple checkout.",
    tag: "Quick checkout",
    label: "One easy checkout",
  },
  {
    id: 4,
    number: "04",
    icon: FiPackage,
    title: "Enjoy",
    description:
      "Track your order and get your homemade goodness delivered to your door.",
    tag: "Delivered with care",
    label: "Sit back & enjoy",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#FFF8F3] py-20 sm:py-24 lg:py-28"
    >
      {/* TOP FADE */}
      <div className="pointer-events-none absolute left-0 top-0 z-20 h-20 w-full bg-gradient-to-b from-[#F3E3DC] to-transparent" />

      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none absolute -left-40 top-1/4 h-[400px] w-[400px] rounded-full bg-[#D6A84F]/10 blur-[130px]" />

      <div className="pointer-events-none absolute -right-40 bottom-1/4 h-[450px] w-[450px] rounded-full bg-[#A85F4B]/10 blur-[140px]" />

      {/* DECORATIVE DOT GRID */}
      <div className="pointer-events-none absolute right-[4%] top-[15%] opacity-[0.08]">
        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: 25 }).map((_, index) => (
            <span
              key={index}
              className="h-1.5 w-1.5 rounded-full bg-[#542719]"
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 xl:px-20">

        {/* HEADER */}
        <div
          className={`mx-auto max-w-2xl text-center transition-all duration-1000 ${
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#A85F4B]/20 bg-[#F3E3DC] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#8F4F3E]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D6A84F]" />
            Simple & Easy
          </div>

          <h2 className="text-4xl font-black leading-tight tracking-tight text-[#3B211B] sm:text-5xl lg:text-[56px]">
            How It{" "}
            <span className="bg-gradient-to-r from-[#D6A84F] via-[#B87932] to-[#542719] bg-clip-text font-serif italic text-transparent">
              Works
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-[#765C54] sm:text-[15px]">
            From choosing your favorite dish to enjoying it at home, ordering
            homemade food is just a few simple steps away.
          </p>
        </div>

        {/* JOURNEY */}
        <div className="relative mt-16 lg:mt-20">

          {/* DESKTOP PROGRESS LINE */}
          <div className="pointer-events-none absolute left-[10%] right-[10%] top-[48px] hidden h-[2px] lg:block">
            <div className="h-full w-full bg-[#D9C1B7]" />

            <div
              className={`absolute left-0 top-0 h-full bg-gradient-to-r from-[#D6A84F] via-[#B87932] to-[#542719] transition-all duration-[1800ms] ease-out ${
                visible ? "w-full" : "w-0"
              }`}
            />
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">

            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.id}
                  className={`relative transition-all duration-700 ${
                    visible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-14 opacity-0"
                  }`}
                  style={{
                    transitionDelay: `${250 + index * 180}ms`,
                  }}
                >
                  {/* ICON CIRCLE */}
                  <div className="relative z-10 mx-auto flex h-[98px] w-[98px] cursor-default items-center justify-center rounded-full border-[7px] border-[#FFF8F3] bg-gradient-to-br from-[#D6A84F] to-[#8F542C] shadow-[0_12px_35px_rgba(84,39,25,0.18)] transition-transform duration-500 hover:scale-110">
                    <div className="flex h-[70px] w-[70px] items-center justify-center rounded-full bg-[#FFF8F3] text-[#542719]">
                      <Icon size={27} strokeWidth={1.8} />
                    </div>

                    <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#542719] text-[9px] font-black text-white shadow-md">
                      {step.number}
                    </span>
                  </div>

                  {/* CONTENT */}
                  <div className="mt-7 text-center">

                    {/* TAG */}
                    <span className="inline-flex rounded-full bg-[#F3E3DC] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#9A5E4B]">
                      {step.tag}
                    </span>

                    <h3 className="mt-4 text-xl font-black text-[#3B211B]">
                      {step.title}
                    </h3>

                    <p className="mx-auto mt-3 max-w-[245px] text-sm leading-6 text-[#765C54]">
                      {step.description}
                    </p>

                    {/* UNIQUE LABEL */}
                    <div className="mt-5 text-[11px] font-bold tracking-wide text-[#A85F4B]">
                      {step.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM CTA */}
        <div
          className={`mx-auto mt-16 max-w-3xl transition-all delay-[1100ms] duration-1000 ${
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <div className="relative overflow-hidden rounded-[24px] border border-[#A85F4B]/15 bg-[#F3E3DC] px-6 py-6 sm:px-8">

            {/* LEFT ACCENT */}
            <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#D6A84F] to-[#542719]" />

            <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">

              <div>
                <p className="text-sm font-black text-[#3B211B] sm:text-base">
                  Your next homemade favorite is waiting.
                </p>

                <p className="mt-1 text-xs text-[#765C54]">
                  Start exploring and make your first order today.
                </p>
              </div>

              <a
                href="/menu"
                className="group inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-[#D6A84F] via-[#B87932] to-[#542719] px-5 py-3 text-xs font-bold text-white shadow-[0_10px_25px_rgba(84,39,25,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(84,39,25,0.25)]"
              >
                Start Ordering

                <FiArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM FADE */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-20 h-20 w-full bg-gradient-to-t from-[#F3E3DC] to-transparent" />
    </section>
  );
}
