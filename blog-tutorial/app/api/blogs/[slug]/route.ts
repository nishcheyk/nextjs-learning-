// app/api/posts/[slug]/route.ts
import { NextResponse } from 'next/server';

type Post = { slug: string; title: string; content: string };

// We reuse the same 'posts' variable as above — but in real you would use a DB.

declare global {
  // Trick to reuse posts array:
  // @ts-ignore
  var posts: Post[] | undefined;
}

if (!global.posts) global.posts = [
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

const posts = global.posts;

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;

  const index = posts.findIndex(p => p.slug === slug);
  if (index === -1) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  posts.splice(index, 1);
  return NextResponse.json({ message: 'Post deleted' }, { status: 200 });
}
