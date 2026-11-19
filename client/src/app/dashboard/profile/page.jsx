
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiEdit3,
  FiSave,
  FiX,
  FiShield,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiArrowRight,
  FiLock,
  FiStar,
  FiCamera,
} from "react-icons/fi";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);
const [uploadingPhoto, setUploadingPhoto] = useState(false);

const profileImageUrl = user?.profile_image
  ? user.profile_image.startsWith("http")
    ? user.profile_image
    : `${API_URL}${user.profile_image}`
  : "";

  const handlePhotoUpload = async (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const allowedTypes = ["image/png", "image/jpeg"];

  if (!allowedTypes.includes(file.type)) {
    showToast("Only PNG, JPG and JPEG images are allowed.", "error");
    e.target.value = "";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    showToast("Image size must be less than 5MB.", "error");
    e.target.value = "";
    return;
  }

  try {
    setUploadingPhoto(true);

    const token = localStorage.getItem("homebite-token");

    if (!token) {
      throw new Error("Please login again.");
    }

    const formData = new FormData();
    formData.append("profile", file);

    const response = await fetch(
      `${API_URL}/api/customer/profile/photo`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Image upload failed.");
    }

  const updatedUser = {
  ...user,
  profile_image: data.profile_image,
};

setUser(updatedUser);

localStorage.setItem(
  "homebite-user",
  JSON.stringify(updatedUser)
);

window.dispatchEvent(
  new CustomEvent("homebite-profile-updated", {
    detail: updatedUser,
  })
);

    showToast("Profile picture updated successfully!");
  } catch (error) {
    showToast(error.message || "Could not upload image.", "error");
  } finally {
    setUploadingPhoto(false);
    e.target.value = "";
  }
};

  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3500);

    return () => clearTimeout(timer);
  }, [toast]);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("homebite-token");

      if (!token) {
        setError("Please login to view your profile.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${API_URL}/api/customer/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load profile.");
      }

     setUser(data.user);

localStorage.setItem(
  "homebite-user",
  JSON.stringify(data.user)
);

