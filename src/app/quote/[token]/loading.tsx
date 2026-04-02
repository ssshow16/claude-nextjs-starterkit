export default function QuoteLoading() {
  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* 견적서 헤더 스켈레톤 */}
        <div className="rounded-lg border border-border bg-card p-8 animate-pulse">
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-3">
              <div className="h-8 w-48 bg-muted rounded" />
              <div className="h-4 w-32 bg-muted rounded" />
            </div>
            <div className="h-8 w-24 bg-muted rounded" />
          </div>

          {/* 고객 정보 스켈레톤 */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="space-y-2">
              <div className="h-4 w-16 bg-muted rounded" />
              <div className="h-6 w-40 bg-muted rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-16 bg-muted rounded" />
              <div className="h-6 w-32 bg-muted rounded" />
            </div>
          </div>

          {/* 품목 테이블 스켈레톤 */}
          <div className="space-y-3">
            <div className="h-10 w-full bg-muted rounded" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 w-full bg-muted/60 rounded" />
            ))}
            <div className="h-12 w-full bg-muted rounded" />
          </div>
        </div>
      </div>
    </main>
  );
}
