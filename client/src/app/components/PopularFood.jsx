
"use client";

import React, { useEffect, useState } from "react";

const PopularFood = () => {
  const [popularFoods, setPopularFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchPopularFoods = async () => {
      try {
        const response = await fetch(`${API_URL}/api/foods`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch foods");
        }

        const data = await response.json();

        const foods = data.foods || [];

        // Only show available foods, latest 5
       const availableFoods = foods
  .filter((food) => Number(food.is_available) === 1)
  .filter(
    (food, index, array) =>
      array.findIndex(
        (item) => item.category_id === food.category_id
      ) === index
  )
  .slice(0, 5);

        setPopularFoods(availableFoods);
      } catch (error) {
        console.error("Popular foods error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularFoods();
  }, [API_URL]);

  return (
    <section className="w-full overflow-hidden bg-[#f8fafc] py-12">

      {/* Header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
              EXPLORE HOMEBITE
            </span>

            <h2 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Popular food items
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Discover delicious homemade meals prepared with love.
            </p>
          </div>

          <a
            href="/menu"
            className="group hidden cursor-pointer items-center text-sm font-semibold text-gray-900 transition-colors duration-200 hover:text-emerald-600 sm:inline-flex"
          >
            View all
            <svg
              className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 17L17 7M17 7H7M17 7v10"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="py-12 text-center text-gray-500">
          Loading popular foods...
        </div>
      ) : popularFoods.length === 0 ? (
        /* Empty State */
        <div className="py-12 text-center text-gray-500">
          No foods available right now.
        </div>
      ) : (
        /* Horizontal Moving Cards */
        <div className="w-full overflow-hidden">
          <div className="popular-food-track flex w-max gap-4">
            {[...popularFoods, ...popularFoods].map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="group relative h-[250px] w-[260px] shrink-0 cursor-pointer overflow-hidden rounded-2xl shadow-sm transition-shadow duration-300 hover:shadow-xl sm:h-[260px] sm:w-[280px]"
              >
                {/* Image */}
                <img
                  src={
                    item.image_url ||
                    "/images/food-placeholder.png"
                  }
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/85 via-black/30 to-black/15 p-4">

                  {/* Top */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex max-w-[190px] items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-slate-800 shadow-sm backdrop-blur-md">
                      {item.category_name || "Homemade Food"}
                    </span>

                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-white group-hover:text-black">
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 17L17 7M17 7H7M17 7v10"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Bottom */}
                  <div>
                    <h3 className="mt-0.5 line-clamp-1 text-sm font-bold leading-snug text-white">
                      {item.name}
                    </h3>

                    <div className="mt-2 flex items-end justify-between border-t border-white/20 pt-2">
                      <div className="flex items-center gap-1 text-[11px] text-gray-300">
                        Homemade Food
                      </div>

                      <div className="text-right">
                        <span className="block text-[8px] font-semibold uppercase tracking-wider text-gray-300">
                          PRICE
                        </span>

                        <span className="text-sm font-extrabold leading-none text-white">
                          ৳{Number(item.price).toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Right to Left Animation */}
      <style jsx>{`
        .popular-food-track {
          animation: popularFoodScroll 30s linear infinite;
        }

        .popular-food-track:hover {
          animation-play-state: paused;
        }

        @keyframes popularFoodScroll {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(calc(-50% - 8px));
          }
        }
      `}</style>

    </section>
  );
};

export default PopularFood;
