import { cn, Input, useDebounce, useUILabels } from '@twaozann/ui';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

// Ô tìm kiếm có debounce: gõ → chờ `debounceMs` mới gọi onChange (giảm số lần gọi API).
// Đồng bộ ngược khi `value` bên ngoài đổi (vd bấm reset) để ô nhập không lệch với state thật.
export function SearchInput({
  value,
  onChange,
  placeholder,
  debounceMs = 400,
  className,
}: SearchInputProps) {
  const labels = useUILabels();
  const [text, setText] = useState(value);
  const debounced = useDebounce(text, debounceMs);
  const lastEmitted = useRef(value);

  useEffect(() => {
    if (value !== lastEmitted.current) {
      lastEmitted.current = value;
      setText(value);
    }
  }, [value]);

  useEffect(() => {
    if (debounced !== lastEmitted.current) {
      lastEmitted.current = debounced;
      onChange(debounced);
    }
  }, [debounced, onChange]);

  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder ?? labels.common.search}
        className="pl-8"
      />
    </div>
  );
}
