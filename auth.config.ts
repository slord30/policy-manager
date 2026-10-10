import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/sign-in',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;
      const isOnProtectedRoute =
        pathname === '/' ||
        ['/dashboard', '/client', '/clients', '/policies', '/renewals', '/carriers'].some(
          (route) => pathname === route || pathname.startsWith(`${route}/`),
        );

      if (isOnProtectedRoute) {
        return isLoggedIn;
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
