"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutShell({ children }) {
  const pathname = usePathname();
  const isAdminPage =
    pathname === "/admin" || pathname.startsWith("/admin/");

  return (
    <>
      {!isAdminPage && <Navbar />}
      {children}
      {!isAdminPage && <Footer />}
    </>
  );
}
