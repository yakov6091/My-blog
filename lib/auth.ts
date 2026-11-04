import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import * as schema from "@/db/schema";
import Credentials from "next-auth/providers/credentials";

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
                return null;
            },
        }),
    ],
    pages: {
        signIn: '/login' // We will build this page in the frontend phase
    },
});