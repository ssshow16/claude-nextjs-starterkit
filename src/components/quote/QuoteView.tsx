import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { QuoteData, QuoteStatus } from '@/types/quote';
import { PdfDownloadButton } from './PdfDownloadButton';

interface QuoteViewProps {
  quote: QuoteData;
}

const STATUS_LABELS: Record<QuoteStatus, { label: string; className: string }> = {
  초안: { label: '초안', className: 'bg-muted text-muted-foreground' },
  발송됨: { label: '발송됨', className: 'bg-primary/10 text-primary' },
  승인됨: { label: '승인됨', className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
  거절됨: { label: '거절됨', className: 'bg-destructive/10 text-destructive' },
  만료됨: { label: '만료됨', className: 'bg-muted text-muted-foreground line-through' },
} as const;

function formatDate(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    return format(new Date(dateStr), 'yyyy년 MM월 dd일', { locale: ko });
  } catch {
    return dateStr;
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount);
}

// Server Component — 견적서 내용 표시
export function QuoteView({ quote }: QuoteViewProps) {
  const statusInfo = STATUS_LABELS[quote.status] ?? STATUS_LABELS['초안'];

  return (
    <article id="quote-content" className="rounded-lg border border-border bg-card shadow-sm">
      {/* 견적서 헤더 */}
      <header className="p-8 border-b border-border">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold text-card-foreground">{quote.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              견적서 번호: {quote.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${statusInfo.className}`}
            >
              {statusInfo.label}
            </span>
            <PdfDownloadButton quoteTitle={quote.title} />
          </div>
        </div>
      </header>

      {/* 고객 정보 및 날짜 */}
      <section className="p-8 border-b border-border">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                수신
              </dt>
              <dd className="mt-1 text-base font-semibold text-card-foreground">
                {quote.clientName}
              </dd>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                담당자
              </dt>
              <dd className="mt-1 text-base text-card-foreground">{quote.manager}</dd>
              {quote.managerEmail && (
                <dd className="text-sm text-muted-foreground">{quote.managerEmail}</dd>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  발행일
                </dt>
                <dd className="mt-1 text-sm text-card-foreground">
                  {formatDate(quote.issueDate)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  유효기한
                </dt>
                <dd className="mt-1 text-sm text-card-foreground">
                  {formatDate(quote.expiryDate)}
                </dd>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 견적 항목 */}
      <section className="p-8 border-b border-border">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
          견적 항목
        </h2>
        {quote.items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left font-medium text-muted-foreground">항목명</th>
                  <th className="pb-3 text-right font-medium text-muted-foreground">수량</th>
                  <th className="pb-3 text-right font-medium text-muted-foreground">단가</th>
                  <th className="pb-3 text-right font-medium text-muted-foreground">금액</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {quote.items.map((item, index) => (
                  <tr key={index}>
                    <td className="py-3 text-card-foreground">{item.name}</td>
                    <td className="py-3 text-right text-card-foreground">{item.quantity}</td>
                    <td className="py-3 text-right text-card-foreground">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="py-3 text-right font-medium text-card-foreground">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border">
                  <td
                    colSpan={3}
                    className="pt-4 text-right font-semibold text-card-foreground"
                  >
                    합계
                  </td>
                  <td className="pt-4 text-right text-xl font-bold text-primary">
                    {formatCurrency(quote.totalAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">등록된 항목이 없습니다.</p>
        )}
      </section>

      {/* 메모 */}
      {quote.memo && (
        <section className="p-8 border-b border-border">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
            메모
          </h2>
          <p className="text-sm text-card-foreground whitespace-pre-wrap">{quote.memo}</p>
        </section>
      )}

      {/* 푸터 */}
      <footer className="px-8 py-4 flex justify-end">
        <p className="text-xs text-muted-foreground">
          최종 수정: {formatDate(quote.lastEditedTime)}
        </p>
      </footer>
    </article>
  );
}
