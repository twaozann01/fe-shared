import { Input } from '@twaozann/ui';
import type { ComponentProps, ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormField } from './form-field';
import type { FieldRules } from './rules';

type NumberInputProps = Omit<
  ComponentProps<'input'>,
  'name' | 'form' | 'type' | 'value' | 'onChange'
>;

export interface NumberFieldProps extends NumberInputProps {
  name: string;
  label: ReactNode;
  required?: boolean;
  /** Luật validate của React Hook Form. Bỏ qua nếu app dùng resolver Zod/Yup. */
  rules?: FieldRules;
}

// Ô số nối RHF: tự ép string→number (rỗng → undefined) để gửi đúng kiểu cho BE.
export function NumberField({ name, label, required, rules, ...inputProps }: NumberFieldProps) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <FormField label={label} htmlFor={name} required={required} error={fieldState.error?.message}>
          <Input
            id={name}
            type="number"
            inputMode="decimal"
            ref={field.ref}
            name={field.name}
            value={field.value ?? ''}
            onBlur={field.onBlur}
            onChange={(e) => {
              const v = e.target.value;
              field.onChange(v === '' ? undefined : Number(v));
            }}
            {...inputProps}
          />
        </FormField>
      )}
    />
  );
}
