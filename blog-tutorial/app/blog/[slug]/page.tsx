// app/blog/[slug]/page.tsx

import { notFound } from "next/navigation";
import Link from "next/link";
import clientPromise from "../../../lib/mongodb";

interface PageProps {
  params: {
    slug: string;
  };
}

interface Post {
  slug: string;
  title: string;
  content: string;
  imageUrl?: string;
}

export async function generateMetadata({ params }: PageProps) {
  const client = await clientPromise;
  const db = client.db(); // or db('your_db_name')

  const post = await db.collection<Post>("posts").findOne({ slug: params.slug });

  if (!post) {
    return { title: "Post Not Found" };
  }

  const baseUrl = " hi this is nishchey testing meta data "; // Replace with your deployed domain

  return {
    title: `${post.title} | testing`,
    description: post.content.slice(0, 150),
    openGraph: {
      title: post.title,
      description: post.content.slice(0, 150),
      url: `${baseUrl}/blog/${post.slug}`,
      siteName: "nishchey blog ",
      images: post.imageUrl
        ? [
            {
              url: post.imageUrl,
              width: 800,
              height: 600,
              alt: post.title,
            },
          ]
        : [],
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const client = await clientPromise;
  const db = client.db();

  const post = await db.collection<Post>("posts").findOne({ slug: params.slug });

  if (!post) {
    notFound();
    return null;
  }

  return (
    <article
      style={{
        maxWidth: 700,
        margin: "40px auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h1>{post.title}</h1>
      <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{post.content}</p>
      <p>
        <Link href="/blog" style={{ color: "#0070f3", textDecoration: "underline" }}>
           Back to Blog
        </Link>
      </p>
    </article>
  );
}
