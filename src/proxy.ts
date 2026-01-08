import { NextResponse, type NextRequest } from 'next/server'
import { locales, defaultLocale, type Locale } from '@/i18n/locales'

/**
 * Proxy to handle locale detection and redirection.
 * Redirects users to their preferred locale based on:
 * 1. Previously selected locale (stored in cookie)
 * 2. Browser's Accept-Language header
 * 3. Default locale (en)
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if pathname already has a locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // Preserve search params for redirects
  const search = request.nextUrl.search

  // Get locale from cookie (user's previous selection)
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value as
    | Locale
    | undefined
  if (cookieLocale && locales.includes(cookieLocale)) {
    return NextResponse.redirect(
      new URL(`/${cookieLocale}${pathname}${search}`, request.url),
    )
  }

  // Detect locale from Accept-Language header
  const acceptLanguage = request.headers.get('Accept-Language')
  let detectedLocale: Locale = defaultLocale

  if (acceptLanguage) {
    // Parse Accept-Language header
    const preferredLocales = acceptLanguage
      .split(',')
      .map((lang) => {
        const [code, priority = 'q=1'] = lang.trim().split(';')
        const q = parseFloat(priority.replace('q=', '')) || 1
        const languageCode = code?.split('-')[0]?.toLowerCase() ?? ''

        return { code: languageCode, q }
      })
      .sort((a, b) => b.q - a.q)

    // Find first matching locale
    for (const { code } of preferredLocales) {
      if (code && locales.includes(code as Locale)) {
        detectedLocale = code as Locale

        break
      }
    }
  }

  // Redirect to detected locale with search params preserved
  return NextResponse.redirect(
    new URL(`/${detectedLocale}${pathname}${search}`, request.url),
  )
}

export const config = {
  // Match all paths except:
  // - API routes
  // - Static files (_next, favicon, images, etc.)
  // - Public files
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
