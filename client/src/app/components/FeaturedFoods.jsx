
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  FiArrowRight,
  FiHeart,
  FiShoppingCart,
  FiStar,
} from "react-icons/fi";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80";

// Select 6 foods from different categories first
function getFeaturedFoods(allFoods) {
  const availableFoods = allFoods.filter(
    (food) =>
      Number(food.is_available) === 1 ||
      food.is_available === true
  );

  const selected = [];
  const usedCategories = new Set();
  const usedIds = new Set();

  // First priority: one food from each category
  for (const food of availableFoods) {
    const categoryKey = String(
      food.category_name || food.category_id || `food-${food.id}`
    ).toLowerCase();

    if (!usedCategories.has(categoryKey)) {
      selected.push(food);
      usedCategories.add(categoryKey);
      usedIds.add(food.id);

      if (selected.length === 6) break;
    }
  }

  // If fewer than 6 categories are available, fill remaining slots
  if (selected.length < 6) {
    for (const food of availableFoods) {
      if (!usedIds.has(food.id)) {
        selected.push(food);
        usedIds.add(food.id);

        if (selected.length === 6) break;
      }
    }
  }

  return selected;
}

function getFoodImage(imageUrl) {
  if (!imageUrl) return FALLBACK_IMAGE;

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://")
  ) {
    return imageUrl;
  }

  return `${API_URL}/${imageUrl.replace(/^\/+/, "")}`;
}

function formatPrice(price) {
  if (price === null || price === undefined) return "৳0";

  if (typeof price === "string" && price.includes("৳")) {
    return price;
  }

  return `৳${Number(price).toLocaleString("en-BD")}`;
}

