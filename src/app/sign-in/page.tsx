import Link from 'next/link';
import { signIn } from '@/auth';

export default function SignInPage() {
  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <div className="rounded-lg border p-6">
        <h1 className="mb-2 text-3xl font-bold">Sign In</h1>

        <p className="mb-6 text-gray-600">
          Sign in to manage your clients and insurance policies.
        </p>

        <form
          action={async (formData) => {
            'use server';

            await signIn('credentials', {
              email: formData.get('email'),
              password: formData.get('password'),
              redirectTo: '/clients',
            });
          }}
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-2 block font-medium"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-md border px-3 py-2"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block font-medium"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md border px-4 py-2 font-medium"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            href="/sign-up"
            className="font-medium underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}