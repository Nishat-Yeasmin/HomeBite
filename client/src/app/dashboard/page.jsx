
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiShoppingBag,
  FiHeart,
  FiClock,
  FiCreditCard,
  FiChevronRight,
  FiArrowUpRight,
  FiPackage,
  FiMapPin,
  FiEdit3,
  FiRefreshCw,
} from "react-icons/fi";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


async function readApiResponse(response, endpoint) {
  const contentType = response.headers.get("content-type") || "";
  const responseText = await response.text();

  if (!contentType.includes("application/json")) {
    throw new Error(
      `API JSON দেয়নি। URL: ${endpoint} | Status: ${response.status}. Backend URL ও route check করো।`
    );
  }

  let data;

  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error("Server থেকে invalid JSON response এসেছে।");
  }

  if (!response.ok || data.success === false) {
    throw new Error(data.message || `Request failed: ${response.status}`);
  }

  return data;
}

async function loadDashboard() {
  setLoading(true);
  setError("");

  const token = localStorage.getItem("homebite-token");

  if (!token) {
    window.location.href = "/login";
    return;
  }

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const dashboardUrl = `${API_URL}/api/customer/dashboard`;
    const wishlistUrl = `${API_URL}/api/wishlist`;

    const [dashboardResponse, wishlistResponse] = await Promise.all([
      fetch(dashboardUrl, { headers }),
      fetch(wishlistUrl, { headers }),
    ]);

    if (dashboardResponse.status === 401) {
      localStorage.removeItem("homebite-token");
      localStorage.removeItem("homebite-user");
      window.dispatchEvent(new Event("homebite-auth-changed"));
      window.location.href = "/login";
      return;
    }

    const dashboardData = await readApiResponse(
      dashboardResponse,
      dashboardUrl
    );

    setDashboard(dashboardData);

    if (wishlistResponse.ok) {
      const wishlistData = await readApiResponse(
        wishlistResponse,
        wishlistUrl
      );

      setWishlist(
        Array.isArray(wishlistData)
          ? wishlistData
          : wishlistData.wishlist || wishlistData.items || []
      );
    } else {
      setWishlist([]);
    }
  } catch (err) {
    console.error("Dashboard loading error:", err);
    setError(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
}


  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#F3E3DC] border-t-[#B08A55]" />
          <p className="text-sm text-[#806d66]">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 text-center">
        <h2 className="font-serif text-2xl font-bold">
          Dashboard could not be loaded
        </h2>

        <p className="mt-3 text-sm text-[#806d66]">{error}</p>

        <button
          onClick={loadDashboard}
          className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#2C0E05] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4a1b0e]"
        >
          <FiRefreshCw />
          Try Again
        </button>
      </div>
    );
  }

  const user = dashboard?.user || {};
  const stats = dashboard?.stats || {};
  const orders = dashboard?.recentOrders || [];

  const latestOrder = orders[0];

  const formatMoney = (amount) =>
    `৳${Number(amount || 0).toLocaleString("en-BD")}`;

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  return (
    <div className="mx-auto max-w-[1500px] px-5 pb-12 sm:px-8 lg:px-10">
      {/* Top bar */}
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="mb-1 text-sm font-medium text-[#B08A55]">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "2-digit",
              year: "numeric",
            })}
          </p>

          <h1 className="font-serif text-3xl font-bold sm:text-4xl">
            Welcome back, {user.name?.split(" ")[0] || "Food Lover"}!
          </h1>

          <p className="mt-2 text-sm text-[#806d66]">
            Here’s what’s happening with your HomeBite account.
          </p>
        </div>

        <Link
          href="/menu"
          className="group flex w-fit items-center gap-2 rounded-xl border border-[#d8c5bc] bg-white px-5 py-3 text-sm font-semibold transition hover:-translate-y-1 hover:border-[#B08A55] hover:shadow-lg"
        >
          Order something delicious
          <FiArrowUpRight className="transition group-hover:translate-x-1 group-hover:-translate-y-1" />
        </Link>
      </div>

      {/* Welcome Banner */}
      <div className="relative mb-8 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#2C0E05] via-[#472016] to-[#6b3826] p-7 text-white shadow-xl sm:p-9">
        <div className="relative z-10 max-w-xl">
          <span className="mb-3 inline-flex rounded-full border border-[#d6b88d]/30 bg-white/10 px-3 py-1 text-xs font-medium text-[#e8cfaa]">
            ✦ HomeBite Member
          </span>

          <h2 className="font-serif text-2xl font-bold leading-tight sm:text-3xl">
            Good food is always
            <br />
            a good idea.
          </h2>

          <p className="mt-3 max-w-md text-sm leading-6 text-white/70">
            Discover homemade meals, sweet treats and comfort food made
            with care.
          </p>

          <Link
            href="/menu"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#F3E3DC] px-5 py-3 text-sm font-semibold text-[#2C0E05] transition hover:bg-white"
          >
            Explore Menu
            <FiChevronRight />
          </Link>
        </div>

        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border border-white/10" />
        <div className="absolute -bottom-28 right-20 h-56 w-56 rounded-full border border-[#d6b88d]/10" />

        <div className="absolute bottom-[-25px] right-[-15px] hidden rotate-[-8deg] text-[150px] opacity-10 lg:block">
          🍰
        </div>
      </div>

      {/* Statistics */}
      <div className="mb-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          icon={<FiShoppingBag />}
          title="Total Orders"
          value={stats.totalOrders || 0}
          subtitle="All your orders"
        />

        <StatCard
          icon={<FiClock />}
          title="Active Orders"
          value={stats.activeOrders || 0}
          subtitle="Not delivered or cancelled"
        />

        <StatCard
          icon={<FiHeart />}
          title="Wishlist"
          value={stats.wishlistCount || 0}
          subtitle="Your saved foods"
        />

        <StatCard
          icon={<FiCreditCard />}
          title="Total Spent"
          value={formatMoney(stats.totalSpent)}
          subtitle="Across all orders"
        />
      </div>

      {/* Recent Orders + Profile */}
      <div className="grid gap-7 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-[26px] border border-[#eadbd3] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold">
                Recent Orders
              </h3>
              <p className="mt-1 text-xs text-[#8a7871]">
                Your latest food orders
              </p>
            </div>

            <Link
              href="/dashboard/orders"
              className="flex items-center gap-1 text-xs font-semibold text-[#B08A55] hover:underline"
            >
              View all <FiChevronRight />
            </Link>
          </div>

          {orders.length === 0 ? (
            <EmptyState
              text="You haven't placed any orders yet."
              href="/menu"
              action="Explore Menu"
            />
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  formatMoney={formatMoney}
                  formatDate={formatDate}
                />
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="rounded-[26px] border border-[#eadbd3] bg-[#F3E3DC]/60 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold">Profile</h3>

            <Link
              href="/dashboard/profile"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2C0E05] transition hover:bg-[#2C0E05] hover:text-white"
              aria-label="Edit profile"
            >
              <FiEdit3 size={15} />
            </Link>
          </div>

          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2C0E05] font-serif text-2xl font-bold text-[#F3E3DC]">
              {(user.name || user.email || "U").charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <h4 className="truncate font-semibold">
                {user.name || "Customer"}
              </h4>
              <p className="truncate text-xs text-[#806d66]">
                {user.email || "—"}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <ProfileInfo
              icon={<FiMapPin />}
              label="Latest Delivery Address"
              value={latestOrder?.delivery_address || "Not available yet"}
            />

            <ProfileInfo
              icon={<FiCreditCard />}
              label="Latest Payment Method"
              value={latestOrder?.payment_method || "Not available yet"}
            />

            <ProfileInfo
              icon={<FiShoppingBag />}
              label="Phone"
              value={user.phone || "Not added"}
            />
          </div>
        </div>
      </div>

      {/* Wishlist */}
      <div className="mt-7 rounded-[26px] border border-[#eadbd3] bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold">
              From Your Wishlist
            </h3>
            <p className="mt-1 text-xs text-[#8a7871]">
              Your saved favorites, ready whenever you are.
            </p>
          </div>

          <Link
            href="/dashboard/wishlist"
            className="hidden items-center gap-1 text-xs font-semibold text-[#B08A55] hover:underline sm:flex"
          >
            View wishlist <FiChevronRight />
          </Link>
        </div>

        {wishlist.length === 0 ? (
          <EmptyState
            text="Your wishlist is empty. Save your favorite foods here."
            href="/menu"
            action="Browse Foods"
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {wishlist.slice(0, 3).map((item) => (
              <WishlistCard
                key={item.id || item.food_id}
                item={item}
                formatMoney={formatMoney}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <QuickAction
          href="/menu"
          icon={<FiShoppingBag />}
          title="Order Food"
          text="Explore our homemade menu"
        />

        <QuickAction
          href="/offers"
          icon={<FiPackage />}
          title="Today's Offers"
          text="Save more on your favorites"
        />

        <QuickAction
          href="/dashboard/orders"
          icon={<FiClock />}
          title="Track Order"
          text="Check your active delivery"
        />
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, subtitle }) {
  return (
    <div className="group rounded-[22px] border border-[#eadbd3] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3E3DC] text-[#2C0E05] transition group-hover:bg-[#2C0E05] group-hover:text-white">
        {icon}
      </div>

      <p className="text-xs text-[#8a7871]">{title}</p>
      <p className="mt-1 break-words font-serif text-2xl font-bold">
        {value}
      </p>
      <p className="mt-1 text-[10px] text-[#a09089]">{subtitle}</p>
    </div>
  );
}

function OrderRow({ order, formatMoney, formatDate }) {
  const status = order.order_status || "Processing";
  const normalized = status.toLowerCase();

  const statusStyle =
    normalized === "delivered"
      ? "bg-[#edf5ed] text-[#557357]"
      : normalized.includes("cancel")
      ? "bg-red-50 text-red-600"
      : normalized.includes("way") || normalized.includes("transit")
      ? "bg-[#fff5df] text-[#9a702e]"
      : "bg-[#f5e9e4] text-[#8a4938]";

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#eee2dc] p-4 transition hover:border-[#d7c0b5] hover:bg-[#fffaf7] sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F3E3DC] text-[#2C0E05]">
          <FiPackage />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold">Order #HB{order.id}</p>
          <p className="mt-1 truncate text-xs text-[#897871]">
            {order.items}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <div className="text-left sm:text-right">
          <p className="text-sm font-bold">
            {formatMoney(order.total_amount)}
          </p>
          <p className="mt-1 text-[10px] text-[#a09089]">
            {formatDate(order.created_at)}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1.5 text-[10px] font-semibold ${statusStyle}`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

function ProfileInfo({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/70 p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F3E3DC] text-[#B08A55]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] text-[#927f77]">{label}</p>
        <p className="truncate text-xs font-semibold">{value}</p>
      </div>
    </div>
  );
}

function WishlistCard({ item, formatMoney }) {
  const name = item.name || item.food_name || "Homemade Food";
  const image = item.image_url || item.food_image || item.image;
  const price = item.price ?? item.food_price;

  return (
    <div className="group overflow-hidden rounded-2xl border border-[#eee2dc] bg-[#fffaf7] transition hover:-translate-y-1 hover:shadow-lg">
      <div className="h-40 overflow-hidden bg-[#F3E3DC]">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">
            🍰
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <h4 className="line-clamp-1 text-sm font-semibold">{name}</h4>

          {price != null && (
            <span className="shrink-0 text-sm font-bold text-[#B08A55]">
              {formatMoney(price)}
            </span>
          )}
        </div>

        <Link
          href="/menu"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2C0E05] py-2.5 text-xs font-semibold text-white transition hover:bg-[#4a1b0e]"
        >
          <FiShoppingBag size={13} />
          Explore Menu
        </Link>
      </div>
    </div>
  );
}

function EmptyState({ text, href, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#ddc9bf] bg-[#fffaf7] px-5 py-9 text-center">
      <p className="text-sm text-[#806d66]">{text}</p>

      <Link
        href={href}
        className="mt-4 inline-flex rounded-xl bg-[#2C0E05] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#4a1b0e]"
      >
        {action}
      </Link>
    </div>
  );
}

function QuickAction({ href, icon, title, text }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-[20px] border border-[#eadbd3] bg-white p-5 transition hover:-translate-y-1 hover:border-[#cdb09f] hover:shadow-lg"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F3E3DC] text-[#2C0E05] transition group-hover:bg-[#2C0E05] group-hover:text-white">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-semibold">{title}</h4>
        <p className="mt-1 truncate text-xs text-[#8a7871]">{text}</p>
      </div>

      <FiChevronRight className="text-[#B08A55] transition group-hover:translate-x-1" />
    </Link>
  );
}
