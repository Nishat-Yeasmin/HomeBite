
"use client";

import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import {
  FiShoppingBag,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiEye,
  FiX,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiMapPin,
  FiPhone,
  FiMail,
  FiCalendar,
  FiPackage,
  FiCreditCard,
  FiUser,
  FiArrowUpRight,
  FiAlertCircle,
  FiCheck,
  FiXCircle,
  FiLoader,
  FiShoppingCart,
  FiTrendingUp,
} from "react-icons/fi";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");


const PAGE_SIZE = 6;

const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const PAYMENT_STATUSES = ["Pending", "Paid", "Failed"];

const PAYMENT_METHODS = [
  "Cash on Delivery",
  "bKash",
  "Nagad",
  "Rocket",
  "Card",
];

const statusStyles = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  Preparing: "bg-purple-50 text-purple-700 border-purple-200",
  "Out for Delivery": "bg-orange-50 text-orange-700 border-orange-200",
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};



const paymentStyles = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Failed: "bg-rose-50 text-rose-700 border-rose-200",
};

function formatPrice(value) {
  return `৳${Number(value || 0).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value) {
  if (!value) return "N/A";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("en-BD", {
    hour: "2-digit",
    minute: "2-digit",
  });
}



function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[11px] font-bold ${
        statusStyles[status] || "border-gray-200 bg-gray-50 text-gray-600"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status || "Unknown"}
    </span>
  );
}

function PaymentBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[11px] font-bold ${
        paymentStyles[status] || "border-gray-200 bg-gray-50 text-gray-600"
      }`}
    >
      {status === "Paid" ? (
        <FiCheck size={12} />
      ) : status === "Failed" ? (
        <FiX size={12} />
      ) : (
        <FiClock size={12} />
      )}
      {status || "Pending"}
    </span>
  );
}

