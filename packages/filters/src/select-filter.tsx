import {
  cn,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useUILabels,
} from '@twaozann/ui';
import type { ReactNode } from 'react';

export interface FilterOption {
  value: string;
  label: ReactNode;
}

export interface SelectFilterProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  options: FilterOption[];
  placeholder?: string;
  allLabel?: ReactNode;
  className?: string;
}

// Radix Select không nhận value rỗng → dùng sentinel cho mục "Tất cả" (map ra undefined).
const ALL = '__all__';

// Dropdown lọc theo 1 field. value rỗng/undefined = không lọc (chọn "Tất cả").
export function SelectFilter({
  value,
  onChange,
  options,
  placeholder,
  allLabel,
  className,
}: SelectFilterProps) {
  const labels = useUILabels();

  return (
    <Select value={value ?? ALL} onValueChange={(v) => onChange(v === ALL ? undefined : v)}>
      <SelectTrigger className={cn('w-[180px]', className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>{allLabel ?? labels.filter.all}</SelectItem>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
