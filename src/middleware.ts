import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const adminToken = request.cookies.get('adminAccessToken')?.value;
  const lawyerToken = request.cookies.get('lawyerAccessToken')?.value;
  const userToken = request.cookies.get('userAccessToken')?.value;

 
  const authRoutes = ['/login', '/sign-up', '/admin/login', '/forgotPassword'];

  // --- Protect Admin routes ----
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!adminToken) return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // --- Protect Lawyer routes ----
  if (pathname.startsWith('/lawyer') && !pathname.startsWith('/lawyers')) {
    if (!lawyerToken) return NextResponse.redirect(new URL('/login', request.url));

 
  }

  // --- Protect User routes ----
  if (pathname.startsWith('/user')) {
    if (!userToken) return NextResponse.redirect(new URL('/login', request.url));


  }

  // --- Prevent Logged In Users From Seeing Login Page ---
  if (authRoutes.includes(pathname)) {
    if (adminToken) return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    if (lawyerToken) return NextResponse.redirect(new URL('/lawyer/dashboard', request.url));
    if (userToken) return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
