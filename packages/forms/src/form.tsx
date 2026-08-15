import type { FormHTMLAttributes, ReactNode } from 'react';
import {
  FormProvider,
  type FieldValues,
  type SubmitHandler,
  type UseFormReturn,
} from 'react-hook-form';

export interface FormProps<T extends FieldValues>
  extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  /** Đối tượng trả về từ useForm() — cung cấp control cho các *Field qua context. */
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  children: ReactNode;
}

// Bọc form RHF: cấp context (FormProvider) + thẻ <form> đã gắn handleSubmit + noValidate.
// Nhờ context, các <TextField>/<SelectField>… tự lấy control, không cần truyền tay.
export function Form<T extends FieldValues>({ form, onSubmit, children, ...props }: FormProps<T>) {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate {...props}>
        {children}
      </form>
    </FormProvider>
  );
}
