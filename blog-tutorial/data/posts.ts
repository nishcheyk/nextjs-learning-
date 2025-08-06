// data/posts.ts
export type Post = {
    slug: string;
    title: string;
    content: string;
  };
  
  export const posts: Post[] = [
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
    {
      slug: "react-hooks",
      title: "React Hooks Explained",
      content: "Let’s understand how React hooks work...",
    },
  ];
  
  // Helper for quick lookup by slug (for detail page)
  export const postsMap: Record<string, Post> = posts.reduce((acc, post) => {
    acc[post.slug] = post;
    return acc;
  }, {} as Record<string, Post>);
  