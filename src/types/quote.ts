export type QuoteStatus = '초안' | '발송됨' | '승인됨' | '거절됨' | '만료됨';

export interface QuoteItem {
  name: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface QuoteData {
  id: string;
  title: string;
  clientName: string;
  issueDate: string;
  expiryDate: string;
  manager: string;
  managerEmail: string;
  status: QuoteStatus;
  totalAmount: number;
  items: QuoteItem[];
  memo?: string;
  lastEditedTime: string;
}

export interface ApiErrorResponse {
  error: 'NOT_FOUND' | 'INTERNAL_SERVER_ERROR';
  message: string;
}
