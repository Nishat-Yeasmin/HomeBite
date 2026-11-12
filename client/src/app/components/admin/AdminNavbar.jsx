
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  FiLayers,
  FiUser,
  FiLogOut,
  FiChevronDown,
  FiRefreshCw,
} from "react-icons/fi";
import Link from "next/link";

export default function AdminNavbar({ onMenuClick }) {
  const pathname = usePathname();
  const router = useRouter();

  const [profileOpen, setProfileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("homebite-user") || "null"
    );
    setCurrentUser(user);
  }, []);

  const titles = {
    "/admin": "Admin Dashboard",
    "/admin/foods": "Food Management",
    "/admin/categories": "Category Management",
    "/admin/orders": "Order Management",
  };

  const title = titles[pathname] || "Admin Panel";

  const handleLogout = () => {
    localStorage.removeItem("homebite-token");
    localStorage.removeItem("homebite-user");

    window.dispatchEvent(new Event("homebite-auth-changed"));
    router.replace("/");
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-[272px] z-40 flex h-[76px] items-center justify-between border-b border-[#F0E1D8] bg-white/65 px-5 backdrop-blur-2xl border-b border-white/50 md:px-8">

      {/* Left Section */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg border border-[#F0E1D8] p-2 lg:hidden"
        >
          <FiLayers size={20} />
        </button>

        <div>
          <h1 className="text-lg font-bold text-[#2C0E05] md:text-xl">
            {title}
          </h1>

          <p className="text-xs text-gray-500">
            Manage your HomeBite store
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">

        {/* Refresh Button */}
        <button
          onClick={() => window.location.reload()}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#F3E3DC] px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-[#EBD2C5] hover:shadow-sm active:scale-95"
        >
          <FiRefreshCw />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-white p-1.5 transition-all duration-200 hover:border-[#B08A55] hover:bg-[#FFF8F3] hover:shadow-sm"
          >
            <img
              src="/images/admin-profile.jpg"
              alt="Admin"
              className="h-9 w-9 rounded-full border-2 border-[#B08A55] object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />

            <FiChevronDown
              className={`mr-1 text-gray-500 transition-transform duration-200 ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {profileOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setProfileOpen(false)}
              />

              <div className="absolute right-0 top-full z-50 mt-2 w-45 overflow-hidden rounded-xl border border-[#F0E1D8] bg-white shadow-xl cursor-pointer">

                {/* Profile Information */}
                <div className="border-b border-[#F0E1D8] bg-[#FFF8F3] px-3 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src="/images/admin-profile.jpg"
                      alt="Admin Profile"
                      className="h-10 w-10 rounded-full border-2 border-[#B08A55] object-cover"
                    />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#2C0E05]">
                        {currentUser?.name || "Admin"}
                      </p>

                      <p className="text-[10px] font-semibold text-[#9B641D]">
                        SUPER ADMIN
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dropdown Actions */}
                <div className="p-1.5">
                  <Link
                    href="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-[#FFF3E9] hover:text-[#8B4930]"
                  >
                    <FiUser size={17} />
                    My Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
                  >
                    <FiLogOut size={17} />
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
