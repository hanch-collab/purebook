// ============================================================
// apps/web/src/app/layout.tsx
// Root layout — providers, fonts, global styles
// ============================================================

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster position="bottom-right" richColors />
        </Providers>
      </body>
    </html>
  )
}

// ============================================================
// apps/web/src/app/globals.css
// ============================================================

/*
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --pb-bg: #EDEAE3;
  --pb-surface: #FFFFFF;
  --pb-surface-1: #F4F2EE;
  --pb-border: #E4DFD8;
  --pb-border-strong: #DDD8D0;
  --pb-text: #0E0E0C;
  --pb-text-secondary: #6A6560;
  --pb-text-muted: #9A9690;
  --pb-gold: #C9A84C;
}

body {
  background-color: var(--pb-bg);
  color: var(--pb-text);
}

* {
  box-sizing: border-box;
}
*/

// ============================================================
// apps/web/src/app/(auth)/login/page.tsx
// ============================================================

/*
'use client'

import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      toast.error('Invalid email or password')
      return
    }

    router.push('/calendar')
  }

  return (
    <div className="min-h-screen bg-pb-bg flex items-center justify-center p-4">
      <div className="bg-white rounded-pb-lg border border-pb-border shadow-pb-card w-full max-w-sm p-8">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-pb-text">Purebook</h1>
          <p className="text-sm text-pb-text-secondary mt-1">Sign in to your salon</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-pb-text-muted mb-1.5">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-3 py-2 text-sm bg-pb-surface-1 border border-pb-border rounded-pb text-pb-text placeholder:text-pb-text-muted focus:outline-none focus:border-pb-gold transition-colors"
              placeholder="hello@yoursalon.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-pb-danger">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-pb-text-muted mb-1.5">
              Password
            </label>
            <input
              {...register('password')}
              type="password"
              className="w-full px-3 py-2 text-sm bg-pb-surface-1 border border-pb-border rounded-pb text-pb-text placeholder:text-pb-text-muted focus:outline-none focus:border-pb-gold transition-colors"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-pb-danger">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-pb-text text-pb-gold text-sm font-medium rounded-pb hover:bg-pb-text/90 transition-colors disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
*/

// ============================================================
// apps/web/src/app/(dashboard)/calendar/page.tsx
// ============================================================

/*
import { Suspense } from 'react'
import { CalendarDayView } from '@/components/calendar/CalendarDayView'
import { NowView } from '@/components/calendar/NowView'
import { CalendarSkeleton } from '@/components/calendar/CalendarSkeleton'

export default function CalendarPage({
  searchParams,
}: {
  searchParams: { view?: string; date?: string }
}) {
  const view = searchParams.view ?? 'day'
  const date = searchParams.date ?? new Date().toISOString().split('T')[0]

  return (
    <Suspense fallback={<CalendarSkeleton />}>
      {view === 'now' ? (
        <NowView />
      ) : (
        <CalendarDayView date={date} />
      )}
    </Suspense>
  )
}
*/

// ============================================================
// apps/web/src/app/(dashboard)/analytics/page.tsx
// ============================================================

/*
import { AnalyticsHome } from '@/components/analytics/AnalyticsHome'
import { getDailyBriefing } from '@/lib/analytics'

export default async function AnalyticsPage() {
  // Server component — data fetched before render
  const briefing = await getDailyBriefing()

  return <AnalyticsHome briefing={briefing} />
}
*/

// NOTE: The actual .tsx files should be created in your project
// from these templates. This file serves as the scaffolding guide.

export {}
