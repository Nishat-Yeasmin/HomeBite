"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Sidebar from "@/app/components/admin/Sidebar";
import {
  FiMenu,
  FiSearch,
  FiBell,
  FiChevronDown,
  FiChevronRight,
  FiRefreshCw,
  FiPlus,
  FiArrowUpRight,
  FiArrowDownRight,
  FiCoffee,
  FiGrid,
  FiCheckCircle,
  FiPackage,
  FiEye,
  FiShoppingCart,
  FiTrendingUp,
  FiAlertCircle,
  FiX,
} from "react-icons/fi";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

function extractArray(payload, keys = []) {
  if (Array.isArray(payload)) return payload;
  for (const key of keys) {
    if (Array.isArray(payload?.[key])) return payload[key];
  }
  return [];
}

function money(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "৳0";
  return `৳${amount.toLocaleString("en-BD", { maximumFractionDigits: 2 })}`;
}

function getFoodName(food) {
  return food?.name || food?.food_name || food?.title || food?.foodName || "Untitled food";
}

function getFoodCategory(food) {
  const category = food?.category_name || food?.categoryName || food?.category;
  if (typeof category === "string") return category;
  return category?.name || category?.category_name || "Uncategorized";
}

function getFoodPrice(food) {
  return food?.price ?? food?.food_price ?? food?.selling_price ?? 0;
}

function getFoodId(food, index) {
  return food?.id ?? food?.food_id ?? food?.foodId ?? index + 1;
}

function getFoodImage(food) {
  return food?.image_url || food?.image || food?.imageUrl || food?.photo || "";
}

function getAvailable(food) {
  const value = food?.is_available ?? food?.available ?? food?.availability ?? food?.status;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    return ["available", "active", "true", "1", "in stock"].includes(value.toLowerCase());
  }
  return true;
}

function StatCard({ title, value, subtitle, icon: Icon, tone = "amber", trend, down = false }) {
  const tones = {
    amber: "border-[#F0E2D0] bg-gradient-to-br from-[#FFF9F0] to-[#FFF4E6] text-[#8B4A25]",
    green: "border-[#D9EEE0] bg-gradient-to-br from-[#F3FBF5] to-[#EAF7EE] text-[#177245]",
    coral: "border-[#F5E1D9] bg-gradient-to-br from-[#FFF6F1] to-[#FFF0E8] text-[#A34D2A]",
    cream: "border-[#F0E5D8] bg-gradient-to-br from-[#FFFCF7] to-[#FFF5E8] text-[#77401F]",
  };
  const iconTones = {
    amber: "bg-[#F9E4CB] text-[#8B4A25]",
    green: "bg-[#D2F0DC] text-[#167044]",
    coral: "bg-[#FBD9CC] text-[#A34D2A]",
    cream: "bg-[#F5E1C2] text-[#77401F]",
  };

  return (
    <div className={`rounded-2xl border p-4 shadow-sm shadow-[#4B2410]/[0.03] sm:p-5 ${tones[tone]}`}>
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-full ${iconTones[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span className={`mt-1 flex items-center gap-1 text-[11px] font-bold ${down ? "text-red-600" : "text-emerald-700"}`}>
            {down ? <FiArrowDownRight /> : <FiArrowUpRight />} {trend}
          </span>
        )}
      </div>
      <p className="mt-4 text-sm text-[#756B66]">{title}</p>
      <p className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#2B1710]">{value}</p>
      <p className="mt-2 text-xs text-[#897A71]">{subtitle}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAllFoods, setShowAllFoods] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);

  const loadDashboard = useCallback(async (quiet = false) => {
    if (quiet) setRefreshing(true);
    else setLoading(true);
    setError("");

    const results = await Promise.allSettled([
      fetch(`${API_URL}/api/foods`, { cache: "no-store" }).then(async (res) => {
        if (!res.ok) throw new Error(`Foods API returned ${res.status}`);
        return res.json();
      }),
      fetch(`${API_URL}/api/categories`, { cache: "no-store" }).then(async (res) => {
        if (!res.ok) throw new Error(`Categories API returned ${res.status}`);
        return res.json();
      }),
    ]);

    if (results[0].status === "fulfilled") {
      setFoods(extractArray(results[0].value, ["foods", "data", "results"]));
    } else {
      setFoods([]);
      setError("Food data could not be loaded. Check that your backend is running and GET /api/foods is available.");
    }

    if (results[1].status === "fulfilled") {
      setCategories(extractArray(results[1].value, ["categories", "data", "results"]));
    } else {
      setCategories([]);
    }

    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const availableFoods = useMemo(() => foods.filter(getAvailable), [foods]);
  const unavailableFoods = useMemo(() => foods.filter((food) => !getAvailable(food)), [foods]);

  const filteredFoods = useMemo(() => {
    const query = search.trim().toLowerCase();
    return foods.filter((food) => {
      const matchesSearch =
        !query ||
        getFoodName(food).toLowerCase().includes(query) ||
        getFoodCategory(food).toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "available" && getAvailable(food)) ||
        (statusFilter === "unavailable" && !getAvailable(food));
      return matchesSearch && matchesStatus;
    });
  }, [foods, search, statusFilter]);

  const visibleFoods = showAllFoods ? filteredFoods : filteredFoods.slice(0, 5);

  const categoryCards = useMemo(() => {
    const colors = [
      "bg-[#FFF4E8] border-[#F5E3D0] text-[#8D4A24]",
      "bg-[#F0FAF1] border-[#DCEFE0] text-[#287449]",
      "bg-[#FFF7E8] border-[#F4E8CE] text-[#8D5C1F]",
      "bg-[#FFF2F3] border-[#F4E0E2] text-[#9D4B5D]",
      "bg-[#F5F5FB] border-[#E5E5F0] text-[#56527C]",
      "bg-[#FFF7F1] border-[#F1E4DA] text-[#8A5B40]",
    ];
    const iconList = [FiCoffee, FiGrid, FiPackage, FiCheckCircle, FiShoppingCart, FiTrendingUp];
    if (categories.length) {
      return categories.map((category, index) => {
        const name = typeof category === "string"
          ? category
          : category?.name || category?.category_name || category?.categoryName || `Category ${index + 1}`;
        const count = foods.filter((food) => getFoodCategory(food).toLowerCase() === String(name).toLowerCase()).length;
        return { name, count, Icon: iconList[index % iconList.length], className: colors[index % colors.length] };
      });
    }

    const uniqueNames = [...new Set(foods.map(getFoodCategory).filter((name) => name && name !== "Uncategorized"))];
    return uniqueNames.slice(0, 6).map((name, index) => ({
      name,
      count: foods.filter((food) => getFoodCategory(food).toLowerCase() === name.toLowerCase()).length,
      Icon: iconList[index % iconList.length],
      className: colors[index % colors.length],
    }));
  }, [categories, foods]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#FFF9F4] text-[#38231C]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Admin-only top bar */}
        <header className="sticky top-0 z-20 flex h-[68px] shrink-0 items-center justify-between border-b border-[#E9D9CC] bg-[#FFFDF9]/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              className="rounded-xl border border-[#E9D9CC] bg-white p-2.5 text-[#5C2C19] shadow-sm transition hover:bg-[#F8EDE3] lg:hidden"
            >
              <FiMenu className="h-5 w-5" />
            </button>
            <div className="hidden items-center gap-2 text-sm text-[#8C7B70] sm:flex">
              <span>Admin</span>
              <FiChevronRight className="h-4 w-4" />
              <span className="font-semibold text-[#4C2415]">Dashboard</span>
            </div>
            <div className="sm:hidden">
              <p className="text-xs text-[#8C7B70]">Admin</p>
              <p className="text-sm font-bold text-[#4C2415]">Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <label className="hidden h-10 w-44 items-center gap-2 rounded-xl border border-[#E9D9CC] bg-white px-3 text-[#8C7B70] md:flex lg:w-56">
              <FiSearch className="h-4 w-4 shrink-0" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search foods..."
                className="min-w-0 flex-1 bg-transparent text-sm text-[#38231C] outline-none placeholder:text-[#AA9A90]"
              />
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setNoticeOpen((value) => !value)}
                aria-label="Notifications"
                className="relative rounded-xl p-2.5 text-[#6A3824] transition hover:bg-[#F6E9DE]"
              >
                <FiBell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full border border-[#FFFDF9] bg-[#D65D42]" />
              </button>
              {noticeOpen && (
                <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-[#EAD8C8] bg-white p-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-[#4C2415]">Notifications</p>
                    <button onClick={() => setNoticeOpen(false)} aria-label="Close notifications"><FiX /></button>
                  </div>
                  <p className="mt-2 text-sm text-[#817168]">You are all caught up for now.</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#C58B57] to-[#8B4525] font-serif font-bold text-white shadow-sm">A</div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-[#4C2415]">Admin</p>
                <p className="text-[11px] text-[#9A877B]">Super Admin</p>
              </div>
              <FiChevronDown className="hidden h-4 w-4 text-[#8C7B70] sm:block" />
            </div>
          </div>
        </header>

        {/* Only this main content area scrolls; sidebar scrolls independently */}
        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="mx-auto max-w-[1700px] space-y-6 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
            {/* Welcome hero */}
            <section className="relative isolate overflow-hidden rounded-2xl border border-[#F0DFCF] bg-gradient-to-r from-[#FFF0E0] via-[#FFF8EF] to-[#F8D8B9] p-5 shadow-sm sm:p-7 lg:min-h-[220px] lg:p-8">
              <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full border-[24px] border-white/25 sm:right-20 sm:h-64 sm:w-64" />
              <div className="pointer-events-none absolute right-10 top-10 hidden h-28 w-28 rounded-full bg-[#E8BD91]/25 blur-2xl lg:block" />
              <div className="relative z-10 max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#E9B77B] bg-[#FFF4DF] px-3 py-1.5 text-xs font-semibold text-[#87451F]">
                  <FiCoffee className="h-4 w-4" /> Your kitchen, your business
                </span>
                <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight text-[#2C1710] sm:text-4xl">
                  Welcome back, <span className="text-[#B65D30]">Admin!</span>
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-[#77675D] sm:text-base">
                  Here&apos;s what&apos;s happening with HomeBite today. Keep your homemade food business running beautifully.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/admin/foods" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#713016] to-[#4B1D0D] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-[#4B1D0D]/15 transition hover:-translate-y-0.5">
                    <FiPlus className="h-4 w-4" /> Manage Foods
                  </Link>
                  <Link href="/admin/orders" className="inline-flex items-center gap-2 rounded-xl border border-[#D9A77F] bg-white/60 px-4 py-3 text-sm font-semibold text-[#8A411F] transition hover:bg-white">
                    <FiShoppingCart className="h-4 w-4" /> View Orders <FiArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-[36%] items-end justify-center lg:flex">
                <div className="mb-8 mr-8 rotate-[-7deg] rounded-[35%] border-[10px] border-[#D8B18A] bg-[#F8E5CC] p-4 shadow-xl">
                  <div className="flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-[#B66C32] via-[#9C4C20] to-[#57240F] shadow-inner">
                    <FiCoffee className="h-16 w-16 text-[#FFE6B8]" />
                  </div>
                </div>
                <p className="absolute right-7 top-10 max-w-24 rotate-6 font-serif text-xl font-bold leading-tight text-[#A95D32]">Good Food,<br />Good Mood ♡</p>
              </div>
            </section>

            {/* Stat cards */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard title="Total Foods" value={loading ? "—" : foods.length} subtitle="Food items in your catalog" icon={FiCoffee} tone="amber" trend="+12%" />
              <StatCard title="Categories" value={loading ? "—" : (categories.length || categoryCards.length)} subtitle="Food collections" icon={FiGrid} tone="cream" trend="+1%" />
              <StatCard title="Available Foods" value={loading ? "—" : availableFoods.length} subtitle="Currently available" icon={FiCheckCircle} tone="green" trend={`${foods.length ? Math.round((availableFoods.length / foods.length) * 100) : 0}%`} />
              <StatCard title="Unavailable Foods" value={loading ? "—" : unavailableFoods.length} subtitle="Currently unavailable" icon={FiPackage} tone="coral" trend={unavailableFoods.length ? "Needs review" : "All clear"} down={unavailableFoods.length > 0} />
            </section>

            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-[#F2D0C7] bg-[#FFF0ED] p-4 text-sm text-[#9A3827]">
                <FiAlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="font-semibold">Could not load live data</p>
                  <p className="mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Food catalog */}
            <section className="overflow-hidden rounded-2xl border border-[#EDE4DE] bg-white shadow-sm shadow-[#4B2410]/[0.03]">
              <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#2D1911]">Food Catalog</h2>
                  <p className="mt-1 text-sm text-[#7E716A]">Search and monitor the food items in your store.</p>
                </div>
                <Link href="/admin/foods" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#713016] to-[#4B1D0D] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110">
                  <FiPlus className="h-4 w-4" /> Add Food
                </Link>
              </div>

              <div className="flex flex-col gap-3 px-5 pb-4 sm:flex-row sm:px-6">
                <label className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-[#E5DCD5] bg-[#FFFEFC] px-3 text-[#8D7B70] focus-within:border-[#C18A5A]">
                  <FiSearch className="h-4 w-4 shrink-0" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search food name or category..."
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#AA9A90]"
                  />
                </label>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="h-11 rounded-xl border border-[#E5DCD5] bg-white px-3 text-sm text-[#5F4B40] outline-none focus:border-[#C18A5A]"
                  aria-label="Filter food availability"
                >
                  <option value="all">All foods</option>
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
                <button
                  type="button"
                  onClick={() => loadDashboard(true)}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E5DCD5] px-4 text-sm font-semibold text-[#713016] transition hover:bg-[#FFF5EB] disabled:opacity-60"
                  disabled={refreshing}
                >
                  <FiRefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                  <span className="sm:hidden">Refresh</span>
                </button>
              </div>

              <div className="overflow-x-auto px-5 pb-2 sm:px-6">
                <table className="w-full min-w-[690px] border-separate border-spacing-0 text-left">
                  <thead>
                    <tr className="bg-[#FAF3ED] text-xs font-bold text-[#7D3F22]">
                      <th className="rounded-l-xl px-4 py-3">Food Item</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="rounded-r-xl px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-[#8D7B70]">Loading food catalog...</td></tr>
                    ) : visibleFoods.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-12 text-center">
                          <FiPackage className="mx-auto h-8 w-8 text-[#C6A995]" />
                          <p className="mt-2 text-sm font-semibold text-[#5E4030]">No food items found</p>
                          <p className="mt-1 text-xs text-[#9A877B]">Try another search or add food items from the Foods page.</p>
                        </td>
                      </tr>
                    ) : (
                      visibleFoods.map((food, index) => {
                        const isAvailable = getAvailable(food);
                        const image = getFoodImage(food);
                        return (
                          <tr key={getFoodId(food, index)} className="border-b border-[#F0E9E4] text-sm transition hover:bg-[#FFFBF7]">
                            <td className="border-b border-[#F0E9E4] px-4 py-3">
                              <div className="flex items-center gap-3">
                                {image ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={image} alt={getFoodName(food)} className="h-11 w-11 shrink-0 rounded-xl border border-[#EDE0D4] object-cover" />
                                ) : (
                                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#EDE0D4] bg-[#FFF0E0] text-[#9A542E]">
                                    <FiCoffee className="h-5 w-5" />
                                  </div>
                                )}
                                <div>
                                  <p className="font-semibold text-[#38231C]">{getFoodName(food)}</p>
                                  <p className="mt-1 text-[11px] text-[#A09086]">ID: {getFoodId(food, index)}</p>
                                </div>
                              </div>
                            </td>
                            <td className="border-b border-[#F0E9E4] px-4 py-3">
                              <span className="inline-flex rounded-full bg-[#F8E7DA] px-3 py-1 text-xs font-semibold text-[#914522]">{getFoodCategory(food)}</span>
                            </td>
                            <td className="border-b border-[#F0E9E4] px-4 py-3 font-semibold text-[#49352B]">{money(getFoodPrice(food))}</td>
                            <td className="border-b border-[#F0E9E4] px-4 py-3">
                              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${isAvailable ? "bg-[#E3F5E8] text-[#247849]" : "bg-[#FDE7E5] text-[#B3342A]"}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${isAvailable ? "bg-[#29965A]" : "bg-[#D94B40]"}`} />
                                {isAvailable ? "Available" : "Unavailable"}
                              </span>
                            </td>
                            <td className="border-b border-[#F0E9E4] px-4 py-3 text-right">
                              <Link href="/admin/foods" aria-label={`View ${getFoodName(food)}`} className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#EDE0D4] text-[#85401F] transition hover:bg-[#FFF0E2]">
                                <FiEye className="h-4 w-4" />
                              </Link>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-3 px-6 py-4 text-xs text-[#897970] sm:flex-row sm:items-center sm:justify-between">
                <span>
                  Showing {visibleFoods.length} of {filteredFoods.length} food{filteredFoods.length === 1 ? "" : "s"}
                </span>
                {filteredFoods.length > 5 && (
                  <button
                    type="button"
                    onClick={() => setShowAllFoods((value) => !value)}
                    className="inline-flex items-center gap-2 self-start font-bold text-[#8A401E] hover:text-[#B65D30] sm:self-auto"
                  >
                    {showAllFoods ? "Show less" : "View all foods"} <FiArrowUpRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </section>

            {/* Categories */}
            <section className="rounded-2xl border border-[#EDE4DE] bg-white p-5 shadow-sm shadow-[#4B2410]/[0.03] sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[#2D1911] sm:text-2xl">Explore Categories</h2>
                  <p className="mt-1 text-sm text-[#7E716A]">See how your food collection is organized.</p>
                </div>
                <Link href="/admin/categories" className="inline-flex items-center gap-2 self-start text-sm font-semibold text-[#8A401E] hover:text-[#B65D30]">
                  Manage categories <FiArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              {categoryCards.length ? (
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
                  {categoryCards.map(({ name, count, Icon, className }) => (
                    <Link
                      key={name}
                      href="/admin/categories"
                      className={`group rounded-2xl border p-4 text-center transition hover:-translate-y-1 hover:shadow-md ${className}`}
                    >
                      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white/80 shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="mt-3 text-sm font-bold">{name}</p>
                      <p className="mt-1 text-xs opacity-75">{count} item{count === 1 ? "" : "s"}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-xl border border-dashed border-[#E8D7C8] p-8 text-center">
                  <FiGrid className="mx-auto h-8 w-8 text-[#B9957C]" />
                  <p className="mt-2 text-sm font-semibold text-[#68432E]">No categories to display yet</p>
                  <p className="mt-1 text-xs text-[#958276]">Create categories to organize your homemade food items.</p>
                  <Link href="/admin/categories" className="mt-4 inline-flex rounded-lg bg-[#6C2B14] px-4 py-2 text-sm font-semibold text-white">Manage categories</Link>
                </div>
              )}
            </section>

            <footer className="flex flex-col gap-2 border-t border-[#E8DCD3] py-5 text-xs text-[#9A897E] sm:flex-row sm:items-center sm:justify-between">
              <p>© {new Date().getFullYear()} HomeBite Admin Panel. All rights reserved.</p>
              <p>Made with care · Homemade goodness</p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
