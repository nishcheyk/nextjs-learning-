'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";  
import { Post } from "../../data/posts";

interface Props {
  posts: Post[];
  onDelete?: (slug: string) => void; // Optional if you want delete buttons here
}

export default function BlogListClient({ posts, onDelete }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(initialSearch);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      const params = new URLSearchParams();

      if (searchTerm.trim() !== "") {
        params.set("search", searchTerm.trim());
      }

      const queryString = params.toString();
      const url = queryString ? `?${queryString}` : window.location.pathname;

      router.replace(url, { scroll: false });
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm, router]);

  const onSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "40px auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <input
        type="search"
        aria-label="Search posts by title"
        placeholder="Search posts by title..."
        value={searchTerm}
        onChange={onSearchChange}
        style={{
          padding: 12,
          marginBottom: 16,
          width: "100%",
          boxSizing: "border-box",
          borderRadius: 6,
          border: "1px solid #ccc",
          fontSize: 16,
          outline: "none",
          transition: "border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#0070f3";
          e.target.style.boxShadow = "0 0 0 3px rgba(0, 112, 243, 0.3)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#ccc";
          e.target.style.boxShadow = "none";
        }}
      />

      <p style={{ fontStyle: "italic", marginBottom: 12, color: "#555" }}>
        {searchTerm === "" ? "Showing all posts" : `Filtering posts for "${searchTerm}"`}
      </p>

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
              color: "#0070f3",
              marginBottom: 10,
              padding: "10px 12px",
              borderRadius: 6,
              userSelect: "none",
              transition: "background-color 0.2s ease-in-out",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#eef6ff")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none", color: "inherit", flexGrow: 1 }}>
              {post.title}
            </Link>
            {onDelete && (
              <button
                onClick={() => onDelete(post.slug)}
                style={{
                  marginLeft: 12,
                  background: "red",
                  color: "white",
                  border: "none",
                  padding: "4px 8px",
                  borderRadius: 4,
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
