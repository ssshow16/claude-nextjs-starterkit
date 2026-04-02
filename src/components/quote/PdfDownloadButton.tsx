'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PdfDownloadButtonProps {
  quoteTitle: string;
  targetId?: string;
}

// Client Component — html2canvas와 jsPDF는 브라우저 전용이므로 동적 import 사용
export function PdfDownloadButton({
  quoteTitle,
  targetId = 'quote-content',
}: PdfDownloadButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const handleDownload = async () => {
    setIsPending(true);
    try {
      // 번들 크기 최소화를 위해 동적 import
      const [html2canvas, { jsPDF }] = await Promise.all([
        import('html2canvas').then((m) => m.default),
        import('jspdf'),
      ]);

      const element = document.getElementById(targetId);
      if (!element) {
        console.error(`[PdfDownload] #${targetId} 요소를 찾을 수 없습니다.`);
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      // 여러 페이지 처리
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `${quoteTitle.replace(/[^a-zA-Z0-9가-힣]/g, '_')}_견적서.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error('[PdfDownload] PDF 생성 오류:', err);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      disabled={isPending}
      aria-label="견적서 PDF 다운로드"
    >
      <Download className="h-4 w-4 mr-2" aria-hidden="true" />
      {isPending ? '생성 중...' : 'PDF 저장'}
    </Button>
  );
}
