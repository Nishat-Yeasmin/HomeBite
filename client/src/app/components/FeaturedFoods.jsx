
"use client";

import Link from "next/link";
import {
  FiArrowRight,
  FiHeart,
  FiShoppingCart,
  FiStar,
} from "react-icons/fi";

const foods = [
  {
    id: 1,
    name: "Chicken Biryani",
    description:
      "Aromatic basmati rice with tender chicken and flavorful homemade spices.",
    rating: "4.9",
    reviews: "128",
    price: "৳180",
    image:
      "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Chocolate Cake",
    description:
      "Rich, moist chocolate cake freshly baked with a delicious homemade touch.",
    rating: "5.0",
    reviews: "96",
    price: "৳450",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Bhapa Pitha",
    description:
      "Soft steamed rice cake filled with coconut and sweet date molasses.",
    rating: "4.8",
    reviews: "74",
    price: "৳60",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    name: "Chicken Samosa",
    description:
      "Crispy golden samosa filled with flavorful homemade chicken stuffing.",
    rating: "4.9",
    reviews: "83",
    price: "৳80",
    image:
      "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    name: "Mango Pickle",
    description:
      "Tangy raw mango blended with aromatic spices for a homemade taste.",
    rating: "4.9",
    reviews: "61",
    price: "৳150",
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    name: "Beef Tehari",
    description:
      "Tender beef cooked with fragrant rice and traditional homemade spices.",
    rating: "4.8",
    reviews: "105",
    price: "৳220",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80",
  },
];

// Duplicate for seamless infinite movement
const marqueeFoods = [...foods, ...foods];

export default function FeaturedFoods() {
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
          animation: featuredFoodMarquee 28s linear infinite;
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
            animation-duration: 25s;
          }
        }

        @media (max-width: 640px) {
          .featured-food-track {
            animation-duration: 22s;
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
          src={food.image}
          alt={food.name}
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
            {food.rating}
          </span>

          <span className="text-xs text-[#9B8178]">
            ({food.reviews})
          </span>
        </div>

        {/* Price + Cart */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="text-xl font-bold text-[#2C0E05]">
            {food.price}
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
