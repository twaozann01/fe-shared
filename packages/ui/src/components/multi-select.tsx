import { Check, ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { useUILabels } from '../provider/ui-provider';
import { fieldBaseClass, fieldSingleLineClass } from './field';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export interface MultiSelectOption {
  value: string;
  label: ReactNode;
}

export interface MultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: MultiSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

// Chọn nhiều: nút trigger (style như Select) mở Popover chứa danh sách tích chọn.
// Controlled: value là string[]. Trigger hiện số mục đã chọn hoặc placeholder.
export function MultiSelect({
  value,
  onChange,
  options,
  placeholder,
  disabled,
  id,
  className,
}: MultiSelectProps) {
  const labels = useUILabels();
  const toggle = (v: string) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          disabled={disabled}
          className={cn(
            fieldBaseClass,
            fieldSingleLineClass,
            'flex items-center justify-between whitespace-nowrap',
            value.length === 0 && 'text-muted-foreground',
            className,
          )}
        >
          <span className="line-clamp-1 text-left">
            {value.length > 0 ? labels.multiSelect.selected(value.length) : placeholder}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-1">
        <div className="max-h-60 overflow-auto">
          {options.map((opt) => {
            const checked = value.includes(opt.value);
            return (
              <button
                type="button"
                key={opt.value}
                onClick={() => toggle(opt.value)}
                className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
              >
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  {checked && <Check className="h-4 w-4" />}
                </span>
                {opt.label}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
