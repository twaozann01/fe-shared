import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

// Drawer trượt từ trái cho MOBILE (<md). Tự dựng (không thêm thư viện): backdrop mờ + panel.
// Luôn render để có hiệu ứng trượt; khi đóng thì pointer-events-none để không chặn thao tác.
export function MobileDrawer({ open, onClose, children, className }: MobileDrawerProps) {
  return (
    <div
      className={cn('fixed inset-0 z-50 md:hidden', !open && 'pointer-events-none')}
      aria-hidden={!open}
    >
      {/* Lớp nền mờ — bấm ra ngoài để đóng */}
      <div
        onClick={onClose}
        className={cn(
          'absolute inset-0 bg-black/40 transition-opacity duration-200',
          open ? 'opacity-100' : 'opacity-0',
        )}
      />
      {/* Panel trượt */}
      <div
        className={cn(
          'absolute left-0 top-0 flex h-full w-64 flex-col bg-card shadow-xl transition-transform duration-200',
          open ? 'translate-x-0' : '-translate-x-full',
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
