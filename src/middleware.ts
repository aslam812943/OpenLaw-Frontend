import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


function getRoleFromToken(token: string): string | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload).role;
  } catch (error) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken')?.value;
  const role = accessToken ? getRoleFromToken(accessToken) : null;


  const authRoutes = ['/login', '/sign-up', '/forgotPassword'];

  
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!accessToken) return NextResponse.redirect(new URL('/admin/login', request.url));
  }


  if (pathname.startsWith('/lawyer') && !pathname.startsWith('/lawyers')) {
    if (!accessToken || role !== 'lawyer') return NextResponse.redirect(new URL('/login', request.url));
  }

  
  if (pathname.startsWith('/user')) {
    if (!accessToken || role !== 'user') return NextResponse.redirect(new URL('/login', request.url));
  }

  
  if (pathname.startsWith('/video-call')) {
    if (!accessToken) return NextResponse.redirect(new URL('/login', request.url));
  }

  
  if (authRoutes.includes(pathname)) {
    // if (accessToken) return NextResponse.redirect(new URL('/admin/dashboard', request.url));

    if (accessToken && role === 'lawyer') {
      return NextResponse.redirect(new URL('/lawyer/dashboard', request.url));
    }
    if (accessToken && role === 'user') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  if (pathname === '/admin/login' && accessToken) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
