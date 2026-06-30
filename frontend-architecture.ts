// ============================================================
// Purebook — Frontend Component Architecture
// Framework: Next.js 14 App Router + React 18 + Tailwind CSS
//
// Component conventions:
//   - Server components by default (no 'use client' unless needed)
//   - 'use client' only for: interactivity, hooks, browser APIs
//   - Data fetching in server components or React Query
//   - Forms via react-hook-form + zod validation
//   - State management via Zustand (global) + React state (local)
// ============================================================