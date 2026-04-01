# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test framework is configured.

## Stack

- **Next.js 16.2.2** — App Router, Server Components by default
- **React 19** — Latest; use `"use client"` only when needed
- **TypeScript 5** — Strict mode, path alias `@/*` → `./src/*`
- **Tailwind CSS v4** — CSS-first config; no `tailwind.config.js`. All theme tokens are CSS variables in `src/app/globals.css` using OKLch color space
- **tw-animate-css** — Animation utilities, imported in `globals.css`
- **shadcn/ui** — Base Nova style, built on `@base-ui/react`. RSC-compatible. Add components via `npx shadcn@latest add <component>`
- **Lucide React** — Icon library

## Architecture

`src/app/` uses the App Router layout system. All components are Server Components unless explicitly marked `"use client"`. UI primitives live in `src/components/ui/` (shadcn/ui generated). Shared utilities are in `src/lib/utils.ts` (`cn()` for className merging).

### File Structure

```
src/
  app/
    layout.tsx      # Root layout — Geist fonts, Header, global CSS
    page.tsx        # Home page
    globals.css     # Tailwind v4 entry + CSS variables (OKLch)
  components/
    header.tsx      # Sticky site header with nav and CTA
    ui/             # shadcn/ui generated components
      button.tsx
      card.tsx
      input.tsx
      label.tsx
      navigation-menu.tsx
  lib/
    utils.ts        # cn() helper (clsx + tailwind-merge)
```

### Fonts

Geist Sans and Geist Mono are loaded via `next/font/google` in `layout.tsx` and injected as CSS variables `--font-geist-sans` / `--font-geist-mono`.

### Theme & Dark Mode

Theme (light/dark) is fully driven by CSS variables in `globals.css` — do not hardcode colors; use the variable names (`--primary`, `--background`, etc.).

Dark mode is toggled via the `.dark` class on the `<html>` element — CSS variables are overridden inside the `.dark` selector.

Before writing any Next.js code, consult `node_modules/next/dist/docs/` — this version has breaking API changes from older Next.js.
