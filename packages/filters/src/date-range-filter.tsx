import { cn, Input, useUILabels } from '@twaozann/ui';

export interface DateRangeValue {
  /** ISO 'yyyy-mm-dd'. */
  from?: string;
  /** ISO 'yyyy-mm-dd'. */
  to?: string;
}

export interface DateRangeFilterProps {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  className?: string;
}

// Lọc khoảng thời gian: từ ngày – đến ngày. Dùng input date native (không thêm lib date-picker
// vào design system — mỗi dự án một gu date-picker, và lib đó thường rất nặng).
// min/max chéo nhau để trình duyệt tự chặn khoảng không hợp lệ.
export function DateRangeFilter({ value, onChange, className }: DateRangeFilterProps) {
  const labels = useUILabels();

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Input
        type="date"
        className="w-[150px]"
        aria-label={labels.filter.from}
        value={value.from ?? ''}
        max={value.to || undefined}
        onChange={(e) => onChange({ ...value, from: e.target.value || undefined })}
      />
      <span className="text-muted-foreground">–</span>
      <Input
        type="date"
        className="w-[150px]"
        aria-label={labels.filter.to}
        value={value.to ?? ''}
        min={value.from || undefined}
        onChange={(e) => onChange({ ...value, to: e.target.value || undefined })}
      />
    </div>
  );
}
