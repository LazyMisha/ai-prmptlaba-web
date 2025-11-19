import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
import './globals.css'

export const metadata = {
  title: 'AI Prompt Laba',
  description: 'Professional prompt creation and management tool.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
