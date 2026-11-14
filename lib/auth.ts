import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import * as schema from "@/db/schema";
import Credentials from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: DrizzleAdapter(db, {
        usersTable: schema.users,
        accountsTable: schema.accounts,
        sessionsTable: schema.sessions,
        verificationTokensTable: schema.verificationTokens,
    }),
    session: { strategy: 'jwt' },
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, request) {
                // We will wire up custom database user lookup & password verification
                if (!credentials?.email || !credentials.password) return null;
                // Temporary mock user return for testing login flow later
                // return null;

                try {
                    // Find user in Neon DB by email using Drizzle
                    const [user] = await db
                        .select()
                        .from(schema.users)
                        .where(eq(schema.users.email, credentials.email as string))
                        .limit(1);

                    if (!user || !user.passwordHash) {
                        return null
                    }

                    // Compare the typed password with the hashed password in DB
                    const passwordsMatch = await bcrypt.compare(
                        credentials.password as string,
                        user.passwordHash
                    );

                    if (!passwordsMatch) return null

                    // Return user object (Auth.js saves this into the JWT session token)
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    };

                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: '/login' // We will build this page in the frontend phase
    },
});