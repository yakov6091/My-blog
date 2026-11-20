'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/actions/auth";

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setError(null);
        setLoading(true);

        try {
            const result = await registerUser(formData);

            if (result?.error) {
                setError(result.error);
            } else if (result?.success) {
                // Registration worked! Redirect to login page
                router.push('/login');
            }
        } catch (error) {
            setError('An unexpected error occurred. Please try again');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-md shadow-slate-500/50 border border-slate-500">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-600">Create an Account</h1>
                    <p className="text-md text-slate-600 mt-1">Join the blog to start writing and commenting</p>
                </div>

                {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">{error}</div>
                )}

                <form className="space-y-4" action={handleSubmit}>
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-slate-700"
                        >
                            Username:
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            placeholder="john doe"
                            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-slate-700"
                        >
                            Email Address:
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="john_doe@example.com"
                            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-slate-700"
                        >
                            Password:
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="••••••••••••••••"
                            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-600">
                    Already have an account?{' '}
                    <Link
                        href="/login"
                        className="text-blue-600 hover:underline font-medium"
                    >
                        Log in
                    </Link>

                </p>


            </div>


        </div>
    )
}