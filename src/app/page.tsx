import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Code2, Layers, Palette, Zap } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Next.js 15",
    description: "App Router, React 19, Server Components",
  },
  {
    icon: Layers,
    title: "TypeScript",
    description: "타입 안전성을 보장하는 정적 타입 시스템",
  },
  {
    icon: Palette,
    title: "Tailwind CSS v4",
    description: "CSS 기반 설정, tailwind.config 파일 불필요",
  },
  {
    icon: Code2,
    title: "shadcn/ui",
    description: "접근성을 갖춘 재사용 가능한 UI 컴포넌트",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Next.js Starter Kit
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
          Next.js 15 · TypeScript · Tailwind CSS v4 · shadcn/ui · lucide-react
        </p>
        <div className="mt-8 flex gap-3 justify-center">
          <Button size="lg">시작하기</Button>
          <Button size="lg" variant="outline">문서 보기</Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title}>
              <CardHeader className="pb-2">
                <Icon className="h-6 w-6 text-primary mb-2" />
                <CardTitle className="text-base">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Example Form */}
      <section className="container mx-auto px-4 pb-24 max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>컴포넌트 예시</CardTitle>
            <CardDescription>shadcn/ui Input & Label 컴포넌트</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" type="email" placeholder="hello@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
            <Button className="w-full">로그인</Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