window.dispatchEvent(
  new CustomEvent("homebite-profile-updated", {
    detail: data.user,
  })
);

      setFormData({
        name: data.user.name || "",
        phone: data.user.phone || "",
      });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const initials = useMemo(() => {
    if (!user?.name) return "HB";

    return user.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }, [user]);

  const completion = useMemo(() => {
    if (!user) return 0;

    const fields = [
      user.name,
      user.email,
      user.phone,
    ];

    const completed = fields.filter(
      (field) => field && String(field).trim()
    ).length;

    return Math.round((completed / fields.length) * 100);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
    });

    setEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
    });

    setEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const phone = formData.phone.trim();

    if (!name) {
      showToast("Please enter your name.", "error");
      return;
    }

    if (name.length > 100) {
      showToast("Name cannot exceed 100 characters.", "error");
      return;
    }

    if (phone.length > 20) {
      showToast("Phone number is too long.", "error");
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("homebite-token");

      if (!token) {
        throw new Error("Please login again.");
      }

      const response = await fetch(
        `${API_URL}/api/customer/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            phone: phone || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Profile update failed.");
      }

      setUser(data.user);

      setFormData({
        name: data.user.name || "",
        phone: data.user.phone || "",
      });

      setEditing(false);
      showToast("Your profile has been updated successfully!");
    } catch (err) {
      showToast(err.message || "Unable to update profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-[#FFF8F3]">
        <div className="text-center">
          <div className="relative mx-auto mb-5 h-16 w-16">
            <div className="absolute inset-0 rounded-full border-4 border-[#EADCC8]" />
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#B08A55]" />
            <FiUser className="absolute inset-0 m-auto text-[#75451F] text-xl" />
          </div>
          <p className="text-sm font-medium tracking-wide text-[#765B47]">
            Preparing your profile...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-[#FFF8F3] px-5">
        <div className="w-full max-w-md rounded-3xl border border-[#E9D9C6] bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F8EAE3] text-[#9A4D35]">
            <FiAlertCircle size={27} />
          </div>

          <h2 className="font-serif text-2xl text-[#2C0E05]">
            Profile Unavailable
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#806D5D]">
            {error}
          </p>

          <button
            onClick={fetchProfile}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2C0E05] px-6 py-3 text-sm font-semibold text-[#F5D99B] transition hover:bg-[#4A2112] hover:shadow-lg"
          >
            <FiRefreshCw />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#FFF8F3] px-4 pb-12 pt-5 sm:px-6 lg:px-8">

      {/* Background Decorations */}
      <div className="pointer-events-none fixed right-0 top-24 h-72 w-72 rounded-full bg-[#E9D2A8]/20 blur-3xl" />
      <div className="pointer-events-none fixed bottom-0 left-0 h-72 w-72 rounded-full bg-[#E9C9B8]/20 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">

        {/* Page Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#A47B45]">
            <span className="h-px w-7 bg-[#B08A55]" />
            My Account
          </div>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="font-serif text-3xl font-bold tracking-tight text-[#2C0E05] sm:text-4xl lg:text-5xl">
                My Profile
                <span className="text-[#B08A55]">.</span>
              </h1>

              <p className="mt-3 max-w-lg text-sm leading-6 text-[#806D5D] sm:text-base">
                Manage your personal information and keep your
                HomeBite account up to date.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-[#896B49]">
              <FiShield className="text-[#B08A55]" size={16} />
              Your account is protected
            </div>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">

          {/* Left Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65 }}
            className="overflow-hidden rounded-[28px] border border-[#DCC7A6] bg-white shadow-[0_15px_50px_rgba(67,36,15,0.08)] lg:col-span-4"
          >
            {/* Gold Cover */}
            <div className="relative h-36 overflow-hidden bg-gradient-to-br from-[#2C0E05] via-[#542B16] to-[#9B7140]">
              <div className="absolute -right-10 -top-20 h-52 w-52 rounded-full border border-[#E8C98C]/30" />
              <div className="absolute -right-2 -top-12 h-40 w-40 rounded-full border border-[#E8C98C]/20" />
              <div className="absolute -bottom-20 left-8 h-44 w-44 rounded-full border border-[#E8C98C]/20" />

              <div className="absolute right-6 top-6 text-[#F4D99E]/80">
                <FiStar size={23} />
              </div>

              <div className="absolute bottom-5 left-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#E8C98C]">
                  HOMEBITE MEMBER
                </p>
                <p className="mt-1 font-serif text-xl text-white">
                  Personal Account
                </p>
              </div>
            </div>

            {/* Avatar */}
            <div className="px-6 pb-7">
             {/* Profile Avatar */}
<div className="relative z-20 -mt-14 flex items-end justify-between">

  <div className="relative">

    {/* Hidden File Input */}
    <input
      ref={fileInputRef}
      type="file"
      accept=".png,.jpg,.jpeg,image/png,image/jpeg"
      onChange={handlePhotoUpload}
      className="hidden"
    />

    {/* Circular Avatar */}
    <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-[5px] border-white bg-gradient-to-br from-[#E3C994] to-[#A77C42] shadow-[0_8px_25px_rgba(44,14,5,0.2)]">

      {profileImageUrl ? (
        <img
          src={profileImageUrl}
          alt="Customer Profile"
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <span className="font-serif text-3xl font-bold tracking-wide text-[#35180C]">
          {initials}
        </span>
      )}

      {uploadingPhoto && (
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-[#2C0E05]/75">
          <FiRefreshCw className="animate-spin text-2xl text-[#F3D99F]" />
        </div>
      )}
    </div>

    {/* Camera Upload Button */}
    <button
      type="button"
      onClick={() => fileInputRef.current?.click()}
      disabled={uploadingPhoto}
      title="Upload profile picture"
      className="absolute bottom-1 right-0 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-white bg-[#2C0E05] text-[#F2D69A] shadow-md transition duration-300 hover:scale-110 hover:bg-[#70431F] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <FiCamera size={15} />
    </button>

  </div>

  <span className="mb-2 flex items-center gap-1.5 rounded-full border border-[#E6D6B9] bg-[#FFF9EF] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8A642F]">
    <FiCheckCircle size={12} />
    Customer
  </span>

</div>

              <h2 className="mt-5 break-words font-serif text-2xl font-bold text-[#2C0E05]">
                {user?.name}
              </h2>

              <p className="mt-1 break-all text-sm text-[#8B796A]">
                {user?.email}
              </p>

              <div className="my-6 h-px bg-gradient-to-r from-transparent via-[#E7D7BE] to-transparent" />

              {/* Profile Completion */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#3D2416]">
                    Profile Completion
                  </p>
                  <span className="font-serif text-lg font-bold text-[#A77B3E]">
                    {completion}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-[#F0E7DC]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completion}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full rounded-full bg-gradient-to-r from-[#9C713B] via-[#C8A568] to-[#E4C98D]"
                  />
                </div>

                <p className="mt-3 text-xs leading-5 text-[#958271]">
                  {completion === 100
                    ? "Wonderful! Your profile information is complete."
                    : "Add your missing information to complete your profile."}
                </p>
              </div>


<button
  type="button"
  onClick={() => fileInputRef.current?.click()}
  disabled={uploadingPhoto}
  className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#D8C29D] bg-[#FFF9EF] px-5 py-3 text-sm font-semibold text-[#805B32] transition hover:bg-[#F4E8D4] disabled:opacity-60"
>
  <FiCamera size={16} />
  {uploadingPhoto ? "Uploading Photo..." : "Change Profile Picture"}
</button>


              <button
                onClick={handleEdit}
                disabled={editing}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2C0E05] px-5 py-3.5 text-sm font-semibold text-[#F3D99F] shadow-md transition duration-300 hover:-translate-y-0.5 hover:bg-[#4B2413] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiEdit3 size={16} />
                Edit My Profile
              </button>
            </div>
          </motion.div>

          {/* Right Information */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.12 }}
            className="space-y-6 lg:col-span-8"
          >

            {/* Personal Information */}
            <div className="rounded-[28px] border border-[#E6D7C3] bg-white p-5 shadow-[0_12px_40px_rgba(67,36,15,0.05)] sm:p-7">
              <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F7EFE3] text-[#9A713E]">
                      <FiUser size={18} />
                    </span>
                    <h3 className="font-serif text-xl font-bold text-[#2C0E05]">
                      Personal Information
                    </h3>
                  </div>

                  <p className="mt-2 text-xs text-[#938170]">
                    Your basic account details
                  </p>
                </div>

                {!editing && (
                  <button
                    onClick={handleEdit}
                    className="inline-flex items-center gap-2 self-start rounded-lg border border-[#E7D7BE] px-4 py-2 text-xs font-semibold text-[#805B32] transition hover:border-[#B08A55] hover:bg-[#FFF9EF]"
                  >
                    <FiEdit3 size={13} />
                    Edit Details
                  </button>
                )}
              </div>

              <AnimatePresence mode="wait">
                {editing ? (
                  <motion.form
                    key="edit-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={handleSave}
                    className="space-y-5"
                  >
                    {/* Name */}
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#80664E]">
                        Full Name
                      </label>

                      <div className="relative">
                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AD8C60]" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          maxLength={100}
                          placeholder="Enter your full name"
                          className="w-full rounded-xl border border-[#E4D5C1] bg-[#FFFCF8] py-3.5 pl-11 pr-4 text-sm text-[#392214] outline-none transition placeholder:text-[#B6A595] focus:border-[#B08A55] focus:ring-4 focus:ring-[#B08A55]/10"
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#80664E]">
                        Email Address
                      </label>

                      <div className="relative">
                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AD8C60]" />
                        <input
                          type="email"
                          value={user?.email || ""}
                          readOnly
                          className="w-full cursor-not-allowed rounded-xl border border-[#EAE1D6] bg-[#F7F3EE] py-3.5 pl-11 pr-4 text-sm text-[#968576] outline-none"
                        />
                      </div>

                      <p className="mt-2 text-[11px] text-[#A18F7D]">
                        Email address cannot be changed here.
                      </p>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#80664E]">
                        Phone Number
                      </label>

                      <div className="relative">
                        <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AD8C60]" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          maxLength={20}
                          placeholder="Enter your phone number"
                          className="w-full rounded-xl border border-[#E4D5C1] bg-[#FFFCF8] py-3.5 pl-11 pr-4 text-sm text-[#392214] outline-none transition placeholder:text-[#B6A595] focus:border-[#B08A55] focus:ring-4 focus:ring-[#B08A55]/10"
                        />
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col gap-3 border-t border-[#F0E7DC] pt-5 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={saving}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E4D7C7] px-6 py-3 text-sm font-semibold text-[#735D4B] transition hover:bg-[#F8F3EC] disabled:opacity-50"
                      >
                        <FiX />
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2C0E05] to-[#59301A] px-7 py-3 text-sm font-semibold text-[#F5DDA7] shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {saving ? (
                          <>
                            <FiRefreshCw className="animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <FiSave />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="profile-info"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                  >
                    {/* Name Card */}
                    <div className="group rounded-2xl border border-[#EEE3D4] bg-[#FFFCF8] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#D3B98C] hover:shadow-md">
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F2E7D7] text-[#98703D] transition group-hover:bg-[#EBD9B9]">
                        <FiUser size={18} />
                      </div>

                      <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#A08B75]">
                        Full Name
                      </p>

                      <p className="mt-2 break-words text-sm font-semibold text-[#382013]">
                        {user?.name || "Not provided"}
                      </p>
                    </div>

                    {/* Email Card */}
                    <div className="group rounded-2xl border border-[#EEE3D4] bg-[#FFFCF8] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#D3B98C] hover:shadow-md">
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F2E7D7] text-[#98703D] transition group-hover:bg-[#EBD9B9]">
                        <FiMail size={18} />
                      </div>

                      <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#A08B75]">
                        Email Address
                      </p>

                      <p className="mt-2 break-all text-sm font-semibold text-[#382013]">
                        {user?.email || "Not provided"}
                      </p>
                    </div>

                    {/* Phone Card */}
                    <div className="group rounded-2xl border border-[#EEE3D4] bg-[#FFFCF8] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#D3B98C] hover:shadow-md sm:col-span-2">
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F2E7D7] text-[#98703D] transition group-hover:bg-[#EBD9B9]">
                        <FiPhone size={18} />
                      </div>

                      <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#A08B75]">
                        Phone Number
                      </p>

                      <p className="mt-2 text-sm font-semibold text-[#382013]">
                        {user?.phone || "No phone number added yet"}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Security Card */}
            <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#2C0E05] via-[#44200F] to-[#684326] p-6 shadow-[0_15px_40px_rgba(44,14,5,0.18)] sm:p-7">
              <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full border border-[#E4C68A]/20" />
              <div className="pointer-events-none absolute -right-4 -top-8 h-32 w-32 rounded-full border border-[#E4C68A]/20" />

              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#D8B875]/30 bg-[#E9C984]/10 text-[#E8C98B]">
                    <FiShield size={22} />
                  </div>

                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#FFF5E4]">
                      Your Account, Protected
                    </h3>

                    <p className="mt-2 max-w-md text-xs leading-6 text-[#E1CBA9]/75">
                      Your account information is protected through
                      secure authentication. Keep your login details
                      private for a safer experience.
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 rounded-full border border-[#D7BB80]/30 bg-[#D7BB80]/10 px-4 py-2 text-xs font-semibold text-[#F0D69E]">
                  <FiLock size={13} />
                  Secure Account
                </div>
              </div>
            </div>

            {/* Helpful Note */}
            <div className="flex gap-3 rounded-2xl border border-[#E9DCC9] bg-[#F8F0E5] p-5">
              <div className="mt-0.5 text-[#A47B45]">
                <FiCheckCircle size={19} />
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#56351D]">
                  Keep your information updated
                </h4>

                <p className="mt-1 text-xs leading-6 text-[#89745E]">
                  Your name and phone number help us manage your
                  orders and delivery information smoothly.
                </p>
              </div>
            </div>

          </motion.div>
        </div>
      </div>

      {/* Custom Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-5 right-4 z-[100] w-[calc(100%-2rem)] max-w-sm sm:right-7"
          >
            <div
              className={`flex items-center gap-3 rounded-2xl border p-4 shadow-2xl ${
                toast.type === "error"
                  ? "border-red-200 bg-white"
                  : "border-[#D8C29D] bg-[#FFFDF8]"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  toast.type === "error"
                    ? "bg-red-50 text-red-600"
                    : "bg-[#F2E7D4] text-[#91682F]"
                }`}
              >
                {toast.type === "error" ? (
                  <FiAlertCircle size={19} />
                ) : (
                  <FiCheckCircle size={19} />
                )}
              </div>

              <p
                className={`flex-1 text-sm font-semibold ${
                  toast.type === "error"
                    ? "text-red-700"
                    : "text-[#56351D]"
                }`}
              >
                {toast.message}
              </p>

              <button
                onClick={() => setToast(null)}
                className="rounded-lg p-1 text-[#927E69] transition hover:bg-[#F3EADF] hover:text-[#422514]"
              >
                <FiX size={17} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
