import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['tr', 'en'];
const defaultLocale = 'tr';

export function middleware(request: NextRequest) {
  // Gelen isteğin yolunu al
  const pathname = request.nextUrl.pathname;

  // Yolun başında zaten bir locale olup olmadığını kontrol et (örn. /tr/..., /en/...)
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Eğer locale eksikse ve yol sadece '/' ise varsayılan locale'e yönlendir
  if (pathnameIsMissingLocale && pathname === '/') {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname}`, request.url)
    );
  }

  // Başka bir durum yoksa isteğe devam et
  return NextResponse.next();
}

// Middleware'in hangi yollarda çalışacağını belirtir
export const config = {
  matcher: [
    // Locale kontrolü gerektirmeyen yolları hariç tut:
    // - API rotaları (_next/static, _next/image, api/, favicon.ico)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 