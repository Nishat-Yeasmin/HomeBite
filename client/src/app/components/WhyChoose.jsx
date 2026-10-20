
"use client";

import { useEffect, useRef, useState } from "react";
import {
  FiHeart,
  FiShield,
  FiClock,
  FiStar,
  FiArrowRight,
  FiCheck,
} from "react-icons/fi";

const features = [
  {
    id: 1,
    icon: FiHeart,
    number: "01",
    title: "Made with Care",
    description:
      "Every dish is prepared with homemade love, care, and attention to detail.",
    points: ["Fresh ingredients", "Homestyle taste"],
  },
  {
    id: 2,
    icon: FiShield,
    number: "02",
    title: "Fresh & Hygienic",
    description:
      "We focus on fresh ingredients and clean preparation for every order.",
    points: ["Quality ingredients", "Safe preparation"],
  },
  {
    id: 3,
    icon: FiClock,
    number: "03",
    title: "Easy & Reliable",
    description:
      "Browse, order, and track your favorite homemade foods without the hassle.",
    points: ["Easy ordering", "Order tracking"],
  },
  {
    id: 4,
    icon: FiStar,
    number: "04",
    title: "Loved by Foodies",
    description:
      "Discover delicious homemade favorites that customers keep coming back for.",
    points: ["Customer reviews", "Favorite foods"],
  },
];

export default function WhyChoose() {
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
      className="relative w-full overflow-hidden bg-[#F3E3DC] py-16 sm:py-16 lg:py-16"
    >

        {/* TOP FADE */}
<div className="pointer-events-none absolute left-0 top-0 z-20 h-20 w-full bg-gradient-to-b from-[#FFF8F3] to-transparent" />
      {/* ================= BACKGROUND ================= */}

      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#D6A84F]/15 blur-[110px]" />

      <div className="pointer-events-none absolute -bottom-40 -right-32 h-[450px] w-[450px] rounded-full bg-[#A85F4B]/15 blur-[130px]" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFF8F3]/50 blur-[100px]" />

      {/* DECORATIVE DOTS */}
      <div className="pointer-events-none absolute left-[7%] top-[20%] h-2 w-2 animate-pulse rounded-full bg-[#A85F4B]/50" />

      <div className="pointer-events-none absolute left-[13%] bottom-[18%] h-3 w-3 animate-pulse rounded-full bg-[#D6A84F]/60 [animation-delay:700ms]" />

      <div className="pointer-events-none absolute right-[8%] top-[25%] h-3 w-3 animate-pulse rounded-full bg-[#A85F4B]/40 [animation-delay:1000ms]" />

      <div className="pointer-events-none absolute right-[15%] bottom-[20%] h-2 w-2 animate-pulse rounded-full bg-[#D6A84F]/50 [animation-delay:400ms]" />

      {/* ================= CONTENT ================= */}

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 xl:px-20">

        {/* ================= HEADER ================= */}

        <div
          className={`mx-auto max-w-2xl text-center transition-all duration-1000 ${
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          {/* BADGE */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#A85F4B]/20 bg-[#FFF8F3]/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#8F4F3E] shadow-sm backdrop-blur-sm">
            <FiHeart size={13} />
            Why HomeBite
          </div>

          {/* HEADING */}
          <h2 className="text-4xl font-black leading-tight tracking-tight text-[#3B211B] sm:text-5xl lg:text-[56px]">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-[#D6A84F] via-[#B87932] to-[#542719] bg-clip-text font-serif italic text-transparent">
              HomeBite?
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-[#765C54] sm:text-[15px]">
            Good food feels better when it is fresh, homemade, and made with
            care.
          </p>
        </div>

        {/* ================= CARDS ================= */}

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.id}
                className={`group relative overflow-hidden rounded-[26px] border border-[#C98F7D]/25 bg-[#FFF8F3] p-6 shadow-[0_15px_45px_rgba(74,43,34,0.10)] transition-all duration-700 hover:-translate-y-3 hover:border-[#D6A84F]/60 hover:bg-[#FFFDFB] hover:shadow-[0_25px_60px_rgba(74,43,34,0.17)] ${
                  visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-12 opacity-0"
                }`}
                style={{
                  transitionDelay: `${150 + index * 120}ms`,
                }}
              >
                {/* CARD GLOW */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#D6A84F]/10 blur-3xl transition-all duration-500 group-hover:scale-125 group-hover:bg-[#D6A84F]/20" />

                {/* NUMBER */}
                <span className="absolute right-5 top-5 text-[11px] font-black tracking-[0.2em] text-[#A85F4B]/30 transition-colors duration-300 group-hover:text-[#A85F4B]/70">
                  {feature.number}
                </span>

                {/* ICON */}
                <div className="relative mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3E3DC] text-[#A85F4B] shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-gradient-to-br group-hover:from-[#F3D18A] group-hover:to-[#D6A84F] group-hover:text-[#542719]">
                  <Icon size={24} strokeWidth={1.8} />

                  <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#D6A84F] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                {/* TITLE */}
                <h3 className="relative text-xl font-black text-[#3B211B]">
                  {feature.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="relative mt-3 text-sm leading-6 text-[#765C54]">
                  {feature.description}
                </p>

                {/* POINTS */}
                <div className="relative mt-5 space-y-2.5">
                  {feature.points.map((point) => (
                    <div
                      key={point}
                      className="flex items-center gap-2 text-xs font-semibold text-[#654A42]"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D6A84F]/20 text-[#9B6630]">
                        <FiCheck size={11} strokeWidth={3} />
                      </span>

                      {point}
                    </div>
                  ))}
                </div>

                {/* BOTTOM LINE */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-[#D6A84F] via-[#B87932] to-[#542719] transition-all duration-500 group-hover:w-full" />
              </article>
            );
          })}
        </div>

        {/* ================= BOTTOM CTA ================= */}

        <div
          className={`mt-14 flex justify-center transition-all delay-700 duration-1000 ${
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-6 opacity-0"
          }`}
        >
          <a
            href="/menu"
            className="group inline-flex cursor-pointer items-center gap-3 rounded-full bg-gradient-to-r from-[#D6A84F] via-[#B87932] to-[#542719] px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_35px_rgba(84,39,25,0.20)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(84,39,25,0.28)]"
          >
            Explore Our Menu

            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-1">
              <FiArrowRight size={15} />
            </span>
          </a>
        </div>
      </div>
      {/* BOTTOM FADE */}
<div className="pointer-events-none absolute bottom-0 left-0 z-20 h-20 w-full bg-gradient-to-t from-[#FFF8F3] to-transparent" />
    </section>
  );
}
