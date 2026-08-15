import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/cn';
import { useUILabels } from '../provider/ui-provider';
import { Button } from './button';

export interface PaginationProps {
  /** Trang hiện tại (1-based). */
  page: number;
  /** Tổng số trang. */
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * Tính danh sách nút trang có dấu '…': luôn hiện trang 1, trang cuối, và quanh trang hiện tại ±1.
 * vd page=5, totalPages=10 → [1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]
 *
 * Xuất ra ngoài để test được mà không cần render DOM.
 */
export function getPageItems(page: number, totalPages: number): (number | 'ellipsis')[] {
  const wanted = [1, totalPages, page, page - 1, page + 1];
  const visible = [...new Set(wanted)]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);

  const items: (number | 'ellipsis')[] = [];
  let prev = 0;
  for (const p of visible) {
    if (p - prev > 1) items.push('ellipsis'); // có quãng cách → chèn '…'
    items.push(p);
    prev = p;
  }
  return items;
}

// Chỉ lo HIỂN THỊ + báo trang được chọn (onPageChange); việc gọi API do nơi dùng quản.
export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  const labels = useUILabels();

  if (totalPages <= 1) return null; // 0–1 trang thì không cần phân trang

  const go = (p: number) => {
    const clamped = Math.min(Math.max(p, 1), totalPages); // kẹp trong [1, totalPages]
    if (clamped !== page) onPageChange(clamped);
  };

  return (
    <nav className={cn('flex items-center justify-center gap-1', className)} aria-label="pagination">
      <Button
        variant="outline"
        size="icon"
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        aria-label={labels.pagination.previous}
      >
        <ChevronLeft />
      </Button>

      {getPageItems(page, totalPages).map((item, i) =>
        item === 'ellipsis' ? (
          <span key={`e${i}`} className="px-2 text-muted-foreground" aria-hidden>
            …
          </span>
        ) : (
          <Button
            key={item}
            variant={item === page ? 'default' : 'outline'}
            size="icon"
            onClick={() => go(item)}
            aria-label={labels.pagination.page(item)}
            aria-current={item === page ? 'page' : undefined}
          >
            {item}
          </Button>
        ),
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => go(page + 1)}
        disabled={page >= totalPages}
        aria-label={labels.pagination.next}
      >
        <ChevronRight />
      </Button>
    </nav>
  );
}
