'use server'

import { db } from "@/db";
import * as schema from "@/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export async function registerUser(fromData: FormData) {
    const userName = fromData.get('username') as string;
    const email = fromData.get('email') as string;
    const password = fromData.get('password') as string;

    if (!userName || !email || !password) {
        return { error: 'Please fill in all fields.' };
    }

    try {
        // Check if user with this email or username already exists
        const existingUser = await db
            .select()
            .from(schema.users)
            .where(eq(schema.users.email, email)) // schema.users.username
            .limit(1);

        if (existingUser.length > 0) {
            return { error: 'User with this email already exists.' };
        }

        // Hash the password securely (salt rounds = 10)
        const hashedPassword = await bcrypt.hash(password, 10);

        // insert user into Neon db
        // populate both 'name' (for Auth.js) and 'username' (for my blog handle)
        await db.insert(schema.users).values({
            name: userName,
            username: userName,
            email: email,
            passwordHash: hashedPassword,
        });

        return { success: 'Account created successfully! you can now log in.' };

    } catch (error) {
        console.error('Registration error:', error);
        return { error: 'Something went wrong during registraion.' };
    }
}