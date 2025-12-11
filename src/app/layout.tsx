import { ToastContainer } from '@/components/common/Toast'
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
 * Language-specific layouts handle Header rendering.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html data-scroll-behavior="smooth" suppressHydrationWarning>
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
        {children}
        <ToastContainer />
      </body>
    </html>
  )
}
