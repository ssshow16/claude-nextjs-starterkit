# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
```

No test framework is configured.

## Stack

- **Next.js 16** — App Router, Server Components by default
- **React 19** — Latest; use `"use client"` only when needed
- **TypeScript 5** — Strict mode, path alias `@/*` → `./src/*`
- **Tailwind CSS v4** — CSS-first config; no `tailwind.config.js`. All theme tokens are CSS variables in `src/app/globals.css` using OKLch color space
- **shadcn/ui** — Base Nova style, RSC-compatible. Add components via `npx shadcn@latest add <component>`
- **Lucide React** — Icon library

## Architecture

`src/app/` uses the App Router layout system. All components are Server Components unless explicitly marked `"use client"`. UI primitives live in `src/components/ui/` (shadcn/ui generated). Shared utilities are in `src/lib/utils.ts` (`cn()` for className merging).

Theme (light/dark) is fully driven by CSS variables in `globals.css` — do not hardcode colors; use the variable names (`--primary`, `--background`, etc.).

Before writing any Next.js code, consult `node_modules/next/dist/docs/` — this version has breaking API changes from older Next.js.
