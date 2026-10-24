'use server'

import { db } from "@/db";
import { posts } from "@/db/schema";
import { insertPostSchema } from "@/db/zod";
import { revalidatePath } from "next/cache";
import { z } from 'zod';

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