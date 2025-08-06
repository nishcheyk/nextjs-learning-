// app/api/blogs/[slug]/route.ts
import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection("posts").deleteOne({ slug: params.slug });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Blog deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}
