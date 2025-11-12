import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_EMAIL = 'cleopatrathequeenofcats@gmail.com'

export function middleware(req: NextRequest) {
  // Только для маршрутов /admin/blog
  if (req.nextUrl.pathname === '/admin/blog') {
    // На клиенте будет проверка через useEffect в page.tsx
    // Middleware здесь просто пропускает запрос
    // Вся проверка будет происходить на странице через Supabase auth
    return NextResponse.next()
  }

  // Блокируем все остальные админ маршруты
  if (req.nextUrl.pathname.startsWith('/admin/')) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}