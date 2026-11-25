
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiArrowRight,
  FiClock,
  FiShoppingBag,
  FiTag,
  FiPercent,
  FiRefreshCw,
  FiGift,
  FiCalendar,
  FiHeart,
} from "react-icons/fi";
import { addToCart } from "../../lib/cart";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/offers`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Failed to load offers.");
      }

      setOffers(
        Array.isArray(data) ? data : data.offers || []
      );
    } catch (err) {
      console.error("Offers fetch error:", err);
      setError(err.message || "Unable to load offers.");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message) => {
    setToast(message);

    window.clearTimeout(window.offerToastTimer);

    window.offerToastTimer = window.setTimeout(() => {
      setToast("");
    }, 2600);
  };

  // Add discounted food to the existing cart
  const handleAddToCart = (offer) => {
    addToCart({
      id: offer.food_id,
      name: offer.name,
      price: Number(offer.discount_price),
      image: offer.image_url || "",
      category: offer.category_name || "Special Offer",
    });

    showToast(`${offer.name} added to your cart!`);
  };

  const money = (value) =>
    `৳${Number(value || 0).toLocaleString("en-BD")}`;

  const formatDate = (date) => {
    if (!date) return null;

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return null;

    return parsed.toLocaleDateString("en-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#FFF8F3] text-[#3B211B]">

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#321711]">

        <div className="pointer-events-none absolute -left-32 -top-40 h-[500px] w-[500px] rounded-full bg-[#B87932]/20 blur-[150px]" />
        <div className="pointer-events-none absolute -right-24 top-10 h-[500px] w-[500px] rounded-full bg-[#A85F4B]/20 blur-[150px]" />
        <div className="pointer-events-none absolute bottom-[-180px] left-[40%] h-[400px] w-[400px] rounded-full bg-[#D6A84F]/10 blur-[130px]" />

        <div className="pointer-events-none absolute right-[8%] top-[12%] h-3 w-3 rounded-full bg-[#D6A84F]/60" />
        <div className="pointer-events-none absolute left-[12%] top-[30%] h-2 w-2 rounded-full bg-[#F3D18A]/50" />
        <div className="pointer-events-none absolute bottom-[18%] right-[22%] h-2 w-2 rounded-full bg-[#D6A84F]/50" />

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-10 sm:pb-20 lg:px-16">

          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-xs font-semibold text-white/80 backdrop-blur-md transition hover:border-[#D6A84F]/50 hover:text-[#F3D18A]"
          >
            <FiArrowLeft className="transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>

          <div className="mx-auto mt-12 max-w-3xl text-center">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D6A84F]/30 bg-[#D6A84F]/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#F3D18A]">
              <FiPercent size={13} />
              Special Offers
            </div>

            <h1 className="text-4xl font-black leading-[1.12] tracking-tight text-white sm:text-5xl md:text-6xl">
              A Little{" "}
              <span className="bg-gradient-to-r from-[#F3D18A] via-[#D6A84F] to-[#B87932] bg-clip-text font-serif font-medium italic text-transparent">
                Extra Happiness.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
              Delicious homemade favorites at special prices.
              A little extra love, a little more happiness in every bite.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-white/65">
              <div className="flex items-center gap-2">
                <FiClock className="text-[#F3D18A]" size={16} />
                Limited time deals
              </div>

              <div className="flex items-center gap-2">
                <FiHeart className="text-[#F3D18A]" size={16} />
                Homemade with love
              </div>

              <div className="flex items-center gap-2">
                <FiTag className="text-[#F3D18A]" size={16} />
                Special prices
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute -bottom-24 left-1/2 h-48 w-[80%] -translate-x-1/2 rounded-[50%] border border-[#D6A84F]/10" />
        </div>
      </section>

      {/* OFFERS */}
      <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-10 lg:px-16">

        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.23em] text-[#A85F4B]">
              <span className="h-[1px] w-7 bg-[#D6A84F]" />
              Fresh Deals For You
            </div>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Today's{" "}
              <span className="font-serif font-medium italic text-[#B87932]">
                Special Picks.
              </span>
            </h2>

            <p className="mt-3 text-sm text-[#8A7169]">
              Enjoy your favorites without spending extra.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchOffers}
            disabled={loading}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-[#A85F4B]/20 bg-white px-4 py-2.5 text-xs font-bold text-[#765C54] shadow-sm transition hover:-translate-y-1 hover:border-[#D6A84F] hover:text-[#A85F4B] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            Refresh Offers
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-[390px] animate-pulse rounded-[26px] bg-[#F0E3DB]"
              />
            ))}
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="rounded-[25px] border border-red-200 bg-white p-10 text-center">
            <p className="font-bold text-[#3B211B]">
              Couldn't load offers
            </p>

            <p className="mt-2 text-sm text-[#8A7169]">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchOffers}
              className="mt-5 cursor-pointer rounded-full bg-[#542719] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#3B211B]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && offers.length === 0 && (
          <div className="relative overflow-hidden rounded-[28px] border border-[#A85F4B]/10 bg-white px-6 py-16 text-center shadow-[0_15px_45px_rgba(74,43,34,0.06)]">

            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#D6A84F]/10 blur-3xl" />

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[25px] bg-[#FFF1DC] text-[#B87932]">
              <FiGift size={34} />
            </div>

            <h3 className="mt-6 text-2xl font-black">
              Something Delicious Is Coming!
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#8A7169]">
              There are no active offers at the moment.
              Our kitchen is preparing more delicious deals for you.
              Please check again soon!
            </p>
          </div>
        )}

        {/* OFFER CARDS */}
        {!loading && !error && offers.length > 0 && (
          <>
            <div className="mb-7 flex items-center gap-2 text-xs font-semibold text-[#8A7169]">
              <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-[#F0DFD5] px-2 text-[#8F4F3E]">
                {offers.length}
              </span>
              special deals waiting for you
            </div>

            <div className="grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {offers.map((offer, index) => {
                const name = offer.name;
                const original = Number(offer.original_price);
                const price = Number(offer.discount_price);
                const discount = Number(offer.discount_percentage);
                const image = offer.image_url;
                const expiry = formatDate(offer.end_date);

                return (
                  <article
                    key={offer.offer_id}
                    style={{ animationDelay: `${index * 100}ms` }}
                    className="offer-enter group relative rounded-[27px] border border-[#A85F4B]/10 bg-white p-3 shadow-[0_14px_40px_rgba(74,43,34,0.08)] transition-all duration-500 hover:-translate-y-3 hover:border-[#D6A84F]/50 hover:shadow-[0_25px_55px_rgba(74,43,34,0.16)]"
                  >

                    {/* IMAGE */}
                    <div className="relative h-[245px] overflow-hidden rounded-[21px] bg-[#F0E3DB]">

                      {image ? (
                        <img
                          src={image}
                          alt={name}
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[#B87932]">
                          <FiGift size={45} />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-[#321711]/75 via-transparent to-[#321711]/10" />

                      {/* DISCOUNT BADGE */}
                      <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-[#F3D18A]/50 bg-gradient-to-r from-[#F3D18A] to-[#D6A84F] px-3.5 py-2 text-[11px] font-black text-[#3B211B] shadow-lg transition-transform duration-300 group-hover:scale-105">
                        <FiTag size={13} />
                        {discount > 0 ? `${discount}% OFF` : "SPECIAL OFFER"}
                      </div>

                      {/* NAME */}
                      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#F3D18A]">
                            Homemade Goodness
                          </p>

                          <h3 className="mt-1 text-xl font-black text-white drop-shadow-md">
                            {name}
                          </h3>
                        </div>

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-md transition-all duration-300 group-hover:rotate-12 group-hover:bg-[#D6A84F] group-hover:text-[#3B211B]">
                          <FiHeart size={17} />
                        </div>
                      </div>
                    </div>

                    {/* PRICE */}
                    <div className="px-2 pb-2 pt-5">

                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#A18B82]">
                            Special price
                          </p>

                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-[27px] font-black tracking-tight text-[#542719]">
                              {money(price)}
                            </span>

                            {original > price && (
                              <span className="text-sm text-[#A18B82] line-through">
                                {money(original)}
                              </span>
                            )}
                          </div>
                        </div>

                        {original > price && (
                          <div className="rounded-xl bg-[#F7F0E5] px-3 py-2 text-right">
                            <p className="text-[9px] font-bold uppercase tracking-wider text-[#9A8178]">
                              You save
                            </p>

                            <p className="mt-0.5 text-sm font-black text-[#A85F4B]">
                              {money(original - price)}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* DETAILS */}
                      <div className="mt-4 flex items-center justify-between gap-2 border-t border-dashed border-[#EADBD2] pt-4">
                        <div className="flex items-center gap-2 text-[11px] text-[#8A7169]">
                          <FiCalendar className="shrink-0 text-[#B87932]" />
                          {expiry ? `Until ${expiry}` : "Limited time only"}
                        </div>

                        <span className="text-right text-[10px] font-semibold text-[#A85F4B]">
                          {offer.category_name || "Special Pick"}
                        </span>
                      </div>

                      {/* ADD TO CART */}
                      <button
                        type="button"
                        onClick={() => handleAddToCart(offer)}
                        className="group/button mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D6A84F] via-[#B87932] to-[#542719] px-5 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(84,39,25,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(84,39,25,0.25)] active:scale-[0.98]"
                      >
                        <FiShoppingBag size={16} />
                        Add to Cart

                        <FiArrowRight className="transition-transform duration-300 group-hover/button:translate-x-1" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[100] w-[calc(100%-32px)] max-w-sm -translate-x-1/2 animate-[toastIn_0.3s_ease-out]">
          <div className="flex items-center gap-3 rounded-2xl border border-[#D6A84F]/30 bg-[#321711] px-5 py-4 text-sm font-semibold text-white shadow-2xl">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D6A84F] text-[#321711]">
              <FiShoppingBag size={16} />
            </span>
            {toast}
          </div>
        </div>
      )}

      <style jsx>{`
        .offer-enter {
          opacity: 0;
          animation: offerAppear 0.7s ease forwards;
        }

        @keyframes offerAppear {
          from {
            opacity: 0;
            transform: translateY(28px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes toastIn {
          from {
            opacity: 0;
            transform: translate(-50%, 12px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .offer-enter {
            opacity: 1;
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}
