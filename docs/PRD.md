# MVP PRD: Notion 견적서 웹 뷰어

> 작성일: 2026-04-02  
> 버전: 1.0.0  
> 상태: Draft

---

## 섹션 1: 제품 개요

### 제품명 및 한 줄 설명

**NotionQuote** — 노션(Notion)에서 작성한 견적서를 클라이언트가 고유 URL로 웹에서 조회하고 PDF로 다운로드할 수 있는 서비스

### 해결하는 문제 (Pain Point)

| 문제 | 현재 방식 | 해결 방향 |
|------|----------|----------|
| 견적서 공유가 번거롭다 | 매번 PDF 내보내기 → 이메일 첨부 | URL 하나로 즉시 공유 |
| 견적서 버전 불일치 | 수정 시 재발송 필요 | 노션 원본 수정 → 자동 반영 |
| 클라이언트 접근 장벽 | 노션 계정 필요 | 로그인 없이 URL로 바로 열람 |
| PDF 생성 반복 작업 | 수동으로 매번 생성 | 클라이언트가 직접 다운로드 |

### 타겟 사용자

**담당자 (Internal User)**
- 노션을 업무 도구로 사용하는 프리랜서, 에이전시, B2B 영업 담당자
- 견적서를 노션 DB에서 관리하고 싶은 사람
- 별도 견적 솔루션 없이 기존 워크플로우를 유지하고 싶은 사람

**클라이언트 (External User)**
- 견적서를 받아보는 고객사 담당자
- 노션 계정이 없는 비기술 사용자
- 웹 브라우저만으로 견적 내용을 확인하고 저장하고 싶은 사람

### MVP 성공 기준 (측정 가능한 지표)

| 지표 | 목표값 | 측정 방법 |
|------|--------|----------|
| 견적서 URL 공유 후 열람 성공률 | ≥ 95% | 유효 토큰 요청 대비 성공 응답 비율 |
| PDF 다운로드 성공률 | ≥ 90% | 버튼 클릭 대비 파일 생성 완료 비율 |
| 페이지 초기 로딩 시간 | ≤ 3초 | Notion API 응답 포함 TTFB |
| Notion API 에러 응답 시 사용자 친화적 에러 노출 | 100% | 에러 케이스별 UI 표시 여부 |

---

## 섹션 2: 사용자 시나리오 (User Story)

### 담당자 시나리오

```
1. 담당자가 노션 견적서 DB에 새 페이지(견적서)를 생성한다.
2. 필드(클라이언트명, 항목, 금액 등)를 입력한다.
3. 해당 노션 페이지 ID를 복사한다.
4. 서비스 URL 패턴으로 공유 URL을 생성한다:
   https://[도메인]/quote/[notionPageId]
5. 해당 URL을 클라이언트에게 이메일/메신저로 전달한다.
6. 노션에서 내용을 수정하면 클라이언트가 URL 재접속 시 자동 반영된다.
```

### 클라이언트 시나리오

```
1. 담당자로부터 받은 URL(예: /quote/abc123)에 접속한다.
2. 로그인 없이 견적서 내용을 웹에서 확인한다.
3. "PDF 다운로드" 버튼을 클릭한다.
4. 견적서_[회사명]_[날짜].pdf 파일이 자동 다운로드된다.
5. 다운로드한 PDF를 내부 결재에 활용한다.
```

### 엣지 케이스

| 케이스 | 트리거 | 처리 방식 |
|--------|--------|----------|
| 잘못된 토큰 | 존재하지 않는 페이지 ID | `not-found.tsx` 렌더링, 404 응답 |
| 노션 API 오류 | Notion 서버 장애, 키 만료 | `error.tsx` 렌더링, 재시도 안내 |
| 삭제된 견적서 | 노션 페이지 삭제됨 | `not-found.tsx` 렌더링, 404 응답 |
| Notion API 키 미설정 | 환경 변수 누락 | 서버 에러 로그 + 500 응답 |
| PDF 생성 실패 | html2canvas 렌더링 오류 | 에러 토스트 메시지 표시 |

---

## 섹션 3: 기능 명세

### 3-1. Notion API 연동

**연동 방식**
- Next.js Server Component에서 `@notionhq/client` 공식 SDK 사용
- API 키는 서버 사이드에서만 사용 (클라이언트에 노출 금지)
- Route Handler(`src/app/api/quote/[token]/route.ts`)에서 Notion 호출 담당

**조회 대상**
- Notion Database: 견적서 DB (DATABASE_ID 환경 변수로 관리)
- 조회 방식: 페이지 ID(= 토큰)로 단일 페이지 직접 조회

**캐싱 전략**

