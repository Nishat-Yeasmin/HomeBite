
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiX,
  FiRefreshCw,
  FiLayers,
  FiPackage,
  FiImage,
  FiGrid,
  FiList,
  FiFilter,
  FiChevronDown,
  FiCheckCircle,
  FiAlertCircle,
  FiTag,
  FiArrowUpRight,
  FiCoffee,
} from "react-icons/fi";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const PAGE_SIZE = 6;

const initialCategory = {
  name: "",
  description: "",
  image_url: "",
};

const cardThemes = [
  {
    card: "bg-[#FFF0E7]",
    icon: "bg-[#F9D9C8] text-[#A65335]",
    badge: "bg-[#F9D9C8] text-[#8E432C]",
    accent: "bg-[#B65F3E]",
    label: "Warm Peach",
  },
  {
    card: "bg-[#EDF5E9]",
    icon: "bg-[#D6E9CF] text-[#4D7A43]",
    badge: "bg-[#D6E9CF] text-[#426B38]",
    accent: "bg-[#5D8C50]",
    label: "Fresh Green",
  },
  {
    card: "bg-[#F0ECFA]",
    icon: "bg-[#DED6F2] text-[#7059A6]",
    badge: "bg-[#DED6F2] text-[#665091]",
    accent: "bg-[#7964B2]",
    label: "Lavender",
  },
  {
    card: "bg-[#FFF5DE]",
    icon: "bg-[#F8E4B5] text-[#A47724]",
    badge: "bg-[#F8E4B5] text-[#8D671D]",
    accent: "bg-[#B58A35]",
    label: "Golden",
  },
  {
    card: "bg-[#EAF3F8]",
    icon: "bg-[#D0E5F0] text-[#427A99]",
    badge: "bg-[#D0E5F0] text-[#376C88]",
    accent: "bg-[#4C87A5]",
    label: "Sky Blue",
  },
  {
    card: "bg-[#FBECEF]",
    icon: "bg-[#F4D5DC] text-[#A34E65]",
    badge: "bg-[#F4D5DC] text-[#914257]",
    accent: "bg-[#B75D74]",
    label: "Rose",
  },
];

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <div className="group rounded-2xl border border-[#F0E1D8] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h2 className="mt-2 text-2xl font-bold text-[#2C0E05]">
            {value}
          </h2>
          <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:rotate-6 ${color}`}
        >
          <Icon size={23} />
        </div>
      </div>
    </div>
  );
}

function Modal({ title, onClose, children, wide = false }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/55 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={`category-modal my-auto max-h-[92vh] w-full ${
          wide ? "max-w-2xl" : "max-w-xl"
        } overflow-y-auto rounded-2xl bg-white shadow-2xl`}
      >
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#F0E1D8] bg-white px-6 py-4">
          <h2 className="font-serif text-lg font-bold text-[#2C0E05]">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-[#F3E3DC] hover:text-[#2C0E05]"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function StatusBadge({ count }) {
  const hasFoods = Number(count || 0) > 0;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold ${
        hasFoods
          ? "bg-green-100 text-green-700"
          : "bg-gray-100 text-gray-500"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          hasFoods ? "bg-green-500" : "bg-gray-400"
        }`}
      />
      {hasFoods ? "In Use" : "Empty"}
    </span>
  );
}

