import { MultiSelect, type MultiSelectOption } from '@twaozann/ui';
import type { ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormField } from './form-field';
import type { FieldRules } from './rules';

export interface MultiSelectFieldProps {
  name: string;
  label: ReactNode;
  options: MultiSelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  /** Luật validate của React Hook Form. Bỏ qua nếu app dùng resolver Zod/Yup. */
  rules?: FieldRules;
}

// Chọn nhiều nối RHF. Giá trị field là string[] → defaultValues của field phải là [].
export function MultiSelectField({
  name,
  label,
  options,
  placeholder,
  required,
  disabled,
  rules,
}: MultiSelectFieldProps) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <FormField label={label} htmlFor={name} required={required} error={fieldState.error?.message}>
          <MultiSelect
            id={name}
            value={field.value ?? []}
            onChange={field.onChange}
            options={options}
            placeholder={placeholder}
            disabled={disabled}
          />
        </FormField>
      )}
    />
  );
}