```typescript
// Server Component에서 fetch 시 revalidate 설정
const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/quote/${token}`, {
  next: { revalidate: 60 } // 60초 캐싱 (견적서는 자주 변경되지 않음)
});
```

> 추천값: `revalidate: 60` (1분)  
> 실시간성이 필요하면 `revalidate: 0` (no-cache) 사용

**에러 처리**

| 에러 유형 | HTTP 상태 | 처리 방식 |
|----------|----------|----------|
| API 키 누락 (`NOTION_API_KEY` 미설정) | 500 | 서버 로그 + 500 JSON 응답 |
| DB ID 누락 (`NOTION_DATABASE_ID` 미설정) | 500 | 서버 로그 + 500 JSON 응답 |
| 페이지 없음 (APIResponseError 404) | 404 | 404 JSON 응답 |
| 기타 Notion API 오류 | 500 | 500 JSON 응답 |

---

### 3-2. 견적서 웹 뷰

**라우트**: `src/app/quote/[token]/page.tsx`

**렌더링 방식**
- Server Component (기본)
- URL의 `[token]` 파라미터 = Notion 페이지 ID
- `/api/quote/[token]` Route Handler 호출 → Notion 페이지 데이터 수신

**표시할 견적서 필드 (최소 요건)**

| 필드명 | Notion 타입 | 표시 위치 |
|--------|------------|----------|
| 제목 (견적서명) | Title | 헤더 최상단 |
| 클라이언트명 | Rich Text | 수신처 정보 |
| 발행일 | Date | 견적서 메타 정보 |
| 유효기간 | Date | 견적서 메타 정보 |
| 담당자 | Rich Text | 발신처 정보 |
| 상태 | Select | 배지(Badge)로 표시 |
| 항목 목록 | 하위 항목 DB 또는 Rich Text | 견적 테이블 |
| 총액 | Number | 견적 테이블 하단 합계 |

**로딩 상태**: `src/app/quote/[token]/loading.tsx` — 스켈레톤 UI

**에러 상태**
- `src/app/quote/[token]/not-found.tsx` — 잘못된 토큰 or 삭제된 견적서
- `src/app/quote/[token]/error.tsx` — Notion API 오류 등 서버 에러

---

### 3-3. PDF 다운로드

**트리거**: "PDF 다운로드" 버튼 클릭 (`"use client"` 컴포넌트)

**동작 흐름**

```
1. 버튼 클릭 → isLoading = true (버튼 비활성화 + 로딩 스피너)
2. html2canvas로 #quote-content DOM 영역 캡처
3. 캡처 이미지를 jsPDF A4 크기로 변환
4. 파일명: 견적서_[클라이언트명]_[발행일 YYYYMMDD].pdf
5. 자동 다운로드 트리거
6. isLoading = false
```

**파일명 규칙**

```typescript
const fileName = `견적서_${clientName}_${format(issueDate, 'yyyyMMdd')}.pdf`;
// 예: 견적서_ACME주식회사_20260402.pdf
```

**다운로드 중 로딩 상태 처리**
- 버튼 텍스트: "PDF 다운로드" → "생성 중..."
- 버튼 비활성화 (`disabled`)
- 로딩 스피너 아이콘 (Lucide `Loader2` + `animate-spin`)

---

## 섹션 4: Notion DB 스키마

### 견적서 DB 프로퍼티

| 프로퍼티명 | Notion 타입 | 필수 여부 | 설명 | 예시값 |
|-----------|-----------|----------|------|--------|
| `Name` | Title | ✅ | 견적서 제목 | "2026년 4월 웹사이트 제작 견적서" |
| `클라이언트명` | Rich Text | ✅ | 수신처 회사/개인명 | "ACME 주식회사" |
| `발행일` | Date | ✅ | 견적서 발행 날짜 | 2026-04-02 |
| `유효기간` | Date | ✅ | 견적서 유효 만료일 | 2026-04-30 |
| `담당자` | Rich Text | ✅ | 발신처 담당자명 | "홍길동" |
| `담당자 이메일` | Email | ✅ | 담당자 연락처 | "gildong@example.com" |
| `상태` | Select | ✅ | 견적서 상태 | "발송됨" / "승인됨" / "거절됨" / "만료됨" |
| `총액` | Number | ✅ | 견적 총액 (원) | 5500000 |
| `메모` | Rich Text | ❌ | 특이사항, 조건 등 | "부가세 별도" |
| `항목 목록` | Rich Text (또는 하위 DB) | ✅ | 견적 항목 상세 | 아래 항목 스키마 참조 |

### 견적 항목 (항목 목록) 스키마

MVP에서는 Notion Rich Text 또는 테이블 블록으로 관리. 구조화된 항목이 필요하면 하위 DB를 별도 구성 가능.

```
| 항목명 | 수량 | 단가 | 금액 |
|--------|------|------|------|
| 웹사이트 기획 | 1 | 1,000,000 | 1,000,000 |
| 디자인 | 1 | 2,000,000 | 2,000,000 |
| 개발 | 1 | 2,500,000 | 2,500,000 |
```

### 토큰 ↔ Notion 페이지 ID 매핑 방식

**MVP 채택 방식: Notion 페이지 ID를 토큰으로 직접 사용**

```
URL: /quote/abc12345-1234-1234-1234-abc123456789
         └── Notion 페이지 ID (UUID)
