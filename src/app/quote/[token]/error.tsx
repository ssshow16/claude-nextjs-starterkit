'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuoteErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function QuoteError({ error, reset }: QuoteErrorProps) {
  useEffect(() => {
    console.error('[QuotePage] 오류 발생:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6 px-4">
        <AlertTriangle className="h-16 w-16 text-destructive mx-auto" />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">오류가 발생했습니다</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            견적서를 불러오는 중 예기치 않은 오류가 발생했습니다.
            잠시 후 다시 시도해 주세요.
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground font-mono">
              오류 코드: {error.digest}
            </p>
          )}
        </div>
        <Button onClick={reset}>다시 시도</Button>
      </div>
    </main>
  );
}
