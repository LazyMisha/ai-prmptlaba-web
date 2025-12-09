import { PageLayout } from '@/components/common/PageLayout'

/**
 * Layout for the home page.
 * Uses default Header with brand name text.
 */
export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <PageLayout>{children}</PageLayout>
}
