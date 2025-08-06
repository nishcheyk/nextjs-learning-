// app/api/blogs/route.ts
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(); // uses default DB from URI
    const blogs = await db.collection("posts").find({}).toArray();
    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const blog = await request.json();
    if (!blog.slug || !blog.title || !blog.content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existing = await db.collection("posts").findOne({ slug: blog.slug });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    await db.collection("posts").insertOne(blog);
    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add blog" }, { status: 500 });
  }
}
