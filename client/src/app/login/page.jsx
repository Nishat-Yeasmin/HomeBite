"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import GoogleAuthButton from "../components/GoogleAuthButton";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/auth";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
} from "react-icons/fi";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
const router = useRouter();
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

async function handleLogin(e) {
  e.preventDefault();
  setError("");
  setLoading(true);

  const formData = new FormData(e.currentTarget);

  try {
    const data = await loginUser({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (data.user.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/");
    }
  } catch (err) {
    setError(err.message || "Login failed. Please try again.");
  } finally {
    setLoading(false);
  }
}

  return (
    <main className="min-h-screen bg-[#FFF8F3] pt-24">

      <section className="min-h-[calc(100vh-96px)] flex items-center justify-center px-5 py-12">

        <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(44,14,5,0.12)]">

          {/* ================= LEFT SIDE ================= */}
          <div className="hidden lg:block relative min-h-[650px] overflow-hidden">

            {/* Animated Image */}
            <div className="absolute inset-0 auth-image-animation">
              <Image
                src="https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGVzc2VydHxlbnwwfHwwfHx8MA%3D%3D"
                alt="Homemade food"
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#2C0E05]/95 via-[#2C0E05]/35 to-transparent" />

            {/* Decorative circle */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full border border-white/20" />

            <div className="absolute bottom-0 left-0 right-0 p-12 text-white z-10">

              <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[#F3E3DC] text-xs tracking-[2px] uppercase mb-5">
                Welcome Back
              </span>

              <h1 className="font-serif text-5xl leading-tight mb-5">
                Homemade goodness,
                <br />
                delivered with love.
              </h1>

              <p className="text-[#F3E3DC] text-sm leading-7 max-w-md">
                Sign in to discover delicious homemade meals, manage your
                orders and enjoy the taste of home.
              </p>

              <div className="flex items-center gap-3 mt-7">
                <div className="w-10 h-[1px] bg-[#B08A55]" />

                <span className="text-xs text-[#E8D9D0] tracking-wide">
                  Taste the comfort of home
                </span>
              </div>

            </div>
          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="px-7 sm:px-12 lg:px-14 py-10 sm:py-12 flex items-center">

            <div className="w-full max-w-md mx-auto">

              {/* Heading */}
              <div className="mb-8">

                <p className="text-[#B08A55] uppercase tracking-[3px] text-xs font-semibold mb-3">
                  HomeBite
                </p>

                <h2 className="font-serif text-3xl sm:text-4xl text-[#2C0E05] mb-3">
                  Welcome Back
                </h2>

                <p className="text-gray-500 text-sm">
                  Sign in to continue to your HomeBite account.
                </p>

              </div>

            <form onSubmit={handleLogin} className="space-y-5">

                {/* Email */}
                <div>

                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#2C0E05] mb-2"
                  >
                    Email Address
                  </label>

                  <div className="relative">

                    <FiMail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B08A55]"
                    />

                    <input
                      id="email"
                      t  name="email"
  type="email"
  required

                      placeholder="Enter your email"
                      className="peer w-full h-12 rounded-xl border border-[#E5D5CC] bg-[#FFFDFC] pl-11 pr-4 text-sm text-[#2C0E05] outline-none transition-all duration-200 focus:border-[#B08A55] focus:bg-[#F3E3DC] placeholder:text-gray-400"
                    />

                  </div>

                </div>

                {/* Password */}
                <div>

                  <div className="flex justify-between items-center mb-2">

                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-[#2C0E05]"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-xs text-[#B08A55] hover:text-[#2C0E05] transition cursor-pointer"
                    >
                      Forgot Password?
                    </button>

                  </div>

                  <div className="relative">

                    <FiLock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B08A55]"
                    />

                    <input
                      id="password"
                      name="password"
required
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full h-12 rounded-xl border border-[#E5D5CC] bg-[#FFFDFC] pl-11 pr-12 text-sm text-[#2C0E05] outline-none transition-all duration-200 focus:border-[#B08A55] focus:bg-[#F3E3DC] placeholder:text-gray-400"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2C0E05] cursor-pointer"
                    >
                      {showPassword ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </button>

                  </div>

                </div>

                {/* Remember */}
                <div className="flex items-center gap-2">

                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 accent-[#2C0E05] cursor-pointer"
                  />

                  <label
                    htmlFor="remember"
                    className="text-sm text-gray-500 cursor-pointer select-none"
                  >
                    Remember me
                  </label>

                </div>
{error && (
  <p
    role="alert"
    className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
  >
    {error}
  </p>
)}
                {/* Login */}
                <button
  type="submit"
  disabled={loading}
  className="w-full h-12 rounded-xl bg-[#2C0E05] text-white text-sm font-medium tracking-wide hover:bg-[#42180D] transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
>
  {loading ? "Signing In..." : "Sign In"}
  {!loading && <FiArrowRight size={17} />}
</button>

                {/* Divider */}
                <div className="flex items-center gap-4 py-1">

                  <div className="flex-1 h-px bg-[#E8DDD7]" />

                  <span className="text-xs text-gray-400 uppercase">
                    Or
                  </span>

                  <div className="flex-1 h-px bg-[#E8DDD7]" />

                </div>

                {/* Google */}
               <GoogleAuthButton label="Continue with Google" />
              </form>

              <p className="text-center text-sm text-gray-500 mt-8">

                Don't have an account?{" "}

                <Link
                  href="/register"
                  className="text-[#B08A55] font-semibold hover:text-[#2C0E05] transition"
                >
                  Create Account
                </Link>

              </p>

            </div>
          </div>

        </div>

      </section>
    </main>
  );
}