import { Checkbox, useUI } from '@twaozann01/ui';
import type { ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import type { FieldRules } from './rules';

export interface CheckboxFieldProps {
  name: string;
  label: ReactNode;
  disabled?: boolean;
  /** Luật validate của React Hook Form. Bỏ qua nếu app dùng resolver Zod/Yup. */
  rules?: FieldRules;
}

// Field boolean (tích/bỏ tích). value là boolean → defaultValues nên là false.
// Không dùng FormField vì nhãn nằm BÊN PHẢI ô tích, không nằm trên như các field khác.
export function CheckboxField({ name, label, disabled, rules }: CheckboxFieldProps) {
  const { control } = useFormContext();
  const { translateError } = useUI();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Checkbox
              id={name}
              ref={field.ref}
              checked={Boolean(field.value)}
              onCheckedChange={field.onChange}
              onBlur={field.onBlur}
              disabled={disabled}
            />
            <label htmlFor={name} className="text-sm font-medium leading-none">
              {label}
            </label>
          </div>
          {fieldState.error?.message && (
            <p className="text-sm text-destructive">{translateError(fieldState.error.message)}</p>
          )}
        </div>
      )}
    />
  );
}
