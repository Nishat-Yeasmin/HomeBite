
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiPlus, FiSearch, FiEdit2, FiTrash2, FiX,
  FiRefreshCw, FiTag, FiCheckCircle, FiXCircle,
  FiPercent, FiCoffee, FiCalendar, FiImage,
  FiAlertCircle, FiGift, FiClock
} from "react-icons/fi";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const initialForm = {
  food_id: "",
  discount_price: "",
  start_date: "",
  end_date: "",
};

const formatDate = (value) => {
  if (!value) return "No end date";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const toDateTimeLocal = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (n) => String(n).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const toMySQLDateTime = (value) => {
  if (!value) return null;
  return `${value.replace("T", " ")}:00`;
};

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [foods, setFoods] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [toggling, setToggling] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const showNotice = (message, type = "success") => {
    setNotice({ message, type });
    window.setTimeout(() => setNotice(""), 3500);
  };

  const getToken = () => {
    const token = localStorage.getItem("homebite-token");

    if (!token) {
      throw new Error("Please login first. Your session may have expired.");
    }

    return token;
  };

  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const token = localStorage.getItem("homebite-token");

      if (!token) {
        throw new Error("Please login first. Your session may have expired.");
      }

      const [offerRes, foodRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/offers`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/foods`),
      ]);

      const offerData = await offerRes.json();
      const foodData = await foodRes.json();

      if (!offerRes.ok) {
        throw new Error(offerData.message || "Unable to load offers.");
      }

      if (!foodRes.ok) {
        throw new Error(foodData.message || "Unable to load foods.");
      }

      setOffers(
        Array.isArray(offerData) ? offerData : offerData.offers || []
      );

      setFoods(
        Array.isArray(foodData) ? foodData : foodData.foods || []
      );

      setError("");
    } catch (err) {
      console.error("Offers loading error:", err);
      setError(err.message || "Unable to load offer data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const availableFoods = useMemo(
    () => foods.filter((food) => Number(food.is_available) === 1),
    [foods]
  );

  const activeOffers = offers.filter(
    (offer) => Number(offer.is_active) === 1
  );

  const inactiveOffers = offers.length - activeOffers.length;

  const filteredOffers = useMemo(() => {
    let result = [...offers];

    if (search.trim()) {
      const keyword = search.trim().toLowerCase();

      result = result.filter((offer) =>
        String(offer.food_name || "").toLowerCase().includes(keyword)
      );
    }

    if (statusFilter === "active") {
      result = result.filter(
        (offer) => Number(offer.is_active) === 1
      );
    } else if (statusFilter === "inactive") {
      result = result.filter(
        (offer) => Number(offer.is_active) !== 1
      );
    }

    return result;
  }, [offers, search, statusFilter]);

  const selectedFood = foods.find(
    (food) => String(food.id) === String(form.food_id)
  );

  const discountPercentage =
    selectedFood && Number(selectedFood.price) > 0
      ? Math.round(
          ((Number(selectedFood.price) - Number(form.discount_price)) /
            Number(selectedFood.price)) *
            100
        )
      : 0;

  const openAddModal = () => {
    setEditingOffer(null);
    setForm(initialForm);
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (offer) => {
    setEditingOffer(offer);

    setForm({
      food_id: String(offer.food_id),
      discount_price: String(offer.discount_price),
      start_date: toDateTimeLocal(offer.start_date),
      end_date: toDateTimeLocal(offer.end_date),
    });

    setError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!editingOffer && !form.food_id) {
      setError("Please select a food item.");
      return;
    }

    if (
      !form.discount_price ||
      !Number.isFinite(Number(form.discount_price)) ||
      Number(form.discount_price) <= 0
    ) {
      setError("Please enter a valid discount price.");
      return;
    }

    const food = editingOffer
      ? foods.find(
          (item) => String(item.id) === String(editingOffer.food_id)
        )
      : selectedFood;

    if (!food) {
      setError("Selected food could not be found.");
      return;
    }

    if (Number(form.discount_price) >= Number(food.price)) {
      setError("Discount price must be lower than the original price.");
      return;
    }

    if (
      form.start_date &&
      form.end_date &&
      new Date(form.end_date) <= new Date(form.start_date)
    ) {
      setError("End date must be later than start date.");
      return;
    }

    try {
      setSaving(true);

      const token = getToken();

      const url = editingOffer
        ? `${API_URL}/api/admin/offers/${editingOffer.id}`
        : `${API_URL}/api/admin/offers`;

      const response = await fetch(url, {
        method: editingOffer ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...(editingOffer
            ? {}
            : { food_id: Number(form.food_id) }),
          discount_price: Number(form.discount_price),
          start_date: toMySQLDateTime(form.start_date),
          end_date: toMySQLDateTime(form.end_date),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save offer.");
      }

      setModalOpen(false);
      setEditingOffer(null);
      setForm(initialForm);

      await fetchData(true);

      showNotice(
        editingOffer
          ? "Offer updated successfully!"
          : "New offer created successfully!"
      );
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (offer) => {
    try {
      setToggling(offer.id);

      const token = getToken();
      const newStatus = Number(offer.is_active) === 1 ? 0 : 1;

      const response = await fetch(
        `${API_URL}/api/admin/offers/${offer.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ is_active: newStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update offer status.");
      }

      await fetchData(true);

      showNotice(
        newStatus === 1
          ? "Offer activated successfully!"
          : "Offer deactivated successfully!"
      );
    } catch (err) {
      showNotice(err.message, "error");
    } finally {
      setToggling(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(deleteTarget.id);

      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/admin/offers/${deleteTarget.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete offer.");
      }

      setDeleteTarget(null);
      await fetchData(true);
      showNotice("Offer deleted successfully!");
    } catch (err) {
      showNotice(err.message, "error");
    } finally {
      setDeleting(null);
    }
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setEditingOffer(null);
    setForm(initialForm);
    setError("");
  };

  return (
    <div className="offers-page min-h-screen overflow-hidden bg-[#FFF9F4] px-4 pb-10 pt-5 sm:px-6 lg:px-8 lg:pl-[290px]">

      {/* HERO */}
      <section className="relative mb-9 min-h-[290px] overflow-hidden rounded-[28px] bg-[#2C0E05] shadow-[0_18px_55px_rgba(44,14,5,0.16)] lg:min-h-[320px]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#210A04] via-[#2C0E05]/95 to-[#75452A]/60" />

        <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full border border-[#D4AE70]/20" />
        <div className="absolute -right-8 -top-16 h-56 w-56 rounded-full border border-[#D4AE70]/20" />

        <div className="relative z-10 flex min-h-[290px] flex-col justify-center px-6 py-9 sm:px-10 lg:min-h-[320px] lg:w-[75%] lg:px-12">
          <div className="mb-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[3px] text-[#E5C18B] sm:text-xs">
            <FiGift />
            HOME BITE · SPECIAL MOMENTS
          </div>

          <h1 className="max-w-2xl text-4xl font-bold leading-tight text-[#FFF8EF] sm:text-5xl">
            Make Every Deal
            <br />
            <span className="font-serif font-medium italic text-[#D9B77E]">
              A Little Sweeter.
            </span>
          </h1>

          <p className="mt-5 max-w-lg font-serif text-sm italic leading-7 text-[#F1DDD0]/85 sm:text-base">
            Create special prices, celebrate your homemade favorites,
            and give customers another reason to smile.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              onClick={openAddModal}
              className="group flex cursor-pointer items-center gap-3 rounded-xl bg-[#D7B273] px-5 py-3.5 text-sm font-bold text-[#2C0E05] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#E8C990] active:scale-95"
            >
              <FiPlus className="text-lg transition-transform group-hover:rotate-90" />
              Create New Offer
            </button>

            <div className="flex items-center gap-2 rounded-xl border border-[#E4C99B]/25 bg-white/5 px-4 py-3 text-xs text-[#F3E5D3] backdrop-blur-sm">
              <FiTag className="text-[#D9B77E]" />
              {offers.length} offers in your collection
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 right-8 hidden h-full w-[30%] items-center justify-center lg:flex">
          <div className="flex h-44 w-44 rotate-[-9deg] items-center justify-center rounded-[35px] border border-[#D9B77E]/30 bg-[#FFF8EF]/10 shadow-2xl backdrop-blur-sm">
            <div className="text-center">
              <FiPercent className="mx-auto text-6xl text-[#E8C990]" />
              <p className="mt-3 font-serif text-xl italic text-[#FFF1D8]">
                Special Deals
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NOTIFICATION */}
      {notice && (
        <div className={`mb-6 flex items-center gap-3 rounded-xl border p-4 text-sm font-semibold animate-[fadeUp_.3s_ease-out] ${
          notice.type === "error"
            ? "border-red-200 bg-red-50 text-red-700"
            : "border-[#C8AD79] bg-[#F7EEDC] text-[#62451E]"
        }`}>
          {notice.type === "error" ? <FiAlertCircle /> : <FiCheckCircle />}
          {notice.message}
          <button
            onClick={() => setNotice("")}
            className="ml-auto cursor-pointer"
          >
            <FiX />
          </button>
        </div>
      )}

      {/* ERROR */}
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

      {/* STATISTICS */}
      <section className="mb-9">
        <div className="mb-5">
          <p className="font-serif text-xs italic tracking-widest text-[#B08A55]">
            A LITTLE OVERVIEW
          </p>
          <h2 className="mt-1 text-xl font-bold text-[#2C0E05] sm:text-2xl">
            Your Offers at a Glance
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Total Offers",
              value: offers.length,
              detail: "All created offers",
              icon: FiTag,
              theme: "stat-chocolate",
            },
            {
              title: "Active Offers",
              value: activeOffers.length,
              detail: "Currently switched on",
              icon: FiCheckCircle,
              theme: "stat-green",
            },
            {
              title: "Inactive Offers",
              value: inactiveOffers,
              detail: "Currently switched off",
              icon: FiXCircle,
              theme: "stat-rose",
            },
            {
              title: "Available Foods",
              value: availableFoods.length,
              detail: "Eligible food items",
              icon: FiCoffee,
              theme: "stat-gold",
            },
          ].map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                style={{ transitionDelay: `${index * 70}ms` }}
                className={`stat-card group relative overflow-hidden rounded-[22px] border p-5 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${stat.theme}`}
              >
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border border-current/10 transition-transform duration-700 group-hover:scale-150" />

                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold opacity-75">
                      {stat.title}
                    </p>
                    <h3 className="mt-3 text-4xl font-bold">
                      {loading ? "—" : stat.value}
                    </h3>
                    <p className="mt-2 font-serif text-xs italic opacity-70">
                      {stat.detail}
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                    <Icon className="text-2xl" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* OFFER TABLE */}
      <section className="overflow-hidden rounded-[24px] border border-[#E9DCD0] bg-white shadow-[0_10px_40px_rgba(67,35,18,0.05)]">

        <div className="flex flex-col justify-between gap-4 border-b border-[#F0E6DE] px-5 py-6 sm:flex-row sm:items-center sm:px-7">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-7 w-1 rounded-full bg-[#B08A55]" />
              <h2 className="text-xl font-bold text-[#2C0E05]">
                Special Offer Collection
              </h2>
            </div>
            <p className="mt-2 pl-3 font-serif text-xs italic text-[#A18A7C]">
              Manage your food discounts and special prices.
            </p>
          </div>

          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-[#E8D9CA] bg-[#FFF9F3] px-3 text-xs font-semibold text-[#68452F] transition-all hover:-translate-y-0.5 hover:border-[#B08A55] hover:bg-[#F2E4CF] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* FILTERS */}
        <div className="grid grid-cols-1 gap-3 border-b border-[#F0E6DE] bg-[#FFFCF9] p-5 md:grid-cols-2">
          <div className="relative">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#A17A50]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search food offers..."
              className="w-full rounded-xl border border-[#E8D8C7] bg-white py-3 pl-11 pr-4 text-sm text-[#432619] outline-none transition-all placeholder:font-serif placeholder:italic placeholder:text-[#B6A394] focus:border-[#A87942] focus:ring-4 focus:ring-[#B08A55]/10"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full cursor-pointer rounded-xl border border-[#E8D8C7] bg-white px-4 py-3 text-sm text-[#5B3927] outline-none transition-all focus:border-[#A87942] focus:ring-4 focus:ring-[#B08A55]/10"
          >
            <option value="all">All Offers</option>
            <option value="active">Active Offers</option>
            <option value="inactive">Inactive Offers</option>
          </select>
        </div>

        <div className="flex items-center justify-between px-5 py-4 sm:px-7">
          <p className="text-xs text-[#927B70]">
            Showing{" "}
            <span className="font-bold text-[#2C0E05]">
              {filteredOffers.length}
            </span>{" "}
            offers
          </p>
          {(search || statusFilter !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
              }}
              className="cursor-pointer font-serif text-xs italic text-[#9B7045] hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead>
              <tr className="border-y border-[#EDE1D5] bg-[#F8F0E7] text-[10px] font-bold uppercase tracking-[1.5px] text-[#86694E]">
                <th className="px-6 py-4">Food Item</th>
                <th className="px-5 py-4">Original Price</th>
                <th className="px-5 py-4">Offer Price</th>
                <th className="px-5 py-4">Discount</th>
                <th className="px-5 py-4">Validity</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F2EAE3]">
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan="7" className="px-6 py-7">
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
              ) : filteredOffers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-20 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5E9DA]">
                      <FiGift className="text-3xl text-[#A77B46]" />
                    </div>
                    <h3 className="mt-4 font-bold text-[#432619]">
                      No offers found
                    </h3>
                    <p className="mt-2 font-serif text-sm italic text-[#A18A7C]">
                      Create your first special offer for your customers.
                    </p>
                    <button
                      onClick={openAddModal}
                      className="mt-5 cursor-pointer rounded-lg bg-[#4A2515] px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-[#75452A]"
                    >
                      Create First Offer
                    </button>
                  </td>
                </tr>
              ) : (
                filteredOffers.map((offer) => (
                  <tr
                    key={offer.id}
                    className="group transition-all duration-300 hover:bg-[#FFF9F0]"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-[58px] w-[58px] shrink-0 overflow-hidden rounded-[14px] border border-[#E9DCCD] bg-[#F7EEE5]">
                          {offer.image_url ? (
                            <img
                              src={offer.image_url}
                              alt={offer.food_name}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <FiImage className="text-xl text-[#B08A55]" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="max-w-[180px] truncate text-sm font-bold text-[#432619]">
                            {offer.food_name}
                          </p>
                          <p className="mt-1 text-xs text-[#A18A7C]">
                            Food ID: #{offer.food_id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-[#8D7B6D]">
                      <span className="line-through">
                        ৳{Number(offer.original_price).toLocaleString("en-BD")}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm font-bold text-[#4A2818]">
                        ৳{Number(offer.discount_price).toLocaleString("en-BD")}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-lg border border-[#E8D4A9] bg-[#FBF2DF] px-3 py-1.5 text-xs font-bold text-[#8A632B]">
                        {offer.discount_percentage}% OFF
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-xs text-[#795B40]">
                        <FiCalendar className="text-[#B08A55]" />
                        {formatDate(offer.end_date)}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleStatus(offer)}
                        disabled={toggling === offer.id}
                        className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all hover:-translate-y-0.5 hover:shadow-sm disabled:opacity-50 ${
                          Number(offer.is_active) === 1
                            ? "border-[#C9DDC9] bg-[#EFF6EC] text-[#54754D]"
                            : "border-[#E9C8B9] bg-[#FAEFEB] text-[#A65E4C]"
                        }`}
                      >
                        {toggling === offer.id ? (
                          <FiRefreshCw className="animate-spin" />
                        ) : (
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            Number(offer.is_active) === 1
                              ? "bg-[#6F9C62]"
                              : "bg-[#BD725A]"
                          }`} />
                        )}
                        {Number(offer.is_active) === 1 ? "Active" : "Inactive"}
                      </button>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(offer)}
                          title="Edit offer"
                          className="action-btn action-edit"
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          onClick={() => setDeleteTarget(offer)}
                          title="Delete offer"
                          disabled={deleting === offer.id}
                          className="action-btn action-delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#1B0A05]/65 p-4 backdrop-blur-sm animate-[fadeIn_.2s_ease-out]"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="my-auto w-full max-w-xl overflow-hidden rounded-[24px] bg-[#FFFCF8] shadow-2xl animate-[modalIn_.3s_ease-out]">
            <div className="flex items-center justify-between bg-[#2C0E05] px-6 py-5 text-white">
              <div>
                <p className="font-serif text-xs italic tracking-widest text-[#D9B77E]">
                  HOME BITE · SPECIAL DEALS
                </p>
                <h2 className="mt-1 text-xl font-bold">
                  {editingOffer ? "Edit Your Offer" : "Create a New Offer"}
                </h2>
                <p className="mt-1 text-xs text-white/60">
                  Set a special price for a homemade favorite.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-white/10 transition-all hover:rotate-90 hover:bg-white/20"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="max-h-[75vh] space-y-5 overflow-y-auto p-6">
              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  <FiAlertCircle />
                  {error}
                </div>
              )}

              {!editingOffer && (
                <div>
                  <label className="form-label">
                    Select Food <span>*</span>
                  </label>
                  <select
                    value={form.food_id}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        food_id: e.target.value,
                      }))
                    }
                    required
                    className="form-input cursor-pointer"
                  >
                    <option value="">Choose a food item</option>
                    {availableFoods
                      .filter(
                        (food) =>
                          !offers.some(
                            (offer) =>
                              String(offer.food_id) === String(food.id)
                          )
                      )
                      .map((food) => (
                        <option key={food.id} value={food.id}>
                          {food.name} — ৳{Number(food.price)}
                        </option>
                      ))}
                  </select>

                  {availableFoods.length === 0 && (
                    <p className="mt-2 text-xs text-red-500">
                      No available food items found. Add an available food first.
                    </p>
                  )}
                </div>
              )}

              {editingOffer && (
                <div className="rounded-xl border border-[#E8D8C7] bg-[#F8F0E7] p-4">
                  <p className="text-xs font-semibold text-[#9A816C]">
                    SELECTED FOOD
                  </p>
                  <p className="mt-1 font-bold text-[#432619]">
                    {editingOffer.food_name}
                  </p>
                </div>
              )}

              {selectedFood && !editingOffer && (
                <div className="flex items-center gap-4 rounded-xl border border-[#E8D8C7] bg-[#F8F0E7] p-3">
                  {selectedFood.image_url ? (
                    <img
                      src={selectedFood.image_url}
                      alt={selectedFood.name}
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#EFE2D4]">
                      <FiCoffee className="text-2xl text-[#A77B46]" />
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-[#432619]">
                      {selectedFood.name}
                    </p>
                    <p className="mt-1 text-sm text-[#795432]">
                      Original Price: ৳{Number(selectedFood.price)}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="form-label">
                  Discount Price (৳) <span>*</span>
                </label>
                <input
                  type="number"
                  value={form.discount_price}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      discount_price: e.target.value,
                    }))
                  }
                  placeholder="e.g. 180"
                  min="0.01"
                  step="0.01"
                  required
                  className="form-input"
                />

                {selectedFood && form.discount_price && (
                  <div className="mt-3 rounded-xl border border-[#E8D4A9] bg-[#FBF2DF] p-3">
                    {Number(form.discount_price) > 0 &&
                    Number(form.discount_price) < Number(selectedFood.price) ? (
                      <p className="text-sm font-semibold text-[#79552A]">
                        <FiPercent className="mr-1 inline" />
                        Customer saves ৳
                        {(Number(selectedFood.price) - Number(form.discount_price)).toFixed(2)}
                        {" "}({discountPercentage}% OFF)
                      </p>
                    ) : (
                      <p className="text-xs text-red-600">
                        Discount price must be lower than original price.
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="form-label">Start Date</label>
                  <input
                    type="datetime-local"
                    value={form.start_date}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        start_date: e.target.value,
                      }))
                    }
                    className="form-input cursor-pointer"
                  />
                </div>

                <div>
                  <label className="form-label">End Date</label>
                  <input
                    type="datetime-local"
                    value={form.end_date}
                    min={form.start_date || undefined}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        end_date: e.target.value,
                      }))
                    }
                    className="form-input cursor-pointer"
                  />
                </div>
              </div>

              <p className="font-serif text-xs italic leading-5 text-[#9A816C]">
                Leave the end date empty if the offer should not have a scheduled end date.
                The start date defaults to the current time when left empty.
              </p>

              <div className="flex flex-col-reverse gap-3 border-t border-[#EDE1D5] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="cursor-pointer rounded-xl border border-[#E2D2C1] px-6 py-3 text-sm font-semibold text-[#75513A] transition-all hover:bg-[#F5E9DC] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || (!editingOffer && availableFoods.length === 0)}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#3B1A0C] px-7 py-3 text-sm font-bold text-[#F8E6C8] transition-all duration-300 hover:-translate-y-1 hover:bg-[#65381D] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <FiRefreshCw className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiPlus />
                      {editingOffer ? "Update Offer" : "Save Offer"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl animate-[modalIn_.25s_ease-out]">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-red-50 p-3 text-red-600">
                <FiTrash2 size={22} />
              </div>
              <h3 className="text-lg font-bold text-[#2C0E05]">
                Delete Offer?
              </h3>
            </div>

            <p className="mt-4 text-sm leading-6 text-gray-600">
              Are you sure you want to delete the offer for{" "}
              <strong>{deleteTarget.food_name}</strong>?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting !== null}
                className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting !== null}
                className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-red-700 disabled:opacity-50"
              >
                {deleting !== null ? "Deleting..." : "Delete Offer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STYLES */}
      <style jsx global>{`
        .offers-page {
          color: #432619;
        }

        .stat-card {
          animation: fadeUp .6s ease both;
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
          box-shadow: 0 5px 12px rgba(65,35,17,.12);
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

        .action-btn:disabled {
          cursor: not-allowed;
          opacity: .5;
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

        .form-input:focus {
          border-color: #A87942;
          background: #FFFCF7;
          box-shadow: 0 0 0 4px rgba(176,138,85,.11);
        }

        .form-input option {
          background: #FFF9F0;
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
          *, *::before, *::after {
            animation-duration: .01ms !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
