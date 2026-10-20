"use client";

import Link from "next/link";
import {
  FiArrowRight,
  FiChevronDown,
  FiSearch,
  FiHeart,
  FiShoppingCart,
} from "react-icons/fi";

const categories = [
  {
    id: 1,
    name: "Cake & Bakery",
    slug: "cake-bakery",
    description: "Freshly baked cakes, pastries & sweet treats.",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85",
    items: "12+ Items",
  },
  {
    id: 2,
    name: "Pitha",
    slug: "pitha",
    description: "Traditional homemade Bengali pitha made with love.",
    image:
      "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=900&q=85",
    items: "10+ Items",
  },
  {
    id: 3,
    name: "Biriyani & Rice",
    slug: "biriyani-rice",
    description: "Aromatic rice dishes and delicious homemade biriyani.",
    image:
      "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJpcnlhbml8ZW58MHx8MHx8fDA%3D",
    items: "15+ Items",
  },
  {
    id: 4,
    name: "Fast Food",
    slug: "fast-food",
    description: "Homemade burgers, sandwiches, pizza and more.",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85",
    items: "18+ Items",
  },
  {
    id: 5,
    name: "Snacks",
    slug: "snacks",
    description: "Crispy and tasty snacks perfect for every moment.",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85",
    items: "14+ Items",
  },
  {
    id: 6,
    name: "Desserts",
    slug: "desserts",
    description: "Sweet homemade desserts for your happy moments.",
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=85",
    items: "11+ Items",
  },
  {
    id: 7,
    name: "Homemade Drinks",
    slug: "homemade-drinks",
    description: "Refreshing homemade drinks made with natural ingredients.",
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=85",
    items: "9+ Items",
  },
  {
    id: 8,
    name: "Pickles & Chutney",
    slug: "pickles-chutney",
    description: "Homemade pickles and chutneys packed with flavor.",
    image:
      "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=900&q=85",
    items: "8+ Items",
  },
];

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-[#FFF8F3] text-[#2C0E05]">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-[#F3E3DC] px-6 pb-20 pt-36 sm:px-10 lg:px-16">

        {/* Decorative circles */}
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#DF8D6E]/15 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#C9A66B]/15 blur-3xl" />

        <div className="relative mx-auto max-w-6xl text-center">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#CF9D8F] bg-white/50 px-4 py-2 text-sm font-medium backdrop-blur-md">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#DF8D6E]" />
            Homemade • Fresh • Delicious
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Explore Our{" "}
            <span className="bg-gradient-to-r from-[#DF8D6E] via-[#B96F52] to-[#2C0E05] bg-clip-text text-transparent">
              Menu
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#5D4037] sm:text-lg">
            Discover delicious homemade food prepared with care and delivered
            fresh to your doorstep.
          </p>

          {/* Search */}
          <div className="mx-auto mt-9 flex max-w-2xl items-center rounded-2xl border border-[#CF9D8F]/50 bg-white/75 p-2 shadow-lg shadow-[#8D5A4A]/10 backdrop-blur-xl">
            <FiSearch className="ml-4 text-xl text-[#8D5A4A]" />

            <input
              type="text"
              placeholder="Search your favorite food..."
              className="w-full bg-transparent px-4 py-3 text-sm outline-none placeholder:text-[#9A766A] sm:text-base"
            />

            <button className="hidden cursor-pointer rounded-xl bg-[#2C0E05] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4A1D10] sm:block">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* ================= CATEGORY SECTION ================= */}
      <section className="px-6 py-20 sm:px-10 lg:px-16">

        <div className="mx-auto max-w-7xl">

          {/* Section heading */}
          <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-[#B96F52]">
                Find What You Love
              </p>

              <h2 className="text-3xl font-bold sm:text-4xl">
                Choose a Category
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#72564D] sm:text-base">
                Pick a category and explore a collection of homemade foods
                prepared specially for you.
              </p>
            </div>

            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-[#7B3F2B]"
            >
              Back to Home
              <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

          </div>

          {/* Category Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {categories.map((category, index) => (
              <Link
                href={`/menu/${category.slug}`}
                key={category.id}
                className="group cursor-pointer"
              >
                <article
                  className="relative h-[330px] overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_15px_45px_rgba(80,30,15,0.10)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(80,30,15,0.18)]"
                  style={{
                    animationDelay: `${index * 80}ms`,
                  }}
                >

                  {/* Image */}
                  <img
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1D0803] via-[#1D0803]/35 to-transparent" />

                  {/* Top badge */}
                  <div className="absolute left-4 top-4 rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                    {category.items}
                  </div>

                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">

                    <h3 className="text-xl font-bold">
                      {category.name}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-5 text-white/80">
                      {category.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between">

                      <span className="text-sm font-semibold">
                        Explore Category
                      </span>

                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2C0E05] transition-all duration-300 group-hover:rotate-[-45deg]">
                        <FiArrowRight />
                      </span>

                    </div>
                  </div>

                </article>
              </Link>
            ))}

          </div>
        </div>
      </section>

      {/* ================= BOTTOM CTA ================= */}
      <section className="px-6 pb-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[30px] bg-[#2C0E05] px-7 py-12 text-center text-white sm:px-12">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E3B99E]">
            Can't decide?
          </p>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Let HomeBite help you find something delicious.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/65">
            Browse our homemade food collection and discover something made
            just for your cravings.
          </p>

          <Link
            href="/"
            className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#C9A66B] px-6 py-3 font-semibold text-[#2C0E05] transition-all duration-300 hover:-translate-y-1 hover:bg-[#D9B97F]"
          >
            Explore HomeBite
            <FiArrowRight />
          </Link>

        </div>
      </section>

    </main>
  );
}