// app/api/posts/route.ts
import { NextResponse } from 'next/server';

type Post = { slug: string; title: string; content: string };

// Simple in-memory store to simulate a DB (server lifetime)
let posts: Post[] = [
  {
    slug: "my-first-post",
    title: "My First Post",
    content: "This is the content of my first post.",
  },
  {
    slug: "hello-nextjs",
    title: "Hello Next.js",
    content: "Welcome to learning Next.js with dynamic routes!",
  },
];

// GET /api/posts - list all posts
export async function GET() {
  return NextResponse.json(posts);
}

// POST /api/posts - add a new post
export async function POST(request: Request) {
  try {
    const newPost = await request.json() as Post;

    // Basic validation
    if (!newPost.slug || !newPost.title || !newPost.content) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Check for duplicate slug
    if(posts.find(p => p.slug === newPost.slug)) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    posts.push(newPost);
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
