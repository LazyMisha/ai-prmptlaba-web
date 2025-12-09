import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import { cn } from '@/lib/utils'

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
}

/**
 * Shared page layout component with Header and Footer.
 * Used by route group layouts to provide consistent structure.
 */
export function PageLayout({ children, showLogo = false, pageTitle }: PageLayoutProps) {
  return (
    <>
      <Header showLogo={showLogo} pageTitle={pageTitle} />
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
