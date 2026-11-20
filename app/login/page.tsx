'use client'

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false // Prevent automatic error throwing
            });

            if (result?.error) {
                setError('Invalid email or password');
            } else if (result?.ok) {
                // Successful login, redirect to homepage
                router.push('/');
                router.refresh();
            }
        } catch (error) {
            setError('An unexpected error occurred. Please try again.');

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="max-w-md w-full space-y-6 shadow-md bg-white p-8 rounded-xl shadow-md">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-800">Welcome Back</h1>
                    <p className="text-sm text-slate-600 mt-1">Log in to your blog account</p>
                </div>

                {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
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
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                            Password:
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="*********"
                            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                <p className="text-center text-cm text-sm text-slate-600">
                    Don't have an account?{' '}
                    <Link href="/register" className="text-blue-600 hover:underline font-medium">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
}
