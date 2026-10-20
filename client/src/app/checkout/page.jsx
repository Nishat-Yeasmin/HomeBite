"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiCreditCard,
  FiMapPin,
  FiPhone,
  FiUser,
  FiShield,
  FiTruck,
  FiShoppingBag,
  FiLock,
} from "react-icons/fi";
import { getCart } from "../../lib/cart";

const DELIVERY_FEE = 60;

const paymentMethods = [
  {
    id: "bkash",
    name: "bKash",
    description: "Pay securely with bKash",
    icon: "/payment-icon/bkash.png",
    gradient: "from-[#C2185B] to-[#E91E63]",
    softBg: "bg-[#FCE4EC]",
  },
  {
    id: "nagad",
    name: "Nagad",
    description: "Pay securely with Nagad",
    icon: "/payment-icon/nagad.png",
    gradient: "from-[#E65100] to-[#FF9800]",
    softBg: "bg-[#FFF3E0]",
  },
  {
    id: "rocket",
    name: "Rocket",
    description: "Pay using Rocket",
    icon: "/payment-icon/rocket.png",
    gradient: "from-[#512DA8] to-[#7E57C2]",
    softBg: "bg-[#EDE7F6]",
  },
  {
    id: "card",
    name: "Card Payment",
    description: "Visa / Mastercard",
    icon: "/payment-icon/visa.png",
    gradient: "from-[#2C0E05] to-[#8A4F3C]",
    softBg: "bg-[#F3E3DC]",
  },
  {
    id: "cod",
    name: "Cash on Delivery",
    description: "Pay when your food arrives",
    icon: "৳",
    gradient: "from-[#8A6A35] to-[#C9A66B]",
    softBg: "bg-[#FBF3E3]",
  },
];
export default function CheckoutPage() {
  const [cart] = useState(() => getCart());
  const [paymentMethod, setPaymentMethod] = useState("bkash");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    area: "",
    note: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const subtotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + Number(item.price) * item.quantity,
      0
    );
  }, [cart]);

  const deliveryFee = subtotal > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  const selectedPayment = paymentMethods.find(
    (method) => method.id === paymentMethod
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Frontend demo only.
    // Later this will connect with backend + payment gateway.
    setSubmitted(true);
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-[#FFF8F3] pt-32 pb-20">
        <div className="mx-auto max-w-3xl px-5 text-center">

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-[#F3E3DC] to-[#DDB9A9] shadow-lg">
            <FiShoppingBag
              size={38}
              className="text-[#7A4433]"
            />
          </div>

          <h1 className="mt-7 font-serif text-3xl font-bold text-[#2C0E05]">
            Your cart is empty
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#806D66]">
            Add some homemade favourites before
            proceeding to checkout.
          </p>

          <Link
            href="/menu"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2C0E05] to-[#7A4433] px-7 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            Explore Menu
            <FiArrowRight size={16} />
          </Link>

        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#FFF8F3] pt-32 pb-20">

        <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-[#DDB9A9]/30 blur-3xl" />

        <div className="pointer-events-none absolute -right-32 top-40 h-96 w-96 rounded-full bg-[#D9B98C]/20 blur-3xl" />

        <div className="relative mx-auto max-w-2xl px-5">

          <div className="overflow-hidden rounded-3xl border border-[#E2CFC5] bg-gradient-to-br from-white via-[#FFF8F3] to-[#F3E3DC] p-8 text-center shadow-[0_25px_70px_rgba(44,14,5,0.12)] sm:p-12">

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#B08A55] to-[#D9B98C] shadow-[0_12px_35px_rgba(176,138,85,0.3)]">

              <FiCheck
                size={42}
                className="text-white"
              />

            </div>

            <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-[#B08A55]">
              Order Ready
            </p>

            <h1 className="mt-2 font-serif text-3xl font-bold text-[#2C0E05] sm:text-4xl">
              Your Order Has Been Placed
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#806D66]">
              Thank you for choosing HomeBite.
              Your homemade goodness is on its way.
            </p>

            <div className="mx-auto mt-7 max-w-sm rounded-2xl border border-[#E6D2C9] bg-white/70 p-5 text-left">

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#806D66]">
                  Payment
                </span>

                <span className="font-semibold capitalize text-[#2C0E05]">
                  {selectedPayment.name}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-[#EADBD3] pt-3">
                <span className="text-sm text-[#806D66]">
                  Total
                </span>

                <span className="text-xl font-bold text-[#2C0E05]">
                  ৳{total.toFixed(0)}
                </span>
              </div>

            </div>

            <Link
              href="/"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2C0E05] via-[#542517] to-[#8A4F3C] px-7 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              Back to Home
              <FiArrowRight size={16} />
            </Link>

          </div>

        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FFF8F3] pt-28 pb-20">

      {/* =========================================
          BACKGROUND DECORATION
      ========================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-[#DDB9A9]/25 blur-3xl" />

        <div className="absolute -right-40 top-40 h-[450px] w-[450px] rounded-full bg-[#D9B98C]/20 blur-3xl" />

        <div className="absolute left-1/3 top-[55%] h-72 w-72 rounded-full bg-[#F0D9CE]/30 blur-3xl" />

      </div>

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">

        {/* =========================================
            HEADER
        ========================================== */}

        <div className="mb-10">

          <Link
            href="/cart"
            className="group mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#7A625A] transition-all duration-300 hover:-translate-x-1 hover:text-[#2C0E05]"
          >
            <FiArrowLeft
              size={16}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            Back to Cart
          </Link>

          <div className="flex flex-col gap-3">

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#D9BFAF] bg-white/70 px-4 py-1.5 shadow-sm backdrop-blur-md">

              <FiLock
                size={12}
                className="text-[#B08A55]"
              />

              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A5A49]">
                Secure Checkout
              </span>

            </div>

            <h1 className="font-serif text-4xl font-bold text-[#2C0E05] sm:text-5xl">

              Complete Your{" "}

              <span className="bg-gradient-to-r from-[#7A3928] via-[#B08A55] to-[#D49C78] bg-clip-text text-transparent">
                Order
              </span>

            </h1>

            <p className="max-w-xl text-sm leading-6 text-[#806D66] sm:text-base">
              Tell us where to deliver your homemade
              favourites and choose your preferred
              payment method.
            </p>

          </div>

          <div className="mt-8 h-[2px] w-full bg-gradient-to-r from-[#2C0E05] via-[#B08A55] to-transparent" />

        </div>

        <form onSubmit={handleSubmit}>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_390px]">

            {/* =======================================
                LEFT SIDE
            ======================================== */}

            <div className="space-y-7">

              {/* DELIVERY INFORMATION */}

              <section className="overflow-hidden rounded-2xl border border-[#E4D0C6] bg-white/80 shadow-[0_15px_45px_rgba(44,14,5,0.06)] backdrop-blur-md">

                <div className="border-b border-[#EADBD3] bg-gradient-to-r from-[#FFF8F3] via-[#F7E9E3] to-[#F3E3DC] px-6 py-5">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#2C0E05] to-[#7A4433] text-white shadow-md">
                      <FiMapPin size={19} />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#B08A55]">
                        Step 01
                      </p>

                      <h2 className="font-serif text-xl font-bold text-[#2C0E05]">
                        Delivery Information
                      </h2>
                    </div>

                  </div>

                </div>

                <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">

                  {/* NAME */}

                  <div className="sm:col-span-2">

                    <label className="mb-2 block text-sm font-semibold text-[#4C3932]">
                      Full Name
                    </label>

                    <div className="relative">

                      <FiUser
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A38A80]"
                      />

                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                        className="w-full rounded-xl border border-[#DECAC1] bg-[#FFFDFC] py-3.5 pl-11 pr-4 text-sm text-[#2C0E05] outline-none transition-all duration-300 placeholder:text-[#B4A39C] focus:border-[#B08A55] focus:bg-[#FFF8F3] focus:ring-4 focus:ring-[#B08A55]/10"
                      />

                    </div>

                  </div>

                  {/* PHONE */}

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-[#4C3932]">
                      Phone Number
                    </label>

                    <div className="relative">

                      <FiPhone
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A38A80]"
                      />

                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        placeholder="01XXXXXXXXX"
                        className="w-full rounded-xl border border-[#DECAC1] bg-[#FFFDFC] py-3.5 pl-11 pr-4 text-sm text-[#2C0E05] outline-none transition-all duration-300 placeholder:text-[#B4A39C] focus:border-[#B08A55] focus:bg-[#FFF8F3] focus:ring-4 focus:ring-[#B08A55]/10"
                      />

                    </div>

                  </div>

                  {/* AREA */}

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-[#4C3932]">
                      Area / City
                    </label>

                    <input
                      type="text"
                      name="area"
                      value={form.area}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Sylhet"
                      className="w-full rounded-xl border border-[#DECAC1] bg-[#FFFDFC] px-4 py-3.5 text-sm text-[#2C0E05] outline-none transition-all duration-300 placeholder:text-[#B4A39C] focus:border-[#B08A55] focus:bg-[#FFF8F3] focus:ring-4 focus:ring-[#B08A55]/10"
                    />

                  </div>

                  {/* ADDRESS */}

                  <div className="sm:col-span-2">

                    <label className="mb-2 block text-sm font-semibold text-[#4C3932]">
                      Delivery Address
                    </label>

                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                      rows={3}
                      placeholder="House, road, area and other delivery details"
                      className="w-full resize-none rounded-xl border border-[#DECAC1] bg-[#FFFDFC] px-4 py-3.5 text-sm text-[#2C0E05] outline-none transition-all duration-300 placeholder:text-[#B4A39C] focus:border-[#B08A55] focus:bg-[#FFF8F3] focus:ring-4 focus:ring-[#B08A55]/10"
                    />

                  </div>

                  {/* NOTE */}

                  <div className="sm:col-span-2">

                    <label className="mb-2 block text-sm font-semibold text-[#4C3932]">
                      Delivery Note{" "}
                      <span className="font-normal text-[#A38A80]">
                        (Optional)
                      </span>
                    </label>

                    <textarea
                      name="note"
                      value={form.note}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Any special instruction for delivery?"
                      className="w-full resize-none rounded-xl border border-[#DECAC1] bg-[#FFFDFC] px-4 py-3.5 text-sm text-[#2C0E05] outline-none transition-all duration-300 placeholder:text-[#B4A39C] focus:border-[#B08A55] focus:bg-[#FFF8F3] focus:ring-4 focus:ring-[#B08A55]/10"
                    />

                  </div>

                </div>

              </section>

              {/* =====================================
                  PAYMENT METHOD
              ====================================== */}

              <section className="overflow-hidden rounded-2xl border border-[#E4D0C6] bg-white/80 shadow-[0_15px_45px_rgba(44,14,5,0.06)] backdrop-blur-md">

                <div className="border-b border-[#EADBD3] bg-gradient-to-r from-[#FFF8F3] via-[#F7E9E3] to-[#F3E3DC] px-6 py-5">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#B08A55] to-[#D5B47A] text-white shadow-md">
                      <FiCreditCard size={19} />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#B08A55]">
                        Step 02
                      </p>

                      <h2 className="font-serif text-xl font-bold text-[#2C0E05]">
                        Payment Method
                      </h2>
                    </div>

                  </div>

                </div>

                <div className="p-6">

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                    {paymentMethods.map((method) => {
                      const selected =
                        paymentMethod === method.id;

                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() =>
                            setPaymentMethod(method.id)
                          }
                          className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 ${
                            selected
                              ? "border-[#B08A55] bg-gradient-to-br from-[#FFF8F3] via-[#F7E7DF] to-[#F0D9C9] shadow-[0_10px_30px_rgba(176,138,85,0.16)]"
                              : "border-[#E5D3CB] bg-white hover:-translate-y-1 hover:border-[#C9A66B] hover:bg-[#FFF9F6] hover:shadow-md"
                          }`}
                        >

                          {/* SELECTED GRADIENT */}
                          {selected && (
                            <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-gradient-to-bl from-[#D9B98C]/30 to-transparent" />
                          )}

                          <div className="relative flex items-center gap-4">

                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-sm">
  {method.id === "cod" ? (
    <span className="text-xl font-bold text-[#8A6A35]">
      {method.icon}
    </span>
  ) : (
    <img
      src={method.icon}
      alt={method.name}
      className="h-10 w-10 object-contain"
    />
  )}
</div>

                            <div className="min-w-0 flex-1">

                              <p className="font-bold text-[#2C0E05]">
                                {method.name}
                              </p>

                              <p className="mt-1 text-xs text-[#806D66]">
                                {method.description}
                              </p>

                            </div>

                            <div
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                                selected
                                  ? "border-[#B08A55] bg-[#B08A55]"
                                  : "border-[#CDBAB1] bg-white"
                              }`}
                            >
                              {selected && (
                                <FiCheck
                                  size={12}
                                  className="text-white"
                                />
                              )}
                            </div>

                          </div>

                        </button>
                      );
                    })}

                  </div>

                  {/* PAYMENT DETAILS */}

                  <div className="mt-5 rounded-2xl border border-[#E6D3CA] bg-gradient-to-r from-[#FBF3EE] to-[#F8EDE7] p-5">

                    <div className="flex gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#B08A55] shadow-sm">
                        <FiShield size={17} />
                      </div>

                      <div>

                        <p className="text-sm font-bold text-[#2C0E05]">
                          {selectedPayment.name}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#806D66]">
                          {paymentMethod === "cod"
                            ? "You can pay the delivery person when your order arrives."
                            : `You will be able to complete your ${selectedPayment.name} payment securely after placing the order.`}
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              </section>

            </div>

            {/* =======================================
                RIGHT SIDE - ORDER SUMMARY
            ======================================== */}

            <aside className="lg:sticky lg:top-28 lg:self-start">

              <div className="relative overflow-hidden rounded-3xl border border-[#5A3023]/20 bg-gradient-to-br from-[#2C0E05] via-[#4A2014] to-[#7B4735] text-white shadow-[0_25px_65px_rgba(44,14,5,0.24)]">

                {/* DECORATIVE GRADIENTS */}

                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#D9B98C]/20 blur-3xl" />

                <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[#DFAF91]/10 blur-3xl" />

                {/* SUMMARY HEADER */}

                <div className="relative border-b border-white/10 px-6 py-6">

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D9B98C]">
                    Your Order
                  </p>

                  <h2 className="mt-1 font-serif text-2xl font-bold">
                    Order Summary
                  </h2>

                </div>

                {/* PRODUCTS */}

                <div className="relative max-h-72 space-y-4 overflow-y-auto px-6 py-5">

                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3"
                    >

                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/10">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-semibold text-white">
                          {item.name}
                        </p>

                        <p className="mt-1 text-xs text-[#CDB4AA]">
                          {item.quantity} × ৳
                          {Number(item.price).toFixed(0)}
                        </p>

                      </div>

                      <p className="font-bold text-[#F0D5AD]">
                        ৳
                        {(
                          Number(item.price) *
                          item.quantity
                        ).toFixed(0)}
                      </p>

                    </div>
                  ))}

                </div>

                {/* PRICE */}

                <div className="relative border-t border-white/10 px-6 py-5">

                  <div className="flex items-center justify-between text-sm">

                    <span className="text-[#D9C7BF]">
                      Subtotal
                    </span>

                    <span className="font-semibold">
                      ৳{subtotal.toFixed(0)}
                    </span>

                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm">

                    <span className="text-[#D9C7BF]">
                      Delivery Fee
                    </span>

                    <span className="font-semibold">
                      ৳{deliveryFee.toFixed(0)}
                    </span>

                  </div>

                  <div className="mt-5 border-t border-white/15 pt-5">

                    <div className="flex items-end justify-between">

                      <div>
                        <p className="font-semibold">
                          Total
                        </p>

                        <p className="mt-1 text-xs text-[#BFAAA1]">
                          Including delivery
                        </p>
                      </div>

                      <p className="bg-gradient-to-r from-[#F1D7B4] via-[#E8C18D] to-[#F6E2C5] bg-clip-text text-3xl font-extrabold text-transparent">
                        ৳{total.toFixed(0)}
                      </p>

                    </div>

                  </div>

                </div>

                {/* PLACE ORDER */}

                <div className="relative px-6 pb-6">

                  <button
                    type="submit"
                    className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D7A36D] via-[#E2BB89] to-[#EBCDAA] px-5 py-4 text-sm font-extrabold text-[#2C0E05] shadow-[0_10px_30px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(0,0,0,0.3)]"
                  >
                    {paymentMethod === "cod"
                      ? "Place Order"
                      : `Pay ৳${total.toFixed(0)}`}

                    <FiArrowRight
                      size={17}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </button>

                  <div className="mt-4 flex items-center justify-center gap-2 text-center text-[11px] text-[#CDB4AA]">

                    <FiLock size={12} />

                    <span>
                      Secure & protected checkout
                    </span>

                  </div>

                </div>

              </div>

              {/* DELIVERY CARD */}

              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#E4D0C6] bg-gradient-to-r from-[#FFF8F3] to-[#F3E3DC] px-4 py-4 shadow-sm">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#B08A55] to-[#D7B579] text-white">
                  <FiTruck size={18} />
                </div>

                <div>

                  <p className="text-sm font-bold text-[#2C0E05]">
                    Fresh Delivery
                  </p>

                  <p className="text-xs text-[#806D66]">
                    Carefully packed & delivered
                  </p>

                </div>

              </div>

            </aside>

          </div>

        </form>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </main>
  );
}