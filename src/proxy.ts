import NextAuth from 'next-auth';
import { authConfig } from '../auth.config';

const { auth: proxy } = NextAuth(authConfig);

export { proxy };

export const config = {
  matcher: ['/', '/dashboard/:path*', '/client/:path*', '/clients/:path*', '/policies/:path*', '/renewals/:path*', '/carriers/:path*'],
};
