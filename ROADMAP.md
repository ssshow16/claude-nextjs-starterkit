# Roadmap

> NotionQuote — Share Notion-based quotes with clients via unique URLs, with PDF download, no login required.

## Overview

NotionQuote is a lightweight web viewer that bridges Notion-managed quotes and external clients. Internal users (freelancers, agencies, B2B sales) share a unique URL derived from a Notion page ID; clients open it in any browser without a Notion account and can download a PDF. The roadmap is structured into three phases: MVP foundation, polish and reliability, and future enhancements.

---

## Assumptions

- The Notion page ID is used directly as the URL token (MVP approach). A separate token-mapping table is explicitly deferred.
- Quote line items are stored as Notion Rich Text or a table block for MVP. A relational sub-database for items is a post-MVP consideration.
- No authentication layer is implemented for MVP; all quote URLs are publicly accessible to anyone with the link.
- Time estimates assume a single developer working part-time (~4–6 hours/day).

---

## Phases

### Phase 1: Foundation & MVP — Week 1–2

**Goal**: Deliver a fully working end-to-end flow — Notion page ID in the URL, quote rendered in the browser, PDF downloadable — with proper error and loading states.

#### Features

- [ ] **Type definitions** (`src/types/quote.ts`) — Define `QuoteData`, `QuoteItem`, `QuoteStatus`, and `ApiErrorResponse` interfaces
- [ ] **Notion utility module** (`src/lib/notion.ts`) — Initialize `@notionhq/client`, expose a `getQuote(pageId)` helper that maps Notion properties to `QuoteData`
- [ ] **Route Handler** (`src/app/api/quote/[token]/route.ts`) — `GET /api/quote/[token]` with 404/500 error handling; `NOTION_API_KEY` server-side only (no `NEXT_PUBLIC_` prefix)
- [ ] **Quote page** (`src/app/quote/[token]/page.tsx`) — Server Component; calls Route Handler with `revalidate: 60`; passes `QuoteData` to `QuoteView`
- [ ] **QuoteView component** (`src/components/quote/QuoteView.tsx`) — Server Component; renders all required fields (title, client name, issue date, expiry date, manager, status badge, line items table, total)
- [ ] **PDF download button** (`src/components/quote/PdfDownloadButton.tsx`) — Client Component; dynamically imports `html2canvas` + `jspdf`; loading state with Lucide `Loader2`; file name `견적서_[clientName]_[YYYYMMDD].pdf`
- [ ] **Loading skeleton** (`src/app/quote/[token]/loading.tsx`) — Skeleton UI matching the QuoteView layout
- [ ] **Not-found page** (`src/app/quote/[token]/not-found.tsx`) — Friendly 404 for invalid/deleted tokens
- [ ] **Error page** (`src/app/quote/[token]/error.tsx`) — Client Component; handles Notion API errors with retry guidance
- [ ] **Environment variables** — Document `.env.local` requirements (`NOTION_API_KEY`, `NOTION_DATABASE_ID`, `NEXT_PUBLIC_BASE_URL`)
- [ ] **Dependency installation** — `@notionhq/client`, `html2canvas`, `jspdf`

#### Milestones

- `GET /api/quote/[token]` returns correct `QuoteData` for a valid Notion page ID
- Quote page renders all required fields from a live Notion database
- PDF download produces a correctly named file matching the on-screen layout
- All error states (404, 500, PDF failure toast) are reachable and display user-friendly messages

---

### Phase 2: Reliability & UX Polish — Week 3

**Goal**: Harden the MVP for real-world usage — improve visual quality of the quote view, strengthen error handling, ensure responsive layout, and validate the PDF output against a print-ready standard.

#### Features

- [ ] **Responsive layout** — Ensure quote view and PDF output are readable on mobile and tablet viewports
- [ ] **Status badge styling** — Visually distinct colors per `QuoteStatus` value (`초안`, `발송됨`, `승인됨`, `거절됨`, `만료됨`)
- [ ] **Number formatting** — Korean currency formatting (e.g., `5,500,000원`) for `totalAmount` and line item prices
- [ ] **Date formatting** — Human-readable Korean date output (e.g., `2026년 4월 2일`) for issue and expiry dates
- [ ] **PDF print fidelity** — Verify A4 sizing, Korean font rendering, and multi-page overflow in `jsPDF`; fix any layout clipping ⚠️
- [ ] **Memo field display** — Conditionally render the optional `memo` field when present
- [ ] **Environment variable validation** — Fail fast with a clear server-side error log when `NOTION_API_KEY` or `NOTION_DATABASE_ID` is missing at startup
- [ ] **`revalidate` tuning** — Expose `revalidate` as a configurable constant; document trade-off between `60` (cached) and `0` (real-time)
- [ ] **Accessibility** — Semantic HTML table for line items, proper heading hierarchy, sufficient color contrast for status badges

