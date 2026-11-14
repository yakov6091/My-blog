import { db } from "@/db";
import * as schema from "@/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function testRegistration() {
    try {
        console.log("🚀 Testing user registration and password verification flow...");

        const email = "auth_tester@blog.com";
        const username = "auth_tester";
        const password = "mypassword123";

        // 1. Clean up if test user already exists from a previous run
        const existing = await db
            .select()
            .from(schema.users)
            .where(eq(schema.users.email, email))
            .limit(1);

        if (existing.length > 0) {
            console.log("🧹 Cleaning up existing test user...");
            await db.delete(schema.users).where(eq(schema.users.email, email));
        }

        // 2. Hash the password with bcrypt (salt rounds = 10)
        console.log("🔐 Hashing password...");
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Insert the new user into Neon DB
        console.log("💾 Inserting user into Neon DB via Drizzle...");
        const [newUser] = await db
            .insert(schema.users)
            .values({
                name: username,
                username: username,
                email: email,
                passwordHash: hashedPassword,
            })
            .returning();

        console.log("✅ Success! Registered user:", {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
        });

        // 4. Test password comparison (simulating what Auth.js `authorize` does during login!)
        console.log("🔑 Testing password verification match...");
        const passwordsMatch = await bcrypt.compare(password, newUser.passwordHash);

        if (passwordsMatch) {
            console.log("🎉 SUCCESS: Password verification passed! Login logic is fully operational.");
        } else {
            console.log("❌ FAILURE: Password verification failed.");
        }

    } catch (error) {
        console.error("❌ Registration test failed:", error);
    }
}

testRegistration();