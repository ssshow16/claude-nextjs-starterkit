import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Code2 } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Code2 className="h-5 w-5" />
          <span>Starter Kit</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
            홈
          </Link>
          <Link href="/docs" className="text-muted-foreground transition-colors hover:text-foreground">
            문서
          </Link>
          <Link href="/components" className="text-muted-foreground transition-colors hover:text-foreground">
            컴포넌트
          </Link>
        </nav>

        <Button size="sm">시작하기</Button>
      </div>
    </header>
  );
}
