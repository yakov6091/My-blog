'use server'

import { db } from "@/db";
import { posts } from "@/db/schema";
import { insertPostSchema } from "@/db/zod";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from 'zod';

// Get all posts (sorted by newest first)
export async function getAllPosts() {
    try {
        const allPosts = await db
            .select()
            .from(posts)
            .orderBy(desc(posts.createdAt));

        return { success: true, data: allPosts };
    } catch (err) {
        console.error('Error fetching posts:', err);
        return { success: false, error: 'Failed to fetch posts' };
    }
};

// Get a single post by its URL slug
export async function getPostBySlug(slug: string) {
    try {
        const [post] = await db
            .select()
            .from(posts)
            .where(eq(posts.slug, slug))
            .limit(1);

        if (!post) {
            return { success: false, error: 'Post not found' };
        }

        return { success: true, data: post };
    } catch (err) {
        console.error('Error fetching post by slug:', err);
        return { success: false, error: 'Failed to fetch post' };
    }
};



export async function createPost(formData: FormData) {
    // Read raw form input
    const rawData = {
        title: formData.get('title')?.toString() || '',
        slug: formData.get('slug')?.toString() || '',
        content: formData.get('content')?.toString() || '',
        userId: formData.get('userId')?.toString() || '', // pass a temporary user ID
    };

    // Validate input with Zod using safeParse
    const validationResult = insertPostSchema.safeParse(rawData);

    // If validation fails, retrun error back to the UI
    if (!validationResult.success) {
        const flattened = z.flattenError(validationResult.error);

        return {
            success: false,
            errors: flattened.fieldErrors,
        };
    }

    // Database Insertion 
    try {
        await db.insert(posts).values(validationResult.data);

        // Refresh the home page cache
        try {
            revalidatePath('/');
        } catch (err) {
            // Safe to ignore when running via standalone terminal test scripts
        }

        return { success: true };

    } catch (error) {
        console.error('Error creating post:', error);
        return { success: false, error: 'Database insert failed' };
    }
};