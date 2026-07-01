import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Purebook — Salon Management',
  description: 'Modern salon booking and management software',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
