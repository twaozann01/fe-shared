import { cn, MultiSelect, useUILabels, type MultiSelectOption } from '@twaozann01/ui';

export interface MultiSelectFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: MultiSelectOption[];
  placeholder?: string;
  className?: string;
}

// Lọc nhiều giá trị trên cùng 1 field (vd nhiều trạng thái). value là string[]; [] = không lọc.
export function MultiSelectFilter({
  value,
  onChange,
  options,
  placeholder,
  className,
}: MultiSelectFilterProps) {
  const labels = useUILabels();

  return (
    <div className={cn('w-[200px]', className)}>
      <MultiSelect
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder ?? labels.filter.all}
      />
    </div>
  );
}
