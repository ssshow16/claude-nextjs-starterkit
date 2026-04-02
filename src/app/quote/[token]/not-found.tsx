import Link from 'next/link';
import { FileX } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';

export default function QuoteNotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6 px-4">
        <FileX className="h-16 w-16 text-muted-foreground mx-auto" />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">견적서를 찾을 수 없습니다</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            요청하신 견적서가 존재하지 않거나 만료되었습니다.
            링크가 올바른지 확인하거나 담당자에게 문의해 주세요.
          </p>
        </div>
        <Link href="/" className={buttonVariants({ variant: 'outline' })}>
          홈으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
