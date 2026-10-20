"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/auth";
import GoogleAuthButton from "../components/GoogleAuthButton";

import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUser,
  FiArrowRight,
} from "react-icons/fi";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  
const router = useRouter();
const [error, setError] = useState("");
const [success, setSuccess] = useState("");
const [loading, setLoading] = useState(false);

async function handleRegister(e) {
  e.preventDefault();
  setError("");
  setSuccess("");

  const form = e.currentTarget;
  const formData = new FormData(form);

  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();
  const termsAccepted = formData.get("terms") === "on";

  if (!name || !email || !password) {
    setError("Please fill in all required fields.");
    return;
  }

  if (password.length < 8 || !/\d/.test(password)) {
    setError("Password must be at least 8 characters and contain a number.");
    return;
  }

  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  if (!termsAccepted) {
    setError("Please agree to the Terms & Privacy Policy.");
    return;
  }

  setLoading(true);

  try {
    await registerUser({ name, email, password });

    setSuccess("Account created successfully! Redirecting to login...");

    form.reset();

    setTimeout(() => {
      router.push("/login");
    }, 1200);
  } catch (err) {
    setError(err.message || "Registration failed. Please try again.");
  } finally {
    setLoading(false);
  }
}


  return (
    <main className="min-h-screen bg-[#FFF8F3] pt-24">

      <section className="min-h-[calc(100vh-96px)] flex items-center justify-center px-5 py-12">

        <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(44,14,5,0.12)]">

          {/* ================= LEFT SIDE ================= */}
          <div className="hidden lg:block relative min-h-[700px] overflow-hidden">

            <div className="absolute inset-0 auth-image-animation">
              <Image
                src="https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGVzc2VydHxlbnwwfHwwfHx8MA%3D%3D"
                alt="Homemade food"
                fill
                priority
                className="object-cover"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-[#2C0E05]/95 via-[#2C0E05]/35 to-transparent" />

            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full border border-white/20" />

            <div className="absolute bottom-0 left-0 right-0 p-12 text-white z-10">

              <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[#F3E3DC] text-xs tracking-[2px] uppercase mb-5">
                Join HomeBite
              </span>

              <h1 className="font-serif text-5xl leading-tight mb-5">
                Good food,
                <br />
                feels like home.
              </h1>

              <p className="text-[#F3E3DC] text-sm leading-7 max-w-md">
                Create your HomeBite account and discover delicious homemade
                meals, snacks, desserts and drinks made with care.
              </p>

              <div className="flex items-center gap-3 mt-7">
                <div className="w-10 h-[1px] bg-[#B08A55]" />

                <span className="text-xs text-[#E8D9D0] tracking-wide">
                  Your table, your taste
                </span>
              </div>

            </div>
          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="px-7 sm:px-12 lg:px-14 py-10 sm:py-11 flex items-center">

            <div className="w-full max-w-md mx-auto">

              {/* Heading */}
              <div className="mb-7">

                <p className="text-[#B08A55] uppercase tracking-[3px] text-xs font-semibold mb-3">
                  HomeBite
                </p>

                <h2 className="font-serif text-3xl sm:text-4xl text-[#2C0E05] mb-3">
                  Create an Account
                </h2>

                <p className="text-gray-500 text-sm">
                  Join HomeBite and enjoy homemade goodness.
                </p>

              </div>

            <form onSubmit={handleRegister} className="space-y-4">

                {/* Full Name */}
                <div>

                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-[#2C0E05] mb-2"
                  >
                    Full Name
                  </label>

                  <div className="relative">

                    <FiUser
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B08A55]"
                    />

                    <input
                      id="name"
                      name = "name"
                      required
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full h-11 rounded-xl border border-[#E5D5CC] bg-[#FFFDFC] pl-11 pr-4 text-sm text-[#2C0E05] outline-none transition-all duration-200 focus:border-[#B08A55] focus:bg-[#F3E3DC] placeholder:text-gray-400"
                    />

                  </div>

                </div>

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
                      name = "email"
                      required
                      type="email"
                      placeholder="Enter your email"
                      className="w-full h-11 rounded-xl border border-[#E5D5CC] bg-[#FFFDFC] pl-11 pr-4 text-sm text-[#2C0E05] outline-none transition-all duration-200 focus:border-[#B08A55] focus:bg-[#F3E3DC] placeholder:text-gray-400"
                    />

                  </div>

                </div>

                {/* Password */}
                <div>

                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[#2C0E05] mb-2"
                  >
                    Password
                  </label>

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
                      placeholder="Create a password"
                      className="w-full h-11 rounded-xl border border-[#E5D5CC] bg-[#FFFDFC] pl-11 pr-12 text-sm text-[#2C0E05] outline-none transition-all duration-200 focus:border-[#B08A55] focus:bg-[#F3E3DC] placeholder:text-gray-400"
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

                  <p className="text-[11px] text-gray-400 mt-1.5">
                    Minimum 8 characters with at least one number.
                  </p>

                </div>

                {/* Confirm Password */}
                <div>

                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-[#2C0E05] mb-2"
                  >
                    Confirm Password
                  </label>

                  <div className="relative">

                    <FiLock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B08A55]"
                    />

                    <input
                      id="confirmPassword"
                      name = "confirmPassword"
                      required
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="w-full h-11 rounded-xl border border-[#E5D5CC] bg-[#FFFDFC] pl-11 pr-12 text-sm text-[#2C0E05] outline-none transition-all duration-200 focus:border-[#B08A55] focus:bg-[#F3E3DC] placeholder:text-gray-400"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2C0E05] cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </button>

                  </div>

                </div>

                {/* Terms */}
                <div className="flex items-start gap-2 pt-1">

                  <input
                    id="terms"
                    name = "terms"
                    required
                    type="checkbox"
                    className="w-4 h-4 mt-1 accent-[#2C0E05] cursor-pointer"
                  />

                  <label
                    htmlFor="terms"
                    className="text-xs leading-5 text-gray-500 cursor-pointer select-none"
                  >
                    I agree to the HomeBite{" "}
                    <span className="text-[#B08A55] font-medium">
                      Terms & Privacy Policy
                    </span>
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

{success && (
  <p
    role="status"
    className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700"
  >
    {success}
  </p>
)}

                {/* Create Account */}
                <button
  type="submit"
  disabled={loading}
  className="w-full h-11 rounded-xl bg-[#2C0E05] text-white text-sm font-medium tracking-wide hover:bg-[#42180D] transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
>
  {loading ? "Creating Account..." : "Create Account"}
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
             <GoogleAuthButton label="Sign up with Google" />

              </form>

              <p className="text-center text-sm text-gray-500 mt-7">

                Already have an account?{" "}

                <Link
                  href="/login"
                  className="text-[#B08A55] font-semibold hover:text-[#2C0E05] transition"
                >
                  Sign In
                </Link>

              </p>

            </div>
          </div>

        </div>

      </section>
    </main>
  );
}