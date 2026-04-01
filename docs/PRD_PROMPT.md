# MVP PRD 생성 메타 프롬프트

> 이 파일은 Claude Code에게 입력하여 MVP PRD 문서를 자동 생성하기 위한 메타 프롬프트입니다.
> 아래 프롬프트를 복사하여 Claude Code 세션에 붙여넣으세요.

---

## 사용 방법

1. 아래 `--- PROMPT START ---` 부터 `--- PROMPT END ---` 사이의 내용을 복사
2. Claude Code 세션에 붙여넣기
3. 생성된 PRD를 `docs/PRD.md`에 저장하도록 요청

---

--- PROMPT START ---

# 역할

당신은 시니어 프로덕트 매니저 겸 풀스택 개발자입니다.
아래 컨텍스트와 체크리스트를 기반으로 **즉시 구현 가능한 수준의 MVP PRD 문서**를 한국어로 작성하세요.

---

# 프로젝트 컨텍스트

## 제품 설명

- 담당자가 노션(Notion)에 견적서를 작성하면, 클라이언트가 고유 URL로 웹에서 확인하고 PDF로 다운로드할 수 있는 서비스

## 기술 스택 (변경 불가)

- **프레임워크**: Next.js 16.2.2 (App Router, Server Components 기본)
- **언어**: TypeScript 5 (strict mode), 경로 별칭 `@/*` → `./src/*`
- **스타일링**: Tailwind CSS v4 (CSS 변수 기반, `tailwind.config.js` 없음)
- **UI 컴포넌트**: shadcn/ui (Nova 스타일, `@base-ui/react` 기반)
- **아이콘**: Lucide React
- **Notion 연동**: `@notionhq/client` (공식 SDK)
- **PDF 생성**: `html2canvas` + `jsPDF` (클라이언트사이드)

## 핵심 결정 사항

- Notion API로 실시간 데이터 조회 (캐싱은 Next.js `fetch` revalidate 활용)
- 클라이언트 접근: `/quote/[token]` 형태의 고유 토큰 URL (로그인 불필요)
- PDF는 브라우저에서 html2canvas로 페이지를 캡처 후 jsPDF로 변환
- MVP 범위: 조회 + PDF 다운로드만 (생성/수정/삭제 UI 없음)

---

# PRD 작성 체크리스트

아래 8개 섹션을 모두 포함하여 PRD를 작성하세요. 각 항목은 반드시 포함되어야 합니다.

## 섹션 1: 제품 개요

- [ ] 제품명 및 한 줄 설명
- [ ] 해결하는 문제 (Pain Point)
- [ ] 타겟 사용자 (담당자 측 / 클라이언트 측 각각 정의)
- [ ] MVP 성공 기준 (측정 가능한 지표로 정의)

## 섹션 2: 사용자 시나리오 (User Story)

- [ ] 담당자 시나리오: 노션에 견적서 작성 → 토큰 URL 생성 → 클라이언트에게 공유
- [ ] 클라이언트 시나리오: URL 접속 → 견적서 확인 → PDF 다운로드
- [ ] 엣지 케이스: 잘못된 토큰, 노션 API 오류, 삭제된 견적서

## 섹션 3: 기능 명세

### 3-1. Notion API 연동
- [ ] 연동 방식: Server Component에서 `@notionhq/client` 사용
- [ ] 조회 대상: Notion Database (견적서 DB)
- [ ] 캐싱 전략: `fetch` revalidate 시간 명시 (추천값 포함)
- [ ] 에러 처리: API 키 누락, DB 없음, 페이지 없음 각각 처리

### 3-2. 견적서 웹 뷰
- [ ] 라우트: `src/app/quote/[token]/page.tsx`
- [ ] 렌더링 방식: Server Component (토큰으로 Notion 페이지 ID 조회)
- [ ] 표시할 견적서 필드 목록 (최소 요건)
- [ ] 로딩 상태: `loading.tsx` 활용
- [ ] 에러 상태: `error.tsx` 또는 `not-found.tsx` 활용

### 3-3. PDF 다운로드
- [ ] 트리거: "PDF 다운로드" 버튼 클릭 (`"use client"` 컴포넌트)
- [ ] 동작 흐름: html2canvas로 `#quote-content` 영역 캡처 → jsPDF로 A4 변환 → 자동 다운로드
- [ ] 파일명 규칙: `견적서_[회사명]_[날짜].pdf`
- [ ] 다운로드 중 로딩 상태 처리

## 섹션 4: Notion DB 스키마

- [ ] 견적서 DB에 필요한 프로퍼티 목록 (이름, 타입, 설명 포함)
- [ ] 최소 포함 필드: 제목, 클라이언트명, 발행일, 유효기간, 항목 목록, 총액, 담당자, 상태
- [ ] 토큰과 Notion 페이지 ID 매핑 방식 명시 (예: Notion 페이지 ID를 토큰으로 직접 사용 vs 별도 매핑 테이블)

## 섹션 5: API 설계

- [ ] `GET /api/quote/[token]` 엔드포인트
  - 요청: `token` (path parameter)
  - 응답 성공 (200): 견적서 데이터 JSON 스키마 정의
  - 응답 실패: 404 (없는 토큰), 500 (Notion API 오류) 각각의 응답 형식
- [ ] Route Handler 위치: `src/app/api/quote/[token]/route.ts`
- [ ] Notion API 호출은 Route Handler에서만 처리 (API 키 노출 방지)

## 섹션 6: 파일 구조

- [ ] 신규 생성할 파일 목록 (경로 + 역할 한 줄 설명)
- [ ] 수정할 기존 파일 목록
- [ ] 설치할 패키지 목록 (`npm install` 명령어 포함)

## 섹션 7: MVP 범위 외 (Out of Scope)

- [ ] 명시적으로 제외할 기능 목록 (이유 포함)
- [ ] 향후 고려할 수 있는 기능 (Future Consideration)

## 섹션 8: 환경 변수

- [ ] `.env.local`에 필요한 모든 환경 변수 목록
- [ ] 각 변수의 이름, 설명, 예시값
- [ ] Notion API 키 발급 방법 참조 링크 포함

---

# 출력 형식 지정

- **파일**: `docs/PRD.md`로 저장
- **언어**: 한국어 (기술 용어는 영어 병기)
- **형식**: Markdown (표, 코드블록 적극 활용)
- **분량**: 섹션당 충분한 깊이로 작성 (구현자가 별도 질문 없이 바로 작업 가능한 수준)
- **코드 예시**: 핵심 타입 정의(`QuoteData` 인터페이스 등)는 TypeScript로 포함

PRD 작성 완료 후 "PRD 작성이 완료되었습니다. `docs/PRD.md`를 확인해주세요."라고 알려주세요.

--- PROMPT END ---
