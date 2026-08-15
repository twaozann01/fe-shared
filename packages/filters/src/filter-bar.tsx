import { Button, cn, useUILabels } from '@twaozann01/ui';
import type { ReactNode } from 'react';

export interface FilterBarProps {
  children: ReactNode;
  /** Truyền vào để hiện nút "Đặt lại"; không truyền thì không có nút. */
  onReset?: () => void;
  className?: string;
}

// Thanh chứa các control lọc (SearchInput, SelectFilter…). Chỉ lo bố cục và nút reset.
export function FilterBar({ children, onReset, className }: FilterBarProps) {
  const labels = useUILabels();

  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {children}
      {onReset && (
        <Button type="button" variant="ghost" size="sm" onClick={onReset}>
          {labels.filter.reset}
        </Button>
      )}
    </div>
  );
}
