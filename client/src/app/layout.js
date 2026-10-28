
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { GoogleOAuthProvider } from "@react-oauth/google";
import LayoutShell from "./components/LayoutShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "HomeBite",
  description: "Homemade Food Ordering & Management System",
  icons: {
    icon: "images/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
        >
         <LayoutShell>{children}</LayoutShell>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
