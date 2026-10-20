
"use client";

import Link from "next/link";
import {
  FiArrowRight,
  FiClock,
  FiShoppingBag,
  FiTag,
  FiPercent,
} from "react-icons/fi";

const offers = [
  {
    id: 1,
    name: "Chicken Biryani",
    oldPrice: "৳220",
    price: "৳180",
    discount: "18% OFF",
    image:
      "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    name: "Chocolate Cake",
    oldPrice: "৳450",
    price: "৳360",
    discount: "20% OFF",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    name: "Bhapa Pitha",
    oldPrice: "৳80",
    price: "৳60",
    discount: "25% OFF",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    name: "Chicken Samosa",
    oldPrice: "৳100",
    price: "৳80",
    discount: "20% OFF",
    image:
      "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 5,
    name: "Beef Tehari",
    oldPrice: "৳270",
    price: "৳220",
    discount: "18% OFF",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 6,
    name: "Mango Pickle",
    oldPrice: "৳190",
    price: "৳150",
    discount: "21% OFF",
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=85",
  },
];

export default function SpecialOffers() {
  return (
    <section className="relative w-full overflow-hidden bg-[#FFF8F3] sm:pb-16 lg:pb-16">

      {/* SOFT BACKGROUND GLOWS */}
      <div className="pointer-events-none absolute -left-40 top-[-120px] h-[500px] w-[500px] rounded-full bg-[#E7B8A8]/15 blur-[140px]" />

      <div className="pointer-events-none absolute -right-40 bottom-[-160px] h-[550px] w-[550px] rounded-full bg-[#D9A08F]/15 blur-[150px]" />

      <div className="pointer-events-none absolute right-[18%] top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-[#D6A84F]/5 blur-[120px]" />

      {/* DECORATIVE DOTS */}
      <div className="pointer-events-none absolute left-[6%] top-[18%] h-2 w-2 rounded-full bg-[#A85F4B]/25" />

      <div className="pointer-events-none absolute left-[12%] bottom-[15%] h-3 w-3 rounded-full bg-[#D6A84F]/30" />

      <div className="pointer-events-none absolute right-[8%] top-[18%] h-3 w-3 rounded-full bg-[#A85F4B]/20" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 xl:px-20">

        {/* TWO COLUMN */}
        <div className="grid items-center gap-12 lg:grid-cols-[42%_58%] xl:gap-6">

          {/* ================= LEFT CONTEXT ================= */}
          <div className="relative z-20">

            {/* BADGE */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#A85F4B]/20 bg-[#A85F4B]/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#8F4F3E]">
              <FiPercent size={13} />
              Special Offers
            </div>

            {/* HEADING */}
            <h2 className="max-w-xl text-4xl font-black leading-[1.08] tracking-tight text-[#3B211B] sm:text-5xl lg:text-[52px] xl:text-[58px]">
              A Little{" "}
              <span className="bg-gradient-to-r from-[#D6A84F] via-[#B87932] to-[#542719] bg-clip-text font-serif font-medium italic text-transparent">
                Extra Happiness.
              </span>
            </h2>

            {/* DESCRIPTION */}
            <p className="mt-6 max-w-md text-sm leading-6 text-[#765C54] sm:text-[15px]">
              Delicious homemade favorites at special prices, for a limited
              time.
            </p>

            {/* TIMER + BUTTON */}
            <div className="mt-8 flex max-w-md items-center justify-between gap-5">

              {/* LIMITED TIME */}
              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#A85F4B]/15 bg-white text-[#A85F4B] shadow-sm">
                  <FiClock size={19} />
                </div>

                <div>
                  <p className="text-sm font-bold text-[#3B211B]">
                    Limited time only
                  </p>

                  <p className="mt-0.5 text-xs text-[#8A7169]">
                    Deals won't stay forever.
                  </p>
                </div>

              </div>

              {/* BUTTON */}
              <Link
                href="/offers"
                className="group inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-[#D6A84F] via-[#B87932] to-[#542719] px-5 py-3 text-sm font-bold text-white shadow-[0_10px_30px_rgba(84,39,25,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(84,39,25,0.28)]"
              >
                View Offers

                <FiArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

            </div>
          </div>

          {/* ================= RIGHT CARDS ================= */}
          <div className="relative mx-auto h-[500px] w-full max-w-[650px]">

            {/* SUBTLE BACK CIRCLE */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#A85F4B]/10" />

            {/* CENTER DECORATION */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#A85F4B]/[0.025]" />

            {/* CARDS */}
            <div className="absolute inset-0">

              {offers.map((offer, index) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  index={index}
                />
              ))}

            </div>

            {/* CENTER BADGE */}
            <div className="absolute left-1/2 top-1/2 z-20 flex h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-[#A85F4B]/20 bg-[#FFF8F3]/95 text-center shadow-[0_20px_60px_rgba(88,45,35,0.12)] backdrop-blur-md sm:h-[135px] sm:w-[135px]">

              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8A7169]">
                Save More
              </span>

              <span className="mt-1 bg-gradient-to-r from-[#D6A84F] via-[#B87932] to-[#542719] bg-clip-text text-3xl font-black text-transparent">
                25%
              </span>

              <span className="mt-1 text-[9px] text-[#8A7169]">
                on selected foods
              </span>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function OfferCard({ offer, index }) {
  const positions = [
    "left-[31%] top-[1%]",
    "right-[2%] top-[18%]",
    "right-[3%] bottom-[5%]",
    "left-[31%] bottom-[0%]",
    "left-[3%] bottom-[12%]",
    "left-[2%] top-[18%]",
  ];

  const rotations = [
    "-4deg",
    "5deg",
    "3deg",
    "-3deg",
    "5deg",
    "-5deg",
  ];

  return (
    <article
      className={`offer-card absolute ${positions[index]} h-[185px] w-[235px] cursor-pointer rounded-[24px] border border-white bg-white p-2 shadow-[0_18px_50px_rgba(74,43,34,0.15)]`}
      style={{
        transform: `rotate(${rotations[index]})`,
      }}
    >
      <div className="relative h-full overflow-hidden rounded-[18px]">

        {/* IMAGE */}
        <img
          src={offer.image}
          alt={offer.name}
          className="offer-image h-full w-full object-cover"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#3B211B]/90 via-[#3B211B]/20 to-transparent" />

        {/* DISCOUNT */}
        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-[#F3D18A] to-[#D6A84F] px-2.5 py-1 text-[9px] font-black text-[#3B211B] shadow-sm">
          <FiTag size={10} />
          {offer.discount}
        </div>

        {/* INFO */}
        <div className="absolute bottom-3 left-3 right-3">

          <h3 className="text-base font-black text-white">
            {offer.name}
          </h3>

          <div className="mt-1 flex items-center gap-2">

            <span className="bg-gradient-to-r from-[#F3D18A] to-[#D6A84F] bg-clip-text text-lg font-black text-transparent">
              {offer.price}
            </span>

            <span className="text-[10px] text-white/65 line-through">
              {offer.oldPrice}
            </span>

          </div>
        </div>

        {/* CART */}
        <button
          type="button"
          aria-label={`Add ${offer.name} to cart`}
          className="absolute bottom-3 right-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-[#3B211B] shadow-lg transition-all duration-300 hover:scale-110 hover:bg-[#F3C7B7] hover:shadow-xl active:scale-95"
        >
          <FiShoppingBag size={15} />
        </button>
      </div>
    </article>
  );
}
