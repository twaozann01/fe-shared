import type { RegisterOptions } from 'react-hook-form';

/**
 * Luật validate truyền thẳng xuống `Controller` của React Hook Form.
 *
 * Dùng cho app validate bằng `rules` thay vì resolver (Zod/Yup). App nào dùng resolver
 * thì bỏ qua prop này — nhưng không có nó thì wrapper sẽ nghèo hơn `Controller` trần,
 * và người dùng buộc phải bỏ wrapper để validate được.
 *
 * Bốn key bị loại là những key `Controller` không nhận (chúng thuộc `register`).
 */
export type FieldRules = Omit<
  RegisterOptions,
  'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
>;