function StatCard({ title, value, description, icon: Icon, color, bg, loading }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#F0E3DC] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div
        className={`absolute -right-7 -top-7 h-28 w-28 rounded-full opacity-40 transition-transform duration-500 group-hover:scale-150 ${bg}`}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#927E75]">{title}</p>

          {loading ? (
            <div className="mt-3 h-8 w-24 animate-pulse rounded-lg bg-[#F3E3DC]" />
          ) : (
            <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-[#2C0E05] sm:text-3xl">
              {value}
            </h3>
          )}

          <p className="mt-2 text-xs text-[#A18C82]">{description}</p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${color} transition-transform duration-300 group-hover:rotate-6`}
        >
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

function Toast({ toast, onClose }) {
  if (!toast) return null;

  const success = toast.type === "success";

  return (
    <div className="fixed right-5 top-5 z-[100] w-[calc(100%-40px)] max-w-sm animate-[slideIn_.3s_ease-out]">
      <div className="flex items-start gap-3 rounded-2xl border border-[#E9DED7] bg-white p-4 shadow-2xl">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            success
              ? "bg-emerald-50 text-emerald-600"
              : "bg-rose-50 text-rose-600"
          }`}
        >
          {success ? <FiCheckCircle size={20} /> : <FiAlertCircle size={20} />}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-bold text-[#2C0E05]">
            {success ? "Success!" : "Something went wrong"}
          </p>
          <p className="mt-1 text-sm text-[#8D7970]">{toast.message}</p>
        </div>

        <button
          onClick={onClose}
          className="cursor-pointer rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
        >
          <FiX size={17} />
        </button>
      </div>
    </div>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#FFF0E8] text-[#B08A55]">
        <FiShoppingBag size={34} />
      </div>

      <h3 className="mt-5 text-lg font-bold text-[#2C0E05]">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-[#9A8981]">{description}</p>
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [confirmOrder, setConfirmOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  const [toast, setToast] = useState(null);

  const heroRef = useRef(null);
const [heroVisible, setHeroVisible] = useState(false);

useEffect(() => {
  const element = heroRef.current;

  if (!element) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setHeroVisible(true);
        observer.unobserve(element);
      }
    },
    { threshold: 0.2 }
  );

  observer.observe(element);

  return () => observer.disconnect();
}, []);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    window.clearTimeout(window.__homebiteOrderToast);
    window.__homebiteOrderToast = window.setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);

  const getToken = useCallback(() => {
    return localStorage.getItem("homebite-token");
  }, []);

  const fetchOrders = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const token = getToken();

        if (!token) {
          showToast("Please login as admin first.", "error");
          setOrders([]);
          return;
        }

        const response = await fetch(`${API_URL}/api/admin/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load orders.");
        }

        setOrders(Array.isArray(data.orders) ? data.orders : []);
      } catch (error) {
        console.error("FETCH ORDERS ERROR:", error);
        showToast(error.message || "Failed to load orders.", "error");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [getToken, showToast]
  );

  useEffect(() => {
    fetchOrders();

    return () => {
      window.clearTimeout(window.__homebiteOrderToast);
    };
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (search.trim()) {
      const term = search.toLowerCase().trim();

      result = result.filter((order) => {
        return (
          String(order.id).toLowerCase().includes(term) ||
          (order.customer_name || "").toLowerCase().includes(term) ||
          (order.customer_email || "").toLowerCase().includes(term) ||
          (order.customer_phone || order.phone || "").toLowerCase().includes(term)
        );
      });
    }

    if (statusFilter !== "All") {
      result = result.filter((order) => order.order_status === statusFilter);
    }

    if (paymentFilter !== "All") {
      result = result.filter(
        (order) => order.payment_status === paymentFilter
      );
    }

    result.sort((a, b) => {
      const first = new Date(a.created_at).getTime() || 0;
      const second = new Date(b.created_at).getTime() || 0;

      return sortOrder === "newest" ? second - first : first - second;
    });

    return result;
  }, [orders, search, statusFilter, paymentFilter, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, paymentFilter, sortOrder]);

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => {
      if (order.payment_status === "Paid") {
        return sum + Number(order.total_amount || 0);
      }
      return sum;
    }, 0);

    return {
      total: orders.length,
      pending: orders.filter((o) => o.order_status === "Pending").length,
      delivered: orders.filter((o) => o.order_status === "Delivered").length,
      revenue: totalRevenue,
    };
  }, [orders]);

  const openDetails = async (order) => {
    setSelectedOrder({
      ...order,
      items: [],
    });

    setDetailsLoading(true);

    try {
      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/admin/orders/${order.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not load order details.");
      }

      setSelectedOrder(data.order);
    } catch (error) {
      console.error("ORDER DETAILS ERROR:", error);
      showToast(error.message || "Failed to load order details.", "error");
      setSelectedOrder(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const updateOrder = async (orderId, field, value) => {
    setUpdating(true);

    try {
      const token = getToken();

      const endpoint =
        field === "order_status" ? "status" : "payment-status";

      const response = await fetch(
        `${API_URL}/api/admin/orders/${orderId}/${endpoint}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            [field]: value,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Update failed.");
      }

      setOrders((previous) =>
        previous.map((order) =>
          Number(order.id) === Number(orderId)
            ? { ...order, [field]: value }
            : order
        )
      );

      setSelectedOrder((previous) =>
        previous && Number(previous.id) === Number(orderId)
          ? { ...previous, [field]: value }
          : previous
      );

      showToast(
        field === "order_status"
          ? "Order status updated successfully."
          : "Payment status updated successfully."
      );

      return true;
    } catch (error) {
      console.error("UPDATE ORDER ERROR:", error);
      showToast(error.message || "Unable to update order.", "error");
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusChange = async (order, value) => {
    if (value === "Cancelled") {
      setConfirmOrder(order);
      return;
    }

    await updateOrder(order.id, "order_status", value);
  };

  const confirmCancel = async () => {
    if (!confirmOrder) return;

    const success = await updateOrder(
      confirmOrder.id,
      "order_status",
      "Cancelled"
    );

    if (success) {
      setConfirmOrder(null);
    }
  };

  const closeDetails = () => {
    if (updating) return;
    setSelectedOrder(null);
  };

  const totalFoodPrice = (items = []) =>
    items.reduce(
      (sum, item) =>
        sum + Number(item.unit_price || 0) * Number(item.quantity || 0),
      0
    );

  return (
    <div className="min-h-screen bg-[#FFF8F3] px-4 pb-10 pt-5 text-[#2C0E05] sm:px-6 lg:px-8 lg:pl-[290px]">
      <style jsx global>{`

      @keyframes heroFloat {
  0%, 100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-9px);
  }
}
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(25px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .order-animate {
          animation: fadeIn 0.45s ease both;
        }

        .modal-animate {
          animation: modalIn 0.25s ease-out both;
        }

        button {
          cursor: pointer;
        }

        button:disabled {
          cursor: not-allowed;
        }

        select {
          cursor: pointer;
        }

        .order-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }

        .order-scrollbar::-webkit-scrollbar-thumb {
          background: #d9c3b7;
          border-radius: 10px;
        }
      `}</style>

      {/* HEADER */}
     

    
{/* HERO SECTION */}
<div
  ref={heroRef}
  className="relative mb-8 overflow-hidden rounded-[26px] bg-gradient-to-r from-[#32120A] via-[#542416] to-[#8C5133] text-white shadow-xl"
>
  {/* Background Decorations */}
  <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border-[35px] border-white/5" />
  <div className="absolute -bottom-32 right-1/3 h-64 w-64 rounded-full bg-[#D6A45E]/10 blur-3xl" />

  <div className="relative z-10 grid items-center gap-8 px-6 py-9 md:grid-cols-2 md:px-10 md:py-12">
    {/* LEFT CONTENT */}
    <div
      className={`transition-all duration-1000 ${
        heroVisible
          ? "translate-x-0 opacity-100"
          : "-translate-x-12 opacity-0"
      }`}
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#F5D9A9]">
        <FiTrendingUp size={14} />
        Order Overview
      </span>

      <h2 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl">
        Every Order Matters.
        <br />
        <span className="text-[#E9BD7C]">
          Every Customer Counts.
        </span>
      </h2>

      <p className="mt-4 max-w-md text-sm leading-7 text-white/70">
        Manage customer orders, track deliveries and keep every
        homemade food experience special with HomeBite.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
          <p className="text-xs text-white/60">Total Orders</p>
          <p className="mt-1 text-xl font-extrabold text-[#F5D9A9]">
            {stats.total}
          </p>
        </div>

        <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
          <p className="text-xs text-white/60">Delivered</p>
          <p className="mt-1 text-xl font-extrabold text-[#B9E9C6]">
            {stats.delivered}
          </p>
        </div>
      </div>
    </div>

    {/* RIGHT FOOD IMAGE */}
    <div
      className={`relative mx-auto w-full max-w-[420px] transition-all duration-[1200ms] ${
        heroVisible
          ? "translate-y-0 scale-100 opacity-100"
          : "translate-y-12 scale-90 opacity-0"
      }`}
    >
      {/* Image Glow */}
      <div className="absolute inset-5 rounded-full bg-[#E9B76D]/30 blur-3xl" />

      {/* Decorative Circle */}
      <div className="absolute -inset-3 rounded-[35px] border border-white/20 rotate-3" />

      {/* Main Image */}
      <div className="relative overflow-hidden rounded-[30px] border-4 border-white/15 shadow-2xl">
        <img
          src="https://images.unsplash.com/photo-1652862729869-2f4e80c1849d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
          alt="Fresh homemade food platter"
          className="h-[240px] w-full object-cover transition-transform duration-1000 hover:scale-110 sm:h-[300px] md:h-[330px] animate-[heroFloat_5s_ease-in-out_infinite]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#2C0E05]/55 via-transparent to-transparent" />

        <div className="absolute bottom-5 left-5">
          <p className="text-xs font-medium tracking-wider text-white/75">
            FRESHLY PREPARED
          </p>
          <h3 className="mt-1 text-xl font-extrabold text-white">
            Made with Love
          </h3>
        </div>
      </div>

      {/* Floating Badge */}
      <div className="absolute -left-5 top-7 flex items-center gap-2 rounded-2xl border border-[#F1DFC5] bg-white px-4 py-3 text-[#542416] shadow-xl">
        <span className="text-xl">🍲</span>
        <div>
          <p className="text-[10px] font-medium text-[#9A8981]">
            HOMEMADE
          </p>
          <p className="text-xs font-extrabold">Fresh Food</p>
        </div>
      </div>

      {/* Bottom Badge */}
      <div className="absolute -bottom-4 -right-3 rounded-2xl border border-white/20 bg-[#A56D45] px-4 py-3 shadow-xl">
        <p className="text-xs font-bold text-white">
          ❤️ Made with Care
        </p>
      </div>
    </div>
  </div>
</div>


      {/* STATISTICS */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Orders"
          value={stats.total}
          description="All customer orders"
          icon={FiShoppingBag}
          color="bg-[#FFF0E5] text-[#B16B3F]"
          bg="bg-[#F3C6A9]"
          loading={loading}
        />

        <StatCard
          title="Paid Revenue"
          value={formatPrice(stats.revenue)}
          description="From successfully paid orders"
          icon={FiDollarSign}
          color="bg-[#E9F8ED] text-[#36985A]"
          bg="bg-[#B7E5C5]"
          loading={loading}
        />

        <StatCard
          title="Pending Orders"
          value={stats.pending}
          description="Waiting for confirmation"
          icon={FiClock}
          color="bg-[#FFF5D9] text-[#C18B20]"
          bg="bg-[#F7DFA2]"
          loading={loading}
        />

        <StatCard
          title="Delivered Orders"
          value={stats.delivered}
          description="Successfully delivered"
          icon={FiTruck}
          color="bg-[#EAF0FF] text-[#5376C8]"
          bg="bg-[#C2D0FA]"
          loading={loading}
        />
      </div>

      {/* ORDER MANAGEMENT */}
      <div className="overflow-hidden rounded-2xl border border-[#EFDFD5] bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-[#F1E6E0] p-5 sm:p-6 xl:flex-row xl:items-center">
          <div>
            <h2 className="text-xl font-extrabold">All Orders</h2>
            <p className="mt-1 text-xs text-[#9A8981]">
              Manage and monitor customer purchases
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-[#FFF6F0] px-4 py-2.5 text-sm font-bold text-[#A56D45]">
            <FiPackage size={17} />
            {filteredOrders.length} Orders Found
          </div>
        </div>

        {/* FILTERS */}
        <div className="grid grid-cols-1 gap-3 border-b border-[#F1E6E0] bg-[#FFFCFA] p-5 sm:grid-cols-2 xl:grid-cols-4">
          <div className="relative sm:col-span-2 xl:col-span-1">
            <FiSearch
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AD9588]"
              size={17}
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order, customer..."
              className="w-full rounded-xl border border-[#EDE0D8] bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#B08A55] focus:ring-2 focus:ring-[#B08A55]/10"
            />
          </div>

          <div className="relative">
            <FiFilter
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AD9588]"
              size={15}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none rounded-xl border border-[#EDE0D8] bg-white py-3 pl-10 pr-9 text-sm font-medium text-[#61483D] outline-none transition focus:border-[#B08A55]"
            >
              <option value="All">All Order Status</option>
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#AD9588]" />
          </div>

          <div className="relative">
            <FiCreditCard
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AD9588]"
              size={15}
            />

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full appearance-none rounded-xl border border-[#EDE0D8] bg-white py-3 pl-10 pr-9 text-sm font-medium text-[#61483D] outline-none transition focus:border-[#B08A55]"
            >
              <option value="All">All Payment Status</option>
              {PAYMENT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#AD9588]" />
          </div>

          <div className="relative">
            <FiCalendar
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AD9588]"
              size={15}
            />

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full appearance-none rounded-xl border border-[#EDE0D8] bg-white py-3 pl-10 pr-9 text-sm font-medium text-[#61483D] outline-none transition focus:border-[#B08A55]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>

            <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#AD9588]" />
          </div>
        </div>

        {/* TABLE */}
        {loading ? (
          <div className="space-y-4 p-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-16 animate-pulse rounded-xl bg-[#FFF4ED]"
              />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <EmptyState
            title={orders.length === 0 ? "No Orders Yet" : "No Matching Orders"}
            description={
              orders.length === 0
                ? "Customer orders will appear here when someone places an order."
                : "Try changing your search keyword or filters."
            }
          />
        ) : (
          <>
            <div className="order-scrollbar overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">
                <thead>
                  <tr className="border-b border-[#F0E5DF] bg-[#FFF9F5] text-[10px] font-bold uppercase tracking-wider text-[#A18D83]">
                    <th className="px-5 py-4">Order ID</th>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Order Date</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Payment</th>
                    <th className="px-5 py-4">Order Status</th>
                    <th className="px-5 py-4 text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedOrders.map((order, index) => (
                    <tr
                      key={order.id}
                      className="border-b border-[#F5ECE7] transition-colors hover:bg-[#FFFAF7]"
                      style={{
                        animation: `fadeIn .35s ease ${index * 0.05}s both`,
                      }}
                    >
                      <td className="px-5 py-5">
                        <span className="font-extrabold text-[#A56D45]">
                          #{String(order.id).padStart(4, "0")}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F7E8DE] text-sm font-extrabold text-[#9C6041]">
                            {(order.customer_name || "C")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[160px] truncate text-sm font-bold text-[#392017]">
                              {order.customer_name || "Unknown Customer"}
                            </p>
                            <p className="mt-1 max-w-[160px] truncate text-xs text-[#A18D83]">
                              {order.customer_email || "No email"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-5">
                        <p className="text-sm font-semibold text-[#634B40]">
                          {formatDate(order.created_at)}
                        </p>
                        <p className="mt-1 text-xs text-[#A18D83]">
                          {formatTime(order.created_at)}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <p className="text-sm font-extrabold text-[#2C0E05]">
                          {formatPrice(order.total_amount)}
                        </p>
                        <p className="mt-1 text-xs text-[#A18D83]">
                          {order.total_items || order.item_count || 0} items
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <PaymentBadge status={order.payment_status} />
                      </td>

                      <td className="px-5 py-5">
                        <StatusBadge status={order.order_status} />
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex justify-center">
                          <button
                            onClick={() => openDetails(order)}
                            title="View Order Details"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#EBDDD3] bg-white text-[#A56D45] transition-all hover:border-[#B08A55] hover:bg-[#FFF1E7] hover:shadow-md active:scale-90"
                          >
                            <FiEye size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="flex flex-col items-center justify-between gap-4 border-t border-[#F0E5DF] px-5 py-5 sm:flex-row">
              <p className="text-xs text-[#9A8981]">
                Showing{" "}
                <strong className="text-[#51382C]">
                  {(currentPage - 1) * PAGE_SIZE + 1}
                </strong>{" "}
                to{" "}
                <strong className="text-[#51382C]">
                  {Math.min(currentPage * PAGE_SIZE, filteredOrders.length)}
                </strong>{" "}
                of{" "}
                <strong className="text-[#51382C]">
                  {filteredOrders.length}
                </strong>{" "}
                orders
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#EBDDD3] text-[#745344] transition hover:bg-[#FFF1E7] disabled:opacity-40"
                >
                  <FiChevronLeft size={18} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1
                  )
                  .map((page, index, array) => (
                    <span key={page} className="contents">
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-1 text-[#A18D83]">...</span>
                      )}

                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`h-9 min-w-9 rounded-xl px-3 text-xs font-bold transition active:scale-95 ${
                          currentPage === page
                            ? "bg-[#542416] text-white shadow-md"
                            : "border border-[#EBDDD3] text-[#745344] hover:bg-[#FFF1E7]"
                        }`}
                      >
                        {page}
                      </button>
                    </span>
                  ))}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#EBDDD3] text-[#745344] transition hover:bg-[#FFF1E7] disabled:opacity-40"
                >
                  <FiChevronRight size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#1E0C07]/60 p-3 backdrop-blur-sm sm:p-5"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeDetails();
          }}
        >
          <div className="modal-animate order-scrollbar max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-[24px] bg-[#FFFDFB] shadow-2xl">
            {/* MODAL HEADER */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#F0E5DF] bg-white px-5 py-5 sm:px-7">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#B08A55]">
                  Order Information
                </p>

                <h2 className="mt-1 text-xl font-extrabold text-[#2C0E05]">
                  Order #{String(selectedOrder.id).padStart(4, "0")}
                </h2>
              </div>

              <button
                onClick={closeDetails}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF2EB] text-[#8A5039] transition hover:bg-[#F4DFD3] active:scale-90"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-6 p-5 sm:p-7">
              {/* STATUS */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#FFF5EE] p-4">
                <div>
                  <p className="text-xs font-semibold text-[#9A8981]">
                    Current Order Status
                  </p>
                  <div className="mt-2">
                    <StatusBadge status={selectedOrder.order_status} />
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-semibold text-[#9A8981]">
                    Order Date
                  </p>
                  <p className="mt-2 text-sm font-bold text-[#54372A]">
                    {formatDate(selectedOrder.created_at)}
                  </p>
                </div>
              </div>

              {/* CUSTOMER */}
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F8E9DE] text-[#A56D45]">
                    <FiUser size={17} />
                  </div>
                  <h3 className="font-extrabold">Customer Information</h3>
                </div>

                <div className="grid gap-3 rounded-2xl border border-[#F0E4DD] p-4 sm:grid-cols-2">
                  <div>
                    <p className="text-[11px] text-[#A18D83]">Customer Name</p>
                    <p className="mt-1 text-sm font-bold">
                      {selectedOrder.customer_name || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-[#A18D83]">Phone Number</p>
                    <p className="mt-1 flex items-center gap-2 text-sm font-bold">
                      <FiPhone size={14} className="text-[#B08A55]" />
                      {selectedOrder.phone || selectedOrder.customer_phone || "N/A"}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-[11px] text-[#A18D83]">Email Address</p>
                    <p className="mt-1 flex items-center gap-2 break-all text-sm font-bold">
                      <FiMail size={14} className="shrink-0 text-[#B08A55]" />
                      {selectedOrder.customer_email || "N/A"}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-[11px] text-[#A18D83]">
                      Delivery Address
                    </p>
                    <p className="mt-1 flex items-start gap-2 text-sm font-semibold leading-6">
                      <FiMapPin
                        size={15}
                        className="mt-1 shrink-0 text-[#B08A55]"
                      />
                      {selectedOrder.delivery_address || "N/A"}
                    </p>
                  </div>
                </div>
              </section>

              {/* ORDERED ITEMS */}
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F8E9DE] text-[#A56D45]">
                    <FiShoppingCart size={17} />
                  </div>
                  <h3 className="font-extrabold">Ordered Items</h3>
                </div>

                {detailsLoading ? (
                  <div className="flex items-center justify-center gap-2 rounded-2xl border border-[#F0E4DD] py-10 text-sm text-[#A18D83]">
                    <FiLoader className="animate-spin" />
                    Loading order items...
                  </div>
                ) : selectedOrder.items?.length ? (
                  <div className="overflow-hidden rounded-2xl border border-[#F0E4DD]">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-3 p-4 sm:gap-4 ${
                          index !== selectedOrder.items.length - 1
                            ? "border-b border-[#F0E4DD]"
                            : ""
                        }`}
                      >
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#FFF0E5]">
                          {item.food_image ? (
                            <img
                              src={item.food_image}
                              alt={item.food_name || "Food"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <FiPackage size={23} className="text-[#B08A55]" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-[#392017]">
                            {item.food_name || `Food #${item.food_id}`}
                          </p>
                          <p className="mt-1 text-xs text-[#A18D83]">
                            {formatPrice(item.unit_price)} × {item.quantity}
                          </p>
                        </div>

                        <p className="whitespace-nowrap text-sm font-extrabold text-[#54372A]">
                          {formatPrice(
                            Number(item.unit_price) * Number(item.quantity)
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-xl border border-[#F0E4DD] p-5 text-center text-sm text-[#A18D83]">
                    No order items found.
                  </p>
                )}
              </section>

              {/* PAYMENT SUMMARY */}
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F8E9DE] text-[#A56D45]">
                    <FiCreditCard size={17} />
                  </div>
                  <h3 className="font-extrabold">Payment Summary</h3>
                </div>

                <div className="rounded-2xl border border-[#F0E4DD] p-5">
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-[#927E75]">Food Subtotal</span>
                    <span className="font-semibold">
                      {detailsLoading
                        ? "..."
                        : formatPrice(totalFoodPrice(selectedOrder.items))}
                    </span>
                  </div>

                  <div className="mt-3 flex justify-between gap-3 text-sm">
                    <span className="text-[#927E75]">Delivery Fee</span>
                    <span className="font-semibold">
                      {formatPrice(selectedOrder.delivery_fee)}
                    </span>
                  </div>

                  <div className="my-4 border-t border-dashed border-[#E7D5CA]" />

                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold">Total Amount</span>
                    <span className="text-xl font-extrabold text-[#A56D45]">
                      {formatPrice(selectedOrder.total_amount)}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-[#FFF7F1] p-3">
                      <p className="text-[11px] text-[#A18D83]">
                        Payment Method
                      </p>
                      <p className="mt-1 text-sm font-bold">
                        {PAYMENT_METHODS.includes(selectedOrder.payment_method)
                          ? selectedOrder.payment_method
                          : selectedOrder.payment_method || "N/A"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#FFF7F1] p-3">
                      <p className="text-[11px] text-[#A18D83]">
                        Payment Status
                      </p>
                      <div className="mt-1">
                        <PaymentBadge status={selectedOrder.payment_status} />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* UPDATE STATUS */}
              <section className="rounded-2xl border border-[#EBDCD1] bg-[#FFFAF6] p-5">
                <h3 className="font-extrabold">Manage This Order</h3>
                <p className="mt-1 text-xs text-[#9A8981]">
                  Update order progress and payment information.
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-bold text-[#76594A]">
                      Order Status
                    </label>

                    <select
                      value={selectedOrder.order_status}
                      disabled={updating}
                      onChange={(e) =>
                        handleStatusChange(selectedOrder, e.target.value)
                      }
                      className="w-full rounded-xl border border-[#E7D5CA] bg-white px-3 py-3 text-sm font-semibold outline-none transition focus:border-[#B08A55] disabled:opacity-50"
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option
                          key={status}
                          value={status}
                          disabled={
                            selectedOrder.order_status === "Cancelled" &&
                            status !== "Cancelled"
                          }
                        >
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold text-[#76594A]">
                      Payment Status
                    </label>

                    <select
                      value={selectedOrder.payment_status}
                      disabled={updating}
                      onChange={(e) =>
                        updateOrder(
                          selectedOrder.id,
                          "payment_status",
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border border-[#E7D5CA] bg-white px-3 py-3 text-sm font-semibold outline-none transition focus:border-[#B08A55] disabled:opacity-50"
                    >
                      {PAYMENT_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {updating && (
                  <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#A56D45]">
                    <FiLoader className="animate-spin" />
                    Updating order...
                  </p>
                )}
              </section>
            </div>

            <div className="flex justify-end border-t border-[#F0E5DF] bg-white px-5 py-4 sm:px-7">
              <button
                onClick={closeDetails}
                disabled={updating}
                className="rounded-xl bg-[#542416] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#713A25] active:scale-95 disabled:opacity-50"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL CONFIRMATION MODAL */}
      {confirmOrder && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#1E0C07]/60 p-4 backdrop-blur-sm">
          <div className="modal-animate w-full max-w-md rounded-[24px] bg-white p-7 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
              <FiAlertCircle size={30} />
            </div>

            <h3 className="mt-5 text-xl font-extrabold text-[#2C0E05]">
              Cancel This Order?
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#917D73]">
              Are you sure you want to cancel order{" "}
              <strong>
                #{String(confirmOrder.id).padStart(4, "0")}
              </strong>
              ? This will change its order status to Cancelled.
            </p>

            <div className="mt-7 flex gap-3">
              <button
                onClick={() => setConfirmOrder(null)}
                disabled={updating}
                className="flex-1 rounded-xl border border-[#E9DDD6] px-4 py-3 text-sm font-bold text-[#76594A] transition hover:bg-[#FFF7F2] disabled:opacity-50"
              >
                Keep Order
              </button>

              <button
                onClick={confirmCancel}
                disabled={updating}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-rose-600 active:scale-95 disabled:opacity-50"
              >
                {updating ? (
                  <FiLoader className="animate-spin" />
                ) : (
                  <FiXCircle size={16} />
                )}
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
