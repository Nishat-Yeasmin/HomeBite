

"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import Navbar from "./Navbar";
import Footer from "./Footer";
import Sidebar from "./admin/Sidebar";
import AdminNavbar from "./admin/AdminNavbar";
import CustomerSidebar from "./customer/CustomerSidebar";

export default function LayoutShell({ children }) {
  const pathname = usePathname();

  const isAdminPage =
    pathname === "/admin" || pathname.startsWith("/admin/");

  const isCustomerDashboard =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [customer, setCustomer] = useState(null);

  // Customer information for sidebar
  useEffect(() => {
    const updateCustomer = () => {
      const savedUser = localStorage.getItem("homebite-user");
      const token = localStorage.getItem("homebite-token");

      if (savedUser && token) {
        try {
          setCustomer(JSON.parse(savedUser));
        } catch {
          setCustomer(null);
        }
      } else {
        setCustomer(null);
      }
    };

    updateCustomer();

    window.addEventListener("homebite-auth-changed", updateCustomer);
    window.addEventListener("storage", updateCustomer);

    return () => {
      window.removeEventListener("homebite-auth-changed", updateCustomer);
      window.removeEventListener("storage", updateCustomer);
    };
  }, []);

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // ADMIN LAYOUT - KEEP EXISTING DESIGN
  if (isAdminPage) {
    return (
      <div className="min-h-screen bg-[#FFF8F3]">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="min-h-screen">
          <AdminNavbar onMenuClick={() => setSidebarOpen(true)} />

          <main className="min-h-screen pt-[76px]">
            {children}
          </main>
        </div>
      </div>
    );
  }

  // CUSTOMER DASHBOARD LAYOUT
  if (isCustomerDashboard) {
    return (
      <>
        <Navbar />

        <CustomerSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          user={customer}
        />

      
<main className="min-h-screen bg-[#FFF8F3] pt-[100px] text-[#2C0E05] lg:ml-[270px]">
  <button
    onClick={() => setSidebarOpen(true)}
    className="fixed left-4 top-[92px] z-40 flex items-center gap-2 rounded-full border border-[#d8c2b5] bg-[#2C0E05] px-4 py-2.5 text-xs font-semibold text-white shadow-lg transition hover:bg-[#4a1b0e] active:scale-95 lg:hidden"
  >
    <span className="text-base">☰</span>
    Dashboard Menu
  </button>

  <div className="px-5 pb-2 sm:px-8 lg:hidden">
    <div className="h-8" />
  </div>

  {children}
</main>

      </>
    );
  }

  // NORMAL PUBLIC WEBSITE LAYOUT
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
