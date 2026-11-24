
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiMail,
  FiTrash2,
  FiSearch,
  FiRefreshCw,
  FiClock,
  FiUser,
  FiMessageSquare,
  FiX,
  FiCheck,
  FiInbox,
  FiArrowUpRight,
  FiMail as FiMailIcon,
  FiSend,
  FiStar
} from "react-icons/fi";

// API configuration
const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://homebite-server.vercel.app"
    : "http://localhost:5000")
).replace(/\/+$/, "");

// Safely handle JSON and HTML responses
async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const responseText = await response.text();

  let data;

  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch {
    console.error("Invalid API response:", responseText);

    throw new Error(
      `Backend returned HTML instead of JSON (${response.status}). Check that ${API_URL} is your deployed backend URL and that the API route exists.`
    );
  }

  if (!response.ok || data.success === false) {
    throw new Error(
      data.message || `Request failed with status ${response.status}`
    );
  }

  return data;
}

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);
  const [processing, setProcessing] = useState(false);

  const [showReplyModal, setShowReplyModal] = useState(false);
const [replyText, setReplyText] = useState("");
const [replyLoading, setReplyLoading] = useState(false);


  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 3500);
  }, []);

  // Fetch all contact messages
  const fetchMessages = useCallback(
    async (silent = false) => {
      const token = localStorage.getItem("homebite-token");

      if (!token) {
        setLoading(false);
        showToast("error", "Please login as admin first.");
        return;
      }

      if (!silent) {
        setRefreshing(true);
      }

      try {
        const data = await apiRequest("/api/admin/messages", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMessages(data.messages || []);
      } catch (error) {
        console.error("Fetch messages error:", error);
        showToast("error", error.message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [showToast]
  );

  useEffect(() => {
    fetchMessages();

    const interval = window.setInterval(() => {
      fetchMessages(true);
    }, 30000);

    const handleMessageUpdate = () => fetchMessages(true);

    window.addEventListener(
      "homebite-contact-message-updated",
      handleMessageUpdate
    );

    return () => {
      window.clearInterval(interval);
      window.removeEventListener(
        "homebite-contact-message-updated",
        handleMessageUpdate
      );
    };
  }, [fetchMessages]);

  const unreadCount = messages.filter(
    (item) => Number(item.is_read) === 0
  ).length;

  const readCount = messages.length - unreadCount;

  // Search and filter
  const filteredMessages = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return messages.filter((item) => {
      const isRead = Number(item.is_read) === 1;

      const matchesFilter =
        filter === "all" ||
        (filter === "unread" && !isRead) ||
        (filter === "read" && isRead);

      const matchesSearch =
        !keyword ||
        item.name?.toLowerCase().includes(keyword) ||
        item.email?.toLowerCase().includes(keyword) ||
        item.subject?.toLowerCase().includes(keyword) ||
        item.message?.toLowerCase().includes(keyword);

      return matchesFilter && matchesSearch;
    });
  }, [messages, filter, search]);

  // Mark message as read
  const markAsRead = async (id) => {
    const token = localStorage.getItem("homebite-token");

    if (!token) {
      showToast("error", "Please login again.");
      return;
    }

    try {
      setProcessing(true);

      await apiRequest(`/api/admin/messages/${id}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessages((prev) =>
        prev.map((item) =>
          String(item.id) === String(id)
            ? { ...item, is_read: 1 }
            : item
        )
      );

      setSelectedMessage((prev) =>
        prev ? { ...prev, is_read: 1 } : null
      );

      window.dispatchEvent(
        new Event("homebite-contact-message-updated")
      );

      showToast("success", "Message marked as read.");
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setProcessing(false);
    }
  };

  // Delete message
  const deleteMessage = async () => {
    if (deleteId === null) return;

    const token = localStorage.getItem("homebite-token");

    if (!token) {
      showToast("error", "Please login again.");
      return;
    }

    try {
      setProcessing(true);

      await apiRequest(`/api/admin/messages/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessages((prev) =>
        prev.filter(
          (item) => String(item.id) !== String(deleteId)
        )
      );

      setSelectedMessage((prev) =>
        prev && String(prev.id) === String(deleteId) ? null : prev
      );

      setDeleteId(null);

      window.dispatchEvent(
        new Event("homebite-contact-message-updated")
      );

      showToast("success", "Message deleted successfully.");
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setProcessing(false);
    }
  };



const handleSendReply = async () => {
  if (!selectedMessage || !replyText.trim()) {
    showToast("error", "Please write your reply first.");
    return;
  }

  const token = localStorage.getItem("homebite-token");

  if (!token) {
    showToast("error", "Please login again.");
    return;
  }

  try {
    setReplyLoading(true);

    const data = await apiRequest(
      `/api/admin/messages/${selectedMessage.id}/reply`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reply: replyText.trim(),
        }),
      }
    );

    // Update local message state
    const updatedMessage = {
      ...selectedMessage,
      is_replied: 1,
      admin_reply: replyText.trim(),
      replied_at: new Date().toISOString(),
    };

    setMessages((prev) =>
      prev.map((item) =>
        String(item.id) === String(selectedMessage.id)
          ? updatedMessage
          : item
      )
    );

    setSelectedMessage(updatedMessage);

    setReplyText("");
    setShowReplyModal(false);

    showToast(
      "success",
      data.message || "Email sent successfully!"
    );

    window.dispatchEvent(
      new Event("homebite-contact-message-updated")
    );
  } catch (error) {
    console.error("Send reply error:", error);
    showToast("error", error.message);
  } finally {
    setReplyLoading(false);
  }
};


  const openMessage = async (item) => {
    setSelectedMessage(item);

    if (Number(item.is_read) === 0) {
      await markAsRead(item.id);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Unknown date";

    return new Date(date).toLocaleString("en-BD", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const stats = [
    {
      label: "Total Messages",
      value: messages.length,
      icon: FiInbox,
      description: "All customer inquiries",
      color: "text-[#B08A55]",
      bg: "bg-[#F3E3DC]",
    },
    {
      label: "Unread Messages",
      value: unreadCount,
      icon: FiMail,
      description: "Waiting for your attention",
      color: "text-[#B66A42]",
      bg: "bg-[#FCE9DE]",
    },
    {
      label: "Read Messages",
      value: readCount,
      icon: FiCheck,
      description: "Already reviewed",
      color: "text-emerald-700",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8F3] lg:ml-[272px]">
      {/* Toast notification */}
      {toast && (
        <div
          role="status"
          className={`fixed right-5 top-24 z-[150] flex max-w-sm items-center gap-3 rounded-xl px-5 py-4 text-sm font-semibold text-white shadow-2xl animate-[toastIn_.3s_ease-out] ${
            toast.type === "success"
              ? "bg-[#2C0E05]"
              : "bg-red-600"
          }`}
        >
          {toast.type === "success" ? (
            <FiCheck size={19} />
          ) : (
            <FiX size={19} />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
     
{/* HERO SECTION */}
<section className="relative mb-6 overflow-hidden rounded-[24px] bg-gradient-to-br from-[#2C0E05] via-[#451B0E] to-[#6A321B] px-5 py-5 text-white shadow-xl sm:px-7 sm:py-6">

  {/* Decorative background */}
  <div className="pointer-events-none absolute -right-12 -top-20 h-48 w-48 rounded-full border border-[#D8B77A]/20 animate-pulse" />
  <div className="pointer-events-none absolute -bottom-20 right-1/3 h-40 w-40 rounded-full bg-[#B08A55]/10 blur-3xl" />

  <div className="relative z-10 flex items-center justify-between gap-5">

    {/* Hero content */}
    <div className="max-w-2xl">

      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D8B77A]/30 bg-white/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[1.5px] text-[#E8C98F] backdrop-blur-sm">
        <FiStar size={12} />
        Customer communication center
      </div>

      <h1 className="font-serif text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
        Every Message
        <span className="text-[#D9B779]"> Matters to Us.</span>
      </h1>

      <p className="mt-2 max-w-lg text-xs leading-6 text-[#E8D8CB] sm:text-sm">
        Connect with customers, manage their feedback and make every HomeBite experience better.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-[10px] text-[#F7EBDD] backdrop-blur-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          Message center active
        </div>

        <div className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-[10px] text-[#F7EBDD] backdrop-blur-sm">
          Auto refresh · 30 sec
        </div>
      </div>
    </div>

    {/* Icon: hidden on small devices */}
    <div className="relative hidden shrink-0 items-center justify-center pr-5 sm:flex">
      <div className="absolute h-36 w-36 rounded-full bg-[#B08A55]/20 blur-2xl" />

      <div className="relative flex h-28 w-28 items-center justify-center rounded-[28px] border border-[#D9B779]/30 bg-gradient-to-br from-[#B08A55]/30 to-white/5 shadow-2xl backdrop-blur-sm transition duration-500 hover:rotate-3 hover:scale-105 lg:h-32 lg:w-32">
        <FiMessageSquare
          size={58}
          strokeWidth={1.1}
          className="text-[#E4C58F]"
        />

        <span className="absolute -right-2 -top-2 flex h-10 w-10 animate-bounce items-center justify-center rounded-xl border-[3px] border-[#4A1D0F] bg-[#D6B477] text-xs font-bold text-[#2C0E05] shadow-lg">
          {unreadCount}
        </span>
      </div>
    </div>

  </div>

  {/* Compact statistics */}
  <div className="relative z-10 mt-5 grid max-w-md grid-cols-3 gap-3 border-t border-white/15 pt-4">
    <div>
      <p className="text-xl font-bold text-white sm:text-2xl">
        {messages.length}
      </p>
      <p className="mt-1 text-[10px] text-[#D8C1AE]">
        Total received
      </p>
    </div>

    <div className="border-x border-white/15 px-4">
      <p className="text-xl font-bold text-[#E7C58C] sm:text-2xl">
        {unreadCount}
      </p>
      <p className="mt-1 text-[10px] text-[#D8C1AE]">
        Unread
      </p>
    </div>

    <div className="pl-2">
      <p className="text-xl font-bold text-white sm:text-2xl">
        {readCount}
      </p>
      <p className="mt-1 text-[10px] text-[#D8C1AE]">
        Read
      </p>
    </div>
  </div>

</section>


        {/* PAGE TITLE + REFRESH */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#B08A55]">
              Inbox management
            </p>
            <h2 className="mt-1 font-serif text-2xl font-bold text-[#2C0E05]">
              Contact Messages
            </h2>
            <p className="mt-1 text-sm text-[#917C70]">
              Manage and respond to customer inquiries.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchMessages()}
            disabled={refreshing}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#E8D8CE] bg-white px-5 py-3 text-sm font-bold text-[#2C0E05] shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#B08A55] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiRefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            {refreshing ? "Refreshing..." : "Refresh Messages"}
          </button>
        </div>

        {/* STATISTICS */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                style={{ animationDelay: `${index * 100}ms` }}
                className="group rounded-2xl border border-[#EADBD2] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#C7A16C] hover:shadow-[0_15px_35px_rgba(44,14,5,0.09)] animate-[cardIn_.5s_ease-out_both]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#8A756B]">
                      {item.label}
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-[#2C0E05]">
                      {item.value}
                    </h3>

                    <p className="mt-1 text-[11px] text-[#A18D82]">
                      {item.description}
                    </p>
                  </div>

                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl transition duration-300 group-hover:rotate-6 group-hover:scale-110 ${item.bg} ${item.color}`}
                  >
                    <Icon size={25} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* MESSAGE LIST */}
        <section className="overflow-hidden rounded-2xl border border-[#EADBD2] bg-white shadow-sm">
          {/* Toolbar */}
          <div className="border-b border-[#F0E4DD] p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2C0E05]">
                  Customer Inbox
                </h3>
                <p className="mt-1 text-xs text-[#9A8579]">
                  {filteredMessages.length} message
                  {filteredMessages.length !== 1 ? "s" : ""} found
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "all", label: "All Messages", count: messages.length },
                  { value: "unread", label: "Unread", count: unreadCount },
                  { value: "read", label: "Read", count: readCount },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.value}
                    onClick={() => setFilter(item.value)}
                    className={`cursor-pointer rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-300 ${
                      filter === item.value
                        ? "bg-[#2C0E05] text-white shadow-md"
                        : "border border-[#EADBD2] bg-[#FFFCFA] text-[#765D52] hover:border-[#B08A55] hover:bg-[#F8EDE5]"
                    }`}
                  >
                    {item.label}
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-[10px] ${
                        filter === item.value
                          ? "bg-white/15 text-white"
                          : "bg-[#F1E5DE] text-[#765D52]"
                      }`}
                    >
                      {item.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="relative mt-5">
              <FiSearch
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B08A55]"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, subject or message..."
                className="w-full rounded-xl border border-[#EADBD2] bg-[#FFFCFA] py-3.5 pl-11 pr-4 text-sm text-[#2C0E05] outline-none transition focus:border-[#B08A55] focus:bg-white focus:ring-4 focus:ring-[#B08A55]/10"
              />
            </div>
          </div>

          {/* Message list content */}
          <div className="divide-y divide-[#F3EAE5]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#F0E1D8] border-t-[#B08A55]" />
                <p className="mt-4 text-sm text-[#8A756B]">
                  Loading customer messages...
                </p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="px-5 py-20 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[26px] bg-[#F7EAE2] text-[#B08A55]">
                  <FiInbox size={35} />
                </div>

                <h3 className="mt-5 font-serif text-xl font-bold text-[#2C0E05]">
                  {search ? "No Matching Messages" : "Your Inbox is Empty"}
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#9A8579]">
                  {search
                    ? "Try another keyword or change your filter."
                    : "When customers send messages through the Contact page, their inquiries will appear here."}
                </p>

                {(search || filter !== "all") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setFilter("all");
                    }}
                    className="mt-5 cursor-pointer rounded-xl bg-[#2C0E05] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#5A2817]"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              filteredMessages.map((item, index) => {
                const isRead = Number(item.is_read) === 1;

                return (
                  <div
                    key={item.id}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className={`group flex flex-col gap-4 p-5 transition-all duration-300 hover:bg-[#FFFCF9] sm:flex-row sm:items-center sm:justify-between sm:px-6 animate-[cardIn_.4s_ease-out_both] ${
                      !isRead ? "bg-[#FFFAF4]" : "bg-white"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => openMessage(item)}
                      className="flex min-w-0 flex-1 cursor-pointer items-start gap-4 text-left"
                    >
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition duration-300 group-hover:scale-110 ${
                          isRead
                            ? "bg-[#F3E8E1] text-[#A77A4C]"
                            : "bg-[#2C0E05] text-[#E2C18B]"
                        }`}
                      >
                        <FiMail size={20} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4
                            className={`truncate text-sm text-[#2C0E05] ${
                              !isRead ? "font-bold" : "font-semibold"
                            }`}
                          >
                            {item.name}
                          </h4>

                          {!isRead && (
                            <span className="rounded-full bg-[#B08A55]/15 px-2.5 py-1 text-[9px] font-extrabold tracking-wider text-[#96652D]">
                              NEW
                            </span>
                          )}

                          {Number(item.is_replied) === 1 && (
  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-extrabold tracking-wider text-emerald-700">
    REPLIED
  </span>
)}

                        </div>

                        <p className="mt-1 truncate text-xs font-semibold text-[#765D52]">
                          {item.subject}
                        </p>

                        <p className="mt-1 line-clamp-1 text-xs leading-5 text-[#A18D82]">
                          {item.message}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-[#A18D82]">
                          <span className="flex items-center gap-1">
                            <FiUser size={12} />
                            {item.email}
                          </span>

                          <span className="flex items-center gap-1">
                            <FiClock size={12} />
                            {formatDate(item.created_at)}
                          </span>
                        </div>
                      </div>
                    </button>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => openMessage(item)}
                        title="View message"
                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-[#F3E8E1] text-[#8B4930] transition duration-300 hover:-translate-y-1 hover:bg-[#EAD4C7] hover:shadow-md"
                      >
                        <FiMailIcon size={17} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteId(item.id)}
                        title="Delete message"
                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-red-50 text-red-500 transition duration-300 hover:-translate-y-1 hover:bg-red-100 hover:shadow-md"
                      >
                        <FiTrash2 size={17} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* MESSAGE DETAILS MODAL */}
        {selectedMessage && (
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-[#1F0B06]/65 p-4 backdrop-blur-sm"
            onClick={() => setSelectedMessage(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[25px] bg-white shadow-2xl animate-[modalIn_.25s_ease-out]"
            >
              <div className="relative overflow-hidden bg-gradient-to-r from-[#2C0E05] to-[#63321D] p-6 text-white">
                <div className="absolute -right-8 -top-12 h-36 w-36 rounded-full border border-white/10" />

                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#D9B779]">
                      Customer communication
                    </p>

                    <h2 className="mt-2 font-serif text-2xl font-bold">
                      Message Details
                    </h2>

                    <p className="mt-1 text-xs text-[#E8D8CB]">
                      Review this customer inquiry
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedMessage(null)}
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-white/10 text-white transition hover:rotate-90 hover:bg-white/20"
                  >
                    <FiX size={20} />
                  </button>
                </div>
              </div>

              <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F3E3DC] text-[#A77A4C]">
                    <FiUser size={25} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-bold text-[#2C0E05]">
                      {selectedMessage.name}
                    </h3>

                    <p className="mt-1 break-all text-xs text-[#8A756B]">
                      {selectedMessage.email}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-[#EADBD2] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#B08A55]">
                    Subject
                  </p>

                  <p className="mt-2 text-sm font-bold text-[#2C0E05]">
                    {selectedMessage.subject}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#B08A55]">
                    Message
                  </p>

                  <div className="mt-3 whitespace-pre-wrap break-words rounded-xl bg-[#FFF8F3] p-5 text-sm leading-7 text-[#493027]">
                    {selectedMessage.message}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#9A8579]">
                  <FiClock size={14} />
                  Received: {formatDate(selectedMessage.created_at)}
                </div>

                <div className="flex flex-wrap justify-end gap-3 border-t border-[#F0E4DD] pt-5">
                 <button
  type="button"
  onClick={() => {
    setReplyText(
      selectedMessage.admin_reply || ""
    );
    setShowReplyModal(true);
  }}
  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#2C0E05] px-5 py-3 text-xs font-bold text-white shadow-md transition duration-300 hover:-translate-y-1 hover:bg-[#63321D] hover:shadow-lg"
>
  <FiSend size={15} />
  {Number(selectedMessage.is_replied) === 1
    ? "Send Another Reply"
    : "Reply to Customer"}
</button>

                  {Number(selectedMessage.is_read) === 0 && (
                    <button
                      type="button"
                      disabled={processing}
                      onClick={() => markAsRead(selectedMessage.id)}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#2C0E05] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#704027] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FiCheck size={15} />
                      {processing ? "Updating..." : "Mark as Read"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}



{/* GMAIL REPLY MODAL */}
{showReplyModal && selectedMessage && (
 <div
  className="fixed inset-0 z-[140] flex items-start justify-center overflow-y-auto bg-[#1F0B06]/70 px-3 py-4 backdrop-blur-sm sm:items-center sm:p-5"
  onClick={() => {
    if (!replyLoading) setShowReplyModal(false);
  }}
>
   <div
  onClick={(e) => e.stopPropagation()}
  className="my-auto flex max-h-[calc(100dvh-2rem)] w-full max-w-xl flex-col overflow-hidden rounded-[25px] bg-white shadow-2xl animate-[modalIn_.25s_ease-out]"
>
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#2C0E05] to-[#63321D] p-6 text-white">
        <div className="absolute -right-10 -top-14 h-36 w-36 rounded-full border border-white/10" />

        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#D9B779]">
              <FiSend size={15} />
              <span className="text-[10px] font-bold uppercase tracking-[2px]">
                Gmail Support
              </span>
            </div>

            <h2 className="mt-2 font-serif text-2xl font-bold">
              Reply to Customer
            </h2>

            <p className="mt-1 text-xs text-[#E8D8CB]">
              Your reply will be sent through HomeBite Gmail.
            </p>
          </div>

          <button
            type="button"
            disabled={replyLoading}
            onClick={() => setShowReplyModal(false)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-white/10 transition hover:rotate-90 hover:bg-white/20 disabled:cursor-not-allowed"
          >
            <FiX size={20} />
          </button>
        </div>
      </div>

      {/* Form */}
    <div className="min-h-0 space-y-5 overflow-y-auto p-5 sm:p-6">

        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[#9A7561]">
            To
          </label>

          <div className="flex items-center gap-3 rounded-xl border border-[#EADBD2] bg-[#FFF8F3] px-4 py-3">
            <FiMail className="shrink-0 text-[#B08A55]" />
            <span className="break-all text-sm font-medium text-[#2C0E05]">
              {selectedMessage.email}
            </span>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[#9A7561]">
            Subject
          </label>

          <div className="rounded-xl border border-[#EADBD2] bg-[#FFF8F3] px-4 py-3 text-sm text-[#493027]">
            Re: {selectedMessage.subject}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#9A7561]">
              Your Reply
            </label>

            <span className="text-[10px] text-[#A18D82]">
              {replyText.length}/10000
            </span>
          </div>

          <textarea
  value={replyText}
  onChange={(e) => setReplyText(e.target.value)}
  maxLength={10000}
  rows={7}
  placeholder="Write your response to the customer..."
  disabled={replyLoading}
  className="h-48 max-h-56 w-full resize-none overflow-y-auto rounded-xl border border-[#EADBD2] bg-[#FFFCFA] p-4 text-sm leading-7 text-[#2C0E05] outline-none transition placeholder:text-[#B5A39A] focus:border-[#B08A55] focus:bg-white focus:ring-4 focus:ring-[#B08A55]/10 disabled:opacity-60"
/>
        </div>

        <div className="flex items-start gap-2 rounded-xl bg-[#F8F0E8] p-3">
          <FiInbox className="mt-0.5 shrink-0 text-[#B08A55]" />
          <p className="text-[11px] leading-5 text-[#765D52]">
            This email will be sent from your configured HomeBite Gmail account.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-[#F0E4DD] pt-5 sm:flex-row sm:justify-end">

          <button
            type="button"
            disabled={replyLoading}
            onClick={() => setShowReplyModal(false)}
            className="cursor-pointer rounded-xl border border-[#EADBD2] px-5 py-3 text-xs font-bold text-[#765D52] transition hover:bg-[#FFF8F3] disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={replyLoading || !replyText.trim()}
            onClick={handleSendReply}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#2C0E05] px-6 py-3 text-xs font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#63321D] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {replyLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Sending...
              </>
            ) : (
              <>
                <FiSend size={15} />
                Send Reply
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  </div>
)}


        {/* DELETE CONFIRMATION */}
        {deleteId !== null && (
          <div
            className="fixed inset-0 z-[130] flex items-center justify-center bg-[#1F0B06]/65 p-4 backdrop-blur-sm"
            onClick={() => !processing && setDeleteId(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-[25px] bg-white p-7 text-center shadow-2xl animate-[modalIn_.25s_ease-out]"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <FiTrash2 size={27} />
              </div>

              <h3 className="mt-5 font-serif text-xl font-bold text-[#2C0E05]">
                Delete Message?
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#8A756B]">
                This message will be permanently deleted. You
                cannot undo this action.
              </p>

              <div className="mt-7 flex gap-3">
                <button
                  type="button"
                  disabled={processing}
                  onClick={() => setDeleteId(null)}
                  className="flex-1 cursor-pointer rounded-xl border border-[#EADBD2] px-4 py-3 text-xs font-bold text-[#765D52] transition hover:bg-[#FFF8F3] disabled:cursor-not-allowed"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={processing}
                  onClick={deleteMessage}
                  className="flex-1 cursor-pointer rounded-xl bg-red-600 px-4 py-3 text-xs font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {processing ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Page animations */}
      <style jsx>{`
        @keyframes cardIn {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes modalIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes toastIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
