import { cn } from '../lib/cn';
import { Button } from './button';

export interface LanguageOption {
  /** Mã ngôn ngữ, vd 'vi' | 'en'. */
  value: string;
  /** Nhãn hiển thị trên nút, vd 'VI'. */
  label: string;
}

export interface LanguageSwitcherProps {
  languages: LanguageOption[];
  current: string;
  onChange: (value: string) => void;
  className?: string;
}

// Stateless như ThemeToggle: app quyết định có bao nhiêu ngôn ngữ và đổi ngôn ngữ ra sao
// (i18next hay gì khác). Thư viện chỉ vẽ dãy nút và báo lựa chọn ra ngoài.
export function LanguageSwitcher({
  languages,
  current,
  onChange,
  className,
}: LanguageSwitcherProps) {
  return (
    <div className={cn('flex gap-1', className)}>
      {languages.map((lng) => (
        <Button
          key={lng.value}
          variant={current === lng.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(lng.value)}
        >
          {lng.label}
        </Button>
      ))}
    </div>
  );
}
