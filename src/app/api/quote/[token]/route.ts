import { type NextRequest } from 'next/server';
import { getQuoteByToken } from '@/lib/notion';
import type { ApiErrorResponse } from '@/types/quote';

// GET /api/quote/[token]
// Notion 데이터베이스에서 token에 해당하는 견적서 데이터를 반환
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  if (!token) {
    const errorBody: ApiErrorResponse = {
      error: 'NOT_FOUND',
      message: '유효하지 않은 견적서 토큰입니다.',
    };
    return Response.json(errorBody, { status: 400 });
  }

  try {
    const quote = await getQuoteByToken(token);

    if (!quote) {
      const errorBody: ApiErrorResponse = {
        error: 'NOT_FOUND',
        message: '해당 견적서를 찾을 수 없습니다.',
      };
      return Response.json(errorBody, { status: 404 });
    }

    return Response.json(quote);
  } catch (err) {
    console.error('[QuoteAPI] 오류 발생:', err);
    const errorBody: ApiErrorResponse = {
      error: 'INTERNAL_SERVER_ERROR',
      message: '견적서 데이터를 불러오는 중 오류가 발생했습니다.',
    };
    return Response.json(errorBody, { status: 500 });
  }
}
