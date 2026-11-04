"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FiShoppingBag,
  FiDollarSign,
  FiGrid,
  FiLayers,
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiImage,
  FiRefreshCw,
  FiEye,
} from "react-icons/fi";

import Sidebar from "@/app/components/admin/Sidebar";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const money = (value) =>
  `৳${Number(value || 0).toLocaleString("en-BD", {
    maximumFractionDigits: 2,
  })}`;

const getImage = (url) => url?.trim() || "/images/food-placeholder.png";

const initialFood = {
  name: "",
  category_id: "",
  description: "",
  price: "",
  image_url: "",
  is_available: true,
};

const initialCategory = {
  name: "",
  description: "",
  image_url: "",
};

function StatCard({ title, value, icon: Icon, color, subtitle }) {
  return (
    <div className="group rounded-2xl border border-[#F0E1D8] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h2 className="mt-2 text-2xl font-bold text-[#2C0E05]">
            {value}
          </h2>
          <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${color} transition-transform duration-300 group-hover:rotate-6`}
        >
          <Icon size={23} />
        </div>
      </div>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-xl animate-[modalIn_.25s_ease-out] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
          <h2 className="text-lg font-bold text-[#2C0E05]">{title}</h2>
          <button
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

export default function AdminDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalEarnings: 0,
    totalFoods: 0,
    totalCategories: 0,
  });
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  const [modal, setModal] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [foodForm, setFoodForm] = useState(initialFood);
  const [categoryForm, setCategoryForm] = useState(initialCategory);

  const [foodSearch, setFoodSearch] = useState("");

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3500);
  };

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);

      const [foodRes, categoryRes, statsRes, salesRes] =
        await Promise.all([
          fetch(`${API_URL}/api/foods`),
          fetch(`${API_URL}/api/categories`),
          fetch(`${API_URL}/api/admin/stats`),
          fetch(`${API_URL}/api/admin/sales`),
        ]);

      if (!foodRes.ok || !categoryRes.ok || !statsRes.ok || !salesRes.ok) {
        throw new Error("Could not load dashboard data");
      }

      const [foodData, categoryData, statsData, salesData] =
        await Promise.all([
          foodRes.json(),
          categoryRes.json(),
          statsRes.json(),
          salesRes.json(),
        ]);

      setFoods(foodData.foods || []);

const loadedCategories = categoryData.categories || [];
setCategories(loadedCategories);

console.log("Loaded categories:", loadedCategories);

      setStats(statsData.stats || {});
      setSales(salesData.sales || []);
    } catch (error) {
      console.error("Dashboard loading error:", error);
      showNotice("Dashboard data load korte problem hoyeche.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const filteredFoods = useMemo(() => {
    const query = foodSearch.toLowerCase().trim();

    return foods.filter((food) => {
      return (
        food.name?.toLowerCase().includes(query) ||
        food.category_name?.toLowerCase().includes(query)
      );
    });
  }, [foods, foodSearch]);

  const maxEarning = Math.max(
    ...sales.map((item) => Number(item.earnings || 0)),
    1
  );

  // Food modal
  const openFoodModal = (food = null) => {
    setEditingId(food?.id || null);

    if (food) {
      setFoodForm({
        name: food.name || "",
        category_id: String(food.category_id || ""),
        description: food.description || "",
        price: food.price || "",
        image_url: food.image_url || "",
        is_available: Boolean(Number(food.is_available)),
      });
    } else {
      setFoodForm({
        ...initialFood,
        category_id: categories[0] ? String(categories[0].id) : "",
      });
    }

    setModal("food");
  };

  const saveFood = async (e) => {
    e.preventDefault();

    if (!foodForm.category_id) {
      showNotice("Please select a category.");
      return;
    }

    try {
      setSaving(true);

      const url = editingId
        ? `${API_URL}/api/foods/${editingId}`
        : `${API_URL}/api/foods`;
console.log("CATEGORY API URL:", url);

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...foodForm,
          price: Number(foodForm.price),
          category_id: Number(foodForm.category_id),
          is_available: foodForm.is_available ? 1 : 0,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Food save failed");
      }

      setModal(null);
      showNotice(result.message || "Food saved successfully!");
      await loadDashboard();
    } catch (error) {
      showNotice(error.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteFood = async (id) => {
    if (!window.confirm("Are you sure you want to delete this food?")) return;

    try {
      const response = await fetch(`${API_URL}/api/foods/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      showNotice(result.message);
      await loadDashboard();
    } catch (error) {
      showNotice(error.message);
    }
  };

  // Category modal
  const openCategoryModal = (category = null) => {
    setEditingId(category?.id || null);

    setCategoryForm(
      category
        ? {
            name: category.name || "",
            description: category.description || "",
            image_url: category.image_url || "",
          }
        : initialCategory
    );

    setModal("category");
  };

 const saveCategory = async (e) => {
  e.preventDefault();

  try {
    setSaving(true);

    const url = editingId
      ? `${API_URL}/api/categories/${editingId}`
      : `${API_URL}/api/categories`;

    const response = await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryForm),
    });

    const responseText = await response.text();

    console.log("CATEGORY SAVE STATUS:", response.status);
    console.log("CATEGORY SAVE RESPONSE:", responseText);

    let result;

    try {
      result = JSON.parse(responseText);
    } catch {
      throw new Error(
        `Backend returned HTML instead of JSON. Status: ${response.status}`
      );
    }

    if (!response.ok) {
      throw new Error(
        result.message || result.error || "Category save failed"
      );
    }

    setModal(null);
    showNotice(result.message || "Category saved successfully!");

    await loadDashboard();
  } catch (error) {
    console.error("Category Save Error:", error);
    showNotice(error.message);
  } finally {
    setSaving(false);
  }
};

  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await fetch(`${API_URL}/api/categories/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      showNotice(result.message);
      await loadDashboard();
    } catch (error) {
      showNotice(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F3] text-[#2C0E05]">
      <style jsx global>{`
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="min-h-screen lg:ml-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#F0E1D8] bg-white/90 px-5 py-4 backdrop-blur-md md:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg border border-[#F0E1D8] p-2 lg:hidden"
            >
              <FiLayers size={20} />
            </button>

            <div>
              <h1 className="text-lg font-bold md:text-xl">Admin Dashboard</h1>
              <p className="text-xs text-gray-500">
                Manage your HomeBite store
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadDashboard}
              className="flex items-center gap-2 rounded-lg bg-[#F3E3DC] px-3 py-2 text-sm font-medium transition hover:bg-[#EBD2C5]"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2C0E05] font-bold text-white">
              A
            </div>
          </div>
        </header>

        <div className="space-y-8 p-5 md:p-8">
          {/* Welcome */}
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2C0E05] to-[#6B3020] p-6 text-white shadow-lg md:p-8">
            <div className="relative z-10 max-w-xl">
              <p className="mb-2 text-sm text-[#E9C6A7]">
                Welcome back, Admin!
              </p>
              <h2 className="text-2xl font-bold md:text-3xl">
                Manage your homemade food business.
              </h2>
              <p className="mt-2 text-sm text-[#F3E3DC]">
                Track orders, earnings, foods and categories from one place.
              </p>

              <Link
                href="/admin/foods"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#B08A55] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#9B7440]"
              >
                <FiEye /> View Food Management
              </Link>
            </div>

            <div className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full border-[30px] border-white/5" />
            <div className="pointer-events-none absolute -bottom-24 right-32 h-56 w-56 rounded-full bg-white/5" />
          </section>

          {/* Stats */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Overview</h2>
              <span className="text-xs text-gray-500">Live database data</span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Total Orders"
                value={Number(stats.totalOrders || 0).toLocaleString()}
                subtitle="All placed orders"
                icon={FiShoppingBag}
                color="bg-[#F3E3DC] text-[#8B4934]"
              />

              <StatCard
                title="Total Earnings"
                value={money(stats.totalEarnings)}
                subtitle="From delivered orders"
                icon={FiDollarSign}
                color="bg-[#E5F3E8] text-[#287A43]"
              />

              <StatCard
                title="Total Foods"
                value={Number(stats.totalFoods || 0).toLocaleString()}
                subtitle="Food items in store"
                icon={FiGrid}
                color="bg-[#FFF0D8] text-[#A66B19]"
              />

              <StatCard
                title="Categories"
                value={Number(stats.totalCategories || 0).toLocaleString()}
                subtitle="Food categories"
                icon={FiLayers}
                color="bg-[#E9E5F8] text-[#6653A4]"
              />
            </div>
          </section>

          {/* Sales chart */}
          <section className="rounded-2xl border border-[#F0E1D8] bg-white p-5 shadow-sm md:p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">Sales Statistics</h2>
                <p className="mt-1 text-xs text-gray-500">
                  Delivered order earnings · Last 7 days
                </p>
              </div>

              <span className="rounded-full bg-[#F3E3DC] px-3 py-1 text-xs font-semibold text-[#713B2A]">
                Weekly Report
              </span>
            </div>

            {sales.length === 0 ? (
              <div className="flex min-h-48 flex-col items-center justify-center rounded-xl bg-[#FFF8F3] text-center">
                <FiDollarSign size={35} className="mb-3 text-[#B08A55]" />
                <p className="font-semibold">No sales data yet</p>
                <p className="mt-1 text-sm text-gray-500">
                  Delivered orders will appear here.
                </p>
              </div>
            ) : (
              <div className="flex h-64 items-end gap-3 overflow-x-auto border-b border-l border-gray-200 px-2 pb-2 pt-6 sm:gap-6">
                {sales.map((item, index) => {
                  const height =
                    (Number(item.earnings || 0) / maxEarning) * 100;

                  return (
                    <div
                      key={item.sale_date}
                      className="flex h-full min-w-12 flex-1 flex-col items-center justify-end gap-2"
                    >
                      <span className="text-[10px] font-semibold text-gray-500 sm:text-xs">
                        {money(item.earnings)}
                      </span>

                      <div className="flex h-full w-full items-end justify-center">
                        <div
                          title={`${money(item.earnings)} earnings`}
                          style={{ height: `${Math.max(height, 3)}%` }}
                          className="w-full max-w-12 rounded-t-lg bg-gradient-to-t from-[#713B2A] to-[#B08A55] transition-all duration-700 hover:brightness-110"
                        />
                      </div>

                      <span className="text-[10px] text-gray-500 sm:text-xs">
                        {new Date(item.sale_date).toLocaleDateString(
                          "en-GB",
                          { day: "2-digit", month: "short" }
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Food management */}
          <section className="overflow-hidden rounded-2xl border border-[#F0E1D8] bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F0E1D8] p-5">
              <div>
                <h2 className="text-lg font-bold">Food Management</h2>
                <p className="mt-1 text-xs text-gray-500">
                  Add, edit and manage food items
                </p>
              </div>

              <button
                onClick={() => openFoodModal()}
                className="flex items-center gap-2 rounded-lg bg-[#2C0E05] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6B3020]"
              >
                <FiPlus /> Add Food
              </button>
            </div>

            <div className="p-5">
              <div className="relative mb-5 max-w-sm">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  value={foodSearch}
                  onChange={(e) => setFoodSearch(e.target.value)}
                  placeholder="Search food or category..."
                  className="w-full rounded-lg border border-[#EADBD2] py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#B08A55]"
                />
              </div>

              {loading ? (
                <div className="py-12 text-center text-sm text-gray-500">
                  Loading foods...
                </div>
              ) : filteredFoods.length === 0 ? (
                <div className="py-12 text-center text-sm text-gray-500">
                  No food items found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] text-left text-sm">
                    <thead>
                      <tr className="border-b bg-[#FFF8F3] text-xs uppercase text-gray-500">
                        <th className="px-3 py-3">Food</th>
                        <th className="px-3 py-3">Category</th>
                        <th className="px-3 py-3">Price</th>
                        <th className="px-3 py-3">Status</th>
                        <th className="px-3 py-3 text-right">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredFoods.map((food) => (
                        <tr
                          key={food.id}
                          className="border-b border-[#F4EAE4] transition hover:bg-[#FFFCFA]"
                        >
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={getImage(food.image_url)}
                                alt={food.name}
                                className="h-12 w-12 rounded-lg border border-[#F0E1D8] object-cover"
                              onError={(e) => {
  e.currentTarget.style.display = "none";
}}
                              />
                              <span className="font-semibold">
                                {food.name}
                              </span>
                            </div>
                          </td>

                          <td className="px-3 py-3 text-gray-600">
                            {food.category_name}
                          </td>

                          <td className="px-3 py-3 font-semibold">
                            {money(food.price)}
                          </td>

                          <td className="px-3 py-3">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                Number(food.is_available)
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
                              {Number(food.is_available)
                                ? "Available"
                                : "Unavailable"}
                            </span>
                          </td>

                          <td className="px-3 py-3">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => openFoodModal(food)}
                                title="Edit food"
                                className="rounded-lg bg-[#FFF0D8] p-2 text-[#9B641D] transition hover:bg-[#F8DDAF]"
                              >
                                <FiEdit2 />
                              </button>

                              <button
                                onClick={() => deleteFood(food.id)}
                                title="Delete food"
                                className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>

          {/* Category management */}
          <section className="rounded-2xl border border-[#F0E1D8] bg-white p-5 shadow-sm">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">Category Management</h2>
                <p className="mt-1 text-xs text-gray-500">
                  Manage food categories and their images
                </p>
              </div>

              <button
                onClick={() => openCategoryModal()}
                className="flex items-center gap-2 rounded-lg bg-[#2C0E05] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6B3020]"
              >
                <FiPlus /> Add Category
              </button>
            </div>

            {categories.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">
                No categories available.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="group flex items-center gap-4 rounded-xl border border-[#F0E1D8] p-3 transition-all duration-300 hover:-translate-y-1 hover:border-[#D7B99F] hover:shadow-md"
                  >
                    <img
                      src={getImage(category.image_url)}
                      alt={category.name}
                      className="h-16 w-16 rounded-xl object-cover"
                    onError={(e) => {
  e.currentTarget.style.display = "none";
}}
                    />

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-bold">{category.name}</h3>
                      <p className="mt-1 text-xs text-gray-500">
                        {category.food_count || 0} food items
                      </p>

                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => openCategoryModal(category)}
                          className="text-xs font-semibold text-[#9B641D] hover:underline"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteCategory(category.id)}
                          className="text-xs font-semibold text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Notification */}
      {notice && (
        <div className="fixed bottom-5 right-5 z-[120] max-w-sm animate-[modalIn_.2s_ease-out] rounded-xl bg-[#2C0E05] px-5 py-3 text-sm text-white shadow-xl">
          {notice}
        </div>
      )}

      {/* Food form modal */}
      {modal === "food" && (
        <Modal
          title={editingId ? "Edit Food" : "Add New Food"}
          onClose={() => setModal(null)}
        >
          <form onSubmit={saveFood} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold">
                Food Name *
              </label>
              <input
                required
                value={foodForm.name}
                onChange={(e) =>
                  setFoodForm({ ...foodForm, name: e.target.value })
                }
                placeholder="Enter food name"
                className="w-full rounded-lg border border-[#EADBD2] px-4 py-3 text-sm outline-none focus:border-[#B08A55]"
              />
            </div>

           <div>
  <label className="mb-1 block text-sm font-semibold">
    Food Category *
  </label>

  <select
    required
    value={foodForm.category_id}
    onChange={(e) =>
      setFoodForm({
        ...foodForm,
        category_id: e.target.value,
      })
    }
    disabled={categories.length === 0}
    className="w-full rounded-lg border border-[#EADBD2] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#B08A55] disabled:cursor-not-allowed disabled:bg-gray-100"
  >
    <option value="">
      {categories.length === 0
        ? "No categories found"
        : "Select a food category"}
    </option>

    {categories.map((category) => (
      <option key={category.id} value={category.id}>
        {category.name}
      </option>
    ))}
  </select>

  {categories.length === 0 && (
    <p className="mt-2 text-xs text-red-500">
      No categories available. Please add a category first.
    </p>
  )}
</div>

            <div>
              <label className="mb-1 block text-sm font-semibold">
                Description
              </label>
              <textarea
                rows={3}
                value={foodForm.description}
                onChange={(e) =>
                  setFoodForm({ ...foodForm, description: e.target.value })
                }
                placeholder="Describe this food..."
                className="w-full rounded-lg border border-[#EADBD2] px-4 py-3 text-sm outline-none focus:border-[#B08A55]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold">
                Price (৳) *
              </label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={foodForm.price}
                onChange={(e) =>
                  setFoodForm({ ...foodForm, price: e.target.value })
                }
                placeholder="Enter price"
                className="w-full rounded-lg border border-[#EADBD2] px-4 py-3 text-sm outline-none focus:border-[#B08A55]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold">
                Food Image URL
              </label>
              <input
                type="url"
                value={foodForm.image_url}
                onChange={(e) =>
                  setFoodForm({ ...foodForm, image_url: e.target.value })
                }
                placeholder="https://example.com/food.jpg"
                className="w-full rounded-lg border border-[#EADBD2] px-4 py-3 text-sm outline-none focus:border-[#B08A55]"
              />

              {foodForm.image_url && (
                <div className="mt-3">
                  <p className="mb-2 text-xs text-gray-500">Image Preview</p>
                  <img
                    src={foodForm.image_url}
                    alt="Food preview"
                    className="h-36 w-full rounded-xl border border-[#F0E1D8] object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    onLoad={(e) => {
                      e.currentTarget.style.display = "block";
                    }}
                  />
                </div>
              )}
            </div>

            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={foodForm.is_available}
                onChange={(e) =>
                  setFoodForm({
                    ...foodForm,
                    is_available: e.target.checked,
                  })
                }
                className="h-4 w-4 accent-[#2C0E05]"
              />
              Available for customers
            </label>

            <button
              disabled={saving}
              type="submit"
              className="w-full rounded-lg bg-[#2C0E05] py-3 font-semibold text-white transition hover:bg-[#6B3020] disabled:opacity-60"
            >
              {saving ? "Saving..." : editingId ? "Update Food" : "Add Food"}
            </button>
          </form>
        </Modal>
      )}

      {/* Category form modal */}
      {modal === "category" && (
        <Modal
          title={editingId ? "Edit Category" : "Add New Category"}
          onClose={() => setModal(null)}
        >
          <form onSubmit={saveCategory} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold">
                Category Name *
              </label>
              <input
                required
                value={categoryForm.name}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, name: e.target.value })
                }
                placeholder="Enter category name"
                className="w-full rounded-lg border border-[#EADBD2] px-4 py-3 text-sm outline-none focus:border-[#B08A55]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold">
                Description
              </label>
              <textarea
                rows={3}
                value={categoryForm.description}
                onChange={(e) =>
                  setCategoryForm({
                    ...categoryForm,
                    description: e.target.value,
                  })
                }
                placeholder="Category description"
                className="w-full rounded-lg border border-[#EADBD2] px-4 py-3 text-sm outline-none focus:border-[#B08A55]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold">
                Category Image URL
              </label>
              <input
                type="url"
                value={categoryForm.image_url}
                onChange={(e) =>
                  setCategoryForm({
                    ...categoryForm,
                    image_url: e.target.value,
                  })
                }
                placeholder="https://example.com/category.jpg"
                className="w-full rounded-lg border border-[#EADBD2] px-4 py-3 text-sm outline-none focus:border-[#B08A55]"
              />

              {categoryForm.image_url && (
                <img
                  src={categoryForm.image_url}
                  alt="Category preview"
                  className="mt-3 h-36 w-full rounded-xl border border-[#F0E1D8] object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  onLoad={(e) => {
                    e.currentTarget.style.display = "block";
                  }}
                />
              )}
            </div>

            <button
              disabled={saving}
              type="submit"
              className="w-full rounded-lg bg-[#2C0E05] py-3 font-semibold text-white transition hover:bg-[#6B3020] disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Category"
                  : "Add Category"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}