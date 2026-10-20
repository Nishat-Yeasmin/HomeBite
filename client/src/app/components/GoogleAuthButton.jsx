
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";

export default function GoogleAuthButton({
  label = "Continue with Google",
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startGoogleLogin = useGoogleLogin({
    scope: "openid email profile",

    onSuccess: async (googleResponse) => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              accessToken: googleResponse.access_token,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Google authentication failed."
          );
        }

        localStorage.setItem("homebite-token", data.token);
        localStorage.setItem(
          "homebite-user",
          JSON.stringify(data.user)
        );

        window.dispatchEvent(
          new Event("homebite-auth-changed")
        );

        router.push(
          data.user.role === "admin" ? "/admin" : "/"
        );
      } catch (err) {
        setError(
          err.message || "Google sign-in failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },

    onError: () => {
      setError("Google sign-in failed. Please try again.");
    },
  });

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => startGoogleLogin()}
        disabled={loading}
        className="w-full h-12 rounded-xl border border-[#DCCBC1] bg-white text-[#2C0E05] flex items-center justify-center gap-3 text-sm font-medium hover:bg-[#F3E3DC] transition-colors cursor-pointer disabled:opacity-60"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.08 13.22l7.98 6.19C12.96 13.72 18.02 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.99 46.98 31.79 46.98 24.55z"
          />
          <path
            fill="#FBBC05"
            d="M11.06 28.59A14.4 14.4 0 0 1 10.3 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 3.08 10.78l7.98-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.18 2.3-5.98 0-11.04-4.22-12.94-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
        </svg>

        {loading ? "Connecting..." : label}
      </button>

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
