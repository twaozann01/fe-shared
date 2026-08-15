import { Switch, useUI } from '@twaozann01/ui';
import type { ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import type { FieldRules } from './rules';

export interface SwitchFieldProps {
  name: string;
  label: ReactNode;
  disabled?: boolean;
  /** Luật validate của React Hook Form. Bỏ qua nếu app dùng resolver Zod/Yup. */
  rules?: FieldRules;
}

// Field boolean dạng công tắc (bật/tắt). value là boolean → defaultValues nên là false.
export function SwitchField({ name, label, disabled, rules }: SwitchFieldProps) {
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
            <Switch
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
