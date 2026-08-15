import {
  CheckboxField,
  Form,
  MultiSelectField,
  NumberField,
  RadioField,
  SelectField,
  SwitchField,
  TextField,
  TextareaField,
} from '@twaozann01/forms';
import { Button, UIProvider } from '@twaozann01/ui';
import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';

const meta: Meta = {
  title: 'Forms/Bộ field',
  parameters: {
    docs: {
      description: {
        component:
          'Field nối React Hook Form. Lỗi validate có thể là key i18n — khai translateError ở UIProvider để dịch.',
      },
    },
  },
};

export default meta;

interface Values {
  name: string;
  email: string;
  price?: number;
  category: string;
  tags: string[];
  plan: string;
  note: string;
  agree: boolean;
  active: boolean;
}

const categories = [
  { value: 'dien', label: 'Điện' },
  { value: 'nuoc', label: 'Nước' },
];

export const DayDu: StoryObj = {
  name: 'Đầy đủ field',
  render: function Render() {
    const form = useForm<Values>({
      defaultValues: {
        name: '',
        email: '',
        price: undefined,
        category: '',
        tags: [],
        plan: 'thang',
        note: '',
        agree: false,
        active: true,
      },
    });

    return (
      <Form
        form={form}
        onSubmit={(values) => window.alert(JSON.stringify(values, null, 2))}
        className="max-w-md space-y-4"
      >
        <TextField name="name" label="Họ tên" required placeholder="Nguyễn Văn A" />
        <TextField name="email" label="Email" type="email" required />
        <NumberField name="price" label="Giá dịch vụ" />
        <SelectField name="category" label="Danh mục" options={categories} placeholder="Chọn" />
        <MultiSelectField name="tags" label="Thẻ" options={categories} placeholder="Chọn nhiều" />
        <RadioField
          name="plan"
          label="Chu kỳ"
          orientation="horizontal"
          options={[
            { value: 'thang', label: 'Hàng tháng' },
            { value: 'nam', label: 'Hàng năm' },
          ]}
        />
        <TextareaField name="note" label="Ghi chú" />
        <CheckboxField name="agree" label="Tôi đồng ý với điều khoản" />
        <SwitchField name="active" label="Kích hoạt ngay" />
        <Button type="submit">Lưu</Button>
      </Form>
    );
  },
};

export const LoiValidate: StoryObj = {
  name: 'Lỗi validate (có dịch)',
  render: function Render() {
    const form = useForm<Pick<Values, 'email'>>({ defaultValues: { email: '' } });
    const dictionary: Record<string, string> = {
      'validation.required': 'Vui lòng nhập trường này',
      'validation.email': 'Email sai định dạng',
    };

    return (
      <UIProvider translateError={(key) => dictionary[key] ?? key}>
        <Form
          form={form}
          onSubmit={() => undefined}
          className="max-w-md space-y-4"
        >
          <TextField
            name="email"
            label="Email"
            required
            // Schema Zod thường trả về key i18n thay vì câu tiếng Việt.
            rules={{ required: 'validation.required' }}
          />
          <Button type="submit">Kiểm tra</Button>
        </Form>
      </UIProvider>
    );
  },
};
