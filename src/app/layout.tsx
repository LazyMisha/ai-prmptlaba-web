import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Prompt Laba',
  description: 'Professional prompt creation and management tool.',
  icons: {
    icon: '/icon.svg',
  },
}

/**
 * Root layout.
 * This is a minimal pass-through layout.
 * The [lang]/layout.tsx handles html/body with proper lang attribute.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
