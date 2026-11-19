
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  FiMapPin,
  FiPlus,
  FiHome,
  FiBriefcase,
  FiMap,
  FiEdit2,
  FiTrash2,
  FiStar,
  FiCheck,
  FiX,
  FiPhone,
  FiUser,
  FiNavigation,
  FiLoader,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const emptyForm = {
  label: "Home",
  recipient_name: "",
  phone: "",
  address_line: "",
  area: "",
  city: "",
  postal_code: "",
  landmark: "",
  is_default: false,
};



async function parseApiResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    const responseText = await response.text();

    console.error("API returned non-JSON response:", {
      url: response.url,
      status: response.status,
      response: responseText.slice(0, 300),
    });

    throw new Error(
      `API response ভুল এসেছে (${response.status})। Backend URL অথবা route check করো।`
    );
  }

  // Read JSON response only once
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}


const inputClass =
  "w-full rounded-xl border border-[#EADBD0] bg-[#FFFCF9] px-4 py-3 text-sm text-[#392016] outline-none transition-all duration-200 placeholder:text-[#B9A69A] focus:border-[#A87942] focus:bg-white focus:ring-4 focus:ring-[#B08A55]/10";

function AddressIcon({ label, size = 20 }) {
  if (label === "Office") return <FiBriefcase size={size} />;
  if (label === "Other") return <FiMap size={size} />;
  return <FiHome size={size} />;
}

