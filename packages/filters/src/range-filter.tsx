import { cn, Input, useUILabels } from '@twaozann/ui';

export interface RangeValue {
  min?: number;
  max?: number;
}

export interface RangeFilterProps {
  value: RangeValue;
  onChange: (value: RangeValue) => void;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  className?: string;
}

// Rỗng → undefined để gửi đúng kiểu lên BE (giống NumberField).
function parse(raw: string): number | undefined {
  return raw === '' ? undefined : Number(raw);
}

// Lọc khoảng số (vd giá): min – max.
export function RangeFilter({
  value,
  onChange,
  minPlaceholder,
  maxPlaceholder,
  className,
}: RangeFilterProps) {
  const labels = useUILabels();

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Input
        type="number"
        inputMode="decimal"
        className="w-28"
        value={value.min ?? ''}
        placeholder={minPlaceholder ?? labels.filter.min}
        onChange={(e) => onChange({ ...value, min: parse(e.target.value) })}
      />
      <span className="text-muted-foreground">–</span>
      <Input
        type="number"
        inputMode="decimal"
        className="w-28"
        value={value.max ?? ''}
        placeholder={maxPlaceholder ?? labels.filter.max}
        onChange={(e) => onChange({ ...value, max: parse(e.target.value) })}
      />
    </div>
  );
}
