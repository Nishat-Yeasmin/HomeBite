
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiArrowRight,
  FiHeart,
  FiShoppingCart,
  FiSearch,
  FiStar,
  FiCoffee,
} from "react-icons/fi";

import { addToCart } from "../../../lib/cart";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

// URL slug to database category ID
const categoryIds = {
  "cake-bakery": 1,
  pitha: 2,
  "biriyani-rice": 3,
  "fast-food": 4,
  snacks: 5,
  desserts: 6,
  "homemade-drinks": 7,
  "pickles-chutney": 8,
};

// Fallback banners
const fallbackBanners = {
  "cake-bakery":
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1600&q=85",
  pitha:
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1600&q=85",
  "biriyani-rice":
    "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1600&q=85",
  "fast-food":
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1600&q=85",
  snacks:
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1600&q=85",
  desserts:
    "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1600&q=85",
  "homemade-drinks":
    "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1600&q=85",
  "pickles-chutney":
    "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=1600&q=85",
};

export default function CategoryPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [wishlistBusy, setWishlistBusy] = useState(new Set());
  const [toast, setToast] = useState("");

  const categoryId = categoryIds[slug];

  const category = useMemo(
    () => categories.find((item) => Number(item.id) === categoryId),
    [categories, categoryId]
  );

  // Toast notification
  const showToast = useCallback((message) => {
    setToast(message);

    window.setTimeout(() => {
      setToast("");
    }, 2800);
  }, []);

  // Load categories and foods from database
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      setLoading(true);

      try {
        const [categoryResponse, foodResponse] = await Promise.all([
          fetch(`${API_URL}/api/categories`, { cache: "no-store" }),
          fetch(`${API_URL}/api/foods`, { cache: "no-store" }),
        ]);

        const categoryData = await categoryResponse.json();
        const foodData = await foodResponse.json();

        if (!categoryResponse.ok || !categoryData.success) {
          throw new Error("Failed to load categories");
        }

        if (!foodResponse.ok || !foodData.success) {
          throw new Error("Failed to load foods");
        }

        if (!mounted) return;

        setCategories(categoryData.categories || []);
        setFoods(foodData.foods || []);
      } catch (error) {
        console.error("Category page loading error:", error);

        if (mounted) {
          showToast(error.message || "Could not load menu");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [showToast]);

  // Load logged-in customer's wishlist
  const loadWishlist = useCallback(async () => {
    const token = localStorage.getItem("homebite-token");

    if (!token) {
      setWishlist([]);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const data = await response.json();

      if (response.status === 401) {
        setWishlist([]);
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not load wishlist");
      }

      setWishlist(
        (data.wishlist || []).map((item) => Number(item.food_id))
      );
    } catch (error) {
      console.error("Wishlist loading error:", error);
    }
  }, []);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  // Filter foods by category and search
  const categoryFoods = useMemo(() => {
    if (!categoryId) return [];

    return foods.filter(
      (food) => Number(food.category_id) === categoryId
    );
  }, [foods, categoryId]);

  const filteredFoods = useMemo(() => {
    return categoryFoods.filter((food) =>
      (food.name || "")
        .toLowerCase()
        .includes(search.trim().toLowerCase())
    );
  }, [categoryFoods, search]);

  // Add or remove wishlist item
  const toggleWishlist = async (food) => {
    const foodId = Number(food.id);

    if (wishlistBusy.has(foodId)) return;

    const token = localStorage.getItem("homebite-token");

    if (!token) {
      showToast("Please login to save your favorite foods");
      router.push("/login");
      return;
    }

    setWishlistBusy((prev) => new Set(prev).add(foodId));

    const isSaved = wishlist.includes(foodId);

    try {
      const response = await fetch(
        isSaved
          ? `${API_URL}/api/wishlist/${foodId}`
          : `${API_URL}/api/wishlist`,
        {
          method: isSaved ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          ...(isSaved
            ? {}
            : {
                body: JSON.stringify({
                  food_id: foodId,
                }),
              }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        showToast("Your session expired. Please login again.");
        router.push("/login");
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Wishlist update failed");
      }

      setWishlist((prev) =>
        isSaved
          ? prev.filter((id) => id !== foodId)
          : [...prev, foodId]
      );

      showToast(
        isSaved
          ? "Removed from your wishlist"
          : "Added to your wishlist ❤️"
      );
    } catch (error) {
      console.error("Wishlist update error:", error);
      showToast(error.message || "Something went wrong");
    } finally {
      setWishlistBusy((prev) => {
        const updated = new Set(prev);
        updated.delete(foodId);
        return updated;
      });
    }
  };

  // Add food to cart using the real database food ID
  const handleAddToCart = (food) => {
    if (
      Number(food.is_available) !== 1 &&
      food.is_available !== true
    ) {
      showToast("This food is currently unavailable");
      return;
    }

    addToCart({
      id: food.id,
      name: food.name,
      price: Number(food.price),
      image: food.image_url || "",
      category: category?.name || "Homemade Food",
    });

    showToast(`${food.name} added to cart`);
  };

  const money = (value) =>
    `৳${Number(value || 0).toLocaleString("en-BD")}`;

  // Invalid slug
  if (!categoryId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFF8F3] px-6">
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

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-[#FFF8F3] px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="h-[350px] animate-pulse rounded-[28px] bg-[#EADBD5]" />

          <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-[28px] bg-white shadow-sm"
              >
                <div className="h-[245px] animate-pulse bg-[#EADBD5]" />
                <div className="space-y-3 p-6">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-[#EADBD5]" />
                  <div className="h-4 w-full animate-pulse rounded bg-[#F3E3DC]" />
                  <div className="h-10 w-full animate-pulse rounded bg-[#F3E3DC]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!category) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFF8F3] px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#2C0E05]">
            Category Not Found
          </h1>

          <Link
            href="/menu"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#2C0E05] px-6 py-3 text-white"
          >
            <FiArrowLeft />
            Back to Menu
          </Link>
        </div>
      </main>
    );
  }

  const banner =
    category.image_url || fallbackBanners[slug];

  return (
    <main className="min-h-screen bg-[#FFF8F3] text-[#2C0E05]">
      {/* ================= HERO ================= */}
      <section className="relative h-[420px] overflow-hidden">
        {banner && (
          <img
            src={banner}
            alt={category.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-12 sm:px-10 lg:px-16">
          <div className="mb-5 flex items-center gap-2 text-sm text-white/80">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>

            <span>/</span>

            <Link href="/menu" className="transition hover:text-white">
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
            {category.description ||
              "Discover delicious homemade food prepared with care."}
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
              {categoryFoods.length} homemade{" "}
              {categoryFoods.length === 1 ? "item" : "items"} available
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
              const isWishlisted = wishlist.includes(Number(food.id));

              const isAvailable =
                Number(food.is_available) === 1 ||
                food.is_available === true;

              const isBusy = wishlistBusy.has(Number(food.id));

              return (
                <article
                  key={food.id}
                  className="group overflow-hidden rounded-[28px] border border-[#EADBD5] bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  {/* Image */}
                  <div className="relative h-[245px] overflow-hidden bg-[#F3E3DC]">
                    {food.image_url ? (
                      <img
                        src={food.image_url}
                        alt={food.name}
                        className={`h-full w-full object-cover transition duration-700 group-hover:scale-110 ${
                          !isAvailable ? "grayscale-[35%]" : ""
                        }`}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-5xl text-[#B96F52]">
                        <FiCoffee />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-70" />

                    {/* Wishlist */}
                    <button
                      type="button"
                      onClick={() => toggleWishlist(food)}
                      disabled={isBusy}
                      aria-label={
                        isWishlisted
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                      className={`absolute right-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 disabled:cursor-wait disabled:opacity-60 ${
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

                    {/* Availability */}
                    <div className="absolute bottom-4 left-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-[10px] font-bold ${
                          isAvailable
                            ? "bg-white/90 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {isAvailable
                          ? "● Available"
                          : "● Currently unavailable"}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-xl font-bold transition-colors duration-300 group-hover:text-[#B76E54]">
                        {food.name}
                      </h3>

                      <span className="whitespace-nowrap text-lg font-bold text-[#B76E54]">
                        {money(food.price)}
                      </span>
                    </div>

                    <p className="mt-3 min-h-[48px] text-sm leading-6 text-gray-500">
                      {food.description ||
                        "A delicious homemade treat, prepared with care."}
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="flex items-center gap-1 text-xs text-[#B18A55]">
                        <FiStar fill="currentColor" />
                        Homemade
                      </span>

                      <button
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => handleAddToCart(food)}
                        className="group/btn inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#2C0E05] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#5A2D1F] hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:shadow-none"
                      >
                        <FiShoppingCart size={15} />

                        {isAvailable ? "Add to Cart" : "Unavailable"}

                        {isAvailable && (
                          <FiArrowRight
                            size={14}
                            className="transition-transform duration-300 group-hover/btn:translate-x-1"
                          />
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[28px] border border-[#EADBD5] bg-white px-6 py-20 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F3E3DC] text-2xl text-[#B96F52]">
              <FiSearch />
            </div>

            <h3 className="text-2xl font-bold text-[#2C0E05]">
              {search ? "No food found" : "No food available yet"}
            </h3>

            <p className="mt-2 text-gray-500">
              {search
                ? "Try searching with a different food name."
                : "We're preparing delicious homemade foods for this category."}
            </p>
          </div>
        )}

        {/* ================= BACK BUTTON ================= */}
        <div className="mt-14 text-center">
          <Link
            href="/menu"
            className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#D8BEB4] bg-white px-6 py-3 text-sm font-semibold text-[#2C0E05] transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A66B] hover:shadow-lg"
          >
            <FiArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
            Back to All Categories
          </Link>
        </div>
      </section>

      {/* ================= TOAST ================= */}
      {toast && (
        <div className="fixed bottom-6 right-5 z-[120] flex max-w-[calc(100%-40px)] items-center gap-3 rounded-2xl bg-[#2C0E05] px-5 py-3.5 text-sm font-medium text-white shadow-2xl">
          <FiHeart className="shrink-0 text-[#E3B99E]" />
          {toast}
        </div>
      )}
    </main>
  );
}