export default function SavedAddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [notice, setNotice] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [pageError, setPageError] = useState("");

  const showNotice = (message, type = "success") => {
    setNotice({ message, type });
    window.clearTimeout(showNotice.timer);
    showNotice.timer = window.setTimeout(() => {
      setNotice(null);
    }, 3500);
  };

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("homebite-token");
  };

  const fetchAddresses = useCallback(async () => {
    try {
      setPageError("");

      const token = getToken();

      if (!token) {
        throw new Error("Please login to view your saved addresses.");
      }

      const response = await fetch(`${API_URL}/api/customer/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

const data = await parseApiResponse(response);

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not load addresses.");
      }

      setAddresses(data.addresses || []);
    } catch (error) {
      setPageError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const openAddModal = () => {
    setEditingAddress(null);
    setForm({
      ...emptyForm,
      is_default: addresses.length === 0,
    });
    setModalOpen(true);
  };

  const openEditModal = (address) => {
    setEditingAddress(address);
    setForm({
      label: address.label || "Home",
      recipient_name: address.recipient_name || "",
      phone: address.phone || "",
      address_line: address.address_line || "",
      area: address.area || "",
      city: address.city || "",
      postal_code: address.postal_code || "",
      landmark: address.landmark || "",
      is_default: Number(address.is_default) === 1,
    });
    setModalOpen(true);
  };

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.recipient_name.trim() ||
      !form.phone.trim() ||
      !form.address_line.trim() ||
      !form.area.trim() ||
      !form.city.trim()
    ) {
      showNotice("Please complete all required fields.", "error");
      return;
    }

    try {
      setSaving(true);

      const token = getToken();

      if (!token) {
        throw new Error("Your login session has expired. Please login again.");
      }

      const url = editingAddress
        ? `${API_URL}/api/customer/addresses/${editingAddress.id}`
        : `${API_URL}/api/customer/addresses`;

      const response = await fetch(url, {
        method: editingAddress ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

const data = await parseApiResponse(response);

if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to save address.");
      }

      setModalOpen(false);
      setEditingAddress(null);
      setForm(emptyForm);

      await fetchAddresses();

      showNotice(
        editingAddress
          ? "Your address has been updated."
          : "Your new address has been saved."
      );
    } catch (error) {
      showNotice(error.message || "Unable to save address.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (address) => {
    try {
      setBusyId(address.id);

      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/customer/addresses/${address.id}/default`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await parseApiResponse(response);

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not update default address.");
      }

      await fetchAddresses();
      showNotice("Default delivery address updated.");
    } catch (error) {
      showNotice(error.message || "Something went wrong.", "error");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setBusyId(deleteTarget.id);

      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/customer/addresses/${deleteTarget.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not delete address.");
      }

      setDeleteTarget(null);
      await fetchAddresses();
      showNotice("Address deleted successfully.");
    } catch (error) {
      showNotice(error.message || "Unable to delete address.", "error");
    } finally {
      setBusyId(null);
    }
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setEditingAddress(null);
    setForm(emptyForm);
  };

  return (
    <main className="addresses-page min-h-screen w-full min-w-0 overflow-hidden bg-[#FFF9F4] px-4 pb-12 pt-6 sm:px-6 lg:px-8">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@500;600;700&display=swap");

        .addresses-page {
          font-family: "DM Sans", sans-serif;
        }

        button,
[role="button"],
input[type="button"],
input[type="submit"],
input[type="reset"] {
  cursor: pointer;
}

button:disabled,
input:disabled {
  cursor: not-allowed;
}
        .address-heading {
          font-family: "Playfair Display", Georgia, serif;
        }

        @keyframes addressFadeUp {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes addressPop {
          from {
            opacity: 0;
            transform: translateY(14px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes addressFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }

        .address-enter {
          animation: addressFadeUp 0.65s ease both;
        }

        .address-card {
          animation: addressPop 0.5s ease both;
          transition: transform 0.3s ease, box-shadow 0.3s ease,
            border-color 0.3s ease;
        }

        .address-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 40px rgba(66, 31, 17, 0.09);
          border-color: #D7B99A;
        }

        .address-float {
          animation: addressFloat 4s ease-in-out infinite;
        }

        .address-modal {
          animation: addressPop 0.25s ease both;
        }

        @media (prefers-reduced-motion: reduce) {
          .address-enter,
          .address-card,
          .address-float,
          .address-modal {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

   
{/* HERO */}
<section className="address-enter relative mb-8 overflow-hidden rounded-[28px] border border-[#E5D3E8] bg-gradient-to-br from-[#F0E5F4] via-[#F7E8EB] to-[#F8EBDD] px-6 py-8 text-[#2C0E05] shadow-[0_18px_50px_rgba(75,40,65,0.08)] sm:px-9 sm:py-10">

  {/* Decorative circles */}
  <div className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full border border-[#A987B8]/25" />
  <div className="pointer-events-none absolute -right-2 -top-16 h-56 w-56 rounded-full border border-[#C58D9E]/25" />
  <div className="pointer-events-none absolute -bottom-24 right-32 h-48 w-48 rounded-full bg-[#D8BDEB]/35 blur-3xl" />

  <div className="relative z-10 flex flex-col justify-between gap-7 sm:flex-row sm:items-center">
    <div className="max-w-xl">

      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#C9AED2] bg-white/65 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#704B7D]">
        <FiMapPin size={12} />
        Your delivery destinations
      </div>

      <h1 className="address-heading text-3xl font-semibold leading-tight text-[#2C0E05] sm:text-[42px]">
        Saved Addresses
      </h1>

      <p className="mt-3 max-w-md text-sm leading-6 text-[#654C43]">
        Keep your favourite places close. Save your addresses and make
        every HomeBite order a little easier.
      </p>
    </div>

    <div className="address-float hidden h-28 w-28 shrink-0 items-center justify-center rounded-[30px] border border-[#C9AED2] bg-white/50 text-[#79518A] shadow-sm sm:flex">
      <FiMapPin size={47} strokeWidth={1.2} />
    </div>
  </div>

  <div className="relative z-10 mt-8 flex flex-wrap items-center gap-3 border-t border-[#D8C5D9] pt-5">

    <div className="flex items-center gap-2 text-xs font-medium text-[#493025]">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-[#B08A55]/15 text-[#896638]">
        <FiHome size={13} />
      </span>
      Home
    </div>

    <span className="h-1 w-1 rounded-full bg-[#B08A55]" />

    <div className="flex items-center gap-2 text-xs font-medium text-[#493025]">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-[#B08A55]/15 text-[#896638]">
        <FiBriefcase size={13} />
      </span>
      Office
    </div>

    <span className="h-1 w-1 rounded-full bg-[#B08A55]" />

    <div className="flex items-center gap-2 text-xs font-medium text-[#493025]">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-[#B08A55]/15 text-[#896638]">
        <FiMap size={13} />
      </span>
      Other places
    </div>
  </div>
</section>

{/* SECTION HEADING */}
<section className="address-enter mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

  <div>
    <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#9A7045]">
      Address book
    </p>

    <h2 className="address-heading text-2xl font-semibold text-[#2C0E05]">
      Your places, your choice
    </h2>

    <p className="mt-1.5 text-sm text-[#806D63]">
      {addresses.length} saved {addresses.length === 1 ? "address" : "addresses"}
    </p>
  </div>

  <button
    onClick={openAddModal}
    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#2C0E05] bg-[#2C0E05] px-5 py-3 text-sm font-semibold text-[#FFF8F0] shadow-lg shadow-[#2C0E05]/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#4A2113] hover:bg-[#4A2113] hover:shadow-xl active:scale-95"
  >
    <FiPlus size={17} />
    Add New Address
  </button>
</section>


      {/* ERROR */}
      {pageError && (
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-[#E8C9BD] bg-[#FFF1EC] p-5 text-sm text-[#8D3F2B] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <FiAlertCircle size={18} />
            {pageError}
          </div>
          <button
            onClick={() => {
              setLoading(true);
              fetchAddresses();
            }}
            className="inline-flex items-center gap-2 font-bold"
          >
            <FiRefreshCw size={14} />
            Try again
          </button>
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-[#EFE2D8] bg-white">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#F5E9DF] text-[#8A5637]">
            <FiLoader className="animate-spin" size={25} />
          </div>
          <p className="mt-4 text-sm font-semibold text-[#563324]">
            Preparing your address book...
          </p>
          <p className="mt-1 text-xs text-[#A3948B]">
            Just a little moment
          </p>
        </div>
      ) : addresses.length === 0 && !pageError ? (
        /* EMPTY STATE */
        <div className="address-enter relative overflow-hidden rounded-[28px] border border-dashed border-[#DCC7B5] bg-white px-6 py-14 text-center shadow-[0_10px_35px_rgba(66,31,17,0.035)]">
          <div className="address-float mx-auto grid h-24 w-24 place-items-center rounded-[30px] bg-[#F5E9DF] text-[#8A5637]">
            <FiMapPin size={40} strokeWidth={1.3} />
          </div>
          <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.22em] text-[#B08A55]">
            A place for every craving
          </p>
          <h3 className="address-heading mt-2 text-2xl font-semibold text-[#2C0E05]">
            Your address book is waiting
          </h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#958278]">
            Add your home or office address so your homemade favourites can
            find their way to you.
          </p>
          <button
            onClick={openAddModal}
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#2C0E05] px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-1 hover:bg-[#4A2113]"
          >
            <FiPlus size={17} />
            Add Your First Address
          </button>
        </div>
      ) : (
        /* ADDRESS CARDS */
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {addresses.map((address, index) => {
            const isDefault = Number(address.is_default) === 1;

            return (
              <article
                key={address.id}
                className="address-card relative overflow-hidden rounded-[24px] border border-[#EFE2D8] bg-white p-5 shadow-[0_8px_30px_rgba(66,31,17,0.045)] sm:p-6"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <div className="absolute -right-9 -top-10 h-32 w-32 rounded-full bg-[#F8F0E9] opacity-70" />

                <div className="relative flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#F5E9DF] text-[#8A5637]">
                      <AddressIcon label={address.label} size={21} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-[#392016]">
                          {address.label || "Home"}
                        </h3>
                        {isDefault && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#F8EEDC] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-[#9A6B2F]">
                            <FiStar size={10} />
                            Default
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[11px] text-[#A3948B]">
                        Delivery address
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => openEditModal(address)}
                      title="Edit address"
                      className="grid h-9 w-9 place-items-center rounded-xl text-[#8C7569] transition hover:bg-[#F5E9DF] hover:text-[#61351F]"
                    >
                      <FiEdit2 size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(address)}
                      title="Delete address"
                      className="grid h-9 w-9 place-items-center rounded-xl text-[#B47A70] transition hover:bg-[#FFF0ED] hover:text-[#A33D32]"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="relative mt-5 space-y-3 border-t border-[#F1E8E1] pt-5">
                  <div className="flex items-start gap-3">
                    <FiUser className="mt-0.5 shrink-0 text-[#B08A55]" size={15} />
                    <p className="text-sm font-semibold text-[#513426]">
                      {address.recipient_name}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <FiPhone className="shrink-0 text-[#B08A55]" size={15} />
                    <p className="text-sm text-[#79665B]">{address.phone}</p>
                  </div>

                  <div className="flex items-start gap-3">
                    <FiMapPin className="mt-0.5 shrink-0 text-[#B08A55]" size={15} />
                    <div className="text-sm leading-6 text-[#79665B]">
                      <p>{address.address_line}</p>
                      <p>
                        {address.area}, {address.city}
                        {address.postal_code ? ` - ${address.postal_code}` : ""}
                      </p>
                      {address.landmark && (
                        <p className="mt-1 text-xs text-[#A3948B]">
                          Near: {address.landmark}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="relative mt-5 border-t border-[#F1E8E1] pt-4">
                  {isDefault ? (
                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#7C673D]">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-[#F4EBD9]">
                        <FiCheck size={12} />
                      </span>
                      This is your default delivery address
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSetDefault(address)}
                      disabled={busyId === address.id}
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#956B3C] transition hover:text-[#4B2818] disabled:opacity-50"
                    >
                      {busyId === address.id ? (
                        <FiLoader className="animate-spin" size={13} />
                      ) : (
                        <FiStar size={13} />
                      )}
                      Make default address
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#1B0A05]/60 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div className="address-modal my-auto max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-[26px] bg-[#FFFCF9] shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#EFE2D8] bg-[#FFFCF9]/95 px-5 py-5 backdrop-blur sm:px-7">
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#B08A55]">
                  HomeBite address book
                </p>
                <h2 className="address-heading mt-1 text-xl font-semibold text-[#2C0E05] sm:text-2xl">
                  {editingAddress ? "Edit your address" : "Add a new address"}
                </h2>
              </div>
              <button
                onClick={closeModal}
                disabled={saving}
                className="grid h-10 w-10 place-items-center rounded-xl bg-[#F5E9DF] text-[#69432F] transition hover:bg-[#EEDCCB]"
              >
                <FiX size={19} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 px-5 py-6 sm:px-7">
              <div>
                <label className="mb-2 block text-xs font-bold text-[#553727]">
                  Address type <span className="text-[#B75B42]">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Home", "Office", "Other"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, label: item }))}
                      className={`flex items-center justify-center gap-2 rounded-xl border px-2 py-3 text-xs font-bold transition-all ${
                        form.label === item
                          ? "border-[#8A5637] bg-[#2C0E05] text-[#FFF4E8] shadow-md"
                          : "border-[#EADBD0] bg-white text-[#806C60] hover:border-[#B08A55]"
                      }`}
                    >
                      <AddressIcon label={item} size={15} />
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold text-[#553727]">
                    Recipient name <span className="text-[#B75B42]">*</span>
                  </label>
                  <input
                    name="recipient_name"
                    value={form.recipient_name}
                    onChange={handleChange}
                    placeholder="Full name"
                    className={inputClass}
                    maxLength={100}
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-[#553727]">
                    Phone number <span className="text-[#B75B42]">*</span>
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="01XXXXXXXXX"
                    className={inputClass}
                    maxLength={20}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-[#553727]">
                  House / Road / Street address <span className="text-[#B75B42]">*</span>
                </label>
                <textarea
                  name="address_line"
                  value={form.address_line}
                  onChange={handleChange}
                  placeholder="House no, road no, street name..."
                  className={`${inputClass} min-h-[88px] resize-y`}
                  maxLength={255}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold text-[#553727]">
                    Area / Upazila <span className="text-[#B75B42]">*</span>
                  </label>
                  <input
                    name="area"
                    value={form.area}
                    onChange={handleChange}
                    placeholder="e.g. Zindabazar"
                    className={inputClass}
                    maxLength={100}
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-[#553727]">
                    City / District <span className="text-[#B75B42]">*</span>
                  </label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="e.g. Sylhet"
                    className={inputClass}
                    maxLength={100}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold text-[#553727]">
                    Postal code
                  </label>
                  <input
                    name="postal_code"
                    value={form.postal_code}
                    onChange={handleChange}
                    placeholder="e.g. 3100"
                    className={inputClass}
                    maxLength={20}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-[#553727]">
                    Nearby landmark
                  </label>
                  <input
                    name="landmark"
                    value={form.landmark}
                    onChange={handleChange}
                    placeholder="e.g. Near a school"
                    className={inputClass}
                    maxLength={150}
                  />
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#EADBC8] bg-[#F9F1E7] p-4">
                <input
                  type="checkbox"
                  name="is_default"
                  checked={form.is_default}
                  onChange={handleChange}
                  className="mt-0.5 h-4 w-4 accent-[#6D3B22]"
                />
                <span>
                  <span className="block text-xs font-bold text-[#513426]">
                    Set as my default address
                  </span>
                  <span className="mt-1 block text-[11px] leading-5 text-[#927F75]">
                    Use this address as your preferred delivery destination.
                  </span>
                </span>
              </label>

              <div className="flex flex-col-reverse gap-3 border-t border-[#EFE2D8] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-[#E5D6CB] px-5 py-3 text-sm font-bold text-[#725D51] transition hover:bg-[#F7EEE7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2C0E05] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#2C0E05]/10 transition hover:bg-[#4A2113] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <FiLoader className="animate-spin" size={16} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiCheck size={16} />
                      {editingAddress ? "Save Changes" : "Save Address"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#1B0A05]/60 p-4 backdrop-blur-sm">
          <div className="address-modal w-full max-w-sm rounded-[25px] bg-[#FFFCF9] p-6 text-center shadow-2xl">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#FFF0ED] text-[#B34F42]">
              <FiTrash2 size={23} />
            </div>
            <h3 className="address-heading mt-5 text-xl font-semibold text-[#2C0E05]">
              Remove this address?
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#927F75]">
              Your <strong>{deleteTarget.label}</strong> address will be removed
              from your saved addresses. This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={busyId === deleteTarget.id}
                className="flex-1 rounded-xl border border-[#E5D6CB] px-4 py-3 text-sm font-bold text-[#725D51] hover:bg-[#F7EEE7]"
              >
                Keep it
              </button>
              <button
                onClick={handleDelete}
                disabled={busyId === deleteTarget.id}
                className="flex-1 rounded-xl bg-[#A33D32] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#862D25] disabled:opacity-60"
              >
                {busyId === deleteTarget.id ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {notice && (
        <div className="fixed bottom-5 right-5 z-[150] w-[calc(100%-40px)] max-w-sm animate-[addressFadeUp_.3s_ease]">
          <div
            className={`flex items-center gap-3 rounded-2xl border bg-white p-4 shadow-[0_15px_45px_rgba(44,14,5,0.16)] ${
              notice.type === "error"
                ? "border-[#EBC9C2]"
                : "border-[#D9E8D7]"
            }`}
          >
            <span
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                notice.type === "error"
                  ? "bg-[#FFF0ED] text-[#A33D32]"
                  : "bg-[#EDF5E9] text-[#47764B]"
              }`}
            >
              {notice.type === "error" ? (
                <FiAlertCircle size={17} />
              ) : (
                <FiCheck size={18} />
              )}
            </span>
            <p className="flex-1 text-xs font-semibold text-[#513426]">
              {notice.message}
            </p>
            <button
              onClick={() => setNotice(null)}
              className="text-[#A3948B] hover:text-[#513426]"
            >
              <FiX size={16} />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
