# `@twaozann01/design-tokens`

**Tầng L0** · không phụ thuộc package nào · [README](../../packages/design-tokens/README.md)

Nguồn chân lý duy nhất của bảng màu. Đổi một giá trị ở đây là toàn bộ app đổi theo.

```ts
import {
  lightTokens, darkTokens,
  lightColors, darkColors,
  colorTokenNames, radius, hsl,
  type ColorToken, type ColorScale,
} from '@twaozann01/design-tokens';

import '@twaozann01/design-tokens/tokens.css';
```

---

## Export

| Export | Kiểu | Mô tả |
|---|---|---|
| `lightTokens` | `ColorScale` | 25 token, dạng bộ ba HSL **trần** (`'217 91% 60%'`) |
| `darkTokens` | `ColorScale` | Bản dark của cùng 25 token |
| `lightColors` | `Record<ColorToken, string>` | Cùng token nhưng bọc `hsl(...)` — dùng được ngay |
| `darkColors` | `Record<ColorToken, string>` | Bản dark |
| `colorTokenNames` | `ColorToken[]` | Danh sách tên, thứ tự ổn định |
| `radius` | `string` | `'0.5rem'` — bo góc gốc |
| `hsl(token)` | `(string) => string` | Bọc bộ ba HSL thành `hsl(...)` |
| `tokens.css` | file CSS | Khai `:root` và `.dark`, **sinh tự động** lúc build |

### Vì sao HSL trần, không bọc `hsl()`

Tailwind cần dạng trần để ghép được alpha:

```js
primary: 'hsl(var(--primary) / <alpha-value>)'
```

Nhờ vậy `bg-primary/15` mới chạy. Bọc sẵn `hsl()` là mất toàn bộ tiện ích alpha.

---

## 25 token

### 11 cặp nền / chữ

Mỗi cặp gồm `x` (màu nền) và `x-foreground` (màu chữ đặt trên nền đó). Luôn dùng theo cặp — đó là cách duy nhất bảo đảm đủ tương phản ở cả hai theme.

| Token | Dùng cho |
|---|---|
| `background` · `foreground` | Nền trang và chữ chính |
| `card` · `card-foreground` | Nền khối nổi: Card, Dialog, Sheet, Drawer |
| `popover` · `popover-foreground` | Nền lớp nổi: Popover, Select, menu |
| `primary` · `primary-foreground` | Hành động chính — nút Lưu, link, ring |
| `secondary` · `secondary-foreground` | Hành động phụ |
| `muted` · `muted-foreground` | Nền chìm và chữ phụ |
| `accent` · `accent-foreground` | Trạng thái hover, header được nhấn |
| `destructive` · `destructive-foreground` | Xoá, huỷ, lỗi |
| `success` · `success-foreground` | Hoàn tất |
| `warning` · `warning-foreground` | Cần chú ý |
| `info` · `info-foreground` | Thông tin trung tính |

### 3 token đơn

| Token | Dùng cho |
|---|---|
| `border` | Mọi đường viền |
| `input` | Viền ô nhập liệu |
| `ring` | Vòng focus |

### 1 token không màu

| Token | Giá trị |
|---|---|
| `radius` | `0.5rem` — Tailwind suy ra `rounded-md` = radius−2px, `rounded-sm` = radius−4px |

---

## Ba nấc độ sâu

Thiết kế cố ý giữ ba nấc phân biệt, rõ nhất ở dark mode:

```
trang (background)  <  hộp thoại (card)  <  ô nhập & popover (popover)
```

Đây là lý do `Dialog` dùng `bg-card` chứ không `bg-background`: dùng `background` thì hộp thoại **cùng màu với trang phía sau**, chỉ còn nhận ra nhờ cái viền.

---

## Dùng ngoài Tailwind

Zalo Mini App (`zmp-ui`) và React Native không có CSS variables. Lấy màu dạng chuỗi:

```ts
import { lightColors, darkColors } from '@twaozann01/design-tokens';

const colors = isDark ? darkColors : lightColors;

// React Native
const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,          // 'hsl(217 91% 60%)'
    color: colors['primary-foreground'],
  },
});
```

Đây là cách **duy nhất** dùng chung được thiết kế giữa web và hai môi trường kia — component thì không dùng chung được vì chúng không chạy Tailwind/DOM.

---

## Đổi bảng màu

1. Sửa `packages/design-tokens/src/tokens.ts` — **không sửa `tokens.css`**, file đó sinh tự động lúc build và sẽ bị ghi đè.
2. `pnpm changeset` → mô tả thay đổi.
3. Merge PR version → CI publish.
4. App chạy `pnpm up @twaozann01/design-tokens`.

Xong. Không sửa dòng code nào trong app mà button, badge, ring, link, bảng đều đổi màu — cả light lẫn dark.

## Thêm token mới

Sửa `ColorToken` trong `tokens.ts`, thêm giá trị vào **cả** `lightTokens` và `darkTokens` (TypeScript sẽ báo lỗi nếu thiếu một bên), rồi khai trong preset ở `packages/tailwind-config/index.js`.

**Đừng thêm màu chỉ một dự án cần.** Token ở đây là ngôn ngữ chung; màu riêng của một app thì để trong app đó.
