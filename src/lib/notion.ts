import { Client } from '@notionhq/client';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import type { QuoteData, QuoteItem, QuoteStatus } from '@/types/quote';

// Notion 클라이언트 싱글턴 — 서버 전용 모듈
export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// PageObjectResponse의 properties 타입 (Notion SDK 내부 타입)
type PageProps = PageObjectResponse['properties'];
type PropValue = PageProps[string];

// 속성에서 문자열 값을 추출하는 헬퍼
function extractText(prop: PropValue | undefined): string {
  if (!prop) return '';

  switch (prop.type) {
    case 'title':
      return prop.title.map((t) => t.plain_text).join('');
    case 'rich_text':
      return prop.rich_text.map((t) => t.plain_text).join('');
    case 'email':
      return prop.email ?? '';
    case 'select':
      return prop.select?.name ?? '';
    case 'status':
      return prop.status?.name ?? '';
    case 'date':
      return prop.date?.start ?? '';
    case 'number':
      return String(prop.number ?? '');
    case 'url':
      return prop.url ?? '';
    case 'phone_number':
      return prop.phone_number ?? '';
    default:
      return '';
  }
}

function extractNumber(prop: PropValue | undefined): number {
  if (!prop) return 0;
  if (prop.type === 'number') {
    return prop.number ?? 0;
  }
  return 0;
}

// 특정 키 후보들 중 첫 번째로 존재하는 값을 반환
function getProp(props: PageProps, ...keys: string[]): PropValue | undefined {
  for (const key of keys) {
    if (props[key]) return props[key];
  }
  return undefined;
}

// Notion 페이지를 QuoteData 형식으로 변환
export function pageToQuoteData(page: PageObjectResponse): QuoteData {
  const props = page.properties;

  // items 필드: rich_text로 JSON 직렬화하여 저장한다고 가정
  let items: QuoteItem[] = [];
  const itemsProp = getProp(props, 'Items', 'items');
  if (itemsProp?.type === 'rich_text') {
    const raw = itemsProp.rich_text.map((t) => t.plain_text).join('');
    if (raw) {
      try {
        items = JSON.parse(raw) as QuoteItem[];
      } catch {
        items = [];
      }
    }
  }

  const statusRaw = extractText(getProp(props, 'Status', 'status'));
  const status = (statusRaw || '초안') as QuoteStatus;

  return {
    id: page.id,
    title: extractText(getProp(props, 'Title', 'Name', 'title', 'name')),
    clientName: extractText(getProp(props, 'ClientName', 'Client Name', 'Client')),
    issueDate: extractText(getProp(props, 'IssueDate', 'Issue Date')),
    expiryDate: extractText(getProp(props, 'ExpiryDate', 'Expiry Date')),
    manager: extractText(getProp(props, 'Manager')),
    managerEmail: extractText(getProp(props, 'ManagerEmail', 'Manager Email')),
    status,
    totalAmount: extractNumber(getProp(props, 'TotalAmount', 'Total Amount')),
    items,
    memo: extractText(getProp(props, 'Memo')) || undefined,
    lastEditedTime: page.last_edited_time,
  };
}

// 데이터베이스에서 token으로 페이지 조회
export async function getQuoteByToken(token: string): Promise<QuoteData | null> {
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!databaseId) {
    throw new Error('NOTION_DATABASE_ID 환경 변수가 설정되지 않았습니다.');
  }

  const response = await notion.dataSources.query({
    data_source_id: databaseId,
    filter: {
      property: 'Token',
      rich_text: {
        equals: token,
      },
    },
    page_size: 1,
  });

  if (response.results.length === 0) {
    return null;
  }

  const page = response.results[0] as PageObjectResponse;
  return pageToQuoteData(page);
}
