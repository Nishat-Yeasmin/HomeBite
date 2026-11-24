
"use client";

import { useState } from "react";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiSend,
  FiMessageCircle,
  FiArrowRight,
} from "react-icons/fi";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");


export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  
const handleSubmit = async (e) => {
  e.preventDefault();

  setStatus({ type: "", message: "" });
  setLoading(true);

  try {
    const response = await fetch(`${API_URL}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(
        "Server returned an invalid response. Please check the API URL."
      );
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to send your message.");
    }

    setStatus({
      type: "success",
      message: data.message || "Your message has been sent successfully!",
    });

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  } catch (error) {
    console.error("Contact form error:", error);

    setStatus({
      type: "error",
      message: error.message || "Something went wrong. Please try again.",
    });
  } finally {
    setLoading(false);
  }
};
  const contactInfo = [
    {
      icon: FiMail,
      title: "Email Us",
      value: "support@homebite.com",
      description: "Our team is always ready to help.",
    },
    {
      icon: FiPhone,
      title: "Call Us",
      value: "+880 1745672381",
      description: "Contact us for any assistance.",
    },
    {
      icon: FiMapPin,
      title: "Our Location",
      value: "Sylhet, Bangladesh",
      description: "Serving homemade food lovers.",
    },
    {
      icon: FiClock,
      title: "Working Hours",
      value: "10:00 AM – 10:00 PM",
      description: "Saturday – Thursday",
    },
  ];

  return (
    <main className="min-h-screen bg-[#FFF8F3] text-[#2C0E05]">

      {/* Hero Section */}
      <section className="px-5 pt-14 pb-10 md:pt-20 md:pb-14">
        <div className="mx-auto max-w-7xl text-center">

          <span className="inline-block rounded-full border border-[#B08A55]/30 bg-[#F3E3DC] px-5 py-2 text-xs font-semibold uppercase tracking-[2px] text-[#B08A55]">
            We'd Love To Hear From You
          </span>

          <h1 className="mt-6 font-serif text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Get in <span className="text-[#B08A55]">Touch</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#765D52] md:text-base">
            Have a question, suggestion, or need help with your order?
            We're here to make your HomeBite experience wonderful.
          </p>

          <div className="mx-auto mt-7 h-[3px] w-16 rounded-full bg-[#B08A55]" />

        </div>
      </section>

      {/* Main Contact Section */}
      <section className="px-5 pb-16 md:pb-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr]">

          {/* Contact Information */}
          <div className="rounded-2xl bg-[#2C0E05] p-7 text-[#FFF8F3] shadow-xl shadow-[#2C0E05]/10 md:p-9">

            <h2 className="font-serif text-2xl font-bold md:text-3xl">
              Contact Information
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#E4CFC4]">
              Feel free to reach out to us. We'd be happy to assist you
              with anything related to HomeBite.
            </p>

            <div className="mt-9 space-y-7">

              {contactInfo.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div key={index} className="group flex gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#B08A55]/15 text-[#D7B77F] transition-all duration-300 group-hover:bg-[#B08A55] group-hover:text-white">
                      <Icon size={21} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-semibold text-[#FFF8F3]">
                        {item.title}
                      </h3>

                      <p className="mt-1 break-words text-sm font-medium text-[#D7B77F]">
                        {item.value}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#C6AEA2]">
                        {item.description}
                      </p>
                    </div>

                  </div>
                );
              })}

            </div>

            <div className="mt-10 border-t border-white/15 pt-7">
              <h3 className="font-serif text-lg font-semibold">
                We're Here for You!
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#D8C3B8]">
                Your satisfaction means everything to us.
                Let's make every meal a delightful experience.
              </p>
            </div>

          </div>

          {/* Contact Form */}
          <div className="rounded-2xl border border-[#EAD8CE] bg-white p-6 shadow-lg shadow-[#2C0E05]/5 md:p-10">

            <div className="mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3E3DC] text-[#B08A55]">
                <FiMessageCircle size={23} />
              </div>

              <h2 className="mt-5 font-serif text-2xl font-bold md:text-3xl">
                Send Us a Message
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#8A756B]">
                Fill out the form below and we'll get back to you as soon
                as possible.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#493027]">
                    Full Name <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    className="w-full rounded-lg border border-[#EAD8CE] bg-[#FFFDFC] px-4 py-3 text-sm text-[#2C0E05] outline-none transition-all placeholder:text-[#B6A49A] focus:border-[#B08A55] focus:ring-2 focus:ring-[#B08A55]/15"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#493027]">
                    Email Address <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    className="w-full rounded-lg border border-[#EAD8CE] bg-[#FFFDFC] px-4 py-3 text-sm text-[#2C0E05] outline-none transition-all placeholder:text-[#B6A49A] focus:border-[#B08A55] focus:ring-2 focus:ring-[#B08A55]/15"
                  />
                </div>

              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#493027]">
                  Subject <span className="text-red-500">*</span>
                </label>

                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full cursor-pointer rounded-lg border border-[#EAD8CE] bg-[#FFFDFC] px-4 py-3 text-sm text-[#765D52] outline-none transition-all focus:border-[#B08A55] focus:ring-2 focus:ring-[#B08A55]/15"
                >
                  <option value="">Select a subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Order Related">Order Related Issue</option>
                  <option value="Payment Issue">Payment Issue</option>
                  <option value="Delivery Issue">Delivery Issue</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#493027]">
                  Your Message <span className="text-red-500">*</span>
                </label>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  rows={5}
                  required
                  className="w-full resize-none rounded-lg border border-[#EAD8CE] bg-[#FFFDFC] px-4 py-3 text-sm text-[#2C0E05] outline-none transition-all placeholder:text-[#B6A49A] focus:border-[#B08A55] focus:ring-2 focus:ring-[#B08A55]/15"
                />
              </div>

              {status.message && (
                <div
                  role="status"
                  className={`rounded-lg px-4 py-3 text-sm ${
                    status.type === "success"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {status.message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg bg-[#2C0E05] px-6 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#B08A55] hover:shadow-lg hover:shadow-[#B08A55]/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Message"}

                <FiSend
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  size={17}
                />
              </button>

            </form>
          </div>

        </div>
      </section>

      {/* Location Section */}
      <section className="px-5 pb-16 md:pb-20">
        <div className="mx-auto max-w-7xl">

          <div className="mb-6 text-center">
            <h2 className="font-serif text-2xl font-bold md:text-3xl">
              Find <span className="text-[#B08A55]">Us</span>
            </h2>

            <p className="mt-2 text-sm text-[#8A756B]">
              Serving homemade food lovers in Sylhet and beyond.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#EAD8CE] shadow-lg">
            <iframe
              title="HomeBite service area in Sylhet"
              src="https://maps.google.com/maps?q=Sylhet%2C%20Bangladesh&t=&z=12&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="300"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

        </div>
      </section>

    </main>
  );
}
