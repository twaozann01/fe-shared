import {
  cn,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useUILabels,
} from '@twaozann01/ui';
import { ArrowUpDown } from 'lucide-react';
import type { FilterOption } from './select-filter';

export interface SortSelectProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  /** value mỗi option theo chuẩn `field:asc | field:desc` (khớp quy ước BE của app). */
  options: FilterOption[];
  placeholder?: string;
  className?: string;
}

// Sentinel cho "mặc định" (không gửi sort → BE tự dùng thứ tự mặc định).
const DEFAULT = '__default__';

// Dropdown chọn sắp xếp. value rỗng/undefined = dùng sort mặc định.
export function SortSelect({ value, onChange, options, placeholder, className }: SortSelectProps) {
  const labels = useUILabels();

  return (
    <Select value={value ?? DEFAULT} onValueChange={(v) => onChange(v === DEFAULT ? undefined : v)}>
      <SelectTrigger className={cn('w-[200px]', className)}>
        <ArrowUpDown className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <SelectValue placeholder={placeholder ?? labels.filter.sort} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={DEFAULT}>{labels.filter.sortDefault}</SelectItem>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
