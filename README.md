# Purebook — Developer Onboarding Guide

## Overview

Purebook is a salon booking and management application. This guide gets a developer from zero to a running local environment.

**Stack:**
- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL 16 via Prisma ORM
- **Frontend:** React 18, Tailwind CSS, React Query, Zustand
- **Auth:** NextAuth v5 (JWT sessions)
- **Payments:** Stripe (Year 1 salon's own Stripe account)
- **SMS:** Twilio
- **Email:** Resend
- **File storage:** Cloudflare R2
- **Hosting:** Railway
- **CI/CD:** GitHub Actions

---

## Quick start

```bash
# 1. Clone the repo
git clone https://github.com/hanch-collab/purebook.git
cd purebook

# 2. Run the setup script
bash setup.sh

# 3. Create a local Postgres database
createdb purebook_dev

# 4. Copy and configure environment
cp apps/web/.env.example apps/web/.env.local

# 5. Push schema and seed
npm run db:push
npm run db:seed

# 6. Start dev server
npm run dev
```

Demo login: `owner@purebook.dev` / `purebook2024!`
