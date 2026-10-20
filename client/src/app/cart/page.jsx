"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiMinus,
  FiPlus,
  FiTrash2,
  FiShoppingBag,
  FiArrowRight,
  FiTruck,
  FiShield,
  FiHeart,
} from "react-icons/fi";

import {
  getCart,
  updateCartQuantity,
  removeFromCart,
} from "../../lib/cart";

const DELIVERY_FEE = 60;

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCart(getCart());
    setMounted(true);

    const handleCartUpdate = () => {
      setCart(getCart());
    };

    window.addEventListener(
      "homebite-cart-updated",
      handleCartUpdate
    );

    return () => {
      window.removeEventListener(
        "homebite-cart-updated",
        handleCartUpdate
      );
    };
  }, []);

  const subtotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + Number(item.price) * item.quantity,
      0
    );
  }, [cart]);

  const deliveryFee = subtotal > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  const handleQuantityChange = (id, quantity) => {
    updateCartQuantity(id, quantity);
    setCart(getCart());
  };

  const handleRemove = (id) => {
    removeFromCart(id);
    setCart(getCart());
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#FFF8F3] pt-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="h-8 w-40 animate-pulse rounded-lg bg-[#F3E3DC]" />
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FFF8F3] pt-28 pb-20">

      {/* =========================================
          DECORATIVE BACKGROUND
      ========================================== */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-[#E8C6B8]/30 blur-3xl" />

        <div className="absolute -right-32 top-72 h-96 w-96 rounded-full bg-[#D9B98C]/20 blur-3xl" />

        <div className="absolute left-1/3 top-[45%] h-72 w-72 rounded-full bg-[#F0D9CE]/30 blur-3xl" />

      </div>

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">

        {/* =========================================
            HEADER
        ========================================== */}
        <div className="mb-10 animate-[fadeIn_0.7s_ease-out]">

          <Link
            href="/menu"
            className="group mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#7A625A] transition-all duration-300 hover:-translate-x-1 hover:text-[#2C0E05]"
          >
            <FiArrowLeft
              size={16}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            Continue Shopping
          </Link>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D8B7A9] bg-white/70 px-4 py-1.5 shadow-sm backdrop-blur-sm">
                <FiHeart
                  size={13}
                  className="text-[#B08A55]"
                />

                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A5A49]">
                  Your Selection
                </span>
              </div>

              <h1 className="font-serif text-4xl font-bold tracking-tight text-[#2C0E05] sm:text-5xl">
                Shopping{" "}
                <span className="bg-gradient-to-r from-[#7A3928] via-[#B08A55] to-[#D49C78] bg-clip-text text-transparent">
                  Cart
                </span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#806D66] sm:text-base">
                Your homemade favourites are waiting.
                Review your selection and get ready for
                something delicious.
              </p>
            </div>

            {cart.length > 0 && (
              <div className="w-fit rounded-2xl border border-[#E4CFC5] bg-white/80 px-5 py-3 shadow-[0_8px_30px_rgba(44,14,5,0.06)] backdrop-blur-md">
                <p className="text-xs uppercase tracking-wider text-[#9A847B]">
                  Selected Items
                </p>

                <p className="mt-1 text-lg font-bold text-[#2C0E05]">
                  {cart.reduce(
                    (total, item) =>
                      total + item.quantity,
                    0
                  )}{" "}
                  <span className="text-sm font-medium text-[#806D66]">
                    item(s)
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* GRADIENT LINE */}
          <div className="mt-8 h-[2px] w-full bg-gradient-to-r from-[#2C0E05] via-[#B08A55] to-transparent opacity-70" />
        </div>

        {/* =========================================
            EMPTY CART
        ========================================== */}
        {cart.length === 0 ? (
          <div className="relative overflow-hidden border border-[#E6D2C9] bg-gradient-to-br from-white via-[#FFF8F3] to-[#F3E3DC] px-6 py-20 text-center shadow-[0_20px_60px_rgba(44,14,5,0.08)] sm:px-10">

            {/* Decorative circles */}
            <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#D8B7A9]/20 blur-2xl" />
            <div className="absolute -bottom-24 -left-20 h-60 w-60 rounded-full bg-[#B08A55]/10 blur-3xl" />

            <div className="relative">

              <div className="mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-br from-[#F3E3DC] to-[#E4C2B5] shadow-[0_12px_30px_rgba(122,68,51,0.15)] animate-[float_3s_ease-in-out_infinite]">
                <FiShoppingBag
                  size={38}
                  className="text-[#7A4433]"
                />
              </div>

              <h2 className="font-serif text-3xl font-bold text-[#2C0E05]">
                Your cart is empty
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#806D66]">
                Looks like you haven't added anything
                yet. Explore our homemade menu and find
                something delicious.
              </p>

              <Link
                href="/menu"
                className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2C0E05] via-[#542517] to-[#7A4433] px-7 py-3.5 text-sm font-bold text-white shadow-[0_10px_25px_rgba(44,14,5,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(44,14,5,0.28)]"
              >
                Explore Menu

                <FiArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        ) : (

          /* =========================================
             CART CONTENT
          ========================================== */

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_390px]">

            {/* =======================================
                CART ITEMS
            ======================================== */}
            <section>

              <div className="overflow-hidden rounded-2xl border border-[#E5D0C7] bg-white/80 shadow-[0_15px_50px_rgba(44,14,5,0.07)] backdrop-blur-md">

                {/* SECTION HEADER */}
                <div className="relative overflow-hidden border-b border-[#EADBD3] bg-gradient-to-r from-[#FFF8F3] via-[#F8EAE4] to-[#F3E3DC] px-5 py-5 sm:px-6">

                  <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-[#D9B98C]/10 to-transparent" />

                  <div className="relative flex items-center justify-between">

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#B08A55]">
                        Freshly Selected
                      </p>

                      <h2 className="mt-1 font-serif text-xl font-bold text-[#2C0E05]">
                        Your Items
                      </h2>
                    </div>

                    <span className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#8A5A49] shadow-sm">
                      {cart.length} product
                      {cart.length !== 1 ? "s" : ""}
                    </span>

                  </div>
                </div>

                {/* ITEMS */}
                <div>
                  {cart.map((item, index) => (
                    <div
                      key={item.id}
                      className={`group px-4 py-6 transition-all duration-300 hover:bg-gradient-to-r hover:from-[#FFF8F3] hover:to-[#FDF2ED] sm:px-6 ${
                        index !== cart.length - 1
                          ? "border-b border-[#F0E4DE]"
                          : ""
                      }`}
                    >

                      <div className="flex gap-4">

                        {/* IMAGE */}
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#F3E3DC] shadow-sm sm:h-28 sm:w-28">

                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-[#2C0E05]/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                        </div>

                        {/* INFO */}
                        <div className="min-w-0 flex-1">

                          <div className="flex items-start justify-between gap-3">

                            <div>

                              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#B08A55]">
                                {item.category}
                              </p>

                              <h3 className="font-serif text-base font-bold text-[#2C0E05] transition-colors duration-300 group-hover:text-[#7A4433] sm:text-lg">
                                {item.name}
                              </h3>

                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                handleRemove(item.id)
                              }
                              className="shrink-0 rounded-lg p-2 text-[#A28E87] transition-all duration-300 hover:rotate-3 hover:bg-[#F9E5DF] hover:text-[#8A3F2E]"
                              aria-label={`Remove ${item.name}`}
                            >
                              <FiTrash2 size={17} />
                            </button>

                          </div>

                          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                            {/* QUANTITY */}
                            <div className="flex w-fit items-center overflow-hidden rounded-xl border border-[#DECAC1] bg-[#FFFDFC] shadow-sm">

                              <button
                                type="button"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                                disabled={item.quantity <= 1}
                                className="flex h-9 w-9 items-center justify-center text-[#5F4A43] transition-all duration-200 hover:bg-[#F4E5DE] disabled:cursor-not-allowed disabled:opacity-30"
                              >
                                <FiMinus size={14} />
                              </button>

                              <span className="flex h-9 min-w-10 items-center justify-center border-x border-[#DECAC1] bg-[#FFF8F3] text-sm font-bold text-[#2C0E05]">
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center text-[#5F4A43] transition-all duration-200 hover:bg-[#F4E5DE] hover:text-[#2C0E05]"
                              >
                                <FiPlus size={14} />
                              </button>

                            </div>

                            {/* PRICE */}
                            <div className="text-left sm:text-right">

                              <p className="text-xs text-[#9A847B]">
                                ৳{Number(item.price).toFixed(0)} ×{" "}
                                {item.quantity}
                              </p>

                              <p className="mt-1 bg-gradient-to-r from-[#2C0E05] to-[#8A4F3C] bg-clip-text text-lg font-bold text-transparent">
                                ৳
                                {(
                                  Number(item.price) *
                                  item.quantity
                                ).toFixed(0)}
                              </p>

                            </div>

                          </div>

                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* =====================================
                  TRUST INFO
              ====================================== */}
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">

                <div className="group flex items-center gap-3 rounded-xl border border-[#E6D2C9] bg-gradient-to-r from-[#FFF8F3] to-[#F4E5DE] px-4 py-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#DDB9A9] to-[#B08A55] text-white shadow-sm">
                    <FiTruck size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#2C0E05]">
                      Fresh Delivery
                    </p>

                    <p className="text-xs text-[#806D66]">
                      Carefully packed for you
                    </p>
                  </div>
                </div>

                <div className="group flex items-center gap-3 rounded-xl border border-[#E6D2C9] bg-gradient-to-r from-[#FFF8F3] to-[#F4E5DE] px-4 py-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#B08A55] to-[#7A4433] text-white shadow-sm">
                    <FiShield size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#2C0E05]">
                      Secure Checkout
                    </p>

                    <p className="text-xs text-[#806D66]">
                      Safe and simple ordering
                    </p>
                  </div>
                </div>

              </div>

            </section>

            {/* =======================================
                ORDER SUMMARY
            ======================================== */}
            <aside className="lg:sticky lg:top-28 lg:self-start">

              <div className="relative overflow-hidden rounded-2xl border border-[#5A3023]/20 bg-gradient-to-br from-[#2C0E05] via-[#492015] to-[#7A4433] text-white shadow-[0_20px_55px_rgba(44,14,5,0.22)]">

                {/* Decorative gradient */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#D9B98C]/20 blur-2xl" />

                <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-[#DFAF91]/10 blur-3xl" />

                {/* HEADER */}
                <div className="relative border-b border-white/10 px-6 py-6">

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D9B98C]">
                    Almost There
                  </p>

                  <h2 className="mt-1 font-serif text-2xl font-bold text-white">
                    Order Summary
                  </h2>

                  <p className="mt-2 text-xs leading-5 text-[#E8D6CF]">
                    A little homemade happiness is
                    just one step away.
                  </p>

                </div>

                {/* SUMMARY */}
                <div className="relative space-y-5 px-6 py-6">

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#E4CEC5]">
                      Subtotal
                    </span>

                    <span className="font-bold text-white">
                      ৳{subtotal.toFixed(0)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#E4CEC5]">
                      Delivery Fee
                    </span>

                    <span className="font-bold text-white">
                      ৳{deliveryFee.toFixed(0)}
                    </span>
                  </div>

                  <div className="border-t border-white/15 pt-5">

                    <div className="flex items-end justify-between">

                      <div>
                        <p className="font-semibold text-white">
                          Total
                        </p>

                        <p className="mt-1 text-xs text-[#CDB4AA]">
                          Including delivery
                        </p>
                      </div>

                      <p className="bg-gradient-to-r from-[#F1D7B4] via-[#E8C18D] to-[#F6E2C5] bg-clip-text text-3xl font-extrabold text-transparent">
                        ৳{total.toFixed(0)}
                      </p>

                    </div>
                  </div>

                  {/* CHECKOUT */}
                  <Link
                    href="/checkout"
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D7A36D] via-[#E1B986] to-[#EBCBA6] px-5 py-3.5 text-sm font-extrabold text-[#2C0E05] shadow-[0_8px_25px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.25)]"
                  >
                    Proceed to Checkout

                    <FiArrowRight
                      size={17}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>

                  {/* CONTINUE */}
                  <Link
                    href="/menu"
                    className="flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/10"
                  >
                    Continue Shopping
                  </Link>

                </div>

                {/* NOTE */}
                <div className="relative border-t border-white/10 bg-black/10 px-6 py-4">

                  <div className="flex gap-3">

                    <FiTruck
                      size={16}
                      className="mt-0.5 shrink-0 text-[#D9B98C]"
                    />

                    <p className="text-xs leading-5 text-[#D9C7BF]">
                      Delivery charge is currently fixed
                      at ৳60. This can be connected to
                      your delivery location later.
                    </p>

                  </div>

                </div>

              </div>
            </aside>

          </div>
        )}
      </div>

      {/* =========================================
          ANIMATION KEYFRAMES
      ========================================== */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-7px);
          }
        }
      `}</style>
    </main>
  );
}