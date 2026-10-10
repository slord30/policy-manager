import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Create Account | PolicyManager',
  description: 'Create an account to manage your clients and policies.',
};

export default function SignUpLayout({ children }: { children: ReactNode }) {
  return children;
}
