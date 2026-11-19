
"use client";
import "./reviews.css";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FiStar,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiMessageSquare,
  FiShoppingBag,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiX,
  FiSend,
  FiCoffee,
  FiRefreshCw,
  FiAlertCircle,
  FiCalendar,
  FiImage,
} from "react-icons/fi";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const emptyForm = {
  food_id: "",
  order_id: "",
  rating: 5,
  review_text: "",
};

function getImageUrl(image) {
  if (!image) return "";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${API_URL}${image.startsWith("/") ? "" : "/"}${image}`;
}

function formatDate(date) {
  if (!date) return "Recently";

  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

async function parseApiResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    throw new Error(
      `Invalid server response (${response.status}). Please check the backend.`
    );
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}

function RatingStars({
  rating,
  interactive = false,
  onChange,
  size = 18,
}) {
  return (
    <div className="hb-stars" role="group" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          className={`hb-star ${
            star <= rating ? "active" : ""
          } ${interactive ? "interactive" : ""}`}
          onClick={() => interactive && onChange(star)}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
        >
          <FiStar
            size={size}
            fill={star <= rating ? "currentColor" : "none"}
          />
        </button>
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    Approved: {
      icon: FiCheckCircle,
      className: "approved",
      label: "Approved",
    },
    Pending: {
      icon: FiClock,
      className: "pending",
      label: "Pending",
    },
    Rejected: {
      icon: FiXCircle,
      className: "rejected",
      label: "Rejected",
    },
  };

  const item = config[status] || config.Pending;
  const Icon = item.icon;

  return (
    <span className={`hb-status ${item.className}`}>
      <Icon size={13} />
      {item.label}
    </span>
  );
}

export default function CustomerReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [eligibleFoods, setEligibleFoods] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [notice, setNotice] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [visibleCount, setVisibleCount] = useState(6);

  const [imageErrors, setImageErrors] = useState({});

  const observerRef = useRef(null);
  const noticeTimer = useRef(null);

  const showNotice = useCallback((message, type = "success") => {
    setNotice({ message, type });

    if (noticeTimer.current) {
      clearTimeout(noticeTimer.current);
    }

    noticeTimer.current = setTimeout(() => {
      setNotice(null);
    }, 3500);
  }, []);

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("homebite-token");
  };

  const fetchReviews = useCallback(async () => {
    const token = getToken();

    if (!token) {
      setLoading(false);
      showNotice("Please login to view your reviews.", "error");
      return;
    }

    try {
      const [reviewResponse, eligibleResponse] = await Promise.all([
        fetch(`${API_URL}/api/customer/reviews`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }),

        fetch(`${API_URL}/api/customer/reviews/eligible`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }),
      ]);

      const reviewData = await parseApiResponse(reviewResponse);
      const eligibleData = await parseApiResponse(eligibleResponse);

      if (!reviewData.success || !eligibleData.success) {
        throw new Error("Unable to load review information.");
      }

      setReviews(reviewData.reviews || []);
      setEligibleFoods(eligibleData.foods || []);
    } catch (error) {
      console.error("REVIEWS FETCH ERROR:", error);
      showNotice(error.message || "Failed to load reviews.", "error");
    } finally {
      setLoading(false);
    }
  }, [showNotice]);

  useEffect(() => {
    fetchReviews();

    return () => {
      if (noticeTimer.current) {
        clearTimeout(noticeTimer.current);
      }
    };
  }, [fetchReviews]);

  // Scroll reveal animation
  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("hb-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -35px 0px",
      }
    );

    observerRef.current = observer;

    document.querySelectorAll(".hb-reveal:not(.hb-visible)").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [loading, reviews, activeFilter, visibleCount]);

  const openAddModal = (food = null) => {
    setEditingReview(null);

    setForm({
      ...emptyForm,
      food_id: food ? String(food.food_id) : "",
      order_id: food ? String(food.order_id) : "",
    });

    setModalOpen(true);
  };

  const openEditModal = (review) => {
    setEditingReview(review);

    setForm({
      food_id: String(review.food_id),
      order_id: String(review.order_id),
      rating: Number(review.rating),
      review_text: review.review_text || "",
    });

    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingReview(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingReview && (!form.food_id || !form.order_id)) {
      showNotice("Please select a food to review.", "error");
      return;
    }

    if (!form.rating || form.rating < 1 || form.rating > 5) {
      showNotice("Please select a valid rating.", "error");
      return;
    }

    const token = getToken();

    if (!token) {
      showNotice("Please login again.", "error");
      return;
    }

    setSaving(true);

    try {
      const isEditing = Boolean(editingReview);

      const url = isEditing
        ? `${API_URL}/api/customer/reviews/${editingReview.id}`
        : `${API_URL}/api/customer/reviews`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          food_id: Number(form.food_id),
          order_id: Number(form.order_id),
          rating: Number(form.rating),
          review_text: form.review_text,
        }),
      });

      const data = await parseApiResponse(response);

      if (!data.success) {
        throw new Error(data.message || "Unable to save review.");
      }

      setModalOpen(false);
      setEditingReview(null);
      setForm(emptyForm);

      showNotice(data.message || "Review saved successfully.");

      await fetchReviews();
    } catch (error) {
      console.error("REVIEW SAVE ERROR:", error);
      showNotice(error.message || "Unable to save review.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    const token = getToken();

    if (!token) {
      showNotice("Please login again.", "error");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/customer/reviews/${deleteTarget.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await parseApiResponse(response);

      if (!data.success) {
        throw new Error(data.message || "Unable to delete review.");
      }

      setDeleteTarget(null);
      showNotice("Review deleted successfully.");

      await fetchReviews();
    } catch (error) {
      console.error("REVIEW DELETE ERROR:", error);
      showNotice(error.message || "Unable to delete review.", "error");
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesFilter =
      activeFilter === "All" || review.status === activeFilter;

    const matchesSearch =
      review.food_name?.toLowerCase().includes(search.toLowerCase()) ||
      review.review_text?.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const averageRating = reviews.length
    ? (
        reviews.reduce((sum, review) => sum + Number(review.rating), 0) /
        reviews.length
      ).toFixed(1)
    : "0.0";

  const approvedCount = reviews.filter(
    (review) => review.status === "Approved"
  ).length;

  const pendingCount = reviews.filter(
    (review) => review.status === "Pending"
  ).length;

  const rejectedCount = reviews.filter(
    (review) => review.status === "Rejected"
  ).length;

  const visibleReviews = filteredReviews.slice(0, visibleCount);

  return (
    <div className="hb-reviews-page">
      <style jsx global>{`
        .hb-reviews-page {
          --hb-dark: #2c0e05;
          --hb-brown: #542416;
          --hb-gold: #b08a55;
          --hb-light-gold: #d6b47e;
          --hb-cream: #fff8f3;
          --hb-soft: #f8eee8;
          --hb-muted: #987c70;
          color: var(--hb-dark);
          width: 100%;
          min-height: 100vh;
          padding: 8px 0 45px;
        }

        .hb-reviews-page * {
          box-sizing: border-box;
        }

        .hb-reviews-page button,
        .hb-reviews-page input,
        .hb-reviews-page textarea,
        .hb-reviews-page select {
          font-family: inherit;
        }

        .hb-reviews-page button {
          cursor: pointer;
        }

        .hb-reviews-page button:disabled {
          cursor: not-allowed;
          opacity: 0.65;
        }

        .hb-reviews-page .hb-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 28px;
          animation: hbFadeDown 0.6s ease both;
        }

        .hb-reviews-page .hb-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: var(--hb-gold);
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 9px;
        }

        .hb-reviews-page .hb-title {
          font-size: clamp(25px, 3vw, 34px);
          font-weight: 850;
          letter-spacing: -1.1px;
          margin: 0;
          color: var(--hb-dark);
        }

        .hb-reviews-page .hb-subtitle {
          color: var(--hb-muted);
          font-size: 13px;
          margin-top: 8px;
          line-height: 1.7;
        }

        .hb-reviews-page .hb-primary-btn {
          border: none;
          border-radius: 12px;
          padding: 13px 19px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          background: linear-gradient(135deg, #3a160b, #754128);
          color: white;
          font-size: 12px;
          font-weight: 750;
          box-shadow: 0 7px 20px rgba(44, 14, 5, 0.15);
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .hb-reviews-page .hb-primary-btn:hover {
          transform: translateY(-3px);
          background: linear-gradient(135deg, #754128, #a47743);
          box-shadow: 0 12px 24px rgba(44, 14, 5, 0.2);
        }

        .hb-reviews-page .hb-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 28px;
        }

        .hb-reviews-page .hb-stat-card {
          position: relative;
          overflow: hidden;
          border: 1px solid #eadbd0;
          border-radius: 17px;
          background: linear-gradient(145deg, #fffdfb, #fff5ee);
          padding: 19px;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow: 0 5px 18px rgba(55, 24, 12, 0.035);
          transition: transform 0.35s ease, box-shadow 0.35s ease,
            border-color 0.35s ease;
        }

        .hb-reviews-page .hb-stat-card::after {
          content: "";
          position: absolute;
          width: 75px;
          height: 75px;
          right: -25px;
          bottom: -34px;
          background: rgba(176, 138, 85, 0.1);
          border-radius: 50%;
          transition: transform 0.4s ease;
        }

        .hb-reviews-page .hb-stat-card:hover {
          transform: translateY(-6px);
          border-color: #d2b78f;
          box-shadow: 0 13px 28px rgba(55, 24, 12, 0.09);
        }

        .hb-reviews-page .hb-stat-card:hover::after {
          transform: scale(1.6);
        }

        .hb-reviews-page .hb-stat-icon {
          width: 45px;
          height: 45px;
          border-radius: 13px;
          display: grid;
          place-items: center;
          background: #f1e4d6;
          color: #79532d;
          flex-shrink: 0;
        }

        .hb-reviews-page .hb-stat-value {
          font-size: 23px;
          line-height: 1;
          font-weight: 850;
          color: var(--hb-dark);
          font-variant-numeric: tabular-nums;
        }

        .hb-reviews-page .hb-stat-label {
          margin-top: 7px;
          color: var(--hb-muted);
          font-size: 11px;
          font-weight: 650;
        }

        .hb-reviews-page .hb-content {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 300px;
          gap: 22px;
          align-items: start;
        }

        .hb-reviews-page .hb-main-panel {
          min-width: 0;
        }

        .hb-reviews-page .hb-toolbar {
          background: #fffdfb;
          border: 1px solid #ebded5;
          border-radius: 15px;
          padding: 15px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 13px;
        }

        .hb-reviews-page .hb-filters {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 7px;
        }

        .hb-reviews-page .hb-filter {
          padding: 8px 13px;
          border: 1px solid transparent;
          border-radius: 9px;
          background: transparent;
          color: #8c7164;
          font-size: 11px;
          font-weight: 750;
          transition: all 0.25s ease;
        }

        .hb-reviews-page .hb-filter:hover {
          background: #f7eee8;
          color: var(--hb-brown);
        }

        .hb-reviews-page .hb-filter.active {
          background: var(--hb-dark);
          color: white;
          box-shadow: 0 4px 10px rgba(44, 14, 5, 0.14);
        }

        .hb-reviews-page .hb-search {
          width: 185px;
          height: 36px;
          border: 1px solid #e9dcd2;
          border-radius: 9px;
          padding: 0 11px;
          outline: none;
          background: #fffaf6;
          font-size: 11px;
          color: var(--hb-dark);
          transition: border 0.25s, box-shadow 0.25s;
        }

        .hb-reviews-page .hb-search:focus {
          border-color: var(--hb-gold);
          box-shadow: 0 0 0 3px rgba(176, 138, 85, 0.12);
        }

        .hb-reviews-page .hb-review-list {
          display: grid;
          gap: 15px;
        }

        .hb-reviews-page .hb-review-card {
          display: grid;
          grid-template-columns: 112px minmax(0, 1fr);
          gap: 17px;
          padding: 16px;
          border-radius: 16px;
          border: 1px solid #ecded3;
          background: linear-gradient(145deg, #fffefd, #fffaf6);
          box-shadow: 0 4px 16px rgba(55, 24, 12, 0.035);
          transition: transform 0.35s ease, box-shadow 0.35s ease,
            border-color 0.35s ease;
        }

        .hb-reviews-page .hb-review-card:hover {
          transform: translateY(-5px);
          border-color: #d6b88d;
          box-shadow: 0 14px 30px rgba(55, 24, 12, 0.09);
        }

        .hb-reviews-page .hb-review-image {
          width: 112px;
          height: 112px;
          overflow: hidden;
          border-radius: 12px;
          background: linear-gradient(135deg, #f3e3dc, #e9d3b9);
          display: grid;
          place-items: center;
          color: #9b7653;
        }

        .hb-reviews-page .hb-review-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .hb-reviews-page .hb-review-card:hover .hb-review-image img {
          transform: scale(1.09);
        }

        .hb-reviews-page .hb-review-body {
          min-width: 0;
        }

        .hb-reviews-page .hb-review-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }

        .hb-reviews-page .hb-food-name {
          font-size: 15px;
          font-weight: 800;
          color: var(--hb-dark);
          margin: 0 0 7px;
        }

        .hb-reviews-page .hb-review-meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 11px;
          color: #9b8276;
          font-size: 10px;
          margin-top: 9px;
        }

        .hb-reviews-page .hb-meta-item {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .hb-reviews-page .hb-review-text {
          color: #755f54;
          font-size: 12px;
          line-height: 1.8;
          margin: 12px 0 0;
          overflow-wrap: anywhere;
        }

        .hb-reviews-page .hb-status {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 9px;
          border-radius: 30px;
          font-size: 9px;
          font-weight: 800;
          white-space: nowrap;
        }

        .hb-reviews-page .hb-status.approved {
          color: #36734e;
          background: #e7f4e9;
        }

        .hb-reviews-page .hb-status.pending {
          color: #9a6a22;
          background: #fbf0d9;
        }

        .hb-reviews-page .hb-status.rejected {
          color: #a7473c;
          background: #fae9e6;
        }

        .hb-reviews-page .hb-review-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 13px;
        }

        .hb-reviews-page .hb-review-actions {
          display: flex;
          gap: 7px;
        }

        .hb-reviews-page .hb-icon-btn {
          width: 32px;
          height: 32px;
          border: 1px solid #e9ddd3;
          border-radius: 9px;
          background: white;
          color: #80634f;
          display: grid;
          place-items: center;
          transition: all 0.25s ease;
        }

        .hb-reviews-page .hb-icon-btn:hover {
          background: var(--hb-dark);
          border-color: var(--hb-dark);
          color: white;
          transform: translateY(-2px);
        }

        .hb-reviews-page .hb-icon-btn.delete:hover {
          background: #b94d43;
          border-color: #b94d43;
        }

        .hb-reviews-page .hb-sidebar {
          position: sticky;
          top: 20px;
          display: grid;
          gap: 16px;
        }

        .hb-reviews-page .hb-side-card {
          border: 1px solid #e9d9ca;
          border-radius: 16px;
          padding: 19px;
          background: linear-gradient(145deg, #fffdfb, #fdf3eb);
          box-shadow: 0 5px 18px rgba(55, 24, 12, 0.04);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hb-reviews-page .hb-side-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 25px rgba(55, 24, 12, 0.08);
        }

        .hb-reviews-page .hb-side-title {
          font-size: 14px;
          font-weight: 850;
          margin: 0;
          color: var(--hb-dark);
        }

        .hb-reviews-page .hb-side-desc {
          font-size: 11px;
          line-height: 1.8;
          color: #92796d;
          margin: 9px 0 14px;
        }

        .hb-reviews-page .hb-eligible-list {
          display: grid;
          gap: 11px;
          margin-top: 14px;
        }

        .hb-reviews-page .hb-eligible-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-bottom: 11px;
          border-bottom: 1px solid #eee1d6;
        }

        .hb-reviews-page .hb-eligible-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .hb-reviews-page .hb-eligible-image {
          width: 43px;
          height: 43px;
          border-radius: 10px;
          object-fit: cover;
          background: #f1e2d4;
          flex-shrink: 0;
        }

        .hb-reviews-page .hb-eligible-name {
          font-size: 10px;
          font-weight: 800;
          color: var(--hb-dark);
          line-height: 1.4;
        }

        .hb-reviews-page .hb-eligible-order {
          font-size: 9px;
          color: #a28a7e;
          margin-top: 4px;
        }

        .hb-reviews-page .hb-small-btn {
          border: 1px solid #d8c1a3;
          background: white;
          color: #73512d;
          border-radius: 8px;
          padding: 7px 9px;
          font-size: 9px;
          font-weight: 800;
          transition: all 0.25s ease;
          white-space: nowrap;
        }

        .hb-reviews-page .hb-small-btn:hover {
          color: white;
          background: var(--hb-dark);
          border-color: var(--hb-dark);
        }

        .hb-reviews-page .hb-rating-summary {
          text-align: center;
          padding: 10px 0 4px;
        }

        .hb-reviews-page .hb-average {
          font-size: 43px;
          font-weight: 900;
          letter-spacing: -2px;
          color: var(--hb-dark);
          line-height: 1.2;
        }

        .hb-reviews-page .hb-average-label {
          color: #92796d;
          font-size: 10px;
          margin-top: 7px;
        }

        .hb-reviews-page .hb-empty {
          text-align: center;
          padding: 55px 20px;
          border: 1px dashed #dfcbb8;
          border-radius: 16px;
          background: #fffdfb;
          animation: hbFadeUp 0.5s ease both;
        }

        .hb-reviews-page .hb-empty-icon {
          width: 65px;
          height: 65px;
          border-radius: 20px;
          display: grid;
          place-items: center;
          margin: 0 auto 16px;
          background: #f2e5d9;
          color: #89643c;
        }

        .hb-reviews-page .hb-empty h3 {
          font-size: 17px;
          margin: 0;
          color: var(--hb-dark);
        }

        .hb-reviews-page .hb-empty p {
          color: #987f72;
          font-size: 12px;
          line-height: 1.8;
          max-width: 340px;
          margin: 9px auto 18px;
        }

        .hb-reviews-page .hb-stars {
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }

        .hb-reviews-page .hb-star {
          display: inline-grid;
          place-items: center;
          padding: 0;
          border: none;
          background: transparent;
          color: #e3d8cd;
          transition: transform 0.2s ease, color 0.2s ease;
        }

        .hb-reviews-page .hb-star.active {
          color: #c49343;
        }

        .hb-reviews-page .hb-star.interactive:hover {
          color: #d4a44d;
          transform: scale(1.2);
        }

        .hb-reviews-page .hb-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: grid;
          place-items: center;
          padding: 18px;
          background: rgba(27, 12, 7, 0.65);
          backdrop-filter: blur(6px);
          animation: hbFadeIn 0.2s ease both;
        }

        .hb-reviews-page .hb-modal {
          width: 100%;
          max-width: 490px;
          max-height: 90vh;
          overflow-y: auto;
          border-radius: 20px;
          background: #fffaf6;
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.25);
          animation: hbModalIn 0.35s ease both;
        }

        .hb-reviews-page .hb-modal-header {
          padding: 21px 23px;
          background: linear-gradient(130deg, #2c0e05, #704029);
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .hb-reviews-page .hb-modal-header h3 {
          font-size: 17px;
          margin: 0;
          font-weight: 850;
        }

        .hb-reviews-page .hb-modal-header p {
          font-size: 10px;
          color: #e7cba7;
          margin: 5px 0 0;
        }

        .hb-reviews-page .hb-close {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.1);
          transition: background 0.2s;
        }

        .hb-reviews-page .hb-close:hover {
          background: rgba(255, 255, 255, 0.25);
        }

        .hb-reviews-page .hb-form {
          padding: 22px;
        }

        .hb-reviews-page .hb-form-group {
          margin-bottom: 17px;
        }

        .hb-reviews-page .hb-form-label {
          display: block;
          color: #624536;
          font-size: 11px;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .hb-reviews-page .hb-input,
        .hb-reviews-page .hb-select,
        .hb-reviews-page .hb-textarea {
          width: 100%;
          border: 1px solid #e7d9cd;
          border-radius: 10px;
          padding: 12px 13px;
          outline: none;
          background: white;
          color: #3b2116;
          font-size: 12px;
          transition: border 0.25s, box-shadow 0.25s;
        }

        .hb-reviews-page .hb-input:focus,
        .hb-reviews-page .hb-select:focus,
        .hb-reviews-page .hb-textarea:focus {
          border-color: var(--hb-gold);
          box-shadow: 0 0 0 3px rgba(176, 138, 85, 0.12);
        }

        .hb-reviews-page .hb-textarea {
          resize: vertical;
          min-height: 110px;
          line-height: 1.7;
        }

        .hb-reviews-page .hb-rating-picker {
          display: flex;
          align-items: center;
          gap: 13px;
          flex-wrap: wrap;
        }

        .hb-reviews-page .hb-rating-text {
          color: #977b65;
          font-size: 11px;
          font-weight: 700;
        }

        .hb-reviews-page .hb-form-footer {
          display: flex;
          justify-content: flex-end;
          gap: 9px;
          margin-top: 21px;
        }

        .hb-reviews-page .hb-secondary-btn {
          border: 1px solid #e6d8cd;
          background: white;
          color: #795d4d;
          border-radius: 10px;
          padding: 11px 16px;
          font-size: 11px;
          font-weight: 750;
          transition: all 0.2s;
        }

        .hb-reviews-page .hb-secondary-btn:hover {
          background: #f5ebe4;
        }

        .hb-reviews-page .hb-toast {
          position: fixed;
          right: 25px;
          bottom: 25px;
          z-index: 10001;
          max-width: min(380px, calc(100vw - 30px));
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 17px;
          border-radius: 12px;
          background: #2c0e05;
          color: white;
          box-shadow: 0 10px 35px rgba(0, 0, 0, 0.2);
          font-size: 12px;
          font-weight: 650;
          animation: hbToastIn 0.35s ease both;
        }

        .hb-reviews-page .hb-toast.error {
          background: #9d3c32;
        }

        .hb-reviews-page .hb-loading {
          min-height: 300px;
          display: grid;
          place-items: center;
          color: #947657;
          font-size: 12px;
          gap: 13px;
        }

        .hb-reviews-page .hb-spinner {
          width: 35px;
          height: 35px;
          border: 3px solid #eaded0;
          border-top-color: #9d7440;
          border-radius: 50%;
          animation: hbSpin 0.8s linear infinite;
        }

        .hb-reviews-page .hb-pagination {
          display: flex;
          justify-content: center;
          margin-top: 22px;
        }

        .hb-reviews-page .hb-pagination button {
          border: 1px solid #d9c4aa;
          background: #fffaf6;
          color: #704b2c;
          border-radius: 10px;
          padding: 10px 18px;
          font-size: 11px;
          font-weight: 750;
          transition: all 0.25s;
        }

        .hb-reviews-page .hb-pagination button:hover {
          background: #2c0e05;
          border-color: #2c0e05;
          color: white;
        }

        .hb-reviews-page .hb-reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.65s ease, transform 0.65s ease;
        }

        .hb-reviews-page .hb-reveal.hb-visible {
          opacity: 1;
          transform: translateY(0);
        }

        @keyframes hbFadeDown {
          from { opacity: 0; transform: translateY(-14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes hbFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes hbFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes hbModalIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes hbToastIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes hbSpin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1100px) {
          .hb-reviews-page .hb-content {
            grid-template-columns: minmax(0, 1fr) 260px;
          }
        }

        @media (max-width: 850px) {
          .hb-reviews-page .hb-content {
            grid-template-columns: 1fr;
          }

          .hb-reviews-page .hb-sidebar {
            position: static;
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 650px) {
          .hb-reviews-page .hb-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .hb-reviews-page .hb-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
          }

          .hb-reviews-page .hb-stat-card {
            padding: 13px;
            gap: 10px;
          }

          .hb-reviews-page .hb-stat-icon {
            width: 38px;
            height: 38px;
          }

          .hb-reviews-page .hb-stat-value {
            font-size: 20px;
          }

          .hb-reviews-page .hb-toolbar {
            align-items: stretch;
          }

          .hb-reviews-page .hb-search {
            width: 100%;
          }

          .hb-reviews-page .hb-review-card {
            grid-template-columns: 78px minmax(0, 1fr);
            gap: 12px;
            padding: 12px;
          }

          .hb-reviews-page .hb-review-image {
            width: 78px;
            height: 78px;
          }

          .hb-reviews-page .hb-review-top {
            flex-direction: column;
          }

          .hb-reviews-page .hb-food-name {
            font-size: 13px;
          }

          .hb-reviews-page .hb-review-text {
            font-size: 11px;
          }

          .hb-reviews-page .hb-review-bottom {
            align-items: flex-start;
            flex-direction: column;
          }

          .hb-reviews-page .hb-sidebar {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hb-reviews-page *,
          .hb-reviews-page *::before,
          .hb-reviews-page *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }

          .hb-reviews-page .hb-reveal {
            opacity: 1;
            transform: none;
          }

          /* ===== PAGE ALIGNMENT ===== */
.hb-reviews-page {
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  padding: 12px 24px 55px;
}

/* ===== HERO SECTION ===== */
.hb-reviews-page .hb-hero {
  position: relative;
  min-height: 275px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  padding: 38px 48px;
  margin-bottom: 28px;
  border: 1px solid #e8d5bd;
  border-radius: 22px;
  background:
    radial-gradient(circle at 85% 20%, rgba(213, 177, 126, .28), transparent 30%),
    linear-gradient(115deg, #fff8f0 0%, #f5e8d9 55%, #ead5bb 100%);
  box-shadow: 0 10px 30px rgba(66, 35, 17, .07);
}

.hb-reviews-page .hb-hero-content {
  position: relative;
  z-index: 2;
  max-width: 650px;
}

.hb-reviews-page .hb-hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #956b36;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 2px;
  margin-bottom: 15px;
}

.hb-reviews-page .hb-hero h1 {
  margin: 0;
  color: #2c0e05;
  font-size: clamp(30px, 3.2vw, 43px);
  line-height: 1.2;
  font-weight: 850;
  letter-spacing: -1.3px;
}

.hb-reviews-page .hb-hero h1 span {
  color: #a47743;
}

.hb-reviews-page .hb-hero-content > p {
  max-width: 570px;
  margin: 14px 0 20px;
  color: #765c4b;
  font-size: 15px;
  line-height: 1.85;
}

.hb-reviews-page .hb-hero-bottom {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.hb-reviews-page .hb-hero-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 13px 21px;
  border: 0;
  border-radius: 11px;
  background: linear-gradient(135deg, #3a160b, #80502d);
  color: white;
  font-size: 14px;
  font-weight: 750;
  box-shadow: 0 7px 17px rgba(44, 14, 5, .16);
  transition: .3s ease;
}

.hb-reviews-page .hb-hero-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 22px rgba(44, 14, 5, .2);
}

.hb-reviews-page .hb-hero-btn:disabled {
  opacity: .55;
  cursor: not-allowed;
}

.hb-reviews-page .hb-hero-note {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #80634f;
  font-size: 13px;
}

.hb-reviews-page .hb-hero-note strong {
  color: #3a160b;
  font-size: 15px;
}

.hb-reviews-page .hb-hero-decoration {
  position: relative;
  width: 230px;
  height: 210px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
}

.hb-reviews-page .hb-hero-circle {
  position: relative;
  z-index: 2;
  width: 155px;
  height: 155px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #fff7ed;
  background: linear-gradient(145deg, #71472b, #2c0e05);
  border: 7px solid rgba(255, 255, 255, .55);
  box-shadow: 0 12px 30px rgba(44, 14, 5, .2);
}

.hb-reviews-page .hb-hero-stars {
  color: #e7bd76;
  font-size: 16px;
  letter-spacing: 3px;
}

.hb-reviews-page .hb-hero-circle span {
  font-size: 12px;
  color: #f4dfc4;
}

.hb-reviews-page .hb-hero-orbit {
  position: absolute;
  border: 1px solid rgba(143, 98, 52, .28);
  border-radius: 50%;
}

.hb-reviews-page .hb-orbit-one {
  width: 195px;
  height: 195px;
}

.hb-reviews-page .hb-orbit-two {
  width: 225px;
  height: 225px;
}

.hb-reviews-page .hb-hero-dot {
  position: absolute;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #b08a55;
  box-shadow: 0 0 0 6px rgba(176, 138, 85, .13);
}

.hb-reviews-page .hb-dot-one {
  top: 20px;
  right: 35px;
}

.hb-reviews-page .hb-dot-two {
  bottom: 22px;
  left: 20px;
  width: 9px;
  height: 9px;
}

/* ===== READABLE FONT SIZES ===== */
.hb-reviews-page .hb-eyebrow,
.hb-reviews-page .hb-stat-label,
.hb-reviews-page .hb-filter,
.hb-reviews-page .hb-search,
.hb-reviews-page .hb-review-meta,
.hb-reviews-page .hb-status,
.hb-reviews-page .hb-side-desc,
.hb-reviews-page .hb-eligible-name,
.hb-reviews-page .hb-eligible-order,
.hb-reviews-page .hb-small-btn,
.hb-reviews-page .hb-average-label,
.hb-reviews-page .hb-form-label,
.hb-reviews-page .hb-rating-text,
.hb-reviews-page .hb-secondary-btn {
  font-size: 13px;
}

.hb-reviews-page .hb-subtitle {
  font-size: 15px;
}

.hb-reviews-page .hb-stat-value {
  font-size: 25px;
}

.hb-reviews-page .hb-food-name {
  font-size: 17px;
}

.hb-reviews-page .hb-review-text {
  font-size: 14px;
}

.hb-reviews-page .hb-side-title {
  font-size: 16px;
}

.hb-reviews-page .hb-eligible-order {
  font-size: 12px;
}

.hb-reviews-page .hb-input,
.hb-reviews-page .hb-select,
.hb-reviews-page .hb-textarea {
  font-size: 14px;
}

.hb-reviews-page .hb-primary-btn {
  font-size: 14px;
}

@media (max-width: 900px) {
  .hb-reviews-page .hb-hero {
    padding: 30px;
  }

  .hb-reviews-page .hb-hero-decoration {
    width: 175px;
    transform: scale(.85);
  }
}

@media (max-width: 650px) {
  .hb-reviews-page {
    padding: 10px 12px 35px;
  }

  .hb-reviews-page .hb-hero {
    padding: 27px 22px;
    min-height: auto;
  }

  .hb-reviews-page .hb-hero-decoration {
    display: none;
  }

  .hb-reviews-page .hb-hero h1 {
    font-size: 30px;
  }

  .hb-reviews-page .hb-hero-content > p {
    font-size: 14px;
  }
}
        }
      `}</style>

      {/* HEADER */}
      
      {/* HERO SECTION */}
      <section className="hb-hero hb-reveal">
        <div className="hb-hero-content">
          <span className="hb-hero-tag">
            <FiStar size={14} />
            YOUR VOICE MATTERS
          </span>

          <h1>
            Every Meal Has a Story.
            <br />
            <span>Share Yours.</span>
          </h1>

          <p>
            Your honest feedback makes HomeBite better. Share your
            experience, rate your favourite homemade meals and help
            others discover something delicious.
          </p>

          <div className="hb-hero-bottom">
            <button
              className="hb-hero-btn"
              onClick={() => openAddModal()}
              disabled={eligibleFoods.length === 0}
            >
              <FiPlus size={17} />
              Write a Review
            </button>

            <div className="hb-hero-note">
              <FiMessageSquare size={17} />
              <span>
                <strong>{reviews.length}</strong> reviews shared by you
              </span>
            </div>
          </div>
        </div>

        <div className="hb-hero-decoration">
          <div className="hb-hero-circle">
            <FiCoffee size={54} />
            <div className="hb-hero-stars">★★★★★</div>
            <span>Made with love</span>
          </div>
          <div className="hb-hero-orbit hb-orbit-one" />
          <div className="hb-hero-orbit hb-orbit-two" />
          <div className="hb-hero-dot hb-dot-one" />
          <div className="hb-hero-dot hb-dot-two" />
        </div>
      </section>


      {loading ? (
        <div className="hb-loading">
          <div className="hb-spinner" />
          Loading your reviews...
        </div>
      ) : (
        <>
          {/* STATS */}
          <div className="hb-stats">
            <div className="hb-stat-card hb-reveal">
              <div className="hb-stat-icon">
                <FiMessageSquare size={20} />
              </div>
              <div>
                <div className="hb-stat-value">{reviews.length}</div>
                <div className="hb-stat-label">Total Reviews</div>
              </div>
            </div>

            <div className="hb-stat-card hb-reveal">
              <div className="hb-stat-icon">
                <FiStar size={20} />
              </div>
              <div>
                <div className="hb-stat-value">{averageRating}</div>
                <div className="hb-stat-label">Average Rating</div>
              </div>
            </div>

            <div className="hb-stat-card hb-reveal">
              <div className="hb-stat-icon">
                <FiCheckCircle size={20} />
              </div>
              <div>
                <div className="hb-stat-value">{approvedCount}</div>
                <div className="hb-stat-label">Approved Reviews</div>
              </div>
            </div>

            <div className="hb-stat-card hb-reveal">
              <div className="hb-stat-icon">
                <FiClock size={20} />
              </div>
              <div>
                <div className="hb-stat-value">{pendingCount}</div>
                <div className="hb-stat-label">Pending Reviews</div>
              </div>
            </div>
          </div>

          <div className="hb-content">
            {/* MAIN */}
            <div className="hb-main-panel">
              <div className="hb-toolbar hb-reveal">
                <div className="hb-filters">
                  {["All", "Approved", "Pending", "Rejected"].map((filter) => (
                    <button
                      key={filter}
                      className={`hb-filter ${
                        activeFilter === filter ? "active" : ""
                      }`}
                      onClick={() => {
                        setActiveFilter(filter);
                        setVisibleCount(6);
                      }}
                    >
                      {filter}
                      {filter === "All" && (
                        <span> ({reviews.length})</span>
                      )}
                    </button>
                  ))}
                </div>

                <input
                  className="hb-search"
                  type="search"
                  placeholder="Search food or review..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setVisibleCount(6);
                  }}
                />
              </div>

              {filteredReviews.length > 0 ? (
                <>
                  <div className="hb-review-list">
                    {visibleReviews.map((review) => (
                      <article
                        className="hb-review-card hb-reveal"
                        key={review.id}
                      >
                        <div className="hb-review-image">
                          {review.food_image &&
                          !imageErrors[review.id] ? (
                            <img
                              src={getImageUrl(review.food_image)}
                              alt={review.food_name}
                              onError={() =>
                                setImageErrors((prev) => ({
                                  ...prev,
                                  [review.id]: true,
                                }))
                              }
                            />
                          ) : (
                            <FiCoffee size={28} />
                          )}
                        </div>

                        <div className="hb-review-body">
                          <div className="hb-review-top">
                            <div>
                              <h3 className="hb-food-name">
                                {review.food_name}
                              </h3>

                              <RatingStars
                                rating={Number(review.rating)}
                                size={15}
                              />
                            </div>

                            <StatusBadge status={review.status} />
                          </div>

                          <p className="hb-review-text">
                            {review.review_text ||
                              "No written comment added."}
                          </p>

                          <div className="hb-review-bottom">
                            <div className="hb-review-meta">
                              <span className="hb-meta-item">
                                <FiCalendar size={12} />
                                {formatDate(review.created_at)}
                              </span>

                              <span className="hb-meta-item">
                                <FiShoppingBag size={12} />
                                Order #{review.order_id}
                              </span>
                            </div>

                            <div className="hb-review-actions">
                              <button
                                className="hb-icon-btn"
                                title="Edit review"
                                onClick={() => openEditModal(review)}
                              >
                                <FiEdit2 size={14} />
                              </button>

                              <button
                                className="hb-icon-btn delete"
                                title="Delete review"
                                onClick={() => setDeleteTarget(review)}
                              >
                                <FiTrash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  {filteredReviews.length > visibleCount && (
                    <div className="hb-pagination">
                      <button
                        onClick={() =>
                          setVisibleCount((prev) => prev + 6)
                        }
                      >
                        Load More Reviews
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="hb-empty">
                  <div className="hb-empty-icon">
                    <FiMessageSquare size={29} />
                  </div>

                  <h3>
                    {reviews.length === 0
                      ? "No Reviews Yet"
                      : "No Reviews Found"}
                  </h3>

                  <p>
                    {reviews.length === 0
                      ? "Once you review your delivered meals, your feedback will appear here."
                      : "Try another search term or select a different review filter."}
                  </p>

                  {reviews.length === 0 && eligibleFoods.length > 0 && (
                    <button
                      className="hb-primary-btn"
                      onClick={() => openAddModal()}
                    >
                      <FiPlus size={15} />
                      Write Your First Review
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* SIDEBAR */}
            <aside className="hb-sidebar">
              <div className="hb-side-card hb-reveal">
                <h3 className="hb-side-title">
                  <FiStar
                    size={15}
                    style={{
                      display: "inline",
                      marginRight: 7,
                      color: "#b08a55",
                    }}
                  />
                  Your Rating Summary
                </h3>

                <div className="hb-rating-summary">
                  <div className="hb-average">{averageRating}</div>

                  <RatingStars
                    rating={Math.round(Number(averageRating))}
                    size={17}
                  />

                  <div className="hb-average-label">
                    Based on {reviews.length}{" "}
                    {reviews.length === 1 ? "review" : "reviews"}
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 17,
                    paddingTop: 14,
                    borderTop: "1px solid #ecdfd3",
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 11,
                    color: "#8e7569",
                  }}
                >
                  <span>Rejected Reviews</span>
                  <strong style={{ color: "#a7473c" }}>
                    {rejectedCount}
                  </strong>
                </div>
              </div>

              <div className="hb-side-card hb-reveal">
                <h3 className="hb-side-title">
                  <FiShoppingBag
                    size={15}
                    style={{
                      display: "inline",
                      marginRight: 7,
                      color: "#b08a55",
                    }}
                  />
                  Ready to Review
                </h3>

                <p className="hb-side-desc">
                  These delivered foods are waiting for your feedback.
                </p>

                {eligibleFoods.length > 0 ? (
                  <div className="hb-eligible-list">
                    {eligibleFoods.slice(0, 4).map((food, index) => (
                      <div
                        className="hb-eligible-item"
                        key={`${food.order_id}-${food.food_id}-${index}`}
                      >
                        {food.food_image ? (
                          <img
                            className="hb-eligible-image"
                            src={getImageUrl(food.food_image)}
                            alt={food.food_name}
                          />
                        ) : (
                          <div className="hb-eligible-image" />
                        )}

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="hb-eligible-name">
                            {food.food_name}
                          </div>
                          <div className="hb-eligible-order">
                            Order #{food.order_id}
                          </div>
                        </div>

                        <button
                          className="hb-small-btn"
                          onClick={() => openAddModal(food)}
                        >
                          Review
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "15px 5px 5px",
                      color: "#9a8274",
                      fontSize: 11,
                      lineHeight: 1.7,
                    }}
                  >
                    <FiCheckCircle
                      size={22}
                      style={{
                        color: "#b08a55",
                        marginBottom: 7,
                      }}
                    />
                    <div>All caught up!</div>
                    <div>No delivered food waiting for review.</div>
                  </div>
                )}

                {eligibleFoods.length > 4 && (
                  <p
                    style={{
                      color: "#987f72",
                      fontSize: 10,
                      margin: "12px 0 0",
                    }}
                  >
                    +{eligibleFoods.length - 4} more foods available to review
                  </p>
                )}
              </div>

              <div className="hb-side-card hb-reveal">
                <h3 className="hb-side-title">
                  <FiCoffee
                    size={15}
                    style={{
                      display: "inline",
                      marginRight: 7,
                      color: "#b08a55",
                    }}
                  />
                  A Little Reminder
                </h3>

                <p className="hb-side-desc" style={{ marginBottom: 0 }}>
                  Your honest feedback helps our homemade food sellers improve
                  their dishes and helps other customers make better choices.
                  Thank you for being part of HomeBite!
                </p>
              </div>
            </aside>
          </div>
        </>
      )}

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div
          className="hb-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="hb-modal">
            <div className="hb-modal-header">
              <div>
                <h3>
                  {editingReview ? "Edit Your Review" : "Write a Review"}
                </h3>
                <p>Share your experience with the HomeBite community.</p>
              </div>

              <button
                type="button"
                className="hb-close"
                onClick={closeModal}
                disabled={saving}
              >
                <FiX size={17} />
              </button>
            </div>

            <form className="hb-form" onSubmit={handleSubmit}>
              {!editingReview && (
                <div className="hb-form-group">
                  <label className="hb-form-label">
                    Select Food *
                  </label>

                  <select
                    className="hb-select"
                    value={
                      form.food_id && form.order_id
                        ? `${form.order_id}-${form.food_id}`
                        : ""
                    }
                    onChange={(e) => {
                      const selected = eligibleFoods.find(
                        (food) =>
                          `${food.order_id}-${food.food_id}` === e.target.value
                      );

                      setForm((prev) => ({
                        ...prev,
                        food_id: selected ? String(selected.food_id) : "",
                        order_id: selected ? String(selected.order_id) : "",
                      }));
                    }}
                    required
                  >
                    <option value="">Choose a delivered food</option>

                    {eligibleFoods.map((food, index) => (
                      <option
                        key={`${food.order_id}-${food.food_id}-${index}`}
                        value={`${food.order_id}-${food.food_id}`}
                      >
                        {food.food_name} — Order #{food.order_id}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {editingReview && (
                <div className="hb-form-group">
                  <label className="hb-form-label">Food</label>
                  <input
                    className="hb-input"
                    value={editingReview.food_name || ""}
                    disabled
                  />
                </div>
              )}

              <div className="hb-form-group">
                <label className="hb-form-label">
                  Your Rating *
                </label>

                <div className="hb-rating-picker">
                  <RatingStars
                    rating={Number(form.rating)}
                    interactive
                    size={28}
                    onChange={(rating) =>
                      setForm((prev) => ({ ...prev, rating }))
                    }
                  />

                  <span className="hb-rating-text">
                    {
                      ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][
                        form.rating
                      ]
                    }
                  </span>
                </div>
              </div>

              <div className="hb-form-group">
                <label className="hb-form-label">
                  Your Experience
                </label>

                <textarea
                  className="hb-textarea"
                  placeholder="Tell us what you liked about this food..."
                  maxLength={2000}
                  value={form.review_text}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      review_text: e.target.value,
                    }))
                  }
                />

                <div
                  style={{
                    textAlign: "right",
                    color: "#a28a7e",
                    fontSize: 10,
                    marginTop: 5,
                  }}
                >
                  {form.review_text.length}/2000
                </div>
              </div>

              <div className="hb-form-footer">
                <button
                  type="button"
                  className="hb-secondary-btn"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="hb-primary-btn"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <FiRefreshCw className="hb-submit-spin" size={14} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSend size={14} />
                      {editingReview ? "Update Review" : "Submit Review"}
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
        <div
          className="hb-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setDeleteTarget(null);
          }}
        >
          <div className="hb-modal" style={{ maxWidth: 390 }}>
            <div className="hb-form" style={{ textAlign: "center" }}>
              <div
                className="hb-empty-icon"
                style={{
                  background: "#fae9e6",
                  color: "#b94d43",
                  marginBottom: 14,
                }}
              >
                <FiTrash2 size={25} />
              </div>

              <h3
                style={{
                  color: "#2c0e05",
                  fontSize: 18,
                  margin: "0 0 9px",
                }}
              >
                Delete This Review?
              </h3>

              <p
                style={{
                  color: "#92796d",
                  fontSize: 12,
                  lineHeight: 1.8,
                  margin: "0 auto 20px",
                }}
              >
                Are you sure you want to delete your review for{" "}
                <strong>{deleteTarget.food_name}</strong>? This action cannot
                be undone.
              </p>

              <div className="hb-form-footer" style={{ justifyContent: "center" }}>
                <button
                  className="hb-secondary-btn"
                  onClick={() => setDeleteTarget(null)}
                >
                  Cancel
                </button>

                <button
                  className="hb-primary-btn"
                  style={{ background: "#a94339" }}
                  onClick={handleDelete}
                >
                  <FiTrash2 size={14} />
                  Delete Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {notice && (
        <div className={`hb-toast ${notice.type === "error" ? "error" : ""}`}>
          {notice.type === "error" ? (
            <FiAlertCircle size={17} />
          ) : (
            <FiCheckCircle size={17} />
          )}
          {notice.message}
        </div>
      )}

      <style jsx>{`
        @keyframes hbSubmitSpin {
          to { transform: rotate(360deg); }
        }

        .hb-submit-spin {
          animation: hbSubmitSpin 0.8s linear infinite;
        }
      `}</style>
    </div>
  );
}
