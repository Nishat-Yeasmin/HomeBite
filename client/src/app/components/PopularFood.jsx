
"use client";

import React from "react";

const PopularFood = () => {
  const popularFoods = [
    {
      id: 1,
      title: "Shahi Mutton Kacchi",
      chef: "Chef Rehana's Kitchen",
      category: "Biriyani & Rice",
      portion: "1 Plate",
      price: "350",
      image:
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600",
    },
    {
      id: 2,
      title: "Bhuna Khichuri & Beef",
      chef: "Home Made Delights",
      category: "Homemade Meals",
      portion: "1 Meal Box",
      price: "280",
      image:
        "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=600",
    },
    {
      id: 3,
      title: "Shorisha Ilish Curry",
      chef: "Tradition Eats",
      category: "Fish & Curry",
      portion: "2 Pieces",
      price: "420",
      image:
        "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=600",
    },
    {
      id: 4,
      title: "Hyderabadi Chicken Biryani",
      chef: "Mom's Magic Bowl",
      category: "Biriyani & Rice",
      portion: "1 Plate",
      price: "260",
      image:
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600",
    },
    {
      id: 5,
      title: "Special Chui Jhal Beef",
      chef: "Khulna Flavors",
      category: "Beef & Meat",
      portion: "250g Box",
      price: "380",
      image:
        "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600",
    },
  ];

  // Duplicate for seamless infinite scrolling
  const scrollingFoods = [...popularFoods, ...popularFoods];

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
              Discover delicious homemade meals prepared by trusted home
              chefs.
            </p>
          </div>

          <a
            href="#all-foods"
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

      {/* Horizontal Moving Cards */}
      <div className="w-full overflow-hidden">
        <div className="popular-food-track flex w-max gap-4">
          {scrollingFoods.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
                className="group relative h-[250px] w-[260px] shrink-0 cursor-pointer overflow-hidden rounded-2xl shadow-sm transition-shadow duration-300 hover:shadow-xl sm:h-[260px] sm:w-[280px]"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/85 via-black/30 to-black/15 p-4">
                {/* Top */}
                <div className="flex items-center justify-between">
                  {/* Category */}
                  <span className="inline-flex max-w-[190px] items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-slate-800 shadow-sm backdrop-blur-md">
                    <svg
                      className="h-3 w-3 shrink-0 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20 7l-8-4-8 4m16 0v10l-8 4-8-4V7m16 0l-8 4m0 0L4 7m8 4v10"
                      />
                    </svg>

                    {item.category}
                  </span>

                  {/* Arrow */}
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
                  <span className="block text-[10px] font-medium uppercase tracking-wider text-gray-300">
                    {item.chef}
                  </span>

                  <h3 className="mt-0.5 line-clamp-1 text-sm font-bold leading-snug text-white">
                    {item.title}
                  </h3>

                  <div className="mt-2 flex items-end justify-between border-t border-white/20 pt-2">
                    <div className="flex items-center gap-1 text-[11px] text-gray-300">
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
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>

                      <span>{item.portion}</span>
                    </div>

                    <div className="text-right">
                      <span className="block text-[8px] font-semibold uppercase tracking-wider text-gray-300">
                        FROM
                      </span>

                      <span className="text-sm font-extrabold leading-none text-white">
                        ৳{item.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right → Left Animation */}
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