#### Milestones

- Quote view passes a manual review on Chrome, Safari, and a mobile browser
- PDF output is accepted as a valid business document (Korean characters render correctly, no clipping)
- All edge cases from the PRD (invalid token, deleted page, missing env vars, PDF generation failure) are covered with automated or manual test runs

---

### Phase 3: Enhancements — Week 4+

**Goal**: Add features that increase trust and utility without expanding the core Notion-dependency model.

#### Features

- [ ] **View notification** — Notify the internal user (via email or webhook) when a client opens a quote URL ⚠️ (requires external service or serverless function)
- [ ] **Password-protected URLs** — Optional PIN or password gate for sensitive quotes ⚠️ (requires session or cookie handling)
- [ ] **Custom branding** — Allow internal users to set a logo URL and accent color via Notion properties; apply to quote view and PDF
- [ ] **Client response buttons** — "Approve" / "Reject" buttons on the quote page that write back to Notion via the API ⚠️ (requires Notion write permissions and state management)
- [ ] **Open Graph / meta tags** — Social preview when the quote URL is shared in messaging apps (title, description, thumbnail)
- [ ] **Print stylesheet** — `@media print` CSS as a lightweight alternative to the `html2canvas` + `jspdf` approach

---

### Phase 4: Future / Icebox

**Goal**: Long-term architectural improvements that reduce Notion dependency or add enterprise-grade features.

#### Features

- [ ] **Self-hosted database** — Replace direct Notion page ID tokens with a mapping table (own DB); enables token revocation, access logging, and analytics
- [ ] **Quote analytics dashboard** — Track view counts, unique visitors, and download rates per quote (requires own DB)
- [ ] **Multi-quote comparison** — Allow a client to compare multiple quote versions side-by-side
- [ ] **Electronic signature** — Legal e-sign flow on the quote page (requires legal review and a signing service integration)
- [ ] **i18n support** — Multi-language quote output for international clients
- [ ] **Mobile app** — Native iOS/Android wrapper if web responsive coverage proves insufficient

---

## Success Metrics

| Metric | Target | Phase to Achieve |
|--------|--------|-----------------|
| Quote URL view success rate (valid token) | >= 95% | Phase 1 |
| PDF download success rate | >= 90% | Phase 1–2 |
| Page initial load time (TTFB incl. Notion API) | <= 3 seconds | Phase 1–2 |
| User-friendly error display rate for all error cases | 100% | Phase 1 |

---

## Risks & Dependencies

| Risk | Impact | Mitigation |
|------|--------|------------|
| Notion API rate limiting under high traffic | High — quote views fail | Add `revalidate: 60` caching; consider ISR |
| Korean font not embedded in jsPDF output | Medium — PDF shows garbled characters | Test early with a Korean-named client; use `jspdf` font embedding or a server-side PDF renderer as fallback ⚠️ |
| `html2canvas` fails to capture CSS variables / Tailwind v4 tokens | Medium — PDF layout broken | Test PDF rendering in Phase 1; have a `@media print` CSS fallback ready |
| Notion page ID exposed in URL | Low — read-only access; no write risk | Acceptable for MVP; Phase 4 introduces token mapping if confidentiality is required |
| `NOTION_API_KEY` leaked to client bundle | Critical — key exposure | Enforce no `NEXT_PUBLIC_` prefix; code review gate |
| Notion service outage | Medium — all quotes unavailable | Cache responses; show `error.tsx` with retry guidance |

---

## Out of Scope (MVP)

The following are explicitly excluded from Phase 1 and 2 per the PRD:

- Quote creation, editing, or deletion UI (managed entirely in Notion)
- User authentication or login for clients
- Quote list or internal dashboard
- View tracking / analytics
- Email sending integration
- i18n / multi-language support
- Native mobile app
- Custom domain or white-label branding
- Electronic signature
