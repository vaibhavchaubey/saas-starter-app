import { clerkMiddleware, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const publicRoutes = ['/', '/api/webhook/register', '/sign-in', '/sign-up'];

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  console.log({ userId });
  const client = await clerkClient(); // Await the asynchronous clerkClient
  const currentPath = req.nextUrl.pathname;

  // Handle unauthenticated users trying to access protected routes
  if (!userId && !publicRoutes.includes(currentPath)) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  if (userId) {
    try {
      const user = await client.users.getUser(userId); // Fetch user data using the async client
      console.log({ user });
      const role = user.publicMetadata.role as string | undefined;

      // Admin role redirection logic
      if (role === 'admin' && currentPath === '/dashboard') {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      }

      // Prevent non-admin users from accessing admin routes
      if (role !== 'admin' && currentPath.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      // Redirect authenticated users trying to access public routes
      if (publicRoutes.includes(currentPath)) {
        return NextResponse.redirect(
          new URL(role === 'admin' ? '/admin/dashboard' : '/dashboard', req.url)
        );
      }
    } catch (error) {
      console.error('Error fetching user data from Clerk:', error);
      return NextResponse.redirect(new URL('/error', req.url));
    }
  }
});
