// app/blog/[slug]/page.tsx
import { postsMap, Post } from "../../../data/posts";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateMetadata({ params }: PageProps) {
  const post = postsMap[params.slug];
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | My Blog`,
    description: post.content.slice(0, 150),
  };
}

export default function BlogPostPage({ params }: PageProps) {
  const post: Post | undefined = postsMap[params.slug];

  if (!post) {
    notFound(); // shows 404 page
  }

  return (
    <article style={{ maxWidth: 700, margin: "40px auto", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h1>{post.title}</h1>
      <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{post.content}</p>
      <p>
        <a href="/blog" style={{ color: "#0070f3", textDecoration: "underline" }}>
          ← Back to Blog
        </a>
      </p>
    </article>
  );
}
