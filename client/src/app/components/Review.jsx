
"use client";

import React from "react";
import {
  FiArrowUpRight,
  FiCheckCircle,
  FiMapPin,
  FiStar,
  FiHeart,
} from "react-icons/fi";

const reviews = [
  {
    id: 1,
    name: "Sadia Rahman",
    role: "Regular Customer",
    location: "Sylhet",
    rating: 5,
    review:
      "The food tasted exactly like homemade food. The kacchi was fresh, flavorful and perfectly packed. HomeBite has become my favorite place for homemade meals.",
    initials: "SR",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300",
    order: "Shahi Mutton Kacchi",
  },
  {
    id: 2,
    name: "Nusrat Jahan",
    role: "Food Lover",
    location: "Dhaka",
    rating: 5,
    review:
      "I ordered biryani for my family and everyone loved it. The ordering process was simple and the food arrived warm. Really loved the homemade touch.",
    initials: "NJ",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300",
    order: "Chicken Biryani",
  },
  {
    id: 3,
    name: "Fahim Ahmed",
    role: "Happy Customer",
    location: "Chattogram",
    rating: 5,
    review:
      "What I liked most is the variety of homemade food. It feels different from regular restaurant food, especially the traditional dishes.",
    initials: "FA",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300",
    order: "Homemade Khichuri",
  },
];

const ReviewCard = ({ item, index }) => {
  return (
    <article
      className={`review-card group relative w-full overflow-hidden rounded-[28px] border border-[#ead9d2] bg-white p-5 shadow-[0_12px_40px_rgba(72,35,25,0.07)] transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_24px_55px_rgba(72,35,25,0.13)] sm:p-6 ${
        index === 1 ? "md:-translate-y-5" : ""
      }`}
    >
      {/* Decorative Circle */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#f8e5dd] opacity-70 transition-all duration-500 group-hover:scale-150 group-hover:opacity-100" />

      {/* Small Decorative Dot */}
      <div className="pointer-events-none absolute right-8 top-10 h-2 w-2 rounded-full bg-[#df8d6e] opacity-50" />

      {/* Big Quote */}
      <div className="pointer-events-none absolute right-5 top-4 font-serif text-[76px] leading-none text-[#f1dfd8] transition-colors duration-500 group-hover:text-[#e8c9bd]">
        “
      </div>

      {/* Customer */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            <div className="h-12 w-12 overflow-hidden rounded-full border-[3px] border-[#fff1eb] bg-[#f3e3dc] shadow-sm">
              <img
                src={item.avatar}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Verified */}
            <div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-[#df8d6e]">
              <FiCheckCircle className="h-2.5 w-2.5 text-white" />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#2c0e05]">
              {item.name}
            </h3>

            <p className="mt-0.5 text-[11px] text-[#92766d]">
              {item.role}
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="relative z-10 flex items-center gap-1 rounded-full border border-[#f0ddd5] bg-[#fff8f4] px-2.5 py-1.5">
          <FiStar className="h-3 w-3 fill-[#d88b68] text-[#d88b68]" />
          <span className="text-[11px] font-bold text-[#5b2a1e]">
            {item.rating}.0
          </span>
        </div>
      </div>

      {/* Review Text */}
      <div className="relative z-10 mt-6">
        <p className="text-[14px] leading-6 text-[#624a42]">
          {item.review}
        </p>
      </div>

      {/* Ordered Food */}
      <div className="relative z-10 mt-5 flex items-center gap-3 rounded-2xl bg-[#fff8f4] p-3 transition-colors duration-300 group-hover:bg-[#fff1eb]">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
          <FiHeart className="h-4 w-4 text-[#d5795b]" />
        </div>

        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-wider text-[#a17c70]">
            Loved this dish
          </p>

          <p className="mt-0.5 truncate text-xs font-bold text-[#4b2117]">
            {item.order}
          </p>
        </div>

        <FiArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-[#b97961] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
      </div>

      {/* Bottom Info */}
      <div className="relative z-10 mt-5 flex items-center justify-between border-t border-[#f0e5e0] pt-4">
        <div className="flex items-center gap-1.5 text-[11px] text-[#92766d]">
          <FiMapPin className="h-3.5 w-3.5 text-[#d98769]" />
          {item.location}
        </div>

        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <FiStar
              key={star}
              className="h-3 w-3 fill-[#d88b68] text-[#d88b68]"
            />
          ))}
        </div>
      </div>

      {/* Animated Bottom Border */}
      <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-[#df8d6e] via-[#b85f43] to-[#5b2a1e] transition-all duration-700 group-hover:w-full" />
    </article>
  );
};

const Review = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#fff8f3] py-16 sm:py-20 lg:py-24">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#f3d5ca]/40 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-[#efd0c3]/35 blur-3xl" />

      {/* Small Floating Dots */}
      <div className="pointer-events-none absolute left-[12%] top-24 h-2 w-2 animate-pulse rounded-full bg-[#df8d6e]" />
      <div className="pointer-events-none absolute right-[14%] top-36 h-1.5 w-1.5 animate-pulse rounded-full bg-[#b97861]" />

      {/* Header */}
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="text-center">
          {/* Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e8d2c9] bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#df8d6e] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#c96f52]" />
            </span>

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#795348]">
              Customer Stories
            </span>
          </div>

          {/* Heading */}
          <h2 className="mx-auto max-w-3xl text-3xl font-extrabold leading-tight text-[#2c0e05] sm:text-4xl lg:text-[46px]">
            Made with love.
            <br className="sm:hidden" />{" "}
            <span className="bg-gradient-to-r from-[#c66c4f] to-[#713324] bg-clip-text text-transparent">
              Loved by many.
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[#80655c] sm:text-[15px]">
            Every meal has a story. Here is what our customers have to say
            about their HomeBite experience.
          </p>
        </div>

        {/* Rating Summary */}
        <div className="mx-auto mt-7 flex w-fit items-center gap-4 rounded-full border border-[#eadbd5] bg-white/80 px-5 py-2.5 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-1">
            <FiStar className="h-4 w-4 fill-[#d88b68] text-[#d88b68]" />
            <span className="text-sm font-extrabold text-[#2c0e05]">
              4.9
            </span>
          </div>

          <div className="h-4 w-px bg-[#e6d7d1]" />

          <span className="text-[11px] font-medium text-[#80655c]">
            Loved by 1,200+ customers
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="relative z-10 mx-auto mt-12 max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-start lg:gap-7">
          {reviews.map((item, index) => (
            <ReviewCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>

      {/* Bottom Text */}
      <div className="relative z-10 mt-10 text-center">
        <p className="text-xs text-[#92766d]">
          Your experience could be our next favorite story.
        </p>
      </div>

      {/* Floating Animation */}
      <style jsx>{`
        .review-card {
          animation: floatingCard 5s ease-in-out infinite;
        }

        .review-card:nth-child(2) {
          animation-delay: -1.7s;
        }

        .review-card:nth-child(3) {
          animation-delay: -3.2s;
        }

        @keyframes floatingCard {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-5px);
          }
        }

        .review-card:hover {
          animation-play-state: paused;
        }

        @media (max-width: 767px) {
          .review-card {
            animation: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .review-card {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};

export default Review;
