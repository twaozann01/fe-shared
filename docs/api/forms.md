# `@twaozann01/forms`

**Tầng L2** · import `@twaozann01/ui` · [README](../../packages/forms/README.md)

Field wrapper nối React Hook Form với control của `ui`: nhãn, dấu bắt buộc, dòng lỗi và khoảng cách đồng nhất trên mọi form.

**peerDependencies:** `react` ≥18 · `react-dom` ≥18 · `react-hook-form` ≥7.50

```ts
import { Form, TextField, SelectField /* … */ } from '@twaozann01/forms';
```

Không dùng React Hook Form thì **không cần package này** — `@twaozann01/ui` vẫn dùng độc lập được.

---

## Bảng tra nhanh

| Component | Kiểu giá trị | `defaultValues` phải là | Control bên dưới |
|---|---|---|---|
| `TextField` | `string` | `''` | `Input` |
| `TextareaField` | `string` | `''` | `Textarea` |
| `NumberField` | `number \| undefined` | `undefined` | `Input type="number"` |
| `SelectField` | `string` | `''` | `Select` |
| `RadioField` | `string` | `''` | `RadioGroup` |
| `MultiSelectField` | `string[]` | `[]` | `MultiSelect` |
| `ImageField` | `File \| string \| null` | `null` | `ImageUpload` |
| `CheckboxField` | `boolean` | `false` | `Checkbox` |
| `SwitchField` | `boolean` | `false` | `Switch` |

> **Sai `defaultValues` là React cảnh báo "changing an uncontrolled input to be controlled".** Đặc biệt lưu ý `NumberField` phải là `undefined` chứ không phải `''` hay `0` — `0` là một giá trị hợp lệ, không phải "trống".

---

## `Form`

Bọc form: cấp context (`FormProvider`) + thẻ `<form>` đã gắn `handleSubmit` và `noValidate`. Nhờ context, các `*Field` tự lấy `control`, không phải truyền tay.

| Prop | Kiểu | Mô tả |
|---|---|---|
| `form` | `UseFormReturn<T>` | **Bắt buộc** — đối tượng trả về từ `useForm()` |
| `onSubmit` | `SubmitHandler<T>` | **Bắt buộc** |
| `children` | `ReactNode` | **Bắt buộc** |
| …`FormHTMLAttributes` trừ `onSubmit` | | `id`, `className`… |

```tsx
const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues });

<Form form={form} onSubmit={onSubmit} className="space-y-4">
  <TextField name="email" label={t('auth.email')} required />
  <Button type="submit">{t('common.save')}</Button>
</Form>
```

`noValidate` là cố ý: để validate của Zod/RHF chạy, không để trình duyệt hiện bong bóng lỗi tiếng Anh của riêng nó.

### Nút Lưu nằm ngoài `<Form>`

