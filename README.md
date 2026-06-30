# Purebook — Developer Onboarding Guide

## Overview

Purebook is a salon booking and management application. This guide gets a developer from zero to a running local environment.

**Stack:**
- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL 16 via Prisma ORM
- **Frontend:** React 18, Tailwind CSS, React Query, Zustand
- **Auth:** NextAuth v5 (JWT sessions)
- **Payments:** Stripe (Year 1 — salon's own Stripe account)
- **SMS:** Twilio
- **Email:** Resend
- **File storage:** Cloudflare R2
- **Hosting:** Railway
- **CI/CD:** GitHub Actions

---

## Prerequisites

- Node.js 20+
- PostgreSQL 16 (local or via Railway / Docker)
- Git