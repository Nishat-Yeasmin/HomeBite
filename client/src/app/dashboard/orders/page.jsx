
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  FiPackage,
  FiSearch,
  FiRefreshCw,
  FiChevronDown,
  FiMapPin,
  FiCreditCard,
  FiX,
  FiShoppingBag,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiArrowUpRight,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiStar,
} from "react-icons/fi";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const ORDERS_PER_PAGE = 5;

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [expanded, setExpanded] = useState(null);
  const [details, setDetails] = useState({});
  const [cancelId, setCancelId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  // Load customer orders
  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("homebite-token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/customer/orders`, {
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
        throw new Error(data.message || "Could not load orders");
      }

      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Toast notification
  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  };

  // Reset pagination when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const status = (order.order_status || "").toLowerCase();

      const matchesFilter =
        filter === "All" ||
        (filter === "Active" &&
          !["delivered", "cancelled", "canceled"].includes(status)) ||
        (filter === "Delivered" && status === "delivered") ||
        (filter === "Cancelled" &&
          ["cancelled", "canceled"].includes(status));

      const searchValue = search.trim().toLowerCase();

      const matchesSearch =
        String(order.id).toLowerCase().includes(searchValue) ||
        (order.items || "").toLowerCase().includes(searchValue);

      return matchesFilter && matchesSearch;
    });
  }, [orders, filter, search]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);

  const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;

  const currentOrders = filteredOrders.slice(
    startIndex,
    startIndex + ORDERS_PER_PAGE
  );

  // Keep current page valid
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }

    if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  // Change page
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
    setExpanded(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Load order details
  async function toggleDetails(orderId) {
    if (expanded === orderId) {
      setExpanded(null);
      return;
    }

    setExpanded(orderId);

    if (details[orderId]) return;

    try {
      const token = localStorage.getItem("homebite-token");

      const response = await fetch(
        `${API_URL}/api/customer/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not load order details");
      }

      setDetails((prev) => ({
        ...prev,
        [orderId]: data.order,
      }));
    } catch (err) {
      showToast(err.message);
    }
  }

  // Cancel order
  async function cancelOrder() {
    if (!cancelId) return;

    setBusy(true);

    try {
      const token = localStorage.getItem("homebite-token");

      const response = await fetch(
        `${API_URL}/api/customer/orders/${cancelId}/cancel`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not cancel order");
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === cancelId
            ? { ...order, order_status: "Cancelled" }
            : order
        )
      );

      showToast("Order cancelled successfully");
      setCancelId(null);
    } catch (err) {
      showToast(err.message);
    } finally {
      setBusy(false);
    }
  }

  // Format currency
  const money = (value) =>
    `৳${Number(value || 0).toLocaleString("en-BD")}`;

  // Format date
  const date = (value) =>
    value
      ? new Date(value).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  // Status colors
  function statusClass(status) {
    const value = (status || "").toLowerCase();

    if (value === "delivered")
      return "border-[#d7e9d8] bg-[#edf7ed] text-[#397344]";

    if (value.includes("cancel"))
      return "border-[#f0d5d1] bg-[#fff0ee] text-[#b44b42]";

    if (value.includes("delivery"))
      return "border-[#d7e3ed] bg-[#edf5fc] text-[#47789e]";

    return "border-[#ead5a8] bg-[#fff7e5] text-[#9b7130]";
  }

  // Status icon
  function statusIcon(status) {
    const value = (status || "").toLowerCase();

    if (value === "delivered") return <FiCheckCircle />;
    if (value.includes("delivery")) return <FiTruck />;
    if (value.includes("cancel")) return <FiX />;

    return <FiClock />;
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="mb-8 h-40 animate-pulse rounded-[30px] bg-[#f2e6ce]" />

        <div className="grid gap-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-36 animate-pulse rounded-3xl bg-[#fffaf0] shadow-sm"
            />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#f4e7ca] text-3xl text-[#9b7130]">
          <FiPackage />
        </div>

        <h2 className="font-serif text-2xl font-bold text-[#392514]">
          Could not load your orders
        </h2>

        <p className="mt-2 text-sm text-[#88765e]">{error}</p>

        <button
          onClick={loadOrders}
          className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#76501f] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-[#583916] hover:shadow-lg"
        >
          <FiRefreshCw /> Try Again
        </button>
      </div>
    );
  }

  const activeCount = orders.filter(
    (order) =>
      !["delivered", "cancelled", "canceled"].includes(
        (order.order_status || "").toLowerCase()
      )
  ).length;

  const deliveredCount = orders.filter(
    (order) => (order.order_status || "").toLowerCase() === "delivered"
  ).length;

  return (
    <div className="mx-auto max-w-[1300px] px-5 pb-14 sm:px-8 lg:px-10">

      {/* Luxury Golden Hero */}
      <motion.section
        variants={reveal}
        initial="hidden"
        animate="visible"
        className="relative mb-9 overflow-hidden rounded-[30px] border border-[#e8d5ac] bg-gradient-to-br from-[#fffaf0] via-[#f5e8cb] to-[#dfc18a] px-6 py-9 shadow-[0_15px_45px_rgba(125,89,34,0.10)] sm:px-9 sm:py-11 lg:px-12"
      >
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border border-[#b88b42]/20" />
        <div className="pointer-events-none absolute -right-5 -top-14 h-52 w-52 rounded-full border border-[#b88b42]/20" />
        <div className="pointer-events-none absolute -bottom-28 right-28 h-64 w-64 rounded-full bg-[#c49a55]/10 blur-2xl" />
        <div className="pointer-events-none absolute bottom-5 right-10 h-24 w-24 rounded-full border border-[#b88b42]/20" />

        <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#c49a55]/40 bg-white/50 px-4 py-2 backdrop-blur-sm">
              <FiStar className="text-sm text-[#a47732]" />
              <span className="text-[10px] font-bold uppercase tracking-[2.5px] text-[#87632e]">
                Your HomeBite Experience
              </span>
            </div>

            <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-[#392514] sm:text-5xl lg:text-[58px]">
              My Orders
              <span className="ml-2 font-serif italic font-normal text-[#a47a37]">
                Collection.
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#796344] sm:text-base">
              Every order tells a delicious story. Explore your order history,
              follow your deliveries and relive the joy of homemade goodness.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/50 px-4 py-3 shadow-sm backdrop-blur-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ead8b4] text-[#87632e]">
                  <FiPackage />
                </div>

                <div>
                  <p className="text-lg font-bold leading-none text-[#392514]">
                    {orders.length}
                  </p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-[#8d7756]">
                    Total Orders
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/50 px-4 py-3 shadow-sm backdrop-blur-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ead8b4] text-[#87632e]">
                  <FiClock />
                </div>

                <div>
                  <p className="text-lg font-bold leading-none text-[#392514]">
                    {activeCount}
                  </p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-[#8d7756]">
                    Active Orders
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/50 px-4 py-3 shadow-sm backdrop-blur-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ead8b4] text-[#87632e]">
                  <FiCheckCircle />
                </div>

                <div>
                  <p className="text-lg font-bold leading-none text-[#392514]">
                    {deliveredCount}
                  </p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-[#8d7756]">
                    Delivered
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero decorative icon */}
          <div className="relative mx-auto flex h-44 w-44 shrink-0 items-center justify-center sm:h-52 sm:w-52 lg:mr-8">
            <div className="absolute inset-0 rounded-full border border-[#b88b42]/30" />
            <div className="absolute inset-4 rounded-full border border-[#b88b42]/30" />
            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-white/70 to-[#d5b477]/30 shadow-inner" />

            <motion.div
              animate={{ y: [0, -8, 0], rotate: [0, 3, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10 flex h-24 w-24 items-center justify-center rounded-[28px] border border-[#c49a55]/40 bg-gradient-to-br from-[#fffdf7] to-[#ead7ad] text-5xl text-[#997035] shadow-[0_12px_30px_rgba(110,75,25,0.16)] sm:h-28 sm:w-28 sm:text-6xl"
            >
              <FiShoppingBag />
            </motion.div>

            <div className="absolute right-2 top-8 flex h-9 w-9 items-center justify-center rounded-full border border-[#d6bb87] bg-[#fffaf0] text-[#a47a37] shadow-md">
              <FiStar className="text-sm" />
            </div>

            <div className="absolute bottom-7 left-2 h-3 w-3 rounded-full bg-[#b88b42]" />
            <div className="absolute right-8 bottom-2 h-2 w-2 rounded-full bg-[#c6a15f]" />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-[#bd9654] to-transparent opacity-60" />
      </motion.section>

      {/* Search and Filters */}
      <motion.div
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.15 }}
        className="mb-6 rounded-2xl border border-[#eadcc0] bg-gradient-to-br from-white to-[#fffaf0] p-4 shadow-[0_5px_20px_rgba(120,85,35,0.05)] sm:p-5"
      >
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ad956d]" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID or food name..."
              className="w-full rounded-xl border border-[#e9dcc2] bg-[#fffdf8] py-3 pl-11 pr-4 text-sm text-[#49351d] outline-none transition placeholder:text-[#ad9b7e] focus:border-[#b88b42] focus:ring-2 focus:ring-[#c49a55]/15"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {["All", "Active", "Delivered", "Cancelled"].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`cursor-pointer rounded-xl px-4 py-2.5 text-xs font-semibold transition duration-200 hover:-translate-y-0.5 ${
                  filter === item
                    ? "bg-gradient-to-r from-[#87602b] to-[#b18a4b] text-white shadow-md shadow-[#87602b]/20"
                    : "border border-[#e9dcc2] bg-white text-[#8a7555] hover:border-[#c49a55] hover:bg-[#fff9ed] hover:text-[#79551f]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Order Count and Actions */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-serif text-lg font-bold text-[#49351d]">
            Your Order History
          </p>
          <p className="mt-1 text-xs text-[#9b8767]">
            {filteredOrders.length} order(s) found
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/menu"
            className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-[#987039] transition hover:text-[#63431d]"
          >
            Order Food <FiArrowUpRight />
          </Link>

          <button
            onClick={loadOrders}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#eadcc0] bg-white px-3 py-2 text-xs font-semibold text-[#987039] transition hover:-translate-y-0.5 hover:border-[#c49a55] hover:bg-[#fffaf0]"
          >
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            className="rounded-3xl border border-dashed border-[#d9c49b] bg-gradient-to-br from-white to-[#fff9ed] px-5 py-16 text-center"
          >
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[26px] border border-[#e8d5ac] bg-gradient-to-br from-[#fff9e9] to-[#ead8b4] text-3xl text-[#9b7130] shadow-sm">
              <FiPackage />
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#49351d]">
              No Orders Found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#927e60]">
              No orders match your current search or filter. Explore our
              homemade menu and discover something delicious.
            </p>

            <Link
              href="/menu"
              className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-[#87602b] to-[#b18a4b] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#87602b]/15 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <FiShoppingBag /> Explore Menu
            </Link>
          </motion.div>
        ) : (
          currentOrders.map((order, index) => {
            const isExpanded = expanded === order.id;
            const orderDetails = details[order.id];

            const isPending =
              (order.order_status || "").toLowerCase() === "pending";

            return (
              <motion.div
                key={order.id}
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.12 }}
                transition={{ delay: index * 0.04 }}
                whileHover={{ y: -3 }}
                className="group overflow-hidden rounded-3xl border border-[#eadcc0] bg-gradient-to-br from-white to-[#fffdf8] shadow-[0_5px_20px_rgba(120,85,35,0.05)] transition-all duration-300 hover:border-[#d8bd88] hover:shadow-[0_15px_35px_rgba(120,85,35,0.11)]"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#e8d5ac] bg-gradient-to-br from-[#fff8e8] to-[#ead8b4] text-xl text-[#967039] shadow-sm transition duration-300 group-hover:rotate-3 group-hover:shadow-md">
                        <FiPackage />
                      </div>

                      <div className="min-w-0">
                        <p className="font-serif text-lg font-bold text-[#49351d]">
                          Order #HB{order.id}
                        </p>

                        <p className="mt-1 truncate text-xs text-[#9a8769]">
                          {order.items || "Your food order"}
                        </p>

                        <p className="mt-2 flex items-center gap-1.5 text-[11px] text-[#a18e70]">
                          <FiCalendar className="text-[#b18a4b]" />
                          {date(order.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
                      <div className="sm:text-right">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#a18e70]">
                          Order Total
                        </p>

                        <p className="font-serif text-2xl font-bold text-[#79551f]">
                          {money(order.total_amount)}
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-[10px] font-bold ${statusClass(order.order_status)}`}
                      >
                        {statusIcon(order.order_status)}
                        {order.order_status || "Pending"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#f0e5d1] pt-4">
                    <p className="text-xs text-[#917e60]">
                      <span className="font-semibold text-[#71542b]">
                        {order.total_items || 0} item(s)
                      </span>
                      <span className="mx-2 text-[#d6c4a3]">|</span>
                      {order.payment_method || "Payment not specified"}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {isPending && (
                        <button
                          onClick={() => setCancelId(order.id)}
                          className="cursor-pointer rounded-xl border border-[#edcebf] bg-white px-3 py-2 text-xs font-semibold text-[#b45d4e] transition hover:-translate-y-0.5 hover:border-[#dca99a] hover:bg-[#fff5f2]"
                        >
                          Cancel Order
                        </button>
                      )}

                      <button
                        onClick={() => toggleDetails(order.id)}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-[#76501f] to-[#a77d3c] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:from-[#604019] hover:to-[#8c642e] hover:shadow-md"
                      >
                        {isExpanded ? "Hide Details" : "View Details"}

                        <FiChevronDown
                          className={`transition-transform duration-300 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-[#eadcc0] bg-gradient-to-br from-[#fffaf0] to-[#f8efd9] p-5 sm:p-6">
                        {!orderDetails ? (
                          <p className="animate-pulse text-sm text-[#927e60]">
                            Loading order details...
                          </p>
                        ) : (
                          <>
                            <div className="mb-5 flex items-center gap-2">
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ead8b4] text-[#87602b]">
                                <FiPackage />
                              </div>

                              <h3 className="font-serif text-lg font-bold text-[#49351d]">
                                Order Items
                              </h3>
                            </div>

                            <div className="space-y-3">
                              {orderDetails.items?.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between gap-3 rounded-xl border border-[#eee2c9] bg-white/80 p-3 transition hover:border-[#d9c49b] hover:shadow-sm"
                                >
                                  <div className="flex min-w-0 items-center gap-3">
                                    {item.food_image ? (
                                      <img
                                        src={item.food_image}
                                        alt={item.food_name || "Food"}
                                        className="h-12 w-12 rounded-xl border border-[#eadcc0] object-cover"
                                      />
                                    ) : (
                                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3e6ca] text-xl">
                                        🍲
                                      </div>
                                    )}

                                    <div className="min-w-0">
                                      <p className="truncate text-sm font-semibold text-[#49351d]">
                                        {item.food_name || "Food item"}
                                      </p>

                                      <p className="mt-1 text-xs text-[#a18e70]">
                                        Quantity: {item.quantity}
                                      </p>
                                    </div>
                                  </div>

                                  <p className="shrink-0 text-sm font-bold text-[#79551f]">
                                    {money(
                                      Number(item.unit_price) *
                                        Number(item.quantity)
                                    )}
                                  </p>
                                </div>
                              ))}
                            </div>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                              <div className="flex items-start gap-3 rounded-xl border border-[#eee2c9] bg-white/80 p-4">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f2e5c9] text-[#997035]">
                                  <FiMapPin />
                                </div>

                                <div>
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#a18e70]">
                                    Delivery Address
                                  </p>

                                  <p className="mt-1 text-xs font-semibold leading-5 text-[#49351d]">
                                    {orderDetails.delivery_address || "—"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start gap-3 rounded-xl border border-[#eee2c9] bg-white/80 p-4">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f2e5c9] text-[#997035]">
                                  <FiCreditCard />
                                </div>

                                <div>
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#a18e70]">
                                    Payment
                                  </p>

                                  <p className="mt-1 text-xs font-semibold text-[#49351d]">
                                    {orderDetails.payment_method || "—"} ·{" "}
                                    {orderDetails.payment_status || "Pending"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="mt-5 rounded-xl border border-[#e8d8b8] bg-white/80 p-4">
                              <div className="flex justify-between text-sm">
                                <span className="text-[#927e60]">
                                  Delivery Fee
                                </span>

                                <strong className="text-[#49351d]">
                                  {money(orderDetails.delivery_fee)}
                                </strong>
                              </div>

                              <div className="mt-3 flex justify-between border-t border-dashed border-[#e4d4b3] pt-3 text-base">
                                <span className="font-semibold text-[#49351d]">
                                  Grand Total
                                </span>

                                <strong className="font-serif text-xl text-[#997035]">
                                  {money(orderDetails.total_amount)}
                                </strong>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="mt-9 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#eadcc0] bg-gradient-to-br from-white to-[#fffaf0] px-4 py-5 shadow-[0_5px_20px_rgba(120,85,35,0.05)] sm:flex-row sm:px-6"
        >
          <p className="text-xs text-[#927e60]">
            Showing{" "}
            <span className="font-bold text-[#79551f]">
              {startIndex + 1}–
              {Math.min(startIndex + ORDERS_PER_PAGE, filteredOrders.length)}
            </span>{" "}
            of{" "}
            <span className="font-bold text-[#79551f]">
              {filteredOrders.length}
            </span>{" "}
            orders
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex h-10 cursor-pointer items-center gap-1 rounded-xl border border-[#e9dcc2] bg-white px-3 text-xs font-semibold text-[#79551f] transition hover:-translate-y-0.5 hover:border-[#c49a55] hover:bg-[#fff9ed] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            >
              <FiChevronLeft />
              <span>Previous</span>
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  aria-label={`Go to page ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                  className={`h-10 w-10 cursor-pointer rounded-xl text-xs font-bold transition duration-200 hover:-translate-y-0.5 ${
                    currentPage === page
                      ? "bg-gradient-to-br from-[#76501f] to-[#b18a4b] text-white shadow-md shadow-[#87602b]/20"
                      : "border border-[#e9dcc2] bg-white text-[#927e60] hover:border-[#c49a55] hover:bg-[#fff9ed] hover:text-[#79551f]"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="inline-flex h-10 cursor-pointer items-center gap-1 rounded-xl border border-[#e9dcc2] bg-white px-3 text-xs font-semibold text-[#79551f] transition hover:-translate-y-0.5 hover:border-[#c49a55] hover:bg-[#fff9ed] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            >
              <span>Next</span>
              <FiChevronRight />
            </button>
          </div>
        </motion.div>
      )}

      {/* Custom Cancel Confirmation */}
      <AnimatePresence>
        {cancelId && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#24180b]/55 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !busy && setCancelId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md overflow-hidden rounded-[28px] border border-[#eadcc0] bg-gradient-to-br from-white to-[#fff9ed] p-6 shadow-2xl"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#efd2c8] bg-[#fff0ec] text-xl text-[#b45d4e]">
                  <FiX />
                </div>

                <button
                  onClick={() => setCancelId(null)}
                  disabled={busy}
                  className="cursor-pointer rounded-full p-2 text-[#927e60] transition hover:bg-[#f3e6ca] disabled:cursor-not-allowed"
                >
                  <FiX />
                </button>
              </div>

              <h3 className="font-serif text-2xl font-bold text-[#49351d]">
                Cancel this order?
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#927e60]">
                Are you sure you want to cancel order #HB{cancelId}? This
                action cannot be undone from your dashboard.
              </p>

              <div className="mt-7 flex gap-3">
                <button
                  disabled={busy}
                  onClick={() => setCancelId(null)}
                  className="flex-1 cursor-pointer rounded-xl border border-[#e9dcc2] bg-white px-4 py-3 text-sm font-semibold text-[#79551f] transition hover:bg-[#fff5df] disabled:opacity-50"
                >
                  Keep Order
                </button>

                <button
                  disabled={busy}
                  onClick={cancelOrder}
                  className="flex-1 cursor-pointer rounded-xl bg-gradient-to-r from-[#a84f43] to-[#c66b5c] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busy ? "Cancelling..." : "Yes, Cancel"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-5 z-[120] flex max-w-[calc(100%-40px)] items-center gap-3 rounded-xl border border-[#c7a66d] bg-gradient-to-r from-[#76501f] to-[#9c753a] px-5 py-3 text-sm font-medium text-white shadow-2xl"
          >
            <FiCheckCircle className="shrink-0 text-[#f3dba9]" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
