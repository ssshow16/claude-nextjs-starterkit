# Claude Next.js Starter Kit

Claude Code와 함께 빠르게 시작할 수 있는 Next.js 스타터 킷입니다.

## 기술 스택

| 기술 | 버전 | 설명 |
|------|------|------|
| **Next.js** | 16.2.2 | App Router, Server Components 기본 |
| **React** | 19 | 최신 React, `"use client"` 최소화 |
| **TypeScript** | 5 | strict mode, `@/*` → `./src/*` 경로 별칭 |
| **Tailwind CSS** | v4 | CSS 변수 기반 설정, `tailwind.config.js` 없음 |
| **shadcn/ui** | Nova 스타일 | `@base-ui/react` 기반, RSC 호환 |
| **Lucide React** | - | 아이콘 라이브러리 |

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 결과를 확인하세요.

## 주요 명령어

```bash
npm run dev      # 개발 서버 시작
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 시작
npm run lint     # ESLint 실행
```

## 프로젝트 구조

```
src/
  app/
    layout.tsx      # 루트 레이아웃 — Geist 폰트, Header, 전역 CSS
    page.tsx        # 홈 페이지
    globals.css     # Tailwind v4 엔트리 + CSS 변수 (OKLch)
  components/
    header.tsx      # 스티키 사이트 헤더 (네비게이션 + CTA)
    ui/             # shadcn/ui 생성 컴포넌트
  lib/
    utils.ts        # cn() 헬퍼 (clsx + tailwind-merge)
```

## 테마 & 다크 모드

테마는 `globals.css`의 CSS 변수로 완전히 제어됩니다. 색상을 하드코딩하지 말고 `--primary`, `--background` 등 변수명을 사용하세요.

다크 모드는 `<html>` 요소의 `.dark` 클래스로 전환됩니다.

## shadcn/ui 컴포넌트 추가

```bash
npx shadcn@latest add <component>
```

## Claude Code 설정

이 프로젝트는 Claude Code 에이전트 설정이 포함되어 있습니다. `.claude/` 디렉토리에서 에이전트 구성을 확인하세요.

## 문서

- [`docs/PRD.md`](docs/PRD.md) — Notion 견적서 웹 뷰어 MVP PRD
