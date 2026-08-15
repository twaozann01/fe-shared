# 03 — Chuyển app cũ sang

Dành cho app **đã có sẵn** component riêng (như `marketplace-fe`), muốn thay dần bằng design system.

**Nguyên tắc: đổi từng lát mỏng, mỗi lát chạy được và test xanh.** Đừng đổi 300 file trong một PR — vỡ ở đâu không ai tìm ra.

---

## Thứ tự làm

Đi từ dưới lên theo tầng. Tầng dưới ổn rồi mới lên tầng trên, vì tầng trên phụ thuộc tầng dưới.

```
1. token + tailwind   →  2. ui  →  3. forms/filters  →  4. feedback/map  →  5. dọn code cũ
```

---

## Bước 1 — Token và Tailwind

Rủi ro thấp nhất, làm trước để thấy ngay có gì lệch màu không.

1. Làm [bước 1–4 của Bắt đầu](01-bat-dau.md).
2. **Xoá** khối `:root` và `.dark` trong `globals.css` của app — token giờ đến từ package.
3. **Xoá** khối `colors` và `borderRadius` trong `tailwind.config.ts` — preset lo rồi.
4. Chạy app, so mắt vài màn.

Nếu lệch màu, gần như chắc chắn app đang có token riêng chưa có trong design system. Hai lựa chọn: dùng token gần nhất, hoặc [thêm token mới](04-dong-gop.md#thêm-token-màu) nếu nó thật sự chung.

> **Sẽ có một khác biệt cố ý:** `Dialog` đổi từ `bg-background` sang `bg-card`. Ở dark mode, bản cũ làm hộp thoại **chìm vào nền trang**, chỉ nhận ra nhờ cái viền. Đây là sửa lỗi, không phải hồi quy.

## Bước 2 — Thay `ui`

Đây là lát lớn nhất. Chia nhỏ ra: một PR cho một nhóm component.

```ts
// trước
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/cn';

// sau
import { Button, cn } from '@twaozann01/ui';
```

Xoá file cũ ngay trong cùng PR — để lại là có ngày hai `Button` khác nhau cùng tồn tại.

### Component cần sửa chỗ gọi

Phần lớn thay import là xong. Bốn cái này đổi API, **có chủ đích**:

| Component | Trước | Sau | Vì sao |
|---|---|---|---|
| `ThemeToggle` | tự đọc `useThemeStore` | `<ThemeToggle />` trong `ThemeProvider` | Thư viện không được biết store của app |
| `LanguageSwitcher` | tự đọc `SUPPORTED_LANGUAGES` | `languages` + `current` + `onChange` | Như trên |
| `NotFound` / `Forbidden` | tự `import { Link }` + `ROUTES` | `action={<Link …/>}` | Thư viện không biết app dùng router nào |
| `TrackingMap` | `repairman` / `repairmanLabel` | `position` / `positionLabel` | Tên theo domain thì dự án khác không dùng được |

### Bỏ được `ConfirmProvider` cũ

App đang có `ConfirmProvider` riêng ở `shared/components/feedback/confirm.tsx`. Bản trong `ui` giống hệt về API — chỉ cần đổi import và xoá file cũ:

```ts
import { ConfirmProvider, useConfirm } from '@twaozann01/ui';
```

## Bước 3 — `forms` và `filters`

```ts
import { Form, TextField, SelectField } from '@twaozann01/forms';
import { FilterBar, SearchInput } from '@twaozann01/filters';
```

**Giữ nguyên** ở app: schema Zod, `createFilterStore`, `usePagination`, `create-crud-hooks`. Đó là nghiệp vụ, không thuộc design system.

`FormField` giờ dịch lỗi qua `translateError` của `UIProvider` thay vì tự gọi `t()`. Khai một lần:

```tsx
<UIProvider translateError={(key) => t(key)}>
```

## Bước 4 — `feedback` và `map`

Xem bảng "cần sửa chỗ gọi" ở bước 2.

## Bước 5 — Dọn

Sau khi hết chỗ dùng, xoá khỏi app:

```
src/shared/components/ui/          →  @twaozann01/ui
src/shared/components/form/        →  @twaozann01/forms
src/shared/components/filter/      →  @twaozann01/filters
src/shared/components/feedback/    →  @twaozann01/feedback
src/shared/components/map/         →  @twaozann01/map
src/shared/lib/cn.ts               →  @twaozann01/ui
src/shared/hooks/use-debounce.ts   →  @twaozann01/ui
src/shared/hooks/use-confirm.ts    →  @twaozann01/ui
```

**Ở lại app** (nghiệp vụ, không phải giao diện):

```
src/shared/api/          src/shared/config/       src/shared/realtime/
src/shared/permissions/  src/shared/constants/    src/shared/i18n/
src/shared/hooks/create-crud-hooks.ts · create-filter-store.ts · use-pagination.ts · use-upload.ts
src/store/
```

---

## Cách nhận biết một thứ có thuộc design system không

> Nếu nó phải **import kiểu dữ liệu hoặc hằng số của một domain cụ thể** thì nó thuộc app, không thuộc design system.

`OrderStatusBadge` biết `OrderStatus` → thuộc app.
`Badge` chỉ biết `variant` → thuộc design system, và app tự map `status → variant`.

---

## Trong lúc chuyển: đừng publish mỗi lần sửa

Sửa design system rồi phải publish mới thử được thì rất chậm. Dùng link cục bộ:

```bash
cd /đường/dẫn/fe-shared/packages/ui && pnpm link --global
cd /đường/dẫn/app && pnpm link --global @twaozann01/ui
```

Nhớ `pnpm build` bên fe-shared sau mỗi lần sửa — app đọc `dist`, không đọc `src`.

Xong việc thì `pnpm unlink --global @twaozann01/ui` rồi cài lại bản đã publish.

---

Tiếp theo: [04 — Đóng góp](04-dong-gop.md) · [05 — Kiến trúc](05-kien-truc.md)