function ActionButton({ icon: Icon, title, onClick, danger = false }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 ${
        danger
          ? "bg-red-50 text-red-600 hover:bg-red-100"
          : "bg-white/80 text-[#80563F] hover:bg-white hover:text-[#2C0E05]"
      }`}
    >
      <Icon size={16} />
    </button>
  );
}

function CategoryCard({
  category,
  index,
  onView,
  onEdit,
  onDelete,
}) {
  const theme = cardThemes[index % cardThemes.length];
  const foodCount = Number(category.food_count || 0);

  return (
    <article
      className={`category-card group overflow-hidden rounded-2xl border border-black/[0.04] ${theme.card} transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl`}
      style={{ animationDelay: `${index * 75}ms` }}
    >
      {/* Image area */}
      <div className="relative h-44 overflow-hidden bg-white/40">
        {category.image_url ? (
          <img
            src={category.image_url}
            alt={category.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(event) => {
              event.currentTarget.style.display = "none";
              event.currentTarget.nextElementSibling.style.display = "flex";
            }}
          />
        ) : null}

        <div
          className="absolute inset-0 items-center justify-center"
          style={{ display: category.image_url ? "none" : "flex" }}
        >
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-3xl ${theme.icon}`}
          >
            <FiImage size={34} />
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#2C0E05]/55 via-transparent to-transparent" />

        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold text-[#553426] shadow-sm backdrop-blur">
          CATEGORY #{category.id}
        </span>

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
          <span className="max-w-[70%] truncate font-serif text-xl font-bold text-white drop-shadow-md">
            {category.name}
          </span>

          <span className="shrink-0 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold text-[#2C0E05] shadow">
            {foodCount} {foodCount === 1 ? "Food" : "Foods"}
          </span>
        </div>
      </div>

      {/* Card content */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <StatusBadge count={foodCount} />

          <span className="text-[10px] font-semibold text-[#765E50]/70">
            {theme.label}
          </span>
        </div>

        <p className="mt-3 min-h-[42px] text-xs leading-6 text-[#684F43]">
          {category.description || "No description added for this category."}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-black/[0.07] pt-3">
          <button
            onClick={onView}
            className="group/view flex items-center gap-1.5 text-xs font-bold text-[#68402D] transition hover:text-[#2C0E05]"
          >
            View Details
            <FiArrowUpRight className="transition-transform group-hover/view:-translate-y-0.5 group-hover/view:translate-x-0.5" />
          </button>

          <div className="flex items-center gap-1.5">
            <ActionButton
              icon={FiEdit2}
              title="Edit category"
              onClick={onEdit}
            />
            <ActionButton
              icon={FiTrash2}
              title="Delete category"
              danger
              onClick={onDelete}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("oldest");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const [modal, setModal] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [viewCategory, setViewCategory] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [form, setForm] = useState(initialCategory);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [notice, setNotice] = useState(null);
  const noticeTimer = useRef(null);

  // Toast notification
  const showNotice = useCallback((message, type = "success") => {
    setNotice({ message, type });

    if (noticeTimer.current) {
      window.clearTimeout(noticeTimer.current);
    }

    noticeTimer.current = window.setTimeout(() => {
      setNotice(null);
    }, 3500);
  }, []);

  useEffect(() => {
    return () => {
      if (noticeTimer.current) {
        window.clearTimeout(noticeTimer.current);
      }
    };
  }, []);

  // Fetch categories
  const fetchCategories = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(`${API_URL}/api/categories`, {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load categories.");
      }

      setCategories(
        Array.isArray(result.categories) ? result.categories : []
      );
    } catch (error) {
      console.error("CATEGORY FETCH ERROR:", error);
      showNotice(error.message || "Could not load categories.", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showNotice]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Statistics
  const totalFoods = useMemo(
    () =>
      categories.reduce(
        (total, category) => total + Number(category.food_count || 0),
        0
      ),
    [categories]
  );

  const usedCategories = categories.filter(
    (category) => Number(category.food_count || 0) > 0
  ).length;

  const emptyCategories = categories.length - usedCategories;

  // Search and sorting
  const filteredCategories = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const result = categories.filter((category) => {
      return (
        String(category.name || "").toLowerCase().includes(keyword) ||
        String(category.description || "").toLowerCase().includes(keyword)
      );
    });

    if (sortBy === "newest") {
      result.sort((a, b) => Number(b.id) - Number(a.id));
    } else if (sortBy === "name-asc") {
      result.sort((a, b) =>
        String(a.name).localeCompare(String(b.name))
      );
    } else if (sortBy === "name-desc") {
      result.sort((a, b) =>
        String(b.name).localeCompare(String(a.name))
      );
    } else if (sortBy === "most-foods") {
      result.sort(
        (a, b) =>
          Number(b.food_count || 0) - Number(a.food_count || 0)
      );
    } else {
      result.sort((a, b) => Number(a.id) - Number(b.id));
    }

    return result;
  }, [categories, search, sortBy]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / PAGE_SIZE)
  );

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const startItem =
    filteredCategories.length === 0
      ? 0
      : (currentPage - 1) * PAGE_SIZE + 1;

  const endItem = Math.min(
    currentPage * PAGE_SIZE,
    filteredCategories.length
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Add category
  const openAddModal = () => {
    setEditingCategory(null);
    setForm(initialCategory);
    setModal("form");
  };

  // Edit category
  const openEditModal = (category) => {
    setEditingCategory(category);

    setForm({
      name: category.name || "",
      description: category.description || "",
      image_url: category.image_url || "",
    });

    setModal("form");
  };

  // Form change
  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Save category
  const saveCategory = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      showNotice("Please enter a category name.", "error");
      return;
    }

    const token = localStorage.getItem("homebite-token");

    if (!token) {
      showNotice("Please login as admin first.", "error");
      return;
    }

    const isEditing = Boolean(editingCategory);

    try {
      setSaving(true);

      const url = isEditing
        ? `${API_URL}/api/categories/${editingCategory.id}`
        : `${API_URL}/api/categories`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
          image_url: form.image_url.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Category save failed.");
      }

      setModal(null);
      setEditingCategory(null);
      setForm(initialCategory);

      showNotice(
        result.message ||
          (isEditing
            ? "Category updated successfully!"
            : "Category created successfully!")
      );

      await fetchCategories(true);
    } catch (error) {
      console.error("CATEGORY SAVE ERROR:", error);
      showNotice(error.message || "Could not save category.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Delete category
  const deleteCategory = async () => {
    if (!deleteTarget) return;

    const token = localStorage.getItem("homebite-token");

    if (!token) {
      showNotice("Please login as admin first.", "error");
      return;
    }

    try {
      setDeleting(true);

      const response = await fetch(
        `${API_URL}/api/categories/${deleteTarget.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Category delete failed.");
      }

      setDeleteTarget(null);
      showNotice(result.message || "Category deleted successfully!");

      await fetchCategories(true);
    } catch (error) {
      console.error("CATEGORY DELETE ERROR:", error);
      showNotice(error.message || "Could not delete category.", "error");
    } finally {
      setDeleting(false);
    }
  };

  const closeFormModal = () => {
    if (saving) return;

    setModal(null);
    setEditingCategory(null);
    setForm(initialCategory);
  };

  const closeViewModal = () => setViewCategory(null);

  return (
    <div className="min-h-screen bg-[#FFF8F3] px-5 pb-8 pt-3 text-[#2C0E05] md:px-8 md:pb-8 md:pt- lg:pl-[290px]">

      {/* Animations */}
      <style jsx global>{`
        @keyframes categoryFadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes categoryModalIn {
          from {
            opacity: 0;
            transform: translateY(14px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes categoryToastIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .category-animate {
          animation: categoryFadeUp 0.55s ease both;
        }

        .category-card {
          animation: categoryFadeUp 0.5s ease both;
        }

        .category-modal {
          animation: categoryModalIn 0.25s ease-out both;
        }

        .category-skeleton {
          background: linear-gradient(
            90deg,
            #f0e5de 25%,
            #fff8f3 50%,
            #f0e5de 75%
          );
          background-size: 200% 100%;
          animation: categoryShimmer 1.4s infinite linear;
        }

        @keyframes categoryShimmer {
          to {
            background-position: -200% 0;
          }
        }

        button {
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
}
  
        @media (prefers-reduced-motion: reduce) {
          .category-animate,
          .category-card,
          .category-modal,
          .category-skeleton {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* ================= HEADER WITH IMAGE ================= */}
      <section className="category-animate relative mb-6 min-h-[250px] overflow-hidden rounded-2xl bg-gradient-to-r from-[#2C0E05] via-[#542315] to-[#8A4C2F] shadow-lg md:min-h-[275px]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=85"
            alt="Delicious homemade food collection"
            className="h-full w-full object-cover object-center opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2C0E05] via-[#2C0E05]/90 to-[#2C0E05]/25" />
        </div>

        <div className="relative z-10 flex min-h-[250px] flex-col justify-center gap-6 p-6 md:min-h-[275px] md:flex-row md:items-center md:justify-between md:px-9 md:py-8">
          <div className="max-w-xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#E9C6A7]/40 bg-white/10 px-3 py-1.5 text-xs font-semibold text-[#E9C6A7] backdrop-blur-sm">
              <FiLayers />
              HOME BITE / CATEGORY COLLECTION
            </div>

            <h1 className="font-serif text-3xl font-bold leading-tight text-white md:text-4xl">
              Explore & Manage
              <span className="block text-[#E8BC83]">
                Food Categories
              </span>
            </h1>

            <p className="mt-3 max-w-lg text-sm leading-6 text-[#F3E3DC]">
              Keep your homemade food menu organized. Create beautiful
              categories and manage every collection with ease.
            </p>

            <button
              onClick={openAddModal}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#B08A55] px-5 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-[#9B7440] hover:shadow-lg active:scale-95"
            >
              <FiPlus size={17} />
              Add New Category
            </button>
          </div>

          {/* Header image accent */}
          <div className="hidden shrink-0 md:block">
            <div className="relative h-48 w-48 overflow-hidden rounded-[32px] border-[5px] border-white/20 shadow-2xl rotate-3 transition duration-500 hover:rotate-0 hover:scale-105 lg:h-56 lg:w-56">
              <img
                src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=650&q=85"
                alt="Freshly prepared food"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C0E05]/55 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-serif text-lg font-bold">
                  Made with Care
                </p>
                <p className="text-[10px] text-white/80">
                  Homemade goodness
                </p>
              </div>
            </div>

            <div className="absolute -bottom-8 right-44 h-20 w-20 rounded-full border-[12px] border-[#D6B17A]/30" />
          </div>
        </div>

        <div className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full border-[25px] border-white/[0.06]" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-[#B08A55]/10 blur-2xl" />
      </section>

      {/* ================= STATS ================= */}
      <section className="mb-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-[#2C0E05]">Overview</h2>
          <span className="text-xs text-gray-500">Live database data</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Categories"
            value={categories.length}
            subtitle="All food collections"
            icon={FiLayers}
            color="bg-[#F3E3DC] text-[#8B4934]"
          />

          <StatCard
            title="Total Food Items"
            value={totalFoods}
            subtitle="Foods in all categories"
            icon={FiPackage}
            color="bg-[#E5F3E8] text-[#287A43]"
          />

          <StatCard
            title="Categories In Use"
            value={usedCategories}
            subtitle="Have food items"
            icon={FiCheckCircle}
            color="bg-[#FFF0D8] text-[#A66B19]"
          />

          <StatCard
            title="Empty Categories"
            value={emptyCategories}
            subtitle="No food assigned yet"
            icon={FiCoffee}
            color="bg-[#E9E5F8] text-[#6653A4]"
          />
        </div>
      </section>

      {/* ================= CATEGORY COLLECTION ================= */}
      <section className="overflow-hidden rounded-2xl border border-[#F0E1D8] bg-white shadow-sm">
        {/* Section heading */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F0E1D8] p-5">
          <div>
            <h2 className="text-lg font-bold text-[#2C0E05]">
              Category Collection
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Browse, organize and manage your food categories.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => fetchCategories(true)}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-lg border border-[#EADBD2] px-3 py-2.5 text-xs font-semibold text-[#704632] transition hover:bg-[#FFF3E9] disabled:opacity-50"
            >
              <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>

            <button
              onClick={openAddModal}
              className="flex items-center gap-2 rounded-lg bg-[#2C0E05] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#6B3020] hover:shadow-lg active:scale-95"
            >
              <FiPlus />
              Add Category
            </button>
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col gap-3 border-b border-[#F0E1D8] bg-[#FFFCFA] p-5 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search category..."
              className="w-full rounded-lg border border-[#EADBD2] py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-[#B08A55] focus:ring-2 focus:ring-[#B08A55]/10"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-3 text-gray-400 hover:text-[#2C0E05]"
              >
                <FiX />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <FiFilter className="text-gray-400" />

            <span className="text-xs text-gray-500">Sort:</span>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="min-w-[155px] appearance-none rounded-lg border border-[#EADBD2] bg-white py-2.5 pl-3 pr-9 text-xs font-semibold text-[#684632] outline-none focus:border-[#B08A55]"
              >
                <option value="oldest">Oldest First</option>
                <option value="newest">Newest First</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="most-foods">Most Foods</option>
              </select>
              <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            <div className="flex rounded-lg border border-[#EADBD2] bg-white p-1">
              <button
                onClick={() => setViewMode("grid")}
                title="Grid view"
                className={`rounded-md p-2 transition ${
                  viewMode === "grid"
                    ? "bg-[#2C0E05] text-white"
                    : "text-gray-500 hover:bg-[#FFF3E9]"
                }`}
              >
                <FiGrid />
              </button>

              <button
                onClick={() => setViewMode("list")}
                title="List view"
                className={`rounded-md p-2 transition ${
                  viewMode === "list"
                    ? "bg-[#2C0E05] text-white"
                    : "text-gray-500 hover:bg-[#FFF3E9]"
                }`}
              >
                <FiList />
              </button>
            </div>
          </div>
        </div>

        {/* Result count */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-4">
          <p className="text-xs text-gray-500">
            Showing{" "}
            <span className="font-bold text-[#2C0E05]">{startItem}</span>
            {" - "}
            <span className="font-bold text-[#2C0E05]">{endItem}</span>
            {" of "}
            <span className="font-bold text-[#2C0E05]">
              {filteredCategories.length}
            </span>{" "}
            categories
          </p>

          {search && (
            <span className="rounded-full bg-[#F3E3DC] px-3 py-1 text-[10px] font-semibold text-[#713B2A]">
              Search: {search}
            </span>
          )}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-[#F0E1D8]"
              >
                <div className="category-skeleton h-44" />
                <div className="space-y-3 p-4">
                  <div className="category-skeleton h-4 w-2/3 rounded" />
                  <div className="category-skeleton h-3 w-full rounded" />
                  <div className="category-skeleton h-3 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-5 py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F3E3DC] text-2xl text-[#8B4934]">
              <FiLayers />
            </div>

            <h3 className="font-serif text-xl font-bold text-[#2C0E05]">
              {search ? "No Categories Found" : "No Categories Yet"}
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
              {search
                ? "Try another keyword or clear your search."
                : "Create your first category to organize your homemade foods."}
            </p>

            <button
              onClick={search ? () => setSearch("") : openAddModal}
              className="mt-5 rounded-lg bg-[#2C0E05] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#6B3020]"
            >
              {search ? "Clear Search" : "Create Category"}
            </button>
          </div>
        ) : (
          <>
            {/* GRID VIEW */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 gap-5 px-5 pb-6 sm:grid-cols-2 xl:grid-cols-3">
                {paginatedCategories.map((category, index) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    index={index}
                    onView={() => setViewCategory(category)}
                    onEdit={() => openEditModal(category)}
                    onDelete={() => setDeleteTarget(category)}
                  />
                ))}
              </div>
            ) : (
              /* LIST VIEW */
              <div className="overflow-x-auto px-5 pb-5">
                <table className="w-full min-w-[750px] text-left text-sm">
                  <thead>
                    <tr className="border-b bg-[#FFF8F3] text-xs uppercase text-gray-500">
                      <th className="px-3 py-3">Category</th>
                      <th className="px-3 py-3">Description</th>
                      <th className="px-3 py-3 text-center">Foods</th>
                      <th className="px-3 py-3 text-center">Status</th>
                      <th className="px-3 py-3 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedCategories.map((category, index) => (
                      <tr
                        key={category.id}
                        style={{ animationDelay: `${index * 70}ms` }}
                        className="category-card border-b border-[#F4EAE4] transition-all duration-300 hover:bg-[#FFFCFA]"
                      >
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F3E3DC]">
                              {category.image_url ? (
                                <img
                                  src={category.image_url}
                                  alt={category.name}
                                  className="h-full w-full object-cover"
                                  onError={(event) => {
                                    event.currentTarget.style.display = "none";
                                  }}
                                />
                              ) : (
                                <FiImage className="text-xl text-[#9B6D53]" />
                              )}
                            </div>

                            <div>
                              <p className="font-semibold text-[#2C0E05]">
                                {category.name}
                              </p>
                              <p className="mt-1 text-[10px] text-gray-400">
                                ID: #{category.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="max-w-[240px] px-3 py-3 text-xs text-gray-500">
                          <p className="line-clamp-2">
                            {category.description || "No description"}
                          </p>
                        </td>

                        <td className="px-3 py-3 text-center">
                          <span className="rounded-full bg-[#FFF0D8] px-3 py-1.5 text-xs font-bold text-[#9B641D]">
                            {Number(category.food_count || 0)}
                          </span>
                        </td>

                        <td className="px-3 py-3 text-center">
                          <StatusBadge count={category.food_count} />
                        </td>

                        <td className="px-3 py-3">
                          <div className="flex justify-end gap-2">
                            <ActionButton
                              icon={FiEye}
                              title="View"
                              onClick={() => setViewCategory(category)}
                            />
                            <ActionButton
                              icon={FiEdit2}
                              title="Edit"
                              onClick={() => openEditModal(category)}
                            />
                            <ActionButton
                              icon={FiTrash2}
                              title="Delete"
                              danger
                              onClick={() => setDeleteTarget(category)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#F0E1D8] px-5 py-4">
              <p className="text-xs text-gray-500">
                Page {currentPage} of {totalPages}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  disabled={currentPage === 1}
                  className="rounded-lg border border-[#EADBD2] px-3 py-2 text-xs font-semibold text-[#704632] transition hover:bg-[#FFF3E9] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`h-9 min-w-9 rounded-lg px-3 text-xs font-bold transition ${
                        currentPage === page
                          ? "bg-[#2C0E05] text-white"
                          : "border border-[#EADBD2] text-[#704632] hover:bg-[#FFF3E9]"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-[#EADBD2] px-3 py-2 text-xs font-semibold text-[#704632] transition hover:bg-[#FFF3E9] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* ================= ADD / EDIT MODAL ================= */}
      {modal === "form" && (
        <Modal
          title={editingCategory ? "Edit Category" : "Add New Category"}
          onClose={closeFormModal}
        >
          <form onSubmit={saveCategory} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#51372B]">
                Category Name *
              </label>
              <input
                required
                name="name"
                value={form.name}
                onChange={handleFormChange}
                maxLength={100}
                placeholder="e.g. Cake & Bakery"
                className="w-full rounded-lg border border-[#EADBD2] px-4 py-3 text-sm outline-none transition focus:border-[#B08A55] focus:ring-2 focus:ring-[#B08A55]/10"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#51372B]">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                maxLength={500}
                value={form.description}
                onChange={handleFormChange}
                placeholder="Write a short category description..."
                className="w-full resize-none rounded-lg border border-[#EADBD2] px-4 py-3 text-sm outline-none transition focus:border-[#B08A55] focus:ring-2 focus:ring-[#B08A55]/10"
              />
              <p className="mt-1 text-right text-[10px] text-gray-400">
                {form.description.length}/500
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#51372B]">
                Category Image URL
              </label>
              <input
                type="url"
                name="image_url"
                value={form.image_url}
                onChange={handleFormChange}
                placeholder="https://example.com/category.jpg"
                className="w-full rounded-lg border border-[#EADBD2] px-4 py-3 text-sm outline-none transition focus:border-[#B08A55] focus:ring-2 focus:ring-[#B08A55]/10"
              />

              {form.image_url.trim() && (
                <div className="mt-3 rounded-xl border border-[#F0E1D8] bg-[#FFF8F3] p-3">
                  <p className="mb-2 text-xs font-semibold text-gray-500">
                    Image Preview
                  </p>
                  <img
                    src={form.image_url}
                    alt="Category preview"
                    className="h-40 w-full rounded-lg object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                    onLoad={(event) => {
                      event.currentTarget.style.display = "block";
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-[#F0E1D8] pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeFormModal}
                disabled={saving}
                className="rounded-lg border border-[#EADBD2] px-5 py-3 text-sm font-semibold text-[#704632] transition hover:bg-[#FFF8F3] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#2C0E05] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6B3020] disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <FiRefreshCw className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    {editingCategory ? <FiEdit2 /> : <FiPlus />}
                    {editingCategory ? "Update Category" : "Add Category"}
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ================= VIEW DETAILS MODAL ================= */}
      {viewCategory && (
        <Modal
          title="Category Details"
          onClose={closeViewModal}
          wide
        >
          <div className="overflow-hidden rounded-xl bg-[#FFF8F3]">
            <div className="relative h-56 bg-[#F3E3DC]">
              {viewCategory.image_url ? (
                <img
                  src={viewCategory.image_url}
                  alt={viewCategory.name}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-5xl text-[#9B6D53]">
                  <FiImage />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#2C0E05]/75 to-transparent" />

              <div className="absolute bottom-5 left-5">
                <span className="rounded-full bg-[#B08A55] px-3 py-1 text-[10px] font-bold text-white">
                  CATEGORY #{viewCategory.id}
                </span>
                <h3 className="mt-2 font-serif text-2xl font-bold text-white">
                  {viewCategory.name}
                </h3>
              </div>
            </div>

            <div className="space-y-5 p-5">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#9B765F]">
                  Description
                </p>
                <p className="text-sm leading-7 text-[#684F43]">
                  {viewCategory.description || "No description available."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <FiPackage className="mb-2 text-xl text-[#A66B19]" />
                  <p className="text-2xl font-bold text-[#2C0E05]">
                    {Number(viewCategory.food_count || 0)}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">Food Items</p>
                </div>

                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <FiTag className="mb-2 text-xl text-[#7964B2]" />
                  <p className="text-2xl font-bold text-[#2C0E05]">
                    #{viewCategory.id}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">Category ID</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EADBD2] pt-4">
                <StatusBadge count={viewCategory.food_count} />

                <button
                  onClick={() => {
                    const selected = viewCategory;
                    setViewCategory(null);
                    openEditModal(selected);
                  }}
                  className="flex items-center gap-2 rounded-lg bg-[#2C0E05] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#6B3020]"
                >
                  <FiEdit2 />
                  Edit Category
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ================= DELETE CONFIRMATION ================= */}
      {deleteTarget && (
        <Modal
          title="Confirm Category Deletion"
          onClose={() => {
            if (!deleting) setDeleteTarget(null);
          }}
        >
          <div className="py-2 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-2xl text-red-600">
              <FiTrash2 />
            </div>

            <h3 className="font-serif text-xl font-bold text-[#2C0E05]">
              Delete this category?
            </h3>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500">
              You are about to delete{" "}
              <strong className="text-[#2C0E05]">
                {deleteTarget.name}
              </strong>
              . This action cannot be undone.
            </p>

            {Number(deleteTarget.food_count || 0) > 0 && (
              <div className="mt-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-left">
                <FiAlertCircle className="mt-0.5 shrink-0 text-amber-600" />
                <p className="text-xs leading-5 text-amber-800">
                  This category contains{" "}
                  <strong>{deleteTarget.food_count} food item(s)</strong>.
                  Your backend will prevent deletion until those foods are
                  moved or deleted.
                </p>
              </div>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="rounded-lg border border-[#EADBD2] px-5 py-3 text-sm font-semibold text-[#704632] transition hover:bg-[#FFF8F3]"
              >
                Cancel
              </button>

              <button
                onClick={deleteCategory}
                disabled={deleting}
                className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <FiRefreshCw className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 />
                    Delete Category
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ================= TOAST ================= */}
      {notice && (
        <div
          className={`fixed bottom-5 right-5 z-[130] flex max-w-sm items-center gap-3 rounded-xl border bg-white px-4 py-3.5 shadow-xl ${
            notice.type === "error"
              ? "border-red-200 text-red-700"
              : "border-green-200 text-green-800"
          }`}
          style={{ animation: "categoryToastIn .25s ease both" }}
        >
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
              notice.type === "error" ? "bg-red-50" : "bg-green-50"
            }`}
          >
            {notice.type === "error" ? (
              <FiAlertCircle />
            ) : (
              <FiCheckCircle />
            )}
          </span>

          <p className="flex-1 text-xs font-semibold">{notice.message}</p>

          <button
            onClick={() => setNotice(null)}
            className="text-gray-400 hover:text-gray-700"
          >
            <FiX />
          </button>
        </div>
      )}
    </div>
  );
}
