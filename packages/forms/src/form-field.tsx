import { cn, useUI } from '@twaozann/ui';
import type { ReactNode } from 'react';

export interface FormFieldProps {
  /** Nhãn đã dịch sẵn. */
  label: ReactNode;
  /** id của control để gắn <label htmlFor>. */
  htmlFor?: string;
  /**
   * Thông điệp lỗi từ RHF. Nếu schema trả key i18n (vd 'validation.email') thì
   * `translateError` của UIProvider sẽ dịch; không khai thì hiển thị nguyên chuỗi.
   */
  error?: string;
  required?: boolean;
  className?: string;
  /** Control thực tế: <Input>, <Textarea>, <Select>… */
  children: ReactNode;
}

// Wrapper field dùng chung: nhãn + control + dòng lỗi.
// KHÔNG tự render input — bọc bất kỳ control nào để đồng nhất khoảng cách & cách hiện lỗi.
export function FormField({
  label,
  htmlFor,
  error,
  required,
  className,
  children,
}: FormFieldProps) {
  const { translateError } = useUI();

  return (
    <div className={cn('space-y-1', className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      {children}
      {error && <p className="text-sm text-destructive">{translateError(error)}</p>}
    </div>
  );
}
