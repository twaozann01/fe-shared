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

export interface BooleanFilterProps {
  value?: boolean;
  onChange: (value: boolean | undefined) => void;
  placeholder?: string;
  trueLabel?: ReactNode;
  falseLabel?: ReactNode;
  className?: string;
}

const ALL = '__all__';
const TRUE = 'true';
const FALSE = 'false';

// Lọc 3 trạng thái: Tất cả / Có / Không (vd isActive). value undefined = không lọc.
export function BooleanFilter({
  value,
  onChange,
  placeholder,
  trueLabel,
  falseLabel,
  className,
}: BooleanFilterProps) {
  const labels = useUILabels();
  const current = value === undefined ? ALL : value ? TRUE : FALSE;

  return (
    <Select value={current} onValueChange={(v) => onChange(v === ALL ? undefined : v === TRUE)}>
      <SelectTrigger className={cn('w-[160px]', className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>{labels.filter.all}</SelectItem>
        <SelectItem value={TRUE}>{trueLabel ?? labels.filter.yes}</SelectItem>
        <SelectItem value={FALSE}>{falseLabel ?? labels.filter.no}</SelectItem>
      </SelectContent>
    </Select>
  );
}
