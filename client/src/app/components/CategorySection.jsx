
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

const categories = [
  {
    id: 1,
    title: "Cake & Bakery",
    count: "18 Items",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    title: "Pitha",
    count: "14 Items",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    title: "Biriyani & Rice",
    count: "24 Items",
    image:
      "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    title: "Fast Food",
    count: "32 Items",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 5,
    title: "Snacks",
    count: "21 Items",
    image:
      "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 6,
    title: "Desserts",
    count: "15 Items",
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 7,
    title: "Homemade Drinks",
    count: "12 Items",
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 8,
    title: "Pickles & Chutney",
    count: "16 Items",
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=85",
  },
];

export default function CategorySection() {
  const [activeIndex, setActiveIndex] = useState(2);
  const [isPaused, setIsPaused] = useState(false);

  // Auto change every 2 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % categories.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  /*
    Get the position of each card relative to
    the currently active card.

    -2 = far left
    -1 = left
     0 = center
     1 = right
     2 = far right
  */
  const getPosition = (index) => {
    let difference = index - activeIndex;

    const total = categories.length;

    if (difference > total / 2) {
      difference -= total;
    }

    if (difference < -total / 2) {
      difference += total;
    }

    return difference;
  };

  return (
    <section className="w-full overflow-hidden bg-[#FFF8F3] px-0 py-0 sm:py-0 lg:py-0 my-0 rounded-xl">

      {/* MAIN SECTION */}
      <div className="relative w-full overflow-hidden bg-olive-200 py-16 shadow-[0_20px_70px_rgba(44,14,5,0.08)] sm:py-20 lg:py-24">

          

        {/* Decorative Background */}
        <div className="pointer-events-none absolute -left-40 top-0 h-[450px] w-[450px] rounded-full bg-[#F3A789]/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 right-0 h-[450px] w-[450px] rounded-full bg-[#CF9D8F]/20 blur-3xl" />

        {/* HEADER */}
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-6 px-6 sm:px-10 lg:flex-row lg:items-end lg:px-16 xl:px-24">
          {/* LEFT CONTENT */}
          <div>
            {/* Badge */}
            <div className="mb-5 inline-flex cursor-default items-center gap-2 rounded-full border border-[#CF9D8F]/40 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#2C0E05] shadow-sm backdrop-blur-sm sm:px-5 sm:text-sm">
              <span className="text-[#CF9D8F]">✦</span>
              Explore Categories
            </div>

            {/* Heading */}
            <h2 className="max-w-[700px] text-4xl font-bold leading-[1.05] tracking-tight text-[#2C0E05] sm:text-5xl lg:text-[58px] xl:text-[64px]">
              Something Delicious,
              <br />
              <span className="font-serif italic font-medium text-[#9E6655]">
                For Every Craving
              </span>
            </h2>

            {/* Description */}
            <p className="mt-6 max-w-[570px] text-sm leading-7 text-[#6B4A40] sm:text-base lg:text-[17px] lg:leading-8">
              Explore our homemade food categories and discover comforting
              classics, delicious snacks, sweet treats, and refreshing drinks
              made with care.
            </p>
          </div>

          {/* VIEW ALL */}
          <Link
            href="/menu"
            className="group inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-[#CF9D8F]/50 bg-white/80 px-5 py-3 text-sm font-semibold text-[#2C0E05] shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-[#2C0E05] hover:text-white hover:shadow-lg"
          >
            View All Categories

            <FiArrowUpRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>

        {/* CAROUSEL */}
        <div
          className="relative z-20 mx-auto mt-14 h-[410px] w-full max-w-[1400px] overflow-hidden sm:mt-16 sm:h-[450px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* LEFT FADE */}
          <div className="pointer-events-none absolute left-0 top-0 z-40 h-full w-24 bg-gradient-to-r from-[#F3E3DC] via-[#F3E3DC]/80 to-transparent sm:w-40 lg:w-56" />

          {/* RIGHT FADE */}
          <div className="pointer-events-none absolute right-0 top-0 z-40 h-full w-24 bg-gradient-to-l from-[#F3E3DC] via-[#F3E3DC]/80 to-transparent sm:w-40 lg:w-56" />

          {/* CARDS */}
          <div className="absolute inset-0">
            {categories.map((category, index) => {
              const position = getPosition(index);

              // Only show center + 2 on each side
              const visible = Math.abs(position) <= 2;

              if (!visible) return null;

              const isCenter = position === 0;
              const isNear = Math.abs(position) === 1;
              const isFar = Math.abs(position) === 2;

              let positionClass = "";
              let scale = 1;
              let blur = "blur(0px)";
              let opacity = 1;
              let zIndex = 10;

              /*
                CENTER
              */
              if (isCenter) {
                positionClass =
                  "left-1/2 -translate-x-1/2 translate-y-[-50%]";

                scale = 1.08;
                blur = "blur(0px)";
                opacity = 1;
                zIndex = 30;
              }

              /*
                LEFT / RIGHT 1
              */
              if (position === -1) {
                positionClass =
                  "left-[50%] -translate-x-[calc(50%+235px)] translate-y-[-50%]";

                scale = 0.91;
                blur = "blur(1.5px)";
                opacity = 0.88;
                zIndex = 20;
              }

              if (position === 1) {
                positionClass =
                  "left-[50%] -translate-x-[calc(50%-235px)] translate-y-[-50%]";

                scale = 0.91;
                blur = "blur(1.5px)";
                opacity = 0.88;
                zIndex = 20;
              }

              /*
                FAR LEFT / RIGHT
              */
              if (position === -2) {
                positionClass =
                  "left-[50%] -translate-x-[calc(50%+465px)] translate-y-[-50%]";

                scale = 0.78;
                blur = "blur(4px)";
                opacity = 0.55;
                zIndex = 10;
              }

              if (position === 2) {
                positionClass =
                  "left-[50%] -translate-x-[calc(50%-465px)] translate-y-[-50%]";

                scale = 0.78;
                blur = "blur(4px)";
                opacity = 0.55;
                zIndex = 10;
              }

              return (
                <article
                  key={category.id}
                  onClick={() => setActiveIndex(index)}
                  className={`absolute top-1/2 h-[350px] w-[245px] cursor-pointer overflow-hidden rounded-[24px] border border-[#CF9D8F]/30 bg-[#FFFDFC] shadow-[0_18px_45px_rgba(44,14,5,0.16)] transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] sm:h-[380px] sm:w-[275px] ${positionClass}`}
                  style={{
                    transform: `${positionClass.includes("-translate-x-1/2") ? "" : ""} scale(${scale})`,
                    filter: blur,
                    opacity,
                    zIndex,
                  }}
                >
                  {/* IMAGE */}
                  <img
                    src={category.image}
                    alt={category.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-110"
                  />

                  {/* DARK OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2C0E05]/90 via-[#2C0E05]/25 to-transparent" />

                  {/* HOVER OVERLAY */}
                  <div className="absolute inset-0 bg-[#CF9D8F]/0 transition-all duration-500 hover:bg-[#CF9D8F]/10" />

                  {/* CONTENT */}
                  <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-5 sm:p-6">
                    <div>
                      <h3 className="max-w-[180px] text-xl font-bold leading-tight text-white sm:text-[22px]">
                        {category.title}
                      </h3>

                      <span className="mt-1.5 block text-xs font-medium tracking-wide text-white/75 sm:text-sm">
                        {category.count}
                      </span>
                    </div>

                    {/* ARROW */}
                    <button
                      type="button"
                      aria-label={`View ${category.title}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        setActiveIndex(index);
                      }}
                      className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/40 bg-white/15 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-[#CF9D8F] hover:text-[#2C0E05] active:scale-95"
                    >
                      <FiArrowUpRight size={20} strokeWidth={2.5} />
                    </button>
                  </div>

                  {/* ACTIVE BORDER */}
                  {isCenter && (
                    <div className="pointer-events-none absolute inset-0 rounded-[24px] border-2 border-white/50" />
                  )}
                </article>
              );
            })}
          </div>
        </div>

        {/* DOTS */}
        <div className="relative z-50 mt-2 flex items-center justify-center gap-2 sm:mt-4">
          {categories.map((category, index) => (
            <button
              key={category.id}
              type="button"
              aria-label={`Show ${category.title}`}
              onClick={() => setActiveIndex(index)}
              className={`cursor-pointer rounded-full transition-all duration-500 ${
                index === activeIndex
                  ? "h-2.5 w-8 bg-[#2C0E05]"
                  : "h-2.5 w-2.5 bg-[#CF9D8F]/70 hover:bg-[#9E6655]"
              }`}
            />
          ))}
        </div>

        {/* BOTTOM TEXT */}
        <p className="relative z-30 mt-5 text-center text-xs font-medium tracking-wide text-[#6B4A40]/70">
          Made fresh • Made with care • Made at home
        </p>

        {/* BOTTOM FADE */}
<div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-24 bg-gradient-to-t from-[#FFF8F3] via-[#FFF8F3]/60 to-transparent" />

      </div>
    </section>
  );
}
