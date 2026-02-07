"use server";

import { revalidatePath } from "next/cache";

/**
 * Revalidates the blog home page so the post list shows newly published posts
 * without requiring a full refresh. Call after publishing a post.
 */
export async function revalidateBlogHome() {
  revalidatePath("/");
}
