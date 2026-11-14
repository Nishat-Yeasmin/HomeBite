
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  FiHeart,
  FiSearch,
  FiTrash2,
  FiShoppingBag,
  FiArrowUpRight,
  FiRefreshCw,
  FiX,
  FiClock,
  FiTag,
  FiChevronRight,
  FiCoffee,
} from "react-icons/fi";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const reveal = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [removeId, setRemoveId] = useState(null);
  const [removing, setRemoving] = useState(false);
  const [toast, setToast] = useState("");

  // Load wishlist
  const loadWishlist = useCallback(async () => {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("homebite-token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("homebite-token");
        localStorage.removeItem("homebite-user");

        window.dispatchEvent(new Event("homebite-auth-changed"));
        window.location.href = "/login";
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not load wishlist");
      }

      setWishlist(data.wishlist || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  // Toast notification
  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  };

  // Categories
  const categories = useMemo(() => {
    const names = wishlist
      .map((item) => item.category_name)
      .filter(Boolean);

    return ["All", ...new Set(names)];
  }, [wishlist]);

  // Filter wishlist
  const filteredWishlist = useMemo(() => {
    return wishlist.filter((item) => {
      const searchValue = search.trim().toLowerCase();

      const matchesSearch =
        (item.name || "").toLowerCase().includes(searchValue) ||
        (item.description || "").toLowerCase().includes(searchValue) ||
        (item.category_name || "").toLowerCase().includes(searchValue);

      const matchesCategory =
        selectedCategory === "All" ||
        item.category_name === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [wishlist, search, selectedCategory]);

  // Remove wishlist item
  async function removeWishlistItem() {
    if (!removeId) return;

    setRemoving(true);

    try {
      const token = localStorage.getItem("homebite-token");

      const response = await fetch(
        `${API_URL}/api/wishlist/${removeId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not remove item");
      }

      setWishlist((prev) =>
        prev.filter((item) => Number(item.food_id) !== Number(removeId))
      );

      showToast("Removed from your wishlist");
      setRemoveId(null);
    } catch (err) {
      showToast(err.message || "Something went wrong");
    } finally {
      setRemoving(false);
    }
  }

  // Format price
  const money = (value) =>
    `৳${Number(value || 0).toLocaleString("en-BD")}`;

  // Format date
  const formatDate = (value) =>
    value
      ? new Date(value).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "Recently added";

  // Loading state
  if (loading) {
    return (
      <div className="mx-auto max-w-[1300px] px-5 py-12 sm:px-8">
        <div className="mb-8 h-10 w-64 animate-pulse rounded-xl bg-[#eadde5]" />

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-[26px] bg-white shadow-sm"
            >
              <div className="h-52 animate-pulse bg-[#f0e7ed]" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-2/3 animate-pulse rounded bg-[#f0e7ed]" />
                <div className="h-4 w-full animate-pulse rounded bg-[#f0e7ed]" />
                <div className="h-10 w-full animate-pulse rounded-xl bg-[#f0e7ed]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#f2e6ed] text-3xl text-[#70405d]">
          <FiHeart />
        </div>

        <h2 className="font-serif text-2xl font-bold italic text-[#392033]">
          Your wishlist is waiting
        </h2>

        <p className="mt-3 text-sm text-[#806d7a]">{error}</p>

        <button
          onClick={loadWishlist}
          className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#49283f] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-[#603b55]"
        >
          <FiRefreshCw /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1300px] px-5 pb-16 sm:px-8 lg:px-10">

      {/* Header */}
      <motion.section
        variants={reveal}
        initial="hidden"
        animate="visible"
        className="relative mb-9 overflow-hidden rounded-[30px] bg-gradient-to-br from-[#392033] via-[#58384f] to-[#79536c] px-6 py-9 text-white shadow-xl sm:px-9 sm:py-11"
      >
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-2 -top-8 h-48 w-48 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -bottom-24 right-36 h-48 w-48 rounded-full bg-[#d9a9bd]/10 blur-2xl" />

        <div className="relative z-10 flex flex-col justify-between gap-7 md:flex-row md:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[2px] text-[#f1d9e6]">
              <FiHeart className="text-[#e8b6ca]" />
              Your personal collection
            </div>

            <h1 className="font-serif text-4xl font-bold italic tracking-tight sm:text-5xl">
              My Wishlist
            </h1>

            <p className="mt-3 max-w-lg text-sm leading-7 text-[#eadce6] sm:text-base">
              A little collection of the homemade flavors you love.
              Keep your favorites close and enjoy them whenever you wish.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs text-white">
                <FiHeart className="text-[#efb7cf]" />
                <span>
                  <strong className="text-white">{wishlist.length}</strong>{" "}
                  saved favorites
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs text-white">
                <FiCoffee className="text-[#e8c99e]" />
                Made with love
              </div>
            </div>
          </div>

          <motion.div
            whileHover={{ rotate: 8, scale: 1.06 }}
            transition={{ type: "spring", stiffness: 220 }}
            className="hidden h-36 w-36 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-inner md:flex"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10">
              <FiHeart className="text-5xl text-[#f0c3d5]" />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Search and Category Filter */}
      <motion.section
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.15 }}
        className="mb-8 rounded-[24px] border border-[#eadde5] bg-white p-4 shadow-sm sm:p-5"
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9b8292]" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Find your favorite food..."
                className="w-full rounded-2xl border border-[#eadde5] bg-[#fcf8fb] py-3.5 pl-11 pr-4 text-sm text-[#392033] outline-none transition placeholder:text-[#ad9aaa] focus:border-[#9b6b8b] focus:ring-4 focus:ring-[#9b6b8b]/10"
              />
            </div>

            <button
              onClick={loadWishlist}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-[#eadde5] px-5 py-3 text-sm font-semibold text-[#70405d] transition hover:-translate-y-0.5 hover:border-[#9b6b8b] hover:bg-[#fcf8fb]"
            >
              <FiRefreshCw />
              Refresh
            </button>
          </div>

          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[2px] text-[#a28b9d]">
              Explore by category
            </p>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`cursor-pointer rounded-full px-4 py-2 text-xs font-semibold transition duration-200 hover:-translate-y-0.5 ${
                    selectedCategory === category
                      ? "bg-[#49283f] text-white shadow-md shadow-[#49283f]/15"
                      : "border border-[#eadde5] bg-white text-[#806d7a] hover:border-[#b78ba7] hover:bg-[#fcf8fb] hover:text-[#49283f]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Results heading */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-serif text-xl font-bold italic text-[#392033]">
            Your saved flavors
          </p>
          <p className="mt-1 text-xs text-[#927e8d]">
            {filteredWishlist.length}{" "}
            {filteredWishlist.length === 1 ? "item" : "items"} found
          </p>
        </div>

        {(search || selectedCategory !== "All") && (
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("All");
            }}
            className="cursor-pointer text-xs font-semibold text-[#95617e] transition hover:text-[#49283f]"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Wishlist Grid */}
      {filteredWishlist.length === 0 ? (
        <motion.div
          variants={reveal}
          initial="hidden"
          animate="visible"
          className="rounded-[30px] border border-dashed border-[#d9c5d3] bg-white px-5 py-16 text-center shadow-sm"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#f5eaf1] text-4xl text-[#895c78]"
          >
            <FiHeart />
          </motion.div>

          <h2 className="font-serif text-2xl font-bold italic text-[#392033]">
            {wishlist.length === 0
              ? "Your wishlist feels lonely"
              : "No favorites found"}
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#927e8d]">
            {wishlist.length === 0
              ? "You haven't saved any homemade treats yet. Explore our menu and keep the foods you love in one place."
              : "We couldn't find any food matching your search. Try another name or category."}
          </p>

          {wishlist.length === 0 ? (
            <Link
              href="/menu"
              className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#49283f] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#49283f]/15 transition hover:-translate-y-1 hover:bg-[#603b55]"
            >
              <FiShoppingBag />
              Explore Menu
              <FiArrowUpRight />
            </Link>
          ) : (
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
              className="mt-7 cursor-pointer rounded-xl bg-[#49283f] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-[#603b55]"
            >
              Show All Favorites
            </button>
          )}
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredWishlist.map((item, index) => {
              const isAvailable =
                item.is_available === 1 ||
                item.is_available === true ||
                item.is_available === "1";

              return (
                <motion.article
                  key={item.food_id}
                  layout
                  variants={reveal}
                  initial="hidden"
                  animate="visible"
                  exit={{
                    opacity: 0,
                    scale: 0.85,
                    y: 20,
                    transition: { duration: 0.25 },
                  }}
                  transition={{
                    layout: { duration: 0.35 },
                    delay: index * 0.06,
                  }}
                  whileHover={{
                    y: -8,
                    transition: { duration: 0.25 },
                  }}
                  className="group overflow-hidden rounded-[26px] border border-[#eadde5] bg-white shadow-[0_8px_30px_rgba(73,40,63,0.05)] transition-shadow duration-300 hover:shadow-[0_20px_45px_rgba(73,40,63,0.13)]"
                >
                  {/* Food Image */}
                  <div className="relative h-56 overflow-hidden bg-[#f2e8ef]">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name || "Homemade food"}
                        className={`h-full w-full object-cover transition duration-700 group-hover:scale-110 ${
                          !isAvailable ? "grayscale-[35%]" : ""
                        }`}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-5xl text-[#9b7890]">
                        <FiCoffee />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#24131f]/55 via-transparent to-transparent opacity-70" />

                    {/* Category */}
                    <div className="absolute left-4 top-4">
                      <span className="rounded-full border border-white/30 bg-white/90 px-3 py-1.5 text-[10px] font-bold tracking-wide text-[#58384f] shadow-sm backdrop-blur">
                        {item.category_name || "Homemade Food"}
                      </span>
                    </div>

                    {/* Remove icon */}
                    <button
                      onClick={() => setRemoveId(item.food_id)}
                      aria-label={`Remove ${item.name} from wishlist`}
                      className="absolute right-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/40 bg-white/90 text-[#9c5275] shadow-md backdrop-blur transition duration-300 hover:scale-110 hover:bg-[#9c5275] hover:text-white"
                    >
                      <FiHeart className="fill-current text-lg" />
                    </button>

                    {/* Availability */}
                    <div className="absolute bottom-4 left-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-[10px] font-bold shadow-sm ${
                          isAvailable
                            ? "bg-[#e5f5eb] text-[#32744b]"
                            : "bg-[#fff0ed] text-[#bd5145]"
                        }`}
                      >
                        {isAvailable ? "● Available now" : "● Currently unavailable"}
                      </span>
                    </div>
                  </div>

                  {/* Food Information */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-serif text-xl font-bold italic leading-snug text-[#392033] transition-colors group-hover:text-[#8b5577]">
                          {item.name}
                        </h3>

                        <p className="mt-2 line-clamp-2 min-h-[40px] text-xs leading-5 text-[#927e8d]">
                          {item.description || "A delicious homemade treat, prepared with care."}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-[#f0e6ed] pt-4">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[1.5px] text-[#ad99a8]">
                          Price
                        </p>
                        <p className="mt-1 font-serif text-2xl font-bold text-[#70405d]">
                          {money(item.price)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="flex items-center justify-end gap-1 text-[10px] text-[#a28b9d]">
                          <FiClock />
                          Saved
                        </p>
                        <p className="mt-1 text-xs font-medium text-[#806d7a]">
                          {formatDate(item.created_at)}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
                      <Link
                        href="/menu"
                        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#49283f] px-4 py-3 text-xs font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#603b55] hover:shadow-lg"
                      >
                        Explore Menu
                        <FiArrowUpRight />
                      </Link>

                      <button
                        onClick={() => setRemoveId(item.food_id)}
                        aria-label="Remove from wishlist"
                        className="flex h-11 w-12 cursor-pointer items-center justify-center rounded-xl border border-[#eadde5] text-[#a16d89] transition duration-300 hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Bottom note */}
      {wishlist.length > 0 && (
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          className="mt-10 flex flex-col items-center justify-between gap-3 rounded-2xl border border-[#eadde5] bg-[#fcf8fb] px-5 py-5 text-center sm:flex-row sm:text-left"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f1e3ec] text-lg text-[#895c78]">
              <FiHeart />
            </div>

            <div>
              <p className="font-serif text-sm font-bold italic text-[#49283f]">
                Made for your cravings
              </p>
              <p className="mt-1 text-xs text-[#927e8d]">
                Your saved favorites are always here when you need them.
              </p>
            </div>
          </div>

          <Link
            href="/menu"
            className="inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-[#895c78] transition hover:gap-3 hover:text-[#49283f]"
          >
            Discover more
            <FiChevronRight />
          </Link>
        </motion.div>
      )}

      {/* Remove Confirmation Modal */}
      <AnimatePresence>
        {removeId && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#24131f]/55 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !removing && setRemoveId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-[28px] border border-[#eadde5] bg-white p-6 shadow-2xl sm:p-7"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7eaf0] text-2xl text-[#a35d7d]">
                  <FiHeart />
                </div>

                <button
                  onClick={() => setRemoveId(null)}
                  disabled={removing}
                  className="cursor-pointer rounded-full p-2 text-[#927e8d] transition hover:bg-[#f5eaf1]"
                >
                  <FiX />
                </button>
              </div>

              <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#a47c95]">
                Wishlist update
              </p>

              <h3 className="mt-2 font-serif text-2xl font-bold italic text-[#392033]">
                Remove this favorite?
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#806d7a]">
                Are you sure you want to remove this food from your wishlist?
                You can always add it again from the menu.
              </p>

              <div className="mt-7 flex gap-3">
                <button
                  disabled={removing}
                  onClick={() => setRemoveId(null)}
                  className="flex-1 cursor-pointer rounded-xl border border-[#eadde5] px-4 py-3 text-sm font-semibold text-[#70405d] transition hover:bg-[#fcf8fb] disabled:opacity-50"
                >
                  Keep It
                </button>

                <button
                  disabled={removing}
                  onClick={removeWishlistItem}
                  className="flex-1 cursor-pointer rounded-xl bg-[#8e4567] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#71334f] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {removing ? "Removing..." : "Yes, Remove"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-5 z-[120] flex max-w-[calc(100%-40px)] items-center gap-3 rounded-2xl border border-white/10 bg-[#392033] px-5 py-3.5 text-sm font-medium text-white shadow-2xl"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 text-[#f0c3d5]">
              <FiHeart />
            </span>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
