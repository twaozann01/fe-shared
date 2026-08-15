import { Input } from '@twaozann/ui';
import type { ComponentProps, ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormField } from './form-field';
import type { FieldRules } from './rules';

type InputProps = Omit<ComponentProps<'input'>, 'name' | 'form'>;

export interface TextFieldProps extends InputProps {
  name: string;
  label: ReactNode;
  required?: boolean;
  /** Luật validate của React Hook Form. Bỏ qua nếu app dùng resolver Zod/Yup. */
  rules?: FieldRules;
}

// Ô text nối RHF: chỉ cần `name` + `label`. Control lấy từ context (useFormContext).
export function TextField({ name, label, required, rules, ...inputProps }: TextFieldProps) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <FormField label={label} htmlFor={name} required={required} error={fieldState.error?.message}>
          <Input id={name} {...field} value={field.value ?? ''} {...inputProps} />
        </FormField>
      )}
    />
  );
}