```

- 장점: 별도 매핑 테이블 불필요, DB 없이 구현 가능
- 단점: Notion 페이지 ID가 URL에 노출됨 (보안상 큰 문제 없음 — 읽기 전용)
- 향후 확장 시 별도 토큰-페이지ID 매핑 테이블(DB) 도입 가능

---

## 섹션 5: API 설계

### `GET /api/quote/[token]`

**Route Handler 위치**: `src/app/api/quote/[token]/route.ts`

**요청**

```
GET /api/quote/abc12345-1234-1234-1234-abc123456789
```

| 파라미터 | 위치 | 타입 | 설명 |
|---------|------|------|------|
| `token` | Path | string | Notion 페이지 ID |

**응답 성공 (200)**

```typescript
interface QuoteData {
  id: string;                    // Notion 페이지 ID
  title: string;                 // 견적서 제목
  clientName: string;            // 클라이언트명
  issueDate: string;             // 발행일 (ISO 8601)
  expiryDate: string;            // 유효기간 (ISO 8601)
  manager: string;               // 담당자명
  managerEmail: string;          // 담당자 이메일
  status: QuoteStatus;           // 견적서 상태
  totalAmount: number;           // 총액 (원)
  items: QuoteItem[];            // 견적 항목 목록
  memo?: string;                 // 메모 (선택)
  lastEditedTime: string;        // 마지막 수정 시각
}

type QuoteStatus = '초안' | '발송됨' | '승인됨' | '거절됨' | '만료됨';

interface QuoteItem {
  name: string;        // 항목명
  quantity: number;    // 수량
  unitPrice: number;   // 단가 (원)
  amount: number;      // 금액 (원)
}
```

**응답 실패**

```typescript
// 404 — 없는 토큰 또는 삭제된 페이지
{
  "error": "NOT_FOUND",
  "message": "견적서를 찾을 수 없습니다."
}

