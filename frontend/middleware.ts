import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // 1. SI ENTRA A LA RAÍZ PELADA (/) 
  if (pathname === '/') {
    // Si tiene token va al catálogo, si no, al login directo
    const targetUrl = token ? '/vehicles' : '/login';
    return NextResponse.redirect(new URL(targetUrl, request.url));
  }

  // 2. SI NO HAY TOKEN y quiere entrar al catálogo (/vehicles) -> al login
  if (!token && pathname.startsWith('/vehicles')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. SI YA TIENE TOKEN e intenta ir al login -> al catálogo
  if (token && pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/vehicles', request.url));
  }

  return NextResponse.next();
}

// Agregamos la raíz '/' al matcher para que el middleware la intercepte
export const config = {
  matcher: ['/', '/vehicles/:path*', '/login'],
};