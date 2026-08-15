import { Moon, Sun } from 'lucide-react';
import { useOptionalTheme, type ResolvedTheme } from '../provider/theme-provider';
import { useUILabels } from '../provider/ui-provider';
import { Button } from './button';

export interface ThemeToggleProps {
  /** Bỏ trống để lấy từ <ThemeProvider>. Truyền vào khi app tự quản theme. */
  theme?: ResolvedTheme;
  onToggle?: () => void;
  /** Chỉ hiện icon, không hiện chữ — hợp với thanh header chật. */
  iconOnly?: boolean;
  className?: string;
}

/**
 * Nút lật sáng/tối.
 *
 * Mặc định lấy trạng thái từ `<ThemeProvider>` nên dùng được luôn, không cần props:
 * ```tsx
 * <ThemeToggle />
 * ```
 * App nào tự quản theme thì truyền `theme` + `onToggle` để dùng ở chế độ controlled.
 */
export function ThemeToggle({ theme, onToggle, iconOnly, className }: ThemeToggleProps) {
  const labels = useUILabels();
  const ctx = useOptionalTheme();

  const current = theme ?? ctx?.resolvedTheme;
  const handleToggle = onToggle ?? ctx?.toggleTheme;

  if (!current || !handleToggle) {
    throw new Error(
      'ThemeToggle cần <ThemeProvider> bọc ngoài, hoặc props theme + onToggle nếu app tự quản theme.',
    );
  }

  const isLight = current === 'light';
  const label = isLight ? labels.common.dark : labels.common.light;

  return (
    <Button
      variant="outline"
      size={iconOnly ? 'icon' : 'sm'}
      onClick={handleToggle}
      className={className}
      aria-label={label}
    >
      {isLight ? <Moon /> : <Sun />}
      {!iconOnly && label}
    </Button>
  );
}
