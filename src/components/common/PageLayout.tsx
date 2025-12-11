import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import { cn } from '@/lib/utils'
import type { Locale } from '@/i18n/locales'

/**
 * Props for the PageLayout component.
 */
interface PageLayoutProps {
  /** Page content */
  children: React.ReactNode
  /** Whether to show logo in header instead of brand name */
  showLogo?: boolean
  /** Page title to display in header center */
  pageTitle?: string
  /** Current locale for navigation */
  locale: Locale
}

/**
 * Shared page layout component with Header and Footer.
 * Used by route group layouts to provide consistent structure.
 */
export function PageLayout({ children, showLogo = false, pageTitle, locale }: PageLayoutProps) {
  return (
    <>
      <Header showLogo={showLogo} pageTitle={pageTitle} locale={locale} />
      <main
        className={cn(
          // Full width
          'w-full',
          // Grow to fill available space
          'flex-grow',
          // Smooth content transitions
          'transition-opacity',
          'duration-300',
        )}
      >
        {children}
      </main>
      <Footer />
    </>
  )
}
