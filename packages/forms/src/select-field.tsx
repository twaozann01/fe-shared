import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@twaozann01/ui';
import type { ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormField } from './form-field';
import type { FieldRules } from './rules';

export interface SelectOption {
  value: string;
  label: ReactNode;
}

export interface SelectFieldProps {
  name: string;
  label: ReactNode;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  /** Luật validate của React Hook Form. Bỏ qua nếu app dùng resolver Zod/Yup. */
  rules?: FieldRules;
}

// Dropdown nối RHF: chỉ cần `name` + `label` + `options`. Control lấy từ context.
export function SelectField({
  name,
  label,
  options,
  placeholder,
  required,
  disabled,
  rules,
}: SelectFieldProps) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <FormField label={label} htmlFor={name} required={required} error={fieldState.error?.message}>
          <Select
            value={field.value ?? ''}
            onValueChange={field.onChange}
            disabled={disabled}
            name={field.name}
          >
            <SelectTrigger id={name} onBlur={field.onBlur}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      )}
    />
  );
}