export default function FeaturedFoods() {
  const [foods, setFoods] = useState([]);

  const fetchFoods = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/foods`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch foods");
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.foods)) {
        const featured = getFeaturedFoods(data.foods);
        setFoods(featured);
      }
    } catch (error) {
      console.error("Featured foods error:", error);
    }
  }, []);

  useEffect(() => {
    fetchFoods();

    // Refresh foods when the user returns to this page
    window.addEventListener("focus", fetchFoods);

    return () => {
      window.removeEventListener("focus", fetchFoods);
    };
  }, [fetchFoods]);

  // Duplicate for seamless infinite movement
  const marqueeFoods = foods.length > 0 ? [...foods, ...foods] : [];

  return (
    <section className="w-full bg-[#FFF8F3] px-0 py-10 sm:py-14 lg:py-16 my-0">
      <div className="relative w-full overflow-hidden rounded-[20px] bg-[#F3E3DC] py-16 shadow-[0_20px_70px_rgba(44,14,5,0.08)] sm:py-20 lg:py-24">

        <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 h-28 bg-gradient-to-b from-[#FFF8F3] via-[#FFF8F3]/40 to-transparent blur-[1px]" />

        {/* Decorative Background */}
        <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-[#F3A789]/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 right-0 h-[450px] w-[450px] rounded-full bg-[#CF9D8F]/20 blur-3xl" />

        <div className="relative flex min-h-[540px] items-center">

          {/* LEFT CONTENT */}
          <div className="relative z-30 w-[42%] shrink-0 pl-6 pr-5 sm:pl-10 sm:pr-8 lg:pl-16 lg:pr-10 xl:pl-24">

            <div className="mb-6 inline-flex cursor-default items-center gap-2 rounded-full border border-[#CF9D8F]/40 bg-white/75 px-4 py-2 text-xs font-semibold text-[#2C0E05] shadow-sm backdrop-blur-sm sm:px-5 sm:text-sm">
              <span className="text-[#CF9D8F]">✦</span>
              Handpicked for You
            </div>

            <h2 className="max-w-[620px] text-4xl font-bold leading-[1.05] tracking-tight text-[#2C0E05] sm:text-5xl lg:text-[58px] xl:text-[66px]">
              Homemade Favorites,
              <br />
              <span className="font-serif italic font-medium text-[#9E6655]">
                Made to Feel Like Home
              </span>
            </h2>

            <p className="mt-6 max-w-[520px] text-sm leading-7 text-[#6B4A40] sm:text-base lg:text-[17px] lg:leading-8">
              From comforting classics to irresistible sweet treats, discover
              delicious homemade food prepared with care and delivered straight
              to your table.
            </p>

            <Link
              href="/menu"
              className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#2C0E05] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#2C0E05]/15 transition-all duration-300 hover:-translate-y-1 hover:bg-[#40170C] hover:shadow-xl"
            >
              Explore Full Menu
              <FiArrowRight size={17} />
            </Link>
          </div>

          {/* MOVING CARDS */}
          <div className="relative z-10 -ml-10 w-[70%] overflow-hidden py-8 sm:-ml-16 lg:-ml-20">

            {/* Left Fade */}
            <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-40 bg-gradient-to-r from-[#F3E3DC] via-[#F3E3DC]/90 to-transparent" />

            {/* Right Fade */}
            <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-32 bg-gradient-to-l from-[#F3E3DC] to-transparent" />

            {/* Marquee Track */}
            <div className="featured-food-track flex w-max gap-6">
              {marqueeFoods.map((food, index) => (
                <FoodCard key={`${food.id}-${index}`} food={food} />
              ))}
            </div>

          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-28 bg-gradient-to-t from-[#FFF8F3] via-[#FFF8F3]/40 to-transparent blur-[1px]" />

      </div>

      <style jsx>{`
        .featured-food-track {
          animation: featuredFoodMarquee 16s linear infinite;
          will-change: transform;
        }

        .featured-food-track:hover {
          animation-play-state: paused;
        }

        @keyframes featuredFoodMarquee {
          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 1024px) {
          .featured-food-track {
            animation-duration: 14s;
          }
        }

        @media (max-width: 640px) {
          .featured-food-track {
            animation-duration: 13s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .featured-food-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

function FoodCard({ food }) {
  return (
    <article className="group w-[280px] shrink-0 overflow-hidden rounded-[24px] border border-[#CF9D8F]/25 bg-[#FFFDFC] p-3 shadow-[0_12px_35px_rgba(44,14,5,0.10)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(44,14,5,0.18)] sm:w-[300px]">

      {/* IMAGE */}
      <div className="relative h-[205px] overflow-hidden rounded-[18px]">
        <img
          src={getFoodImage(food.image_url)}
          alt={food.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2C0E05]/25 to-transparent" />

        {/* Wishlist */}
        <button
          type="button"
          aria-label={`Add ${food.name} to wishlist`}
          className="absolute right-3 top-3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/95 text-[#2C0E05] shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-[#2C0E05] hover:text-white active:scale-95"
        >
          <FiHeart size={18} />
        </button>
      </div>

      {/* CONTENT */}
      <div className="px-2 pb-2 pt-4">
        <h3 className="truncate text-[21px] font-bold text-[#2C0E05]">
          {food.name}
        </h3>

        <p className="mt-2 h-10 overflow-hidden text-[13px] leading-5 text-[#765B52]">
          {food.description}
        </p>

        {/* Rating */}
        <div className="mt-4 flex items-center gap-1.5">
          <FiStar
            size={15}
            className="fill-[#CF9D8F] text-[#CF9D8F]"
          />

          <span className="text-sm font-semibold text-[#2C0E05]">
            {food.rating ?? "New"}
          </span>

          <span className="text-xs text-[#9B8178]">
            ({food.reviews ?? food.review_count ?? 0})
          </span>
        </div>

        {/* Price + Cart */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="text-xl font-bold text-[#2C0E05]">
            {formatPrice(food.price)}
          </span>

          <button
            type="button"
            className="flex cursor-pointer items-center gap-1.5 rounded-full bg-[#CF9D8F] px-4 py-2.5 text-xs font-semibold text-[#2C0E05] transition-all duration-300 hover:scale-105 hover:bg-[#B98170] active:scale-95"
          >
            <FiShoppingCart size={14} />
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
