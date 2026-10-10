'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { signUp, type SignUpState } from './actions';

const initialState: SignUpState = {
  message: '',
  errors: {},
};

export default function SignUpPage() {
  const [state, formAction, pending] = useActionState(
    signUp,
    initialState,
  );

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <div className="rounded-lg border p-6">
        <h1 className="mb-2 text-3xl font-bold">Create an Account</h1>

        <p className="mb-6 text-gray-600">
          Sign up to manage your clients and insurance policies.
        </p>

        <form action={formAction} className="space-y-6">
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

            {state.errors?.email && (
              <p className="mt-1 text-sm text-red-600">
                {state.errors.email[0]}
              </p>
            )}
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
              minLength={6}
              className="w-full rounded-md border px-3 py-2"
              placeholder="At least 6 characters"
            />

            {state.errors?.password && (
              <p className="mt-1 text-sm text-red-600">
                {state.errors.password[0]}
              </p>
            )}
          </div>

          {state.message && (
            <p
              className="text-sm text-red-600"
              aria-live="polite"
            >
              {state.message}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-md border px-4 py-2 font-medium"
          >
            {pending ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            href="/sign-in"
            className="font-medium underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}