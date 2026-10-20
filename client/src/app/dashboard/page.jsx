"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiHome,
  FiShoppingBag,
  FiHeart,
  FiUser,
  FiSettings,
  FiLogOut,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiChevronRight,
  FiArrowUpRight,
  FiPackage,
  FiMapPin,
  FiCreditCard,
  FiEdit3,
  FiMenu,
  FiX,
} from "react-icons/fi";

const orders = [
  {
    id: "#HB10245",
    date: "Oct 08, 2026",
    items: "Chicken Biryani × 2",
    amount: "৳440",
    status: "Delivered",
    icon: FiCheckCircle,
  },
  {
    id: "#HB10238",
    date: "Oct 06, 2026",
    items: "Chocolate Cake × 1",
    amount: "৳650",
    status: "On the way",
    icon: FiTruck,
  },
  {
    id: "#HB10221",
    date: "Oct 03, 2026",
    items: "Pitha Platter × 1",
    amount: "৳280",
    status: "Processing",
    icon: FiClock,
  },
];

const wishlist = [
  {
    name: "Homemade Chicken Biryani",
    price: "৳220",
    image:
      "https://images.unsplash.com/photo-1719239885399-f87d992e0f18?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2hpY2tlbiUyMGJpcml5YW5pfGVufDB8fDB8fHww",
  },
  {
    name: "Chocolate Fudge Cake",
    price: "৳650",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Traditional Pitha Platter",
    price: "৳280",
    image:
      "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=500&q=80",
  },
];

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#FFF8F3] text-[#2C0E05]">
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-[#eadbd3] bg-[#FFF8F3]/95 px-5 py-4 backdrop-blur md:hidden">
        <Link
          href="/"
          className="font-serif text-xl font-bold tracking-tight text-[#2C0E05]"
        >
          Home<span className="text-[#B08A55]">Bite</span>
        </Link>

        <button
          onClick={() => setSidebarOpen(true)}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-[#2C0E05] text-white"
        >
          <FiMenu size={20} />
        </button>
      </div>

      <div className="mx-auto flex max-w-[1500px]">
        {/* Overlay */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-0 z-50 flex h-screen w-[270px] flex-col border-r border-[#eadbd3] bg-[#fffaf7] px-6 py-7 transition-transform duration-300 md:sticky md:z-30 md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Close mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute right-5 top-5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-[#F3E3DC] md:hidden"
          >
            <FiX size={18} />
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="mb-12 font-serif text-2xl font-bold tracking-tight"
          >
            Home<span className="text-[#B08A55]">Bite</span>
          </Link>

          {/* User mini profile */}
          <div className="mb-8 flex items-center gap-3 rounded-2xl bg-[#F3E3DC]/70 p-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2C0E05] font-serif text-lg font-bold text-[#F3E3DC]">
              N
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Nishat Nisha</p>
              <p className="truncate text-xs text-[#806d66]">Food lover</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <SidebarLink
              icon={<FiHome />}
              label="Overview"
              active
              href="/dashboard"
            />

            <SidebarLink
              icon={<FiShoppingBag />}
              label="My Orders"
              href="/dashboard/orders"
            />

            <SidebarLink
              icon={<FiHeart />}
              label="Wishlist"
              href="/dashboard/wishlist"
            />

            <SidebarLink
              icon={<FiUser />}
              label="My Profile"
              href="/dashboard/profile"
            />

            <SidebarLink
              icon={<FiSettings />}
              label="Settings"
              href="/dashboard/settings"
            />
          </nav>

          <div className="mt-auto">
            <Link
              href="/menu"
              className="mb-4 flex items-center justify-center gap-2 rounded-xl bg-[#2C0E05] px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <FiShoppingBag />
              Browse Menu
            </Link>

            <button className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#7b6b65] transition hover:bg-[#F3E3DC] hover:text-[#2C0E05]">
              <FiLogOut />
              Logout
            </button>
          </div>
        </aside>

        {/* Main */}
        <section className="min-w-0 flex-1 px-5 py-7 sm:px-8 lg:px-10 lg:py-10">
          {/* Top bar */}
          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="mb-1 text-sm font-medium text-[#B08A55]">
                Thursday, October 08, 2026
              </p>

              <h1 className="font-serif text-3xl font-bold sm:text-4xl">
                Welcome back, Nishat!
              </h1>

              <p className="mt-2 text-sm text-[#806d66]">
                Here’s what’s happening with your HomeBite account.
              </p>
            </div>

            <Link
              href="/menu"
              className="group flex w-fit items-center gap-2 rounded-xl border border-[#d8c5bc] bg-white px-5 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-1 hover:border-[#B08A55] hover:shadow-lg"
            >
              Order something delicious
              <FiArrowUpRight className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
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

            {/* Decorative circles */}
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
              value="24"
              change="+12%"
              subtitle="from last month"
            />

            <StatCard
              icon={<FiClock />}
              title="Pending Orders"
              value="02"
              change="Active"
              subtitle="right now"
            />

            <StatCard
              icon={<FiHeart />}
              title="Wishlist"
              value="08"
              change="+2"
              subtitle="this month"
            />

            <StatCard
              icon={<FiCreditCard />}
              title="Total Spent"
              value="৳8,420"
              change="+8%"
              subtitle="from last month"
            />
          </div>

          {/* Content Grid */}
          <div className="grid gap-7 xl:grid-cols-[1.5fr_1fr]">
            {/* Recent Orders */}
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
                  View all
                  <FiChevronRight />
                </Link>
              </div>

              <div className="space-y-3">
                {orders.map((order) => (
                  <OrderRow key={order.id} order={order} />
                ))}
              </div>
            </div>

            {/* Profile */}
            <div className="rounded-[26px] border border-[#eadbd3] bg-[#F3E3DC]/60 p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold">
                  Profile
                </h3>

                <Link
                  href="/dashboard/profile"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2C0E05] transition hover:bg-[#2C0E05] hover:text-white"
                >
                  <FiEdit3 size={15} />
                </Link>
              </div>

              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2C0E05] font-serif text-2xl font-bold text-[#F3E3DC]">
                  N
                </div>

                <div>
                  <h4 className="font-semibold">Nishat Yeasmin</h4>
                  <p className="text-xs text-[#806d66]">
                    nishat@example.com
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <ProfileInfo
                  icon={<FiMapPin />}
                  label="Delivery Address"
                  value="Sylhet, Bangladesh"
                />

                <ProfileInfo
                  icon={<FiCreditCard />}
                  label="Preferred Payment"
                  value="Cash on Delivery"
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
                View wishlist
                <FiChevronRight />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {wishlist.map((item) => (
                <WishlistCard key={item.name} item={item} />
              ))}
            </div>
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
              icon={<FiTruck />}
              title="Track Order"
              text="Check your active delivery"
            />
          </div>

          {/* Footer note */}
          <div className="mt-10 border-t border-[#eadbd3] pt-6 text-center">
            <p className="text-xs text-[#927e76]">
              Made with care by HomeBite · Homemade goodness, delivered with
              love.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

/* Sidebar Link */
function SidebarLink({ icon, label, href, active }) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
        active
          ? "bg-[#2C0E05] text-white shadow-md"
          : "text-[#75645e] hover:translate-x-1 hover:bg-[#F3E3DC] hover:text-[#2C0E05]"
      }`}
    >
      <span
        className={`text-lg ${
          active
            ? "text-[#e8cfaa]"
            : "text-[#9a847b] group-hover:text-[#B08A55]"
        }`}
      >
        {icon}
      </span>
      {label}
    </Link>
  );
}

/* Stat Card */
function StatCard({ icon, title, value, change, subtitle }) {
  return (
    <div className="group rounded-[22px] border border-[#eadbd3] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-5 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3E3DC] text-[#2C0E05] transition-all duration-300 group-hover:rotate-6 group-hover:bg-[#2C0E05] group-hover:text-white">
          {icon}
        </div>

        <span className="rounded-full bg-[#f5efe9] px-2.5 py-1 text-[10px] font-semibold text-[#B08A55]">
          {change}
        </span>
      </div>

      <p className="text-xs text-[#8a7871]">{title}</p>

      <div className="mt-1 flex items-end gap-2">
        <span className="font-serif text-2xl font-bold">{value}</span>
      </div>

      <p className="mt-1 text-[10px] text-[#a09089]">{subtitle}</p>
    </div>
  );
}

/* Order Row */
function OrderRow({ order }) {
  const StatusIcon = order.icon;

  const statusStyle =
    order.status === "Delivered"
      ? "bg-[#edf5ed] text-[#557357]"
      : order.status === "On the way"
      ? "bg-[#fff5df] text-[#9a702e]"
      : "bg-[#f5e9e4] text-[#8a4938]";

  return (
    <div className="group flex flex-col gap-4 rounded-2xl border border-[#eee2dc] p-4 transition-all duration-300 hover:border-[#d7c0b5] hover:bg-[#fffaf7] sm:flex-row sm:items-center">
      <div className="flex flex-1 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F3E3DC] text-[#2C0E05]">
          <FiPackage />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold">{order.id}</p>
          <p className="mt-1 truncate text-xs text-[#897871]">
            {order.items}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <div className="text-left sm:text-right">
          <p className="text-sm font-bold">{order.amount}</p>
          <p className="mt-1 text-[10px] text-[#a09089]">
            {order.date}
          </p>
        </div>

        <span
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold ${statusStyle}`}
        >
          <StatusIcon size={12} />
          {order.status}
        </span>
      </div>
    </div>
  );
}

/* Profile Info */
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

/* Wishlist */
function WishlistCard({ item }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-[#eee2dc] bg-[#fffaf7] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-40 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />

        <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#9b4339] shadow-sm">
          <FiHeart size={14} fill="currentColor" />
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <h4 className="line-clamp-1 text-sm font-semibold">
            {item.name}
          </h4>

          <span className="shrink-0 text-sm font-bold text-[#B08A55]">
            {item.price}
          </span>
        </div>

        <button className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#2C0E05] py-2.5 text-xs font-semibold text-white transition hover:bg-[#4a1b0e]">
          <FiShoppingBag size={13} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}

/* Quick Action */
function QuickAction({ href, icon, title, text }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-[20px] border border-[#eadbd3] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#cdb09f] hover:shadow-lg"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F3E3DC] text-[#2C0E05] transition-all duration-300 group-hover:bg-[#2C0E05] group-hover:text-white">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-semibold">{title}</h4>
        <p className="mt-1 truncate text-xs text-[#8a7871]">{text}</p>
      </div>

      <FiChevronRight className="text-[#B08A55] transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}