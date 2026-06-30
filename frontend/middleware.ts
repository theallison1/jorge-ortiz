import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Intentamos leer el token de las cookies
  const token = request.cookies.get('token')?.value;
  
  const { pathname } = request.nextUrl;

  // 2. Si el usuario intenta entrar a rutas del sistema PERO NO tiene token, lo rebotamos al login
  const rutasPrivadas = ['/dashboard', '/vehicles', '/clients', '/sales', '/settings'];
  
  const esRutaPrivada = rutasPrivadas.some(ruta => pathname.startsWith(ruta));

  if (esRutaPrivada && !token) {
    // Si no hay token en la cookie, lo mandamos al login de prepo
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Si tiene token e intenta ir al login, lo mandamos directo al dashboard para que no se vuelva a loguear
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configuración para que el middleware se ejecute en tus rutas privadas y en el login
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/vehicles/:path*',
    '/clients/:path*',
    '/sales/:path*',
    '/settings/:path*',
    '/login'
  ],
};