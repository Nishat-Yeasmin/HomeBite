
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye, FiX,
  FiRefreshCw, FiCoffee, FiCheckCircle, FiXCircle,
  FiLayers, FiFilter, FiChevronDown, FiImage,
  FiPackage, FiArrowRight, FiArrowLeft, FiArrowUpRight,
  FiStar, FiGrid, FiList, FiAlertCircle, FiClock
} from "react-icons/fi";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const PAGE_SIZE = 5;

const initialForm = {
  name: "",
  category_id: "",
  description: "",
  price: "",
  image_url: "",
  is_available: true,
};

const heroImage =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=85";

export default function FoodsPage() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
 const [deleteTarget, setDeleteTarget] = useState(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [currentPage, setCurrentPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [viewFood, setViewFood] = useState(null);

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [imageError, setImageError] = useState(false);
  const contentRef = useRef(null);

  // Fetch foods and categories
  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const [foodRes, categoryRes] = await Promise.all([
        fetch(`${API_URL}/api/foods`),
        fetch(`${API_URL}/api/categories`),
      ]);

      if (!foodRes.ok || !categoryRes.ok) {
        throw new Error("Failed to load food data.");
      }

      const foodData = await foodRes.json();
      const categoryData = await categoryRes.json();

      setFoods(
        Array.isArray(foodData)
          ? foodData
          : foodData.foods || []
      );

      setCategories(
        Array.isArray(categoryData)
          ? categoryData
          : categoryData.categories || []
      );

      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load data. Please check your server connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Scroll reveal animation
  useEffect(() => {
    if (loading) return;

    const elements = document.querySelectorAll(".scroll-reveal");

    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [loading, foods, currentPage]);


{/* Delete Confirmation Toast */}
{deleteTarget && (
  <div className="fixed right-5 top-5 z-[9999] w-[calc(100%-40px)] max-w-sm rounded-2xl border border-[#E8D5C9] bg-white p-5 shadow-2xl animate-[fadeUp_.3s_ease-out]">
    <div className="flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
        <FiTrash2 size={20} />
      </div>

      <div className="flex-1">
        <h3 className="font-bold text-[#2C0E05]">
          Delete Food Item?
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-[#2C0E05]">
            {deleteTarget.name}
          </span>
          ?
        </p>
      </div>

      <button
        onClick={() => setDeleteTarget(null)}
        className="text-gray-400 hover:text-gray-700"
        disabled={deleting !== null}
      >
        <FiX size={20} />
      </button>
    </div>

    <div className="mt-5 flex justify-end gap-3">
      <button
        onClick={() => setDeleteTarget(null)}
        disabled={deleting !== null}
        className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
      >
        Cancel
      </button>

  <button
  onClick={() => setDeleteTarget(food)}
  title="Delete food"
  className="action-btn action-delete"
>
  <FiTrash2 />
</button>
    </div>
  </div>
)}


  // Notifications
  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3500);
  };

 
  // Statistics
  const availableFoods = foods.filter(
    (food) => Number(food.is_available) === 1
  ).length;

  const unavailableFoods = foods.length - availableFoods;

  const stats = [
    {
      title: "Total Food Items",
      value: foods.length,
      detail: "All menu collections",
      icon: FiCoffee,
      theme: "stat-chocolate",
      iconTheme: "icon-chocolate",
    },
    {
      title: "Available Foods",
      value: availableFoods,
      detail: "Ready to serve",
      icon: FiCheckCircle,
      theme: "stat-green",
      iconTheme: "icon-green",
    },
    {
      title: "Unavailable",
      value: unavailableFoods,
      detail: "Currently not listed",
      icon: FiXCircle,
      theme: "stat-rose",
      iconTheme: "icon-rose",
    },
    {
      title: "Categories",
      value: categories.length,
      detail: "Food collections",
      icon: FiLayers,
      theme: "stat-gold",
      iconTheme: "icon-gold",
    },
  ];

  // Search, filters and sorting
 
  // Search, filters and sorting
  const filteredFoods = useMemo(() => {
    let result = [...foods];

    if (search.trim()) {
      const keyword = search.trim().toLowerCase();

      result = result.filter((food) => {
        const name = String(food.name || "").toLowerCase();
        const description = String(food.description || "").toLowerCase();

        const category =
          String(
            food.category_name ||
            categories.find(
              (cat) => String(cat.id) === String(food.category_id)
            )?.name ||
            ""
          ).toLowerCase();

        return (
          name.includes(keyword) ||
          description.includes(keyword) ||
          category.includes(keyword)
        );
      });
    }

    if (categoryFilter !== "all") {
      result = result.filter(
        (food) => String(food.category_id) === categoryFilter
      );
    }

    if (statusFilter === "available") {
      result = result.filter(
        (food) => Number(food.is_available) === 1
      );
    }

    if (statusFilter === "unavailable") {
      result = result.filter(
        (food) => Number(food.is_available) !== 1
      );
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "name") {
      result.sort((a, b) =>
        (a.name || "").localeCompare(b.name || "")
      );
    } else {
      result.sort((a, b) => Number(b.id) - Number(a.id));
    }

    return result;
  }, [foods, categories, search, categoryFilter, statusFilter, sortBy]);

  // Pagination
  
  // Pagination

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredFoods.length / PAGE_SIZE)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedFoods = filteredFoods.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE
  );

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };



  // Add food
  const openAddModal = () => {
    setEditingFood(null);
    setForm(initialForm);
    setError("");
    setImageError(false);
    setModalOpen(true);
  };

  // Edit food
  const openEditModal = (food) => {
    setEditingFood(food);

    setForm({
      name: food.name || "",
      category_id: String(food.category_id || ""),
      description: food.description || "",
      price: food.price || "",
      image_url: food.image_url || "",
      is_available: Number(food.is_available) === 1,
    });

    setError("");
    setImageError(false);
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Save food
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.name.trim() ||
      !form.category_id ||
      !form.price ||
      Number(form.price) <= 0
    ) {
      setError("Please complete all required fields correctly.");
      return;
    }

    try {
      setSaving(true);

      const url = editingFood
        ? `${API_URL}/api/foods/${editingFood.id}`
        : `${API_URL}/api/foods`;

     const token = localStorage.getItem("homebite-token");

if (!token) {
  throw new Error("Please login first. Your login session may have expired.");
}

const response = await fetch(url, {
  method: editingFood ? "PUT" : "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    name: form.name.trim(),
    category_id: Number(form.category_id),
    description: form.description.trim(),
    price: Number(form.price),
    image_url: form.image_url.trim(),
    is_available: form.is_available,
  }),
});

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Unable to save food.");
      }

      setModalOpen(false);
      setEditingFood(null);
      setForm(initialForm);

      await fetchData(true);

      showNotice(
        editingFood
          ? "Food information updated successfully!"
          : "New food added successfully!"
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete food
 
// Delete food

const handleDelete = async (food) => {
  try {
    setDeleting(food.id);

    const token = localStorage.getItem("homebite-token");

    if (!token) {
      throw new Error("Please login first.");
    }

    const response = await fetch(
      `${API_URL}/api/foods/${food.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok || data.success === false) {
      throw new Error(data.message || "Unable to delete food.");
    }

    setDeleteTarget(null);
    await fetchData(true);
    showNotice("Food deleted successfully!");
  } catch (err) {
    showNotice(err.message || "Unable to delete food.");
  } finally {
    setDeleting(null);
  }
};


  // Availability toggle

// Availability toggle
const toggleAvailability = async (food) => {
  try {
    const token = localStorage.getItem("homebite-token");

    if (!token) {
      throw new Error("Please login first. Your session may have expired.");
    }

    const response = await fetch(
      `${API_URL}/api/foods/${food.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: food.name,
          category_id: Number(food.category_id),
          description: food.description || "",
          price: Number(food.price),
          image_url: food.image_url || "",
          is_available: Number(food.is_available) !== 1,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || data.success === false) {
      throw new Error(data.message || "Availability update failed.");
    }

    await fetchData(true);
    showNotice("Food availability updated!");
  } catch (err) {
    alert(err.message);
  }
};

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setEditingFood(null);
    setForm(initialForm);
    setError("");
  };

const resetFilters = () => {
  setSearch("");
  setCategoryFilter("all");
  setStatusFilter("all");
  setSortBy("newest");
  setCurrentPage(1);
};

  return (
    <div className="food-page min-h-screen overflow-hidden bg-[#FFF9F4] px-4 pb-10 pt-5 sm:px-6 lg:px-8 lg:pl-[290px]">

    {/* // <div className="food-page min-h-screen overflow-hidden bg-[#FFF9F4] px-4 pb-10 pt-5 sm:px-6 lg:px-8"> */}

      {/* ================= HERO SECTION ================= */}
      <section className="hero-section relative mb-9 min-h-[290px] overflow-hidden rounded-[28px] bg-[#2C0E05] shadow-[0_18px_55px_rgba(44,14,5,0.16)] lg:min-h-[340px]">

        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url("${heroImage}")` }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#210A04] via-[#2C0E05]/95 to-[#2C0E05]/30" />

        <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full border border-[#D4AE70]/20" />
        <div className="absolute -right-8 -top-16 h-56 w-56 rounded-full border border-[#D4AE70]/20" />

        <div className="relative z-10 flex min-h-[290px] flex-col justify-center px-6 py-9 sm:px-10 lg:min-h-[340px] lg:w-[70%] lg:px-12">

          <div className="mb-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[3px] text-[#E5C18B] sm:text-xs">
            <FiStar />
            HOME BITE · THE ART OF HOMEMADE FOOD
          </div>

          <h1 className="max-w-2xl text-4xl font-bold leading-tight text-[#FFF8EF] sm:text-5xl lg:text-[56px]">
            Every Dish Has
            <br />
            <span className="font-serif font-medium italic text-[#D9B77E]">
              A Story to Tell.
            </span>
          </h1>

          <p className="mt-5 max-w-lg font-serif text-sm italic leading-7 text-[#F1DDD0]/85 sm:text-base">
            Curate your kitchen, celebrate homemade flavors, and
            bring every delicious creation to your customers.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              onClick={openAddModal}
              className="group flex cursor-pointer items-center gap-3 rounded-xl bg-[#D7B273] px-5 py-3.5 text-sm font-bold text-[#2C0E05] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#E8C990] hover:shadow-[0_10px_25px_rgba(215,178,115,0.3)] active:scale-95"
            >
              <FiPlus className="text-lg transition-transform group-hover:rotate-90" />
              Create New Dish
              <FiArrowUpRight className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>

            <div className="flex items-center gap-2 rounded-xl border border-[#E4C99B]/25 bg-white/5 px-4 py-3 text-xs text-[#F3E5D3] backdrop-blur-sm">
              <FiCoffee className="text-[#D9B77E]" />
              {foods.length} dishes in your kitchen
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-[40%] lg:block">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2C0E05] to-transparent" />
        <div className="relative">
  <img
    src="https://plus.unsplash.com/premium_photo-1663858367108-9150fe5ce9bd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
    alt="Delicious Homemade food"
    className="h-full w-full object-cover -translate-y-25"
    style={{
      maskImage:
        "linear-gradient(to left, black 65%, transparent 100%)",
      WebkitMaskImage:
        "linear-gradient(to left, black 65%, transparent 100%)",
    }}
  />
</div>
          <div className="absolute bottom-7 right-8 rounded-2xl border border-[#E4C99B]/30 bg-[#2C0E05]/75 px-5 py-3 backdrop-blur-md">
            <p className="font-serif text-lg italic text-[#E8C990]">
              Made with love.
            </p>
            <p className="mt-1 text-[9px] uppercase tracking-[2px] text-white/70">
              Served with warmth
            </p>
          </div>
        </div>
      </section>

      {/* Notification */}
      {notice && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-[#C8AD79] bg-[#F7EEDC] p-4 text-sm font-semibold text-[#62451E] animate-[fadeUp_.3s_ease-out]">
          <FiCheckCircle className="text-lg" />
          {notice}
        </div>
      )}


{/* Delete Confirmation Modal */}
{deleteTarget && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">

      <div className="flex items-center gap-3">
        <div className="rounded-full bg-red-50 p-3 text-red-600">
          <FiTrash2 size={22} />
        </div>

        <h3 className="text-lg font-bold text-[#2C0E05]">
          Delete Food?
        </h3>
      </div>

      <p className="mt-4 text-sm text-gray-600">
        Are you sure you want to delete{" "}
        <strong>{deleteTarget.name}</strong>?
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => setDeleteTarget(null)}
          disabled={deleting !== null}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={() => handleDelete(deleteTarget)}
          disabled={deleting !== null}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {deleting !== null ? "Deleting..." : "Delete"}
        </button>
      </div>

    </div>
  </div>
)}


      {/* Error */}
      {error && !modalOpen && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <FiAlertCircle />
          {error}
          <button
            onClick={() => fetchData(true)}
            className="ml-auto cursor-pointer font-bold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* ================= STATISTICS ================= */}
      <section className="mb-9">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <p className="font-serif text-xs italic tracking-widest text-[#B08A55]">
              A LITTLE OVERVIEW
            </p>
            <h2 className="mt-1 text-xl font-bold text-[#2C0E05] sm:text-2xl">
              Your Kitchen at a Glance
            </h2>
          </div>
          <span className="hidden text-xs italic text-[#A58B79] sm:block">
            A beautiful collection of flavors
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                style={{ transitionDelay: `${index * 80}ms` }}
                className={`scroll-reveal stat-card ${stat.theme} group relative overflow-hidden rounded-[22px] border p-5 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl`}
              >
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border border-current/10 transition-transform duration-700 group-hover:scale-150" />

                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold tracking-wide opacity-75">
                      {stat.title}
                    </p>

                    <h3 className="mt-3 text-4xl font-bold tracking-tight">
                      {loading ? (
                        <span className="inline-block h-10 w-14 animate-pulse rounded-lg bg-current/10" />
                      ) : stat.value}
                    </h3>

                    <p className="mt-2 font-serif text-xs italic opacity-70">
                      {stat.detail}
                    </p>
                  </div>

                  <div className={`stat-icon flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-500 group-hover:rotate-12 group-hover:scale-110`}>
                    <Icon className="text-2xl" />
                  </div>
                </div>

                <div className="relative z-10 mt-5 h-1 overflow-hidden rounded-full bg-current/10">
                  <div
                    className="h-full rounded-full bg-current/60 transition-all duration-1000"
                    style={{
                      width: loading
                        ? "0%"
                        : `${Math.min(
                            100,
                            foods.length
                              ? (stat.value / foods.length) * 100
                              : 0
                          )}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= FOOD LIST ================= */}
      <section ref={contentRef} className="scroll-reveal overflow-hidden rounded-[24px] border border-[#E9DCD0] bg-white shadow-[0_10px_40px_rgba(67,35,18,0.05)]">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-[#F0E6DE] px-5 py-6 sm:flex-row sm:items-center sm:px-7">

          <div>
            <div className="flex items-center gap-2">
              <span className="h-7 w-1 rounded-full bg-[#B08A55]" />
              <h2 className="text-xl font-bold text-[#2C0E05]">
                The Food Collection
              </h2>
            </div>

            <p className="mt-2 pl-3 font-serif text-xs italic text-[#A18A7C]">
              Every homemade favorite, all in one place.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full border border-[#EADCCB] bg-[#FFF9F3] px-3 py-2 text-xs font-semibold text-[#805A3C]">
              {filteredFoods.length} Results
            </span>

            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-[#E8D9CA] bg-[#FFF9F3] px-3 text-xs font-semibold text-[#68452F] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B08A55] hover:bg-[#F2E4CF] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 gap-3 border-b border-[#F0E6DE] bg-[#FFFCF9] p-5 md:grid-cols-2 xl:grid-cols-4">

          {/* Search */}
          <div className="filter-control relative">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#A17A50]" />

            <input
              type="text"
              placeholder="Search your dishes..."
              value={search}
            onChange={(e) => {
  setSearch(e.target.value);
  setCurrentPage(1);
}}
              className="filter-input w-full rounded-xl border border-[#E8D8C7] bg-white py-3 pl-11 pr-4 text-sm text-[#432619] outline-none transition-all duration-300 placeholder:font-serif placeholder:italic placeholder:text-[#B6A394] hover:border-[#C5A06D] focus:border-[#A87942] focus:bg-[#FFFCF7] focus:ring-4 focus:ring-[#B08A55]/10"
            />
          </div>

          {/* Category */}
          <div className="relative">
            <FiLayers className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#A17A50]" />

            <select
              value={categoryFilter}
             onChange={(e) => {
  setCategoryFilter(e.target.value);
  setCurrentPage(1);
}}
              className="filter-select w-full appearance-none rounded-xl border border-[#E8D8C7] bg-white py-3 pl-11 pr-10 text-sm text-[#5B3927] outline-none transition-all duration-300 hover:border-[#C5A06D] hover:bg-[#FFFAF2] focus:border-[#A87942] focus:ring-4 focus:ring-[#B08A55]/10"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </option>
              ))}
            </select>

            <FiChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#A17A50]" />
          </div>

          {/* Status */}
          <div className="relative">
            <FiFilter className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#A17A50]" />

            <select
              value={statusFilter}
             onChange={(e) => {
  setStatusFilter(e.target.value);
  setCurrentPage(1);
}}
              className="filter-select w-full appearance-none rounded-xl border border-[#E8D8C7] bg-white py-3 pl-11 pr-10 text-sm text-[#5B3927] outline-none transition-all duration-300 hover:border-[#C5A06D] hover:bg-[#FFFAF2] focus:border-[#A87942] focus:ring-4 focus:ring-[#B08A55]/10"
            >
              <option value="all">All Availability</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>

            <FiChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#A17A50]" />
          </div>

          {/* Sorting */}
          <div className="relative">
            <FiList className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#A17A50]" />

            <select
              value={sortBy}
             onChange={(e) => {
  setSortBy(e.target.value);
  setCurrentPage(1);
}}
              className="filter-select w-full appearance-none rounded-xl border border-[#E8D8C7] bg-white py-3 pl-11 pr-10 text-sm text-[#5B3927] outline-none transition-all duration-300 hover:border-[#C5A06D] hover:bg-[#FFFAF2] focus:border-[#A87942] focus:ring-4 focus:ring-[#B08A55]/10"
            >
              <option value="newest">Newest First</option>
              <option value="name">Name: A - Z</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            <FiChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#A17A50]" />
          </div>
        </div>

        {/* Filter summary */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-7">
          <p className="text-xs text-[#927B70]">
            Showing{" "}
            <span className="font-bold text-[#2C0E05]">
              {filteredFoods.length === 0
                ? 0
                : (currentPage - 1) * PAGE_SIZE + 1}
              -
              {Math.min(safeCurrentPage * PAGE_SIZE, filteredFoods.length)}
            </span>{" "}
            of <span className="font-bold text-[#2C0E05]">{filteredFoods.length}</span> dishes
          </p>

          {(search || categoryFilter !== "all" || statusFilter !== "all" || sortBy !== "newest") && (
            <button
              onClick={resetFilters}
              className="flex cursor-pointer items-center gap-1.5 font-serif text-xs italic text-[#9B7045] transition-colors hover:text-[#2C0E05] hover:underline"
            >
              <FiX />
              Clear filters
            </button>
          )}
        </div>

        {/* Food Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">

            <thead>
              <tr className="border-y border-[#EDE1D5] bg-[#F8F0E7] text-[10px] font-bold uppercase tracking-[1.5px] text-[#86694E]">
                <th className="px-6 py-4">Food Item</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Availability</th>
                <th className="px-5 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F2EAE3]">

              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan="5" className="px-6 py-5">
                      <div className="flex animate-pulse items-center gap-4">
                        <div className="h-14 w-14 rounded-xl bg-[#EFE2D4]" />
                        <div className="space-y-2">
                          <div className="h-3 w-36 rounded bg-[#EFE2D4]" />
                          <div className="h-2 w-24 rounded bg-[#F6EEE7]" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : paginatedFoods.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5E9DA]">
                      <FiCoffee className="text-3xl text-[#A77B46]" />
                    </div>
                    <h3 className="mt-4 font-bold text-[#432619]">
                      No dishes found
                    </h3>
                    <p className="mt-2 font-serif text-sm italic text-[#A18A7C]">
                      Your search did not match any food items.
                    </p>
                    <button
                      onClick={resetFilters}
                      className="mt-5 cursor-pointer rounded-lg bg-[#4A2515] px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-[#75452A]"
                    >
                      Reset Filters
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedFoods.map((food, index) => (
                  <tr
  key={food.id}
  className="food-row group transition-all duration-300 hover:bg-[#FFF9F0]"
>
                    {/* Food */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-[58px] w-[58px] shrink-0 overflow-hidden rounded-[14px] border border-[#E9DCCD] bg-[#F7EEE5] shadow-sm">
                          {food.image_url ? (
                            <img
                              src={food.image_url}
                              alt={food.name}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <FiImage className="text-xl text-[#B08A55]" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-[220px] truncate text-sm font-bold text-[#432619] transition-colors group-hover:text-[#9C6D37]">
                            {food.name}
                          </p>
                          <p className="mt-1 max-w-[220px] truncate font-serif text-xs italic text-[#A18A7C]">
                            {food.description || "A homemade delight"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-lg border border-[#EAD9C3] bg-[#F7EFE4] px-3 py-1.5 text-xs font-semibold text-[#795432] transition-colors group-hover:border-[#C7A477] group-hover:bg-[#F0E0C7]">
                        {food.category_name || "Uncategorized"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4">
                      <span className="font-bold text-[#4A2818]">
                        ৳{Number(food.price).toLocaleString("en-BD")}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleAvailability(food)}
                        title="Click to change availability"
                        className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm ${
                          Number(food.is_available) === 1
                            ? "border-[#C9DDC9] bg-[#EFF6EC] text-[#54754D] hover:bg-[#E3F0DE]"
                            : "border-[#E9C8B9] bg-[#FAEFEB] text-[#A65E4C] hover:bg-[#F5E1D9]"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          Number(food.is_available) === 1
                            ? "bg-[#6F9C62]"
                            : "bg-[#BD725A]"
                        }`} />
                        {Number(food.is_available) === 1
                          ? "Available"
                          : "Unavailable"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">

                        <button
                          onClick={() => {
                            setViewFood(food);
                            setViewModalOpen(true);
                          }}
                          title="View food"
                          className="action-btn action-view"
                        >
                          <FiEye />
                        </button>

                        <button
                          onClick={() => openEditModal(food)}
                          title="Edit food"
                          className="action-btn action-edit"
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          onClick={() => setDeleteTarget(food)}
                          disabled={deleting === food.id}
                          title="Delete food"
                          className="action-btn action-delete"
                        >
                          {deleting === food.id
                            ? <FiRefreshCw className="animate-spin" />
                            : <FiTrash2 />}
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ================= PAGINATION ================= */}
        {!loading && filteredFoods.length > 0 && (
          <div className="flex flex-col items-center justify-between gap-4 border-t border-[#EDE1D5] bg-[#FFFCF9] px-5 py-5 sm:flex-row sm:px-7">

            <p className="font-serif text-xs italic text-[#987D67]">
              Page {safeCurrentPage} of {totalPages} · {filteredFoods.length} delicious dishes
            </p>

            <div className="flex items-center gap-2">

              <button
                onClick={() => goToPage(safeCurrentPage - 1)}
                disabled={safeCurrentPage === 1}
                className="page-btn"
                aria-label="Previous page"
              >
                <FiArrowLeft />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  return (
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - safeCurrentPage) <= 1
                  );
                })
                .map((page, index, arr) => (
                  <span key={page} className="flex items-center gap-2">
                    {index > 0 && arr[index - 1] !== page - 1 && (
                      <span className="text-xs text-[#AD947C]">...</span>
                    )}

                    <button
                      onClick={() => goToPage(page)}
                      className={`page-number ${
                        safeCurrentPage === page ? "page-active" : ""
                      }`}
                    >
                      {page}
                    </button>
                  </span>
                ))}

              <button
                onClick={() => goToPage(safeCurrentPage + 1)}
                disabled={safeCurrentPage === totalPages}
                className="page-btn"
                aria-label="Next page"
              >
                <FiArrowRight />
              </button>

            </div>
          </div>
        )}

      </section>

      {/* ================= ADD / EDIT MODAL ================= */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#1B0A05]/65 p-4 backdrop-blur-sm animate-[fadeIn_.2s_ease-out]"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="my-auto w-full max-w-2xl overflow-hidden rounded-[24px] bg-[#FFFCF8] shadow-2xl animate-[modalIn_.3s_ease-out]">

            <div className="flex items-center justify-between bg-[#2C0E05] px-6 py-5 text-white">
              <div>
                <p className="font-serif text-xs italic tracking-widest text-[#D9B77E]">
                  HOME BITE KITCHEN
                </p>
                <h2 className="mt-1 text-xl font-bold">
                  {editingFood ? "Edit Your Dish" : "Create a New Dish"}
                </h2>
                <p className="mt-1 text-xs text-white/60">
                  {editingFood
                    ? "Refresh your food details"
                    : "Add something delicious to your collection"}
                </p>
              </div>

              <button
                onClick={closeModal}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-white/10 transition-all hover:rotate-90 hover:bg-white/20"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="max-h-[75vh] space-y-5 overflow-y-auto p-6"
            >
              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  <FiAlertCircle />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div className="sm:col-span-2">
                  <label className="form-label">
                    Food Name <span>*</span>
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Homemade Chicken Biryani"
                    required
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">
                    Category <span>*</span>
                  </label>
                  <select
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                    required
                    className="form-input cursor-pointer"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">
                    Price (৳) <span>*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="250"
                    min="0.01"
                    step="0.01"
                    required
                    className="form-input"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="form-label">Food Image URL</label>
                  <input
                    type="url"
                    name="image_url"
                    value={form.image_url}
                    onChange={(e) => {
                      handleChange(e);
                      setImageError(false);
                    }}
                    placeholder="https://example.com/food-image.jpg"
                    className="form-input"
                  />

                  {form.image_url && !imageError && (
                    <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#E9DCCD] bg-[#F8F0E7] p-3">
                      <img
                        src={form.image_url}
                        alt="Preview"
                        onError={() => setImageError(true)}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <span className="font-serif text-xs italic text-[#795432]">
                        Your food image preview
                      </span>
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe your delicious homemade food..."
                    className="form-input resize-none"
                  />
                </div>
              </div>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[#E8D8C7] bg-[#F8F0E7] p-4 transition-colors hover:border-[#B08A55]">
                <div>
                  <p className="text-sm font-bold text-[#432619]">
                    Food Availability
                  </p>
                  <p className="mt-1 font-serif text-xs italic text-[#9A816C]">
                    Allow customers to order this food
                  </p>
                </div>
                <input
                  type="checkbox"
                  name="is_available"
                  checked={form.is_available}
                  onChange={handleChange}
                  className="h-5 w-5 cursor-pointer accent-[#70401F]"
                />
              </label>

              <div className="flex flex-col-reverse gap-3 border-t border-[#EDE1D5] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-[#E2D2C1] px-6 py-3 text-sm font-semibold text-[#75513A] transition-all hover:bg-[#F5E9DC] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#3B1A0C] px-7 py-3 text-sm font-bold text-[#F8E6C8] transition-all duration-300 hover:-translate-y-1 hover:bg-[#65381D] hover:shadow-lg disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <FiRefreshCw className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiPlus />
                      {editingFood ? "Update Dish" : "Save Dish"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= VIEW MODAL ================= */}
      {viewModalOpen && viewFood && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#1B0A05]/65 p-4 backdrop-blur-sm animate-[fadeIn_.2s_ease-out]"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setViewModalOpen(false);
              setViewFood(null);
            }
          }}
        >
          <div className="my-auto w-full max-w-md overflow-hidden rounded-[24px] bg-[#FFFCF8] shadow-2xl animate-[modalIn_.3s_ease-out]">

            <div className="relative h-60 bg-[#F3E3DC]">
              {viewFood.image_url ? (
                <img
                  src={viewFood.image_url}
                  alt={viewFood.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <FiImage className="text-5xl text-[#B08A55]" />
                </div>
              )}

              <button
                onClick={() => {
                  setViewModalOpen(false);
                  setViewFood(null);
                }}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#2C0E05]/80 text-white transition-all hover:rotate-90 hover:bg-[#2C0E05]"
              >
                <FiX />
              </button>

              <span className="absolute bottom-4 left-4 rounded-full border border-white/40 bg-[#2C0E05]/75 px-4 py-2 text-xs font-semibold text-[#F5D9A7] backdrop-blur-md">
                {viewFood.category_name || "Homemade Food"}
              </span>
            </div>

            <div className="p-6">
              <p className="font-serif text-xs italic tracking-widest text-[#B08A55]">
                A TASTE OF HOME
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#2C0E05]">
                {viewFood.name}
              </h2>

              <p className="mt-3 font-serif text-sm italic leading-7 text-[#947D6D]">
                {viewFood.description || "A delicious homemade delight."}
              </p>

              <div className="my-5 flex items-center justify-between border-y border-[#EDE1D5] py-4">
                <span className="text-sm text-[#947D6D]">Price</span>
                <span className="text-xl font-bold text-[#4A2818]">
                  ৳{Number(viewFood.price).toLocaleString("en-BD")}
                </span>
              </div>

              <div className="mb-5 flex items-center justify-between">
                <span className="text-sm text-[#947D6D]">Availability</span>
                <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                  Number(viewFood.is_available) === 1
                    ? "bg-[#EAF2E5] text-[#58764B]"
                    : "bg-[#F8E8E1] text-[#A65E4C]"
                }`}>
                  {Number(viewFood.is_available) === 1
                    ? "Available"
                    : "Unavailable"}
                </span>
              </div>

              <button
                onClick={() => {
                  setViewModalOpen(false);
                  openEditModal(viewFood);
                  setViewFood(null);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3B1A0C] px-5 py-3 text-sm font-bold text-[#F8E6C8] transition-all hover:-translate-y-1 hover:bg-[#65381D] hover:shadow-lg"
              >
                <FiEdit2 />
                Edit This Dish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CUSTOM STYLES ================= */}
      <style jsx global>{`
        .food-page {
          color: #432619;
        }

        .stat-card {
          opacity: 0;
          transform: translateY(25px);
        }

        .scroll-reveal {
          opacity: 0;
          transform: translateY(25px);
          transition: opacity .7s ease, transform .7s cubic-bezier(.2,.7,.2,1);
        }

        .scroll-reveal.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        .stat-chocolate {
          background: linear-gradient(135deg, #3A190D, #714329);
          border-color: #80573B;
          color: #FFF3E4;
        }

        .stat-green {
          background: linear-gradient(135deg, #E7EFE2, #F5F5E9);
          border-color: #D5E1CD;
          color: #476442;
        }

        .stat-rose {
          background: linear-gradient(135deg, #F8E8DF, #FFF5ED);
          border-color: #EED7C9;
          color: #985B46;
        }

        .stat-gold {
          background: linear-gradient(135deg, #F3E4C6, #FBF2DF);
          border-color: #E8D3A9;
          color: #79552A;
        }

        .icon-chocolate {
          background: rgba(255,255,255,.12);
          color: #F0D09A;
        }

        .icon-green {
          background: #D8E8D0;
          color: #53734C;
        }

        .icon-rose {
          background: #F1D8CA;
          color: #A55E49;
        }

        .icon-gold {
          background: #EAD5A8;
          color: #775125;
        }

        .action-btn {
          display: flex;
          height: 36px;
          width: 36px;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          transition: all .25s ease;
        }

        .action-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 12px rgba(65, 35, 17, .12);
        }

        .action-btn:disabled {
          cursor: not-allowed;
          opacity: .5;
        }

        .action-view {
          background: #F1E8D9;
          color: #785B35;
        }

        .action-view:hover {
          background: #E7D6B9;
          color: #432619;
        }

        .action-edit {
          background: #F6EBD2;
          color: #93692F;
        }

        .action-edit:hover {
          background: #EED9AD;
          color: #5D3C16;
        }

        .action-delete {
          background: #F8E8E1;
          color: #A65E4C;
        }

        .action-delete:hover {
          background: #EED0C3;
          color: #7C3528;
        }

        .page-btn, .page-number {
          display: flex;
          height: 36px;
          min-width: 36px;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          border: 1px solid #E9DCCB;
          background: white;
          color: #795B40;
          font-size: 12px;
          font-weight: 700;
          transition: all .25s ease;
        }

        .page-btn:hover:not(:disabled),
        .page-number:hover {
          border-color: #B08A55;
          background: #F1E4D0;
          color: #3B1A0C;
          transform: translateY(-2px);
        }

        .page-btn:disabled {
          cursor: not-allowed;
          opacity: .35;
        }

        .page-active {
          border-color: #3B1A0C;
          background: #3B1A0C;
          color: #F5DDAF;
          box-shadow: 0 4px 10px rgba(59,26,12,.2);
        }

        .form-label {
          display: block;
          margin-bottom: 9px;
          color: #553727;
          font-size: 13px;
          font-weight: 700;
        }

        .form-label span {
          color: #B75B42;
        }

        .form-input {
          width: 100%;
          border: 1px solid #E8D8C7;
          border-radius: 12px;
          background: white;
          padding: 12px 15px;
          color: #432619;
          font-size: 13px;
          outline: none;
          transition: all .25s ease;
        }

        .form-input::placeholder {
          color: #B8A69A;
          font-family: Georgia, serif;
          font-style: italic;
        }

        .form-input:focus {
          border-color: #A87942;
          background: #FFFCF7;
          box-shadow: 0 0 0 4px rgba(176,138,85,.11);
        }

        .form-input option,
        .filter-select option {
          background: #FFF9F0;
          color: #432619;
          padding: 12px;
        }

        .filter-select {
          cursor: pointer;
        }

        .filter-select:hover {
          color: #432619;
        }

        button {
          cursor: pointer;
        }

        button:disabled {
          cursor: not-allowed;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes modalIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .scroll-reveal {
            opacity: 1;
            transform: none;
            transition: none;
          }

          .stat-card {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
