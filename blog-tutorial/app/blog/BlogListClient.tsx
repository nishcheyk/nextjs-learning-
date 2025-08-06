'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Next.js hooks
import { Post } from "../../data/posts";

interface Props {
  posts: Post[];
}

export default function BlogListClient({ posts }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize searchTerm from URL param "search" or empty string
  const initialSearch = searchParams.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  // Update URL query when searchTerm changes, using debounce (optional)
  useEffect(() => {
    // Always sync URL with current searchTerm (except when empty, you can remove param)
    const params = new URLSearchParams();

    if (searchTerm.trim() !== "") {
      params.set("search", searchTerm.trim());
    }

    // Optional: preserve other URL params if needed

    const queryString = params.toString();
    const url = queryString ? `?${queryString}` : window.location.pathname;

    router.replace(url, { scroll: false }); // Update URL without reload and no scroll jump
  }, [searchTerm, router]);

  // Filter posts by title ignoring case
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (selectedSlug && !filteredPosts.some(post => post.slug === selectedSlug)) {
      setSelectedSlug(null);
    }
  }, [searchTerm, filteredPosts, selectedSlug]);

  const selectedPost = selectedSlug
    ? posts.find((post) => post.slug === selectedSlug)
    : null;

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search posts by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: 12,
          marginBottom: 16,
          width: "100%",
          boxSizing: "border-box",
          borderRadius: 6,
          border: "1px solid #ccc",
          fontSize: 16,
          outline: "none",
          transition: "border-color 0.2s ease-in-out",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#0070f3")}
        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
      />

      {/* Helper Text */}
      <p style={{ fontStyle: "italic", marginBottom: 12, color: "#555" }}>
        {searchTerm === "" ? "Showing all posts" : `Filtering posts for "${searchTerm}"`}
      </p>

      {/* Posts List */}
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {filteredPosts.length === 0 && (
          <li
            style={{
              color: "#888",
              fontStyle: "italic",
              padding: "12px 8px",
              borderRadius: 4,
              backgroundColor: "#fafafa",
            }}
          >
            No posts found.
          </li>
        )}
        {filteredPosts.map((post) => (
          <li
            key={post.slug}
            style={{
              cursor: "pointer",
              color: selectedSlug === post.slug ? "#0070f3" : "#222",
              marginBottom: 10,
              padding: "10px 12px",
              borderRadius: 6,
              backgroundColor: selectedSlug === post.slug ? "#e6f0ff" : "transparent",
              userSelect: "none",
              transition: "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
            }}
            onClick={() => setSelectedSlug(post.slug)}
            onMouseEnter={(e) => {
              if (post.slug !== selectedSlug) {
                e.currentTarget.style.backgroundColor = "#f5f7fa";
              }
            }}
            onMouseLeave={(e) => {
              if (post.slug !== selectedSlug) {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            {post.title}
          </li>
        ))}
      </ul>

      {/* Selected Post Details */}
      {selectedPost && (
        <section
          style={{
            marginTop: 40,
            padding: 24,
            borderRadius: 8,
            border: "1px solid #ccc",
            backgroundColor: "#f9faff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: 12, color: "#0070f3" }}>
            {selectedPost.title}
          </h2>
          <p style={{ lineHeight: 1.6, color: "#333" }}>{selectedPost.content}</p>
          <button
            onClick={() => setSelectedSlug(null)}
            style={{
              marginTop: 20,
              padding: "8px 16px",
              fontSize: 14,
              cursor: "pointer",
              borderRadius: 6,
              border: "none",
              backgroundColor: "#0070f3",
              color: "#fff",
              transition: "background-color 0.2s ease-in-out",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#005bb5")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0070f3")}
          >
            Close
          </button>
        </section>
      )}
    </div>
  );
}
