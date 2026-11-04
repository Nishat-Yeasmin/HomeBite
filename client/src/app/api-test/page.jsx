"use client";

import { useEffect, useState } from "react";

export default function ApiTestPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        const response = await fetch(`${API_URL}/api/categories`);
        const data = await response.json();

        console.log("API Status:", response.status);
        console.log("API Response:", data);

        if (!response.ok) {
          throw new Error(data.error || data.message || "Failed to fetch categories");
        }

        setCategories(data.categories || []);
      } catch (err) {
        console.error("Category Fetch Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading) return <p>Loading categories...</p>;

  if (error) return <p>Error: {error}</p>;

  return (
    <main style={{ padding: "30px" }}>
      <h1>HomeBite Categories</h1>

      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <ul>
          {categories.map((category) => (
            <li key={category.id}>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}