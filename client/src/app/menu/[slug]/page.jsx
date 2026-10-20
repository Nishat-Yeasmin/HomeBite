"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  FiArrowLeft,
  FiArrowRight,
  FiHeart,
  FiShoppingCart,
  FiStar,
  FiSearch,
} from "react-icons/fi";
import { useState } from "react";
import { addToCart } from "../../../lib/cart";

const categoryData = {
  "cake-bakery": {
    name: "Cake & Bakery",
    description:
      "Freshly baked homemade cakes, pastries and bakery treats made with love.",
    banner:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1600&q=85",

    foods: [
      {
        id: 1,
        name: "Chocolate Cake",
        description: "Rich and moist homemade chocolate cake.",
        price: 450,
        rating: 4.9,
        reviews: 32,
        image:
          "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 2,
        name: "Red Velvet Cake",
        description: "Soft red velvet cake with creamy frosting.",
        price: 550,
        rating: 4.8,
        reviews: 27,
        image:
          "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 3,
        name: "Vanilla Cake",
        description: "Light and fluffy homemade vanilla cake.",
        price: 400,
        rating: 4.7,
        reviews: 21,
        image:
          "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 4,
        name: "Chocolate Cupcake",
        description: "Soft chocolate cupcake with creamy topping.",
        price: 120,
        rating: 4.8,
        reviews: 18,
        image:
          "https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y3VwY2FrZXxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        id: 5,
        name: "Butter Cookies",
        description: "Crispy and buttery homemade cookies.",
        price: 180,
        rating: 4.6,
        reviews: 15,
        image:
          "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 6,
        name: "Strawberry Pastry",
        description: "Fresh strawberry pastry with soft cream.",
        price: 160,
        rating: 4.7,
        reviews: 19,
        image:
          "https://images.unsplash.com/photo-1702742322469-36315505728f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHBhc3RyaWVzfGVufDB8fDB8fHww",
      },
    ],
  },

  pitha: {
    name: "Pitha",
    description:
      "Traditional homemade Bangladeshi pitha prepared with authentic flavors.",
    banner:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1600&q=85",

    foods: [
      {
        id: 1,
        name: "Bhapa Pitha",
        description: "Traditional steamed rice cake with coconut and jaggery.",
        price: 80,
        rating: 4.9,
        reviews: 25,
        image:
          "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 2,
        name: "Chitoi Pitha",
        description: "Soft homemade chitoi pitha served fresh.",
        price: 70,
        rating: 4.8,
        reviews: 19,
        image:
          "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 3,
        name: "Patishapta",
        description: "Sweet rice crepe filled with coconut and milk.",
        price: 120,
        rating: 4.9,
        reviews: 31,
        image:
          "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },

  "biriyani-rice": {
    name: "Biriyani & Rice",
    description:
      "Flavorful homemade biriyani and delicious rice dishes prepared fresh.",
    banner:
      "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmlyeWFuaXxlbnwwfHwwfHx8MA%3D%3D",

    foods: [
      {
        id: 1,
        name: "Chicken Biryani",
        description: "Aromatic basmati rice with tender chicken and spices.",
        price: 220,
        rating: 4.9,
        reviews: 45,
        image:
          "https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 2,
        name: "Beef Biryani",
        description: "Rich homemade beef biryani with aromatic spices.",
        price: 280,
        rating: 4.8,
        reviews: 36,
        image:
          "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 3,
        name: "Chicken Tehari",
        description: "Traditional flavorful rice cooked with chicken.",
        price: 200,
        rating: 4.7,
        reviews: 29,
        image:
          "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },

  "fast-food": {
    name: "Fast Food",
    description:
      "Homemade burgers, sandwiches and other delicious fast-food favorites.",
    banner:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1600&q=85",

    foods: [
      {
        id: 1,
        name: "Chicken Burger",
        description: "Juicy chicken patty with fresh vegetables and sauce.",
        price: 180,
        rating: 4.8,
        reviews: 34,
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 2,
        name: "Chicken Sandwich",
        description: "Fresh homemade sandwich with crispy chicken.",
        price: 150,
        rating: 4.7,
        reviews: 24,
        image:
          "https://media.istockphoto.com/id/183377755/photo/sandwich-selection.webp?a=1&b=1&s=612x612&w=0&k=20&c=idnoW3EGgOyPr-qsbMsnmcvC3vtVWNWa_OW95YY2OM0=",
      },
      {
        id: 3,
        name: "French Fries",
        description: "Crispy golden fries served fresh.",
        price: 100,
        rating: 4.6,
        reviews: 20,
        image:
          "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },

  snacks: {
    name: "Snacks",
    description:
      "Tasty homemade snacks perfect for evening tea or quick bites.",
    banner:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1600&q=85",

    foods: [
      {
        id: 1,
        name: "Chicken Samosa",
        description: "Crispy samosa filled with spicy chicken.",
        price: 40,
        rating: 4.8,
        reviews: 28,
        image:
          "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 2,
        name: "Vegetable Roll",
        description: "Crispy roll filled with fresh vegetables.",
        price: 50,
        rating: 4.7,
        reviews: 17,
        image:
          "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 3,
        name: "Chicken Spring Roll",
        description: "Crunchy homemade spring roll with chicken filling.",
        price: 60,
        rating: 4.8,
        reviews: 22,
        image:
          "https://images.unsplash.com/photo-1548507200-7a9b8b2c5e5a?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },

  desserts: {
    name: "Desserts",
    description:
      "Sweet homemade desserts prepared fresh for every occasion.",
    banner:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1600&q=85",

    foods: [
      {
        id: 1,
        name: "Chocolate Brownie",
        description: "Rich, fudgy and freshly baked chocolate brownie.",
        price: 140,
        rating: 4.9,
        reviews: 30,
        image:
          "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 2,
        name: "Caramel Pudding",
        description: "Smooth homemade pudding with caramel topping.",
        price: 120,
        rating: 4.8,
        reviews: 26,
        image:
          "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 3,
        name: "Fruit Custard",
        description: "Creamy custard loaded with fresh seasonal fruits.",
        price: 150,
        rating: 4.7,
        reviews: 18,
        image:
          "https://images.unsplash.com/photo-1488477304112-4944851de03d?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },

  "homemade-drinks": {
    name: "Homemade Drinks",
    description:
      "Refreshing homemade drinks made with fresh and natural ingredients.",
    banner:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1600&q=85",

    foods: [
      {
        id: 1,
        name: "Fresh Lemonade",
        description: "Refreshing lemonade made with fresh lemons.",
        price: 80,
        rating: 4.8,
        reviews: 22,
        image:
          "https://images.unsplash.com/photo-1523677011781-c91d1bbe2f8d?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 2,
        name: "Mango Juice",
        description: "Fresh homemade mango juice with ripe mangoes.",
        price: 100,
        rating: 4.9,
        reviews: 35,
        image:
          "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 3,
        name: "Mint Lemon Drink",
        description: "Cool and refreshing mint lemon drink.",
        price: 90,
        rating: 4.7,
        reviews: 19,
        image:
          "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },

  "pickles-chutney": {
    name: "Pickles & Chutney",
    description:
      "Traditional homemade pickles and chutneys packed with authentic flavors.",
    banner:
      "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=1600&q=85",

    foods: [
      {
        id: 1,
        name: "Mango Pickle",
        description: "Spicy and tangy homemade raw mango pickle.",
        price: 180,
        rating: 4.9,
        reviews: 25,
        image:
          "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 2,
        name: "Date Chutney",
        description: "Sweet and tangy chutney made from dates.",
        price: 150,
        rating: 4.8,
        reviews: 21,
        image:
          "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 3,
        name: "Green Chili Pickle",
        description: "Spicy homemade green chili pickle.",
        price: 130,
        rating: 4.7,
        reviews: 16,
        image:
          "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
};

export default function CategoryPage() {
  const { slug } = useParams();

  const [search, setSearch] = useState("");
  const [wishlist, setWishlist] = useState([]);

  const category = categoryData[slug];

  if (!category) {
    return (
      <main className="min-h-screen bg-[#FFF8F3] flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#2C0E05]">
            Category Not Found
          </h1>

          <p className="mt-3 text-gray-600">
            Sorry, we couldn't find this food category.
          </p>

          <Link
            href="/menu"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#2C0E05] px-6 py-3 text-white transition hover:-translate-y-1"
          >
            <FiArrowLeft />
            Back to Menu
          </Link>
        </div>
      </main>
    );
  }

  const filteredFoods = category.foods.filter((food) =>
    food.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  return (
    <main className="min-h-screen bg-[#FFF8F3] text-[#2C0E05]">
      {/* ================= HERO ================= */}
      <section className="relative h-[420px] overflow-hidden">
        <img
          src={category.banner}
          alt={category.name}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-12 sm:px-10 lg:px-16">
          {/* Breadcrumb */}
          <div className="mb-5 flex items-center gap-2 text-sm text-white/80">
            <Link
              href="/"
              className="transition hover:text-white"
            >
              Home
            </Link>

            <span>/</span>

            <Link
              href="/menu"
              className="transition hover:text-white"
            >
              Menu
            </Link>

            <span>/</span>

            <span className="text-white">{category.name}</span>
          </div>

          <span className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#F3CFC8]">
            Homemade • Fresh • Delicious
          </span>

          <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            {category.name}
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/85 sm:text-base">
            {category.description}
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="mx-auto max-w-7xl px-6 py-14 sm:px-10 lg:px-16">
        {/* Top Row */}
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#C18A72]">
              Our Selection
            </p>

            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
              Delicious {category.name}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {category.foods.length} homemade items available
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-[300px]">
            <FiSearch
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder={`Search ${category.name}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-[#E8D5CE] bg-white py-3 pl-11 pr-5 text-sm outline-none transition focus:border-[#C9A66B] focus:ring-2 focus:ring-[#C9A66B]/20"
            />
          </div>
        </div>

        {/* ================= FOOD GRID ================= */}
        {filteredFoods.length > 0 ? (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filteredFoods.map((food) => {
              const isWishlisted = wishlist.includes(food.id);

              return (
                <article
                  key={food.id}
                  className="group overflow-hidden rounded-[28px] border border-[#EADBD5] bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  {/* Image */}
                  <div className="relative h-[245px] overflow-hidden">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-70" />

                    {/* Wishlist */}
                    <button
                      onClick={() => toggleWishlist(food.id)}
                      className={`absolute right-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 ${
                        isWishlisted
                          ? "bg-white text-red-500"
                          : "bg-white/85 text-[#2C0E05] hover:bg-white hover:text-red-500"
                      }`}
                    >
                      <FiHeart
                        size={18}
                        fill={isWishlisted ? "currentColor" : "none"}
                      />
                    </button>

                    {/* Rating */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold backdrop-blur-md">
                      <FiStar
                        size={13}
                        className="text-[#C9A66B]"
                        fill="currentColor"
                      />
                      {food.rating}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-xl font-bold transition-colors duration-300 group-hover:text-[#B76E54]">
                        {food.name}
                      </h3>

                      <span className="whitespace-nowrap text-lg font-bold text-[#B76E54]">
                        ৳{food.price}
                      </span>
                    </div>

                    <p className="mt-3 min-h-[48px] text-sm leading-6 text-gray-500">
                      {food.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {food.reviews} reviews
                      </span>

                      <button
  type="button"
  onClick={() => {
    addToCart({
      id: `${slug}-${food.id}`,
      name: food.name,
      price: food.price,
      image: food.image,
      category: category.name,
    });
  }}
  className="group/btn inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#2C0E05] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#5A2D1F] hover:shadow-lg"
>
  <FiShoppingCart size={15} />

  Add to Cart

  <FiArrowRight
    size={14}
    className="transition-transform duration-300 group-hover/btn:translate-x-1"
  />
</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[28px] border border-[#EADBD5] bg-white px-6 py-20 text-center">
            <h3 className="text-2xl font-bold text-[#2C0E05]">
              No food found
            </h3>

            <p className="mt-2 text-gray-500">
              Try searching with a different food name.
            </p>
          </div>
        )}

        {/* ================= BACK BUTTON ================= */}
        <div className="mt-14 text-center">
          <Link
            href="/menu"
            className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#D8BEB4] bg-white px-6 py-3 text-sm font-semibold text-[#2C0E05] transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A66B] hover:shadow-lg"
          >
            <FiArrowLeft
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />

            Back to All Categories
          </Link>
        </div>
      </section>
    </main>
  );
}