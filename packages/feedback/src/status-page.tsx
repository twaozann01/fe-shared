import { cn } from '@twaozann01/ui';
import type { ReactNode } from 'react';

export interface StatusPageProps {
  /** Dòng lớn nhất — mã lỗi ('404') hoặc tiêu đề ngắn. */
  title: ReactNode;
  description?: ReactNode;
  /**
   * Nút/liên kết hành động. Cố ý là ReactNode chứ không phải `href`:
   * thư viện không biết app dùng react-router, TanStack Router hay thẻ <a> thường.
   */
  action?: ReactNode;
  className?: string;
}

// Khung chung cho mọi trang trạng thái toàn màn hình (404, 403, lỗi render).
export function StatusPage({ title, description, action, className }: StatusPageProps) {
  return (
    <div
      className={cn(
        'flex min-h-screen flex-col items-center justify-center gap-3 bg-background text-foreground',
        className,
      )}
    >
      <h1 className="text-4xl font-bold">{title}</h1>
      {description && <p className="text-muted-foreground">{description}</p>}
      {action}
    </div>
  );
}
