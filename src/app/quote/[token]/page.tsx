import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getQuoteByToken } from '@/lib/notion';
import { QuoteView } from '@/components/quote/QuoteView';

interface QuotePageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: QuotePageProps): Promise<Metadata> {
  const { token } = await params;
  const quote = await getQuoteByToken(token).catch(() => null);

  if (!quote) {
    return { title: '견적서를 찾을 수 없습니다 — NotionQuote' };
  }

  return {
    title: `${quote.title} — NotionQuote`,
    description: `${quote.clientName} 견적서`,
  };
}

export default async function QuotePage({ params }: QuotePageProps) {
  const { token } = await params;
  const quote = await getQuoteByToken(token).catch(() => null);

  if (!quote) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <QuoteView quote={quote} />
      </div>
    </main>
  );
}
