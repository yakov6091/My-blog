import Link from 'next/link';
import { auth, signOut } from '@/lib/auth';
import { getAllPosts } from '@/actions/post';

export default async function HomePage() {
  const session = await auth();
  const result = await getAllPosts();
  const postList = result.success ? result.data : [];

  return (
    <div className="min-h-screen bg-slate-200 text-slate-500">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-50">
        <div className="max-2-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">My Blog</Link>

          <nav className="flex items-center gap-2 text-sm">
            {session?.user ? (
              <>
                <span className="text-lg text-slate-600">
                  Welcome:{' '}
                  <strong className="text-slate-800">
                    {session.user.name || session.user.email}{' '}
                  </strong>
                </span>

                <Link
                  href="/posts/new"
                  className="inline-flex items-center gap-1 px-2.5 py-2 rounded-md bg-blue-600 text-xs font-xl text-white shadow-sm hover:bg-blue-500 active:scale-[0.98] transition-all"
                >
                  <svg
                    xmlns="http://w3.org"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-3.5 h-3.5 -ml-0.5"
                    aria-hidden="true"
                  >
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                  </svg>
                  <span>New Post</span>
                </Link>

                <form
                  action={async () => {
                    'use server';
                    await signOut({ redirectTo: '/' });
                  }}
                >
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1 px-2.5 py-2 rounded-md bg-slate-600 text-xs font-xl text-white shadow-sm hover:bg-slate-500 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    Log Out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-xl text-slate-800 bg-slate-200 rounded-lg shadow-xs hover:bg-slate-300 hover:text-slate-900 active:scale-[0.98] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-xl text-white bg-blue-600 rounded-lg shadow-xs hover:bg-blue-500 hover:text-white active:scale-[0.98] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-600">Latest Posts</h1>
          <p className="text-sm text-slate-500 mt-1">
            Recent posts from the blog.
          </p>
        </div>

        {!result.success && (
          <div className="mb-4 rounded-xl border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {result.error}
          </div>
        )}

        {postList?.length === 0 ? (
          <div className="bg-white border-slate-200 rounded-xl p-8 text-center text-slate-500">
            No posts found yet.
          </div>
        ) : (
          <div className="space-y-4">
            {postList?.map((post) => (
              <article
                key={post.id}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
              >
                <h2 className="text-xl font-semibold text-slate-800">
                  {post.title}
                </h2>
                {post.content && (
                  <p className="mt-2 text-slate-600 line-clamp-3">
                    {post.content}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}