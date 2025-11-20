import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import { cn } from '@/lib/utils'
import './globals.css'

export const metadata = {
  title: 'AI Prompt Laba',
  description: 'Professional prompt creation and management tool.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={cn(
          // Flexbox column layout
          'flex',
          'flex-col',
          // Full viewport height
          'min-h-screen',
        )}
      >
        <Header />
        <main
          className={cn(
            // full width
            'w-full',
            // Grow to fill available space
            'flex-grow',
          )}
        >
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