Khi chân dialog tách khỏi thân (xem [`DialogShell`](ui.md#dialogshell)), nối bằng cặp `id` + `form`:

```tsx
<DialogShell footer={<Button type="submit" form="my-form">Lưu</Button>}>
  <Form id="my-form" form={form} onSubmit={onSubmit}>…</Form>
</DialogShell>
```

---

## `FormField`

Wrapper dùng chung: nhãn + control + dòng lỗi. **Không tự render input** — bọc bất kỳ control nào để đồng nhất khoảng cách và cách hiện lỗi.

| Prop | Kiểu | Mô tả |
|---|---|---|
| `label` | `ReactNode` | **Bắt buộc** — chuỗi **đã dịch sẵn** |
| `children` | `ReactNode` | **Bắt buộc** — control thật |
| `htmlFor` | `string` | id của control, để gắn `<label htmlFor>` |
| `error` | `string` | Thông điệp lỗi; đi qua `translateError` của `UIProvider` |
| `required` | `boolean` | Gắn dấu `*` màu destructive sau nhãn |
| `className` | `string` | |

Dùng độc lập được khi cần bọc control tự viết mà vẫn giữ đúng nhãn/lỗi/khoảng cách.

> `required` **chỉ là dấu hiệu thị giác**. Việc bắt buộc thật nằm ở schema (`z.string().min(1)`) hoặc `rules`.

---

## Props chung của mọi `*Field`

| Prop | Kiểu | Mô tả |
|---|---|---|
| `name` | `string` | **Bắt buộc** — tên field trong form |
| `label` | `ReactNode` | **Bắt buộc** — chuỗi đã dịch sẵn |
| `rules` | `FieldRules` | Luật validate của RHF. Bỏ qua nếu app dùng resolver Zod/Yup |
| `required` | `boolean` | Dấu `*` (trừ `CheckboxField`/`SwitchField` không có nhãn kiểu đó) |
| `disabled` | `boolean` | |

`FieldRules` = `RegisterOptions` bỏ bốn key mà `Controller` không nhận (`valueAsNumber`, `valueAsDate`, `setValueAs`, `disabled` — chúng thuộc `register`).

---

## Từng field

### `TextField` · `TextareaField`

Nhận thêm **mọi props của `<input>` / `<textarea>`** (`placeholder`, `type`, `maxLength`, `rows`…) trừ `name` và `form`.

```tsx
<TextField name="email" label={t('auth.email')} type="email" required />
<TextareaField name="note" label={t('order.note')} rows={4} />
```

### `NumberField`

Tự ép `string → number`; ô rỗng thành `undefined` chứ không phải `0` hay `''`, để gửi đúng kiểu lên BE.

Nhận props của `<input>` trừ `name` `form` `type` `value` `onChange`.

### `SelectField`

| Prop | Kiểu | Mô tả |
|---|---|---|
| `options` | `SelectOption[]` | **Bắt buộc** — `{ value: string; label: ReactNode }` |
| `placeholder` | `string` | |

### `RadioField`

| Prop | Kiểu | Mặc định | Mô tả |
|---|---|---|---|
| `options` | `RadioOption[]` | — | **Bắt buộc** — `{ value: string; label: ReactNode }` |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | |

Hiện **tất cả** lựa chọn cùng lúc — chọn `RadioField` khi có ≤5 lựa chọn và người dùng cần so sánh; nhiều hơn thì dùng `SelectField`.

### `MultiSelectField`

| Prop | Kiểu | Mô tả |
|---|---|---|
| `options` | `MultiSelectOption[]` | **Bắt buộc** |
| `placeholder` | `string` | |

### `ImageField`

| Prop | Kiểu | Mặc định |
|---|---|---|
| `accept` | `string` | `'image/*'` |
| `maxSizeMB` | `number` | `5` |

Giá trị field là `File | string | null`. **Upload do app làm lúc submit** — xem [công thức](../02-cong-thuc.md#chọn-ảnh).

### `CheckboxField` · `SwitchField`

Chỉ nhận `name` · `label` · `disabled` · `rules`.

Không dùng `FormField` vì nhãn nằm **bên phải** ô tích, không nằm trên như các field khác.

---

## Lỗi validate và i18n

Schema Zod thường trả **key i18n** thay vì câu tiếng Việt, để một schema dùng cho nhiều ngôn ngữ:

```ts
const schema = z.object({
  email: z.string().email('validation.email'),
});
```

Khai hàm dịch **một lần** ở gốc app:

```tsx
<UIProvider translateError={(key) => t(key)}>
```

Không khai thì chuỗi hiển thị nguyên trạng — schema viết thẳng tiếng Việt vẫn chạy bình thường.

---

## Khi nào KHÔNG dùng

- **Đừng đưa schema Zod của một dự án vào package này.** Schema là nghiệp vụ; package chỉ lo cách vẽ field.
- **Đừng thêm field tự gọi API** (vd `<RepairmanPicker>` tự fetch danh sách thợ). Truyền `options` từ ngoài vào.