// 500 — Notion API 오류
{
  "error": "INTERNAL_SERVER_ERROR",
  "message": "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
}
```

**Route Handler 구현 골격**

```typescript
// src/app/api/quote/[token]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Client, APIResponseError } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  try {
    const page = await notion.pages.retrieve({ page_id: token });
    // ... 데이터 변환 로직
    return NextResponse.json(quoteData);
  } catch (error) {
    if (error instanceof APIResponseError && error.status === 404) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: '견적서를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'INTERNAL_SERVER_ERROR', message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
```

> **중요**: Notion API 호출은 Route Handler에서만 수행. `NOTION_API_KEY`는 절대 클라이언트 번들에 포함되지 않도록 `NEXT_PUBLIC_` 접두사 사용 금지.

---

## 섹션 6: 파일 구조

### 신규 생성할 파일

| 파일 경로 | 역할 |
|----------|------|
| `src/app/api/quote/[token]/route.ts` | Notion API 호출 Route Handler |
| `src/app/quote/[token]/page.tsx` | 견적서 웹 뷰 Server Component |
| `src/app/quote/[token]/loading.tsx` | 견적서 로딩 스켈레톤 UI |
| `src/app/quote/[token]/not-found.tsx` | 견적서 없음 에러 페이지 |
| `src/app/quote/[token]/error.tsx` | 서버 에러 페이지 (Client Component) |
| `src/components/quote/QuoteView.tsx` | 견적서 내용 표시 컴포넌트 (Server) |
| `src/components/quote/PdfDownloadButton.tsx` | PDF 다운로드 버튼 (Client Component) |
| `src/lib/notion.ts` | Notion 클라이언트 초기화 및 유틸 함수 |
| `src/types/quote.ts` | `QuoteData`, `QuoteItem`, `QuoteStatus` 타입 정의 |

### 수정할 기존 파일

| 파일 경로 | 수정 내용 |
|----------|---------|
| `.env.local` | Notion 관련 환경 변수 추가 |
| `package.json` | `@notionhq/client`, `html2canvas`, `jspdf` 의존성 추가 |

### 설치할 패키지

```bash
npm install @notionhq/client html2canvas jspdf
npm install --save-dev @types/jspdf
```

> `html2canvas`와 `jspdf`는 클라이언트 전용 (`"use client"` 컴포넌트에서만 동적 import 권장)

```typescript
// PdfDownloadButton.tsx 내 동적 import 예시
const generatePdf = async () => {
  const html2canvas = (await import('html2canvas')).default;
  const jsPDF = (await import('jspdf')).jsPDF;
  // ...
};
```

---

## 섹션 7: MVP 범위 외 (Out of Scope)

### 제외 기능 목록

| 기능 | 제외 이유 |
|------|----------|
| 견적서 생성/수정/삭제 UI | 노션에서 직접 관리 — 별도 UI는 중복 작업 |
| 사용자 인증/로그인 | 클라이언트 접근 간소화가 MVP 핵심 가치 |
| 견적서 목록/대시보드 | 담당자용 기능 — 노션 DB로 대체 가능 |
| 견적서 열람 통계/추적 | DB 필요 — MVP 범위 초과 |
| 이메일 발송 기능 | 외부 메일 서비스 연동 필요 — 별도 구현 |
| 다국어(i18n) 지원 | 초기 타겟은 국내 사용자 |
| 모바일 앱 | 웹 브라우저 반응형으로 대체 |
| 커스텀 도메인/브랜딩 | 인프라 복잡도 증가 — Phase 2 이후 |
| 전자서명 | 법적 검토 필요 — MVP 범위 초과 |

### Future Consideration (향후 고려 기능)

- **단기**: 견적 열람 알림 (클라이언트가 URL 접속 시 담당자에게 알림)
- **단기**: 비밀번호 보호 URL (민감한 견적서 접근 제어)
- **중기**: 커스텀 브랜딩 (로고, 색상 테마 설정)
- **중기**: 견적서 승인/거절 버튼 (클라이언트가 웹에서 직접 응답)
- **장기**: 자체 DB 도입 (Notion 의존도 낮추기, 더 빠른 응답)
- **장기**: 다중 견적서 비교 기능

---

## 섹션 8: 환경 변수

### `.env.local` 필요 변수 목록

```bash
# .env.local

# Notion API 키 (필수)
# 발급: https://www.notion.so/my-integrations
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Notion 견적서 데이터베이스 ID (필수)
# 노션 DB URL에서 추출: notion.so/[workspace]/[DATABASE_ID]?v=...
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 서비스 베이스 URL (필수, Server Component에서 절대 URL로 API 호출 시 사용)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 변수 상세 설명

| 변수명 | 필수 | 설명 | 예시값 |
|--------|------|------|--------|
| `NOTION_API_KEY` | ✅ | Notion Integration의 Internal Integration Token | `secret_abc123...` |
| `NOTION_DATABASE_ID` | ✅ | 견적서가 저장된 Notion Database의 ID | `abc12345def67890...` (32자) |
| `NEXT_PUBLIC_BASE_URL` | ✅ | 서비스 배포 URL (로컬: `http://localhost:3000`) | `https://quote.example.com` |

### Notion API 키 발급 방법

1. [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations) 접속
2. "New integration" 클릭
3. Integration 이름 입력 → "Submit"
4. "Internal Integration Token" 복사 → `NOTION_API_KEY`에 설정
5. 견적서 DB 노션 페이지에서 "..." → "Connections" → 생성한 Integration 추가 (DB 접근 권한 부여 필수)

### Database ID 추출 방법

```
노션 DB URL 예시:
https://www.notion.so/myworkspace/abc12345def678901234567890abcdef?v=...
                                  └────────────── DATABASE_ID ──────────────┘
```

> **주의**: `.env.local`은 절대 git에 커밋하지 마세요. `.gitignore`에 포함되어 있는지 확인하세요.

---

## 부록: 핵심 타입 정의

```typescript
// src/types/quote.ts

export type QuoteStatus = '초안' | '발송됨' | '승인됨' | '거절됨' | '만료됨';

export interface QuoteItem {
  name: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface QuoteData {
  id: string;
  title: string;
  clientName: string;
  issueDate: string;        // ISO 8601 (e.g., "2026-04-02")
  expiryDate: string;       // ISO 8601
  manager: string;
  managerEmail: string;
  status: QuoteStatus;
  totalAmount: number;      // 원 단위 정수
  items: QuoteItem[];
  memo?: string;
  lastEditedTime: string;   // ISO 8601
}

export interface ApiErrorResponse {
  error: 'NOT_FOUND' | 'INTERNAL_SERVER_ERROR';
  message: string;
}
```

---

PRD 작성이 완료되었습니다. `docs/PRD.md`를 확인해주세요.
