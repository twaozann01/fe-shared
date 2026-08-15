import { cn, RadioGroup, RadioGroupItem } from '@twaozann/ui';
import type { ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormField } from './form-field';
import type { FieldRules } from './rules';

export interface RadioOption {
  value: string;
  label: ReactNode;
}

export interface RadioFieldProps {
  name: string;
  label: ReactNode;
  options: RadioOption[];
  required?: boolean;
  disabled?: boolean;
  /** 'vertical' (mặc định) xếp dọc; 'horizontal' xếp ngang. */
  orientation?: 'vertical' | 'horizontal';
  /** Luật validate của React Hook Form. Bỏ qua nếu app dùng resolver Zod/Yup. */
  rules?: FieldRules;
}

// Chọn 1 trong nhiều (hiện tất cả lựa chọn). Chỉ cần `name` + `label` + `options`.
export function RadioField({
  name,
  label,
  options,
  required,
  disabled,
  orientation = 'vertical',
  rules,
}: RadioFieldProps) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <FormField label={label} required={required} error={fieldState.error?.message}>
          <RadioGroup
            value={field.value ?? ''}
            onValueChange={field.onChange}
            disabled={disabled}
            className={cn(orientation === 'horizontal' ? 'flex flex-wrap gap-4' : 'grid gap-2')}
          >
            {options.map((opt) => {
              const itemId = `${name}-${opt.value}`;
              return (
                <div key={opt.value} className="flex items-center gap-2">
                  <RadioGroupItem value={opt.value} id={itemId} />
                  <label htmlFor={itemId} className="text-sm">
                    {opt.label}
                  </label>
                </div>
              );
            })}
          </RadioGroup>
        </FormField>
      )}
    />
  );
}
