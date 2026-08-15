# @twaozann01/forms

Field wrapper nối React Hook Form với control của `@twaozann01/ui`: nhãn, dấu bắt buộc, dòng lỗi và khoảng cách đồng nhất trên mọi form.

## Tầng

**L2** — import `@twaozann01/ui` (L1). `react-hook-form` là **peerDependency**, app tự cài.

## Consumer

App web có form. Không dùng RHF thì không cần package này — `@twaozann01/ui` vẫn dùng độc lập được.

## Public API

```tsx
const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues });

<Form form={form} onSubmit={onSubmit} className="space-y-4">
  <TextField name="email" label={t('auth.email')} required />
  <SelectField name="role" label={t('user.role')} options={roleOptions} />
  <SwitchField name="isActive" label={t('user.active')} />
  <Button type="submit">{t('common.save')}</Button>
</Form>
```

| Component | Kiểu giá trị | `defaultValues` nên là |
|---|---|---|
| `TextField` · `TextareaField` | `string` | `''` |
| `NumberField` | `number \| undefined` | `undefined` |
| `SelectField` · `RadioField` | `string` | `''` |
| `MultiSelectField` | `string[]` | `[]` |
| `ImageField` | `File \| string \| null` | `null` |
| `CheckboxField` · `SwitchField` | `boolean` | `false` |

`FormField` dùng được độc lập để bọc control tự viết mà vẫn giữ đúng nhãn/lỗi/khoảng cách.

### Lỗi validate và i18n

Schema Zod thường trả **key i18n** (`'validation.email'`) thay vì câu tiếng Việt, để một schema dùng cho nhiều ngôn ngữ. Khai hàm dịch một lần ở gốc app:

```tsx
<UIProvider translateError={(key) => t(key)}>
```

Không khai thì chuỗi hiển thị nguyên trạng — schema viết thẳng tiếng Việt vẫn chạy bình thường.

## Khi nào KHÔNG dùng

- **Đừng đưa schema Zod của một dự án vào đây.** Schema là nghiệp vụ; package này chỉ lo cách vẽ field.
- **Đừng thêm field gọi API** (vd `<RepairmanPicker>` tự fetch danh sách thợ). Truyền `options` từ ngoài vào; việc lấy dữ liệu thuộc app.
- **Đừng thêm `zod` hay `@hookform/resolvers` vào dependencies** — package này không cần biết app validate bằng gì.
