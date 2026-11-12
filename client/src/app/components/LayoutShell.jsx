
// "use client";

// import { usePathname } from "next/navigation";
// import Navbar from "./Navbar";
// import Footer from "./Footer";
// import Sidebar from "./admin/Sidebar";

// export default function LayoutShell({ children }) {
//   const pathname = usePathname();

//   const isAdminPage =
//     pathname === "/admin" || pathname.startsWith("/admin/");

//   if (isAdminPage) {
//     return (
//       <div className="min-h-screen bg-[#FFF8F3]">
//         <Sidebar />

//         <div className="min-h-screen lg:ml-[0px]">
//           {children}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <Navbar />
//       {children}
//       <Footer />
//     </>
//   );
// }



"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

import Navbar from "./Navbar";
import Footer from "./Footer";
import Sidebar from "./admin/Sidebar";
import AdminNavbar from "./admin/AdminNavbar";

export default function LayoutShell({ children }) {
  const pathname = usePathname();

  const isAdminPage =
    pathname === "/admin" || pathname.startsWith("/admin/");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isAdminPage) {
    return (
      <div className="min-h-screen bg-[#FFF8F3]">

        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="min-h-screen ">

<AdminNavbar
  onMenuClick={() => setSidebarOpen(true)}
 
/>

          <main className="min-h-screen pt-[76px]">
            {children}
          </main>

        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
