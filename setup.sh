#!/usr/bin/env bash
# ============================================================
# Purebook — Project Setup Script
# Run once from an empty directory: bash setup.sh
# Requires: Node.js 20+, npm, git, psql (PostgreSQL CLI)
# ============================================================

set -e

echo ""
echo "Purebook — Project Setup"
echo ""

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "Node.js not found. Install v20+ from https://nodejs.org"; exit 1; }
command -v npm  >/dev/null 2>&1 || { echo "npm not found."; exit 1; }
command -v git  >/dev/null 2>&1 || { echo "git not found."; exit 1; }
NODE_VER=$(node -e "process.stdout.write(process.version.slice(1).split('.')[0])")
if [ "$NODE_VER" -lt 20 ]; then echo "Node.js 20+ required (found v$NODE_VER)"; exit 1; fi
echo "Node.js $(node -v) detected"

git init
echo "Git initialised"

# Root package.json
cat > package.json << 'JSON'
{
  "name": "purebook",
  "version": "0.1.0",
  "private": true,
  "workspaces": ["apps/web", "packages/db"],
  "scripts": {
    "dev":      "npm run dev --workspace=apps/web",
    "build":    "npm run build --workspace=apps/web",
    "db:push":  "npm run db:push --workspace=packages/db",
    "db:seed":  "npm run db:seed --workspace=packages/db",
    "db:studio":"npm run db:studio --workspace=packages/db",
    "test":     "npm run test --workspace=apps/web"
  }
}
JSON

# Directory structure
mkdir -p \
  apps/web/src/app/api \
  apps/web/src/app/\(auth\)/login \
  apps/web/src/app/\(dashboard\)/calendar \
  apps/web/src/app/\(dashboard\)/clients \
  apps/web/src/app/\(dashboard\)/analytics \
  apps/web/src/app/\(dashboard\)/settings \
  apps/web/src/app/\(dashboard\)/inventory \
  apps/web/src/app/\(dashboard\)/promotions \
  apps/web/src/app/\(dashboard\)/waitlist \
  apps/web/src/components/ui \
  apps/web/src/components/calendar \
  apps/web/src/components/appointments \
  apps/web/src/components/clients \
  apps/web/src/components/analytics \
  apps/web/src/components/checkout \
  apps/web/src/lib \
  apps/web/src/hooks \
  apps/web/src/types \
  packages/db/prisma \
  packages/db/src/seed

echo "Directory structure created"

# apps/web package.json
cat > apps/web/package.json << 'JSON'
{
  "name": "@purebook/web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev":   "next dev",
    "build": "next build",
    "start": "next start",
    "test":  "vitest"
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "@purebook/db": "*",
    "@tanstack/react-query": "5.51.1",
    "axios": "1.7.2",
    "date-fns": "3.6.0",
    "clsx": "2.1.1",
    "tailwind-merge": "2.4.0",
    "lucide-react": "0.414.0",
    "stripe": "16.2.0",
    "@stripe/stripe-js": "4.1.0",
    "zustand": "4.5.4",
    "react-hook-form": "7.52.1",
    "zod": "3.23.8",
    "@hookform/resolvers": "3.9.0",
    "sonner": "1.5.0",
    "next-auth": "5.0.0-beta.19"
  },
  "devDependencies": {
    "typescript": "5.5.3",
    "@types/react": "18.3.3",
    "@types/react-dom": "18.3.0",
    "@types/node": "20.14.10",
    "tailwindcss": "3.4.6",
    "autoprefixer": "10.4.19",
    "postcss": "8.4.39",
    "vitest": "2.0.3"
  }
}
JSON

# packages/db package.json
cat > packages/db/package.json << 'JSON'
{
  "name": "@purebook/db",
  "version": "0.1.0",
  "private": true,
  "main": "./src/index.ts",
  "scripts": {
    "db:push":   "prisma db push",
    "db:migrate":"prisma migrate dev",
    "db:seed":   "tsx src/seed/index.ts",
    "db:studio": "prisma studio",
    "generate":  "prisma generate"
  },
  "dependencies": {
    "@prisma/client": "5.16.2"
  },
  "devDependencies": {
    "prisma": "5.16.2",
    "tsx": "4.16.2",
    "typescript": "5.5.3"
  }
}
JSON

# .gitignore
cat > .gitignore << 'IGNORE'
node_modules/
.next/
out/
dist/
.env
.env.local
.env.*.local
packages/db/prisma/*.db
.DS_Store
*.pem
.vercel
coverage/
IGNORE

# .env.example
cat > apps/web/.env.example << 'ENV'
DATABASE_URL="postgresql://user:password@localhost:5432/purebook_dev"
NEXTAUTH_SECRET="32-character-random-string"
NEXTAUTH_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_FROM_NUMBER="+44..."
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="hello@purebook.app"
R2_ACCOUNT_ID="..."
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."
R2_BUCKET_NAME="purebook-uploads"
R2_PUBLIC_URL="https://cdn.purebook.app"
ENV

echo "Config files written"
echo ""
echo "Installing dependencies..."
npm install
cd packages/db && npm install && cd ../..
echo "Dependencies installed"

echo ""
echo "Running prisma generate..."
cd packages/db && npx prisma generate && cd ../..
echo "Prisma client generated"

echo ""
echo "Setup complete!"
echo ""
echo "Next steps:"
echo "  1. createdb purebook_dev"
echo "  2. cp apps/web/.env.example apps/web/.env.local  (then fill in DATABASE_URL)"
echo "  3. npm run db:push"
echo "  4. npm run db:seed"
echo "  5. npm run dev"
echo ""