'use client';

import { useState, useEffect } from 'react';
import BlogListClient from './BlogListClient';

type Post = { slug: string; title: string; content: string };

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newContent, setNewContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // for safe state updates, optional

    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => {
        if (isMounted) {
          if (Array.isArray(data)) {
            setPosts(data);
          } else {
            setError('API did not return a list of posts');
            setPosts([]);
          }
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('Failed to load posts');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleAddPost() {
    setError(null);
    setSuccess(null);

    if (!newSlug || !newTitle || !newContent) {
      setError('Please fill out all fields');
      return;
    }

    const post = {
      slug: newSlug.trim(),
      title: newTitle.trim(),
      content: newContent.trim(),
    };

    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to add post');
        return;
      }

      const created: Post = await res.json();
      setPosts(prev => [...prev, created]);
      setNewSlug('');
      setNewTitle('');
      setNewContent('');
      setSuccess('Post added successfully!');
    } catch {
      setError('Network error');
    }
  }

  async function handleDeletePost(slug: string) {
    try {
      const res = await fetch(`/api/blogs/${slug}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        alert('Failed to delete post');
        return;
      }

      setPosts(prev => prev.filter(p => p.slug !== slug));
    } catch {
      alert('Network error');
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h1>Manage Blog Posts</h1>

      <section style={{ marginBottom: 40 }}>
        <h2>Add New Post</h2>
        <input
          placeholder="Slug"
          value={newSlug}
          onChange={e => setNewSlug(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <input
          placeholder="Title"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <textarea
          placeholder="Content"
          value={newContent}
          onChange={e => setNewContent(e.target.value)}
          rows={5}
          style={{ width: '100%', padding: 8, marginBottom: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <button onClick={handleAddPost} style={{ padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}>
          Add Post
        </button>

        {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}
        {success && <p style={{ color: 'green', marginTop: 12 }}>{success}</p>}
      </section>

      <section>
  <h2>Existing Posts</h2>
  {loading ? (
    <p>Loading posts...</p>
  ) : error ? (
    <p style={{ color: 'red' }}>{error}</p>
  ) : posts.length === 0 ? (
    <p>No posts available.</p>
  ) : (
    <BlogListClient posts={posts} onDelete={handleDeletePost} />
  )}
</section>
    </div>
  );
}
