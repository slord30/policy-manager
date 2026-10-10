import { signOut } from '@/auth';

export default function SignOutButton() {
  return (
    <form
      action={async () => {
        'use server';

        await signOut({
          redirectTo: '/sign-in',
        });
      }}
    >
      <button
        type="submit"
        className="rounded-md border px-4 py-2 font-medium"
      >
        Sign Out
      </button>
    </form>
  );
}