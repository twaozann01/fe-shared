import { Textarea } from '@twaozann01/ui';
import type { ComponentProps, ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormField } from './form-field';
import type { FieldRules } from './rules';

type TextareaProps = Omit<ComponentProps<'textarea'>, 'name' | 'form'>;

export interface TextareaFieldProps extends TextareaProps {
  name: string;
  label: ReactNode;
  required?: boolean;
  /** Luật validate của React Hook Form. Bỏ qua nếu app dùng resolver Zod/Yup. */
  rules?: FieldRules;
}

// Ô nhập nhiều dòng nối RHF: chỉ cần `name` + `label`. Control lấy từ context.
export function TextareaField({
  name,
  label,
  required,
  rules,
  ...textareaProps
}: TextareaFieldProps) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <FormField label={label} htmlFor={name} required={required} error={fieldState.error?.message}>
          <Textarea id={name} {...field} value={field.value ?? ''} {...textareaProps} />
        </FormField>
      )}
    />
  );
}
