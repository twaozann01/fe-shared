# 01 — Bắt đầu

Cắm design system vào một app React + Vite + Tailwind. Mất khoảng 10 phút.

---

## Bước 1 — Cho phép máy tải package

GitHub Packages **yêu cầu xác thực kể cả với package public**. Đây là chỗ hay vấp nhất, làm đúng một lần rồi thôi.

Tạo Personal Access Token (classic) tại https://github.com/settings/tokens, tick đúng một quyền: **`read:packages`**.

Rồi thêm vào `~/.npmrc` — file này nằm ở thư mục người dùng, **ngoài repo**, nên không bao giờ bị commit nhầm:

```ini
//npm.pkg.github.com/:_authToken=ghp_xxxxxxxxxxxx
```

> **Không đặt token vào `.npmrc` của dự án.** File đó nằm trong git, đẩy lên là lộ token. Nếu lỡ, vào https://github.com/settings/tokens thu hồi ngay rồi tạo cái mới.

Trong **repo của app**, tạo `.npmrc` (không có token):

```ini
@twaozann01:registry=https://npm.pkg.github.com
```

## Bước 2 — Cài

```bash
pnpm add @twaozann01/design-tokens @twaozann01/ui
pnpm add -D @twaozann01/tailwind-config

# thêm khi cần:
pnpm add @twaozann01/forms react-hook-form     # form
pnpm add @twaozann01/filters                   # thanh lọc
pnpm add @twaozann01/feedback                  # 404 · 403 · ErrorBoundary
pnpm add @twaozann01/map leaflet react-leaflet # bản đồ
```

`react-hook-form`, `leaflet`, `react-leaflet` là **peerDependency** — app tự cài, để không bị hai bản khác nhau cùng chạy.

## Bước 3 — Tailwind

```ts
// tailwind.config.ts
import preset from '@twaozann01/tailwind-config';
import type { Config } from 'tailwindcss';

export default {
  presets: [preset],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    ...preset.sharedContent, // ← BẮT BUỘC
  ],
} satisfies Config;
```

> **`preset.sharedContent` thiếu là hỏng.** Tailwind chỉ sinh CSS cho class nó **nhìn thấy trong file nguồn**. Không trỏ vào `dist` của thư viện thì class của component bị purge sạch, và anh sẽ thấy nút hiện ra trần trụi không màu không bo góc — mà không có lỗi nào báo cả.

## Bước 4 — Nạp token màu

```css
/* src/styles/globals.css — @import phải đứng TRƯỚC mọi thứ khác */
@import '@twaozann01/design-tokens/tokens.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * { @apply border-border; }
  body { @apply bg-background text-foreground; }
}
```

## Bước 5 — Bọc provider

```tsx
// src/main.tsx
import { ThemeProvider, UIProvider, ConfirmProvider } from '@twaozann01/ui';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import './styles/globals.css';

function Providers({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();

  return (
    <ThemeProvider defaultTheme="system">
      <UIProvider
        labels={{ table: { empty: t('table.empty') } }}
        onError={(message) => toast.error(message)}
        translateError={(key) => t(key)}
      >
        <ConfirmProvider>{children}</ConfirmProvider>
      </UIProvider>
    </ThemeProvider>
  );
}
```

Ba provider đều **tuỳ chọn**:

| Provider | Bỏ qua thì sao |
|---|---|
| `ThemeProvider` | Không có dark mode tự động. `<ThemeToggle />` sẽ ném lỗi trừ khi truyền `theme` + `onToggle`. |
| `UIProvider` | Chữ trong component là tiếng Việt mặc định; lỗi ghi ra console thay vì toast. Vẫn chạy. |
| `ConfirmProvider` | `useConfirm()` ném lỗi. Không dùng thì không cần. |

## Bước 6 — Chống nháy trắng (nên làm)

Không có bước này, trang hiện nền **sáng một nhịp** rồi mới nhảy sang tối — vì React chạy sau khi HTML đã vẽ.

```ts
// chạy một lần để lấy chuỗi script
import { getThemeInitScript } from '@twaozann01/ui';
console.log(getThemeInitScript());
```

Dán chuỗi đó vào `<head>` của `index.html`, **trước** thẻ `<script>` của app:

```html
<head>
  <script>/* dán chuỗi vào đây */</script>
</head>
```

## Bước 7 — Thử

```tsx
import { Button, Card, CardContent, ThemeToggle } from '@twaozann01/ui';

export function Demo() {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-6">
        <Button>Nút</Button>
        <ThemeToggle />
      </CardContent>
    </Card>
  );
}
```

Bấm `ThemeToggle` mà nền đổi sáng/tối là xong.

---

## Khi trục trặc

| Hiện tượng | Nguyên nhân gần như chắc chắn |
|---|---|
| Component hiện ra không có style | Thiếu `...preset.sharedContent` trong `content` |
| Màu sai / không có dark mode | Quên `@import '@twaozann01/design-tokens/tokens.css'` |
| `401 Unauthorized` lúc `pnpm add` | Thiếu token trong `~/.npmrc`, hoặc token thiếu quyền `read:packages` |
| `404 Not Found` lúc `pnpm add` | Thiếu dòng `@twaozann01:registry=...` trong `.npmrc` của app |
| `useTheme phải nằm trong <ThemeProvider>` | Chưa bọc `ThemeProvider`, hoặc bọc bên trong component đang gọi |
| Trang nháy trắng rồi mới tối | Chưa làm bước 6 |
| Menu Select chui xuống dưới dialog | Đang dùng `Select` của thư viện khác; dùng `Select` của `@twaozann01/ui` |

---

Tiếp theo: [02 — Công thức](02-cong-thuc.md)
