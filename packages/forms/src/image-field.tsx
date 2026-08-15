import { ImageUpload } from '@twaozann01/ui';
import type { ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormField } from './form-field';
import type { FieldRules } from './rules';

export interface ImageFieldProps {
  name: string;
  label: ReactNode;
  required?: boolean;
  disabled?: boolean;
  accept?: string;
  maxSizeMB?: number;
  /** Luật validate của React Hook Form. Bỏ qua nếu app dùng resolver Zod/Yup. */
  rules?: FieldRules;
}

// Chọn 1 ảnh nối RHF. Giá trị field là File | string (URL cũ) | null → defaultValues nên là null.
// Việc upload lên server do app làm lúc submit — design system không gọi API.
export function ImageField({
  name,
  label,
  required,
  disabled,
  accept,
  maxSizeMB,
  rules,
}: ImageFieldProps) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <FormField label={label} htmlFor={name} required={required} error={fieldState.error?.message}>
          <ImageUpload
            id={name}
            value={field.value ?? null}
            onChange={field.onChange}
            onBlur={field.onBlur}
            disabled={disabled}
            accept={accept}
            maxSizeMB={maxSizeMB}
          />
        </FormField>
      )}
    />
  );
}
