import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import { cn } from '@/lib/utils'
import './globals.css'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Prompt Laba',
  description: 'Professional prompt creation and management tool.',
}

/**
 * Root layout with clean structure.
 * Features smooth transitions and elegant spacing.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={cn(
          // Flexbox column layout
          'flex',
          'flex-col',
          // Full viewport height
          'min-h-screen',
          // White background
          'bg-white',
          // Antialiased text rendering
          'antialiased',
        )}
      >
        <Header />
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
      </body>
    </html>
  )
}
