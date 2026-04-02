import type { Metadata } from 'next';
import { FileText, Zap, Lock, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'NotionQuote — Notion 기반 견적서 웹 뷰어',
  description: 'Notion 데이터베이스를 활용한 전문적인 견적서 생성 및 공유 서비스',
};

const features = [
  {
    icon: FileText,
    title: 'Notion 연동',
    description: 'Notion 데이터베이스에 입력한 데이터가 즉시 견적서로 변환됩니다.',
  },
  {
    icon: Zap,
    title: '즉시 공유',
    description: '고유 링크를 통해 고객에게 견적서를 즉시 전달할 수 있습니다.',
  },
  {
    icon: Lock,
    title: '보안 토큰',
    description: '각 견적서는 고유한 토큰으로 보호되어 안전하게 공유됩니다.',
  },
  {
    icon: Download,
    title: 'PDF 다운로드',
    description: '견적서를 PDF로 저장하여 오프라인에서도 활용할 수 있습니다.',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* 히어로 섹션 */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground mb-6">
          <FileText className="h-4 w-4" aria-hidden="true" />
          <span>Notion 기반 견적서 서비스</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
          NotionQuote
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Notion 데이터베이스 하나로 전문적인 견적서를 만들고,
          고유 링크로 고객에게 바로 전달하세요.
          별도의 도구 없이 Notion만으로 충분합니다.
        </p>
        <div className="mt-10 flex gap-4 justify-center flex-wrap">
          <Button size="lg">
            시작하기
          </Button>
          <Button size="lg" variant="outline">
            견적서 예시 보기
          </Button>
        </div>
      </section>

      {/* 기능 소개 */}
      <section className="container mx-auto px-4 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-foreground">주요 기능</h2>
          <p className="mt-2 text-muted-foreground">간단하지만 강력한 견적서 관리</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title}>
              <CardHeader className="pb-2">
                <Icon className="h-6 w-6 text-primary mb-2" aria-hidden="true" />
                <CardTitle className="text-base">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 사용 방법 */}
      <section className="container mx-auto px-4 pb-24 max-w-2xl">
        <div className="rounded-lg border border-border bg-card p-8">
          <h2 className="text-xl font-bold text-card-foreground mb-6">이렇게 사용하세요</h2>
          <ol className="space-y-4">
            {[
              'Notion에서 견적서 데이터베이스를 생성합니다.',
              'NotionQuote에 Notion API 키와 데이터베이스 ID를 연결합니다.',
              '견적서 페이지를 만들면 고유 링크가 자동으로 생성됩니다.',
              '링크를 고객에게 공유하거나 PDF로 내보내세요.',
            ].map((step, index) => (
              <li key={index} className="flex gap-4 text-sm text-card-foreground">
                <span className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {index + 1}
                </span>
                <span className="leading-6">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
