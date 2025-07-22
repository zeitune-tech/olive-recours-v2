export type ToastType = 'success' | 'info' | 'error' | 'primary' | 'accent' | 'warn' | 'secondary';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number; // en ms, undefined = non auto-dismiss
  createdAt: number;
} 