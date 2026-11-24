
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  FiArrowUpRight,
  FiHeart,
  FiCheckCircle,
  FiShield,
  FiUsers,
  FiCoffee,
  FiStar,
  FiShoppingBag,
  FiTruck,
} from "react-icons/fi";

const values = [
  {
    icon: FiHeart,
    title: "Made with Care",
    description:
      "Every homemade dish is prepared with attention, warmth, and love.",
    color: "bg-[#F2DDE1] text-[#A66E78]",
  },
  {
    icon: FiShield,
    title: "Fresh & Hygienic",
    description:
      "We value fresh ingredients and clean food preparation.",
    color: "bg-[#E5EBD9] text-[#65745A]",
  },
  {
    icon: FiUsers,
    title: "Local Food Makers",
    description:
      "We bring talented home cooks and food lovers closer together.",
    color: "bg-[#F8E9D9] text-[#B17C54]",
  },
  {
    icon: FiStar,
    title: "Quality First",
    description:
      "We believe good food starts with care, quality, and consistency.",
    color: "bg-[#E8E2F0] text-[#88739E]",
  },
];

const highlights = [
  "Freshly prepared homemade food",
  "Discover unique local food makers",
  "Simple and convenient ordering",
];

export default function AboutPage() {
  const pageRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    if (pageRef.current) observer.observe(pageRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <main
      ref={pageRef}
      className="relative min-h-screen overflow-hidden bg-[#FFF8F3]"
    >
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-[#E9EBDD] px-6 pb-20 pt-16 sm:px-10 sm:pb-24 sm:pt-20 lg:px-16">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#B87983]/20 blur-[110px]" />
        <div className="pointer-events-none absolute -bottom-40 right-0 h-[450px] w-[450px] rounded-full bg-[#A7B18C]/35 blur-[120px]" />
        <div className="pointer-events-none absolute right-[20%] top-10 h-32 w-32 rounded-full bg-[#F4D9D9]/40 blur-3xl" />

        <div
          className={`relative z-10 mx-auto max-w-5xl text-center transition-all duration-1000 ${
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#A97878]/25 bg-[#FFF8F3]/75 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#8E626A] shadow-sm backdrop-blur-md">
            <FiHeart size={14} />
            Welcome to HomeBite
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-black leading-[1.15] tracking-tight text-[#46513D] sm:text-5xl lg:text-[66px]">
            A Taste of Home,
            <span className="block font-serif font-medium italic text-[#A97878]">
              Made with Love.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#707765] sm:text-base sm:leading-8">
            Bringing homemade goodness closer to you. Discover comforting
            meals, delightful treats, and the people who make them special.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href="/foods"
              className="group inline-flex cursor-pointer items-center gap-3 rounded-full bg-[#65745A] px-7 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#526348]"
            >
              Explore Foods
              <FiArrowUpRight
                size={18}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>

            <Link
              href="/contact"
              className="inline-flex cursor-pointer items-center rounded-full border border-[#A97878]/35 bg-[#FFF8F3]/80 px-7 py-3.5 text-sm font-bold text-[#8E626A] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 h-20 w-full bg-gradient-to-t from-[#FFF8F3] to-transparent" />
      </section>

      {/* ================= OUR STORY ================= */}
      <section className="relative overflow-hidden px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        <div className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-[#F0DDE0]/55 blur-[110px]" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* IMAGE */}
          <div
            className={`relative mx-auto w-full max-w-[540px] transition-all duration-1000 ${
              visible
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            <div className="absolute -left-5 -top-5 h-32 w-32 rounded-[30px] bg-[#B87983]/25 sm:-left-7 sm:-top-7" />

            <div className="relative overflow-hidden rounded-[32px] border-[7px] border-[#F5E9E2] shadow-[0_25px_60px_rgba(74,83,57,0.15)]">
              <img
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1100&q=85"
                alt="Homemade food prepared with care"
                className="h-[310px] w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-[430px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#46513D]/30 to-transparent" />
            </div>

            <div className="absolute -bottom-5 right-3 flex items-center gap-3 rounded-2xl border border-[#E7D5CD] bg-[#FFF8F3]/95 px-4 py-3 shadow-xl backdrop-blur-md sm:right-7 sm:px-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F2DDE1] text-[#A66E78]">
                <FiHeart size={21} />
              </div>
              <div>
                <p className="text-sm font-bold text-[#46513D]">
                  Made with Care
                </p>
                <p className="mt-0.5 text-xs text-[#887B70]">
                  From our kitchen to you
                </p>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div
            className={`transition-all delay-200 duration-1000 ${
              visible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#A97878]/25 bg-[#F8ECEB] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#8E626A]">
              <FiCoffee size={14} />
              Our Story
            </div>

            <h2 className="max-w-xl text-4xl font-black leading-[1.15] tracking-tight text-[#46513D] sm:text-5xl">
              More Than Just
              <span className="mt-1 block font-serif font-medium italic text-[#A97878]">
                Homemade Food.
              </span>
            </h2>

            <p className="mt-6 text-sm leading-8 text-[#707765] sm:text-base">
              HomeBite was created to make homemade food easier to discover
              and enjoy. We connect passionate home cooks with people who
              appreciate fresh, comforting, and delicious meals.
            </p>

            <p className="mt-4 text-sm leading-8 text-[#707765] sm:text-base">
              From everyday meals to special treats, we want every order
              to bring a little warmth and happiness to your table.
            </p>

            <div className="mt-7 space-y-3">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm font-semibold text-[#58634D]"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#A7B18C]/30 text-[#65745A]">
                    <FiCheckCircle size={15} />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= MISSION & VISION ================= */}
      <section className="relative overflow-hidden bg-[#F3E9E5] px-6 py-16 sm:px-10 sm:py-20 lg:px-16">
        <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-[#B87983]/15 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-[#A7B18C]/25 blur-[110px]" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#A97878]/25 bg-[#FFF8F3]/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#8E626A]">
              <FiStar size={13} />
              What Drives Us
            </span>

            <h2 className="mt-5 text-3xl font-black text-[#46513D] sm:text-5xl">
              Our Purpose,
              <span className="font-serif font-medium italic text-[#A97878]">
                {" "}Our Promise.
              </span>
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <article className="group rounded-[30px] border border-[#E5D1D0] bg-[#FFF8F3] p-8 shadow-[0_15px_45px_rgba(74,43,34,0.07)] transition-all duration-500 hover:-translate-y-2 hover:shadow-xl sm:p-10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F2DDE1] text-[#A66E78] transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                <FiHeart size={25} />
              </div>
              <h3 className="text-2xl font-black text-[#46513D]">
                Our Mission
              </h3>
              <p className="mt-4 text-sm leading-7 text-[#77796B] sm:text-base">
                To make homemade food accessible and convenient while
                supporting passionate local home cooks and their culinary
                creations.
              </p>
            </article>

            <article className="group rounded-[30px] border border-[#D7DDC9] bg-[#F8F9F1] p-8 shadow-[0_15px_45px_rgba(74,43,34,0.07)] transition-all duration-500 hover:-translate-y-2 hover:shadow-xl sm:p-10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E5EBD9] text-[#65745A] transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                <FiStar size={25} />
              </div>
              <h3 className="text-2xl font-black text-[#46513D]">
                Our Vision
              </h3>
              <p className="mt-4 text-sm leading-7 text-[#77796B] sm:text-base">
                To build a trusted community where homemade food, local
                creativity, and meaningful food experiences come together.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ================= OUR VALUES ================= */}
      <section className="relative overflow-hidden bg-[#FFF8F3] px-6 py-16 sm:px-10 sm:py-20 lg:px-16">
        <div className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full bg-[#E8D5DF]/45 blur-[110px]" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#A97878]/25 bg-[#F8ECEB] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#8E626A]">
              <FiHeart size={13} />
              What Matters to Us
            </span>

            <h2 className="mt-5 text-3xl font-black leading-tight text-[#46513D] sm:text-5xl">
              The Values Behind
              <span className="block font-serif font-medium italic text-[#A97878]">
                Every Bite.
              </span>
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#77796B] sm:text-base">
              A few simple things make the HomeBite experience special.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((item, index) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="group relative overflow-hidden rounded-[26px] border border-[#E8DCD5] bg-white/85 p-7 shadow-[0_12px_35px_rgba(74,43,34,0.07)] transition-all duration-500 hover:-translate-y-3 hover:border-[#D5B6B7] hover:shadow-[0_22px_50px_rgba(74,43,34,0.12)]"
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#F2DDE1]/40 blur-3xl transition-transform duration-500 group-hover:scale-150" />

                  <div className={`relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${item.color} transition-all duration-500 group-hover:rotate-6 group-hover:scale-110`}>
                    <Icon size={24} />
                  </div>

                  <h3 className="relative text-xl font-black text-[#46513D]">
                    {item.title}
                  </h3>

                  <p className="relative mt-3 text-sm leading-7 text-[#77796B]">
                    {item.description}
                  </p>

                  <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-[#B87983] to-[#A7B18C] transition-all duration-500 group-hover:w-full" />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="relative overflow-hidden px-6 py-16 sm:px-10 sm:py-20 lg:px-16">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-[#65745A] px-7 py-14 text-center shadow-[0_25px_60px_rgba(75,91,62,0.18)] sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-[#F2DDE1]/20 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-28 -right-16 h-72 w-72 rounded-full bg-[#D6C99E]/25 blur-[90px]" />

          <div className="relative z-10 mx-auto max-w-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-[#F8E4E4] backdrop-blur-sm">
              <FiShoppingBag size={25} />
            </div>

            <h2 className="mt-6 text-3xl font-black leading-tight text-white sm:text-5xl">
              Ready for Something
              <span className="block font-serif font-medium italic text-[#F3D9DE]">
                Delicious?
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/80 sm:text-base">
              Explore homemade favorites and find something special for
              your next meal.
            </p>

            <Link
              href="/foods"
              className="group mt-8 inline-flex cursor-pointer items-center gap-3 rounded-full bg-[#FFF8F3] px-7 py-3.5 text-sm font-bold text-[#58634D] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#F2DDE1] hover:text-[#8E626A]"
            >
              Explore Our Foods
              <FiArrowUpRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
