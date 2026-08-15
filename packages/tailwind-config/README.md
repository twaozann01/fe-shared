# @twaozann/tailwind-config

Preset Tailwind nối class tiện dụng (`bg-primary`, `text-muted-foreground`) với CSS variable của `@twaozann/design-tokens`.

## Tầng

**L0** — chỉ phụ thuộc `tailwindcss-animate`; `tailwindcss` là peer.

## Consumer

Mọi app web dùng Tailwind. Zalo Mini App (zmp-ui) và React Native **không** dùng package này — chúng lấy màu trực tiếp từ `@twaozann/design-tokens`.

## Public API

```ts
// tailwind.config.ts của app
import preset from '@twaozann/tailwind-config';

export default {
  presets: [preset],
  content: ['./index.html', './src/**/*.{ts,tsx}', ...preset.sharedContent],
};
```

`preset.sharedContent` là danh sách glob trỏ vào `dist` của các package UI. **Bắt buộc phải thêm** — thiếu nó Tailwind sẽ purge mất class của thư viện và component hiện ra trần trụi không style.

Preset khai `darkMode: 'class'`. App tự gắn/gỡ class `.dark` trên `<html>`; thư viện không giữ trạng thái theme.

Mọi màu ở đây viết dạng `hsl(var(--token) / <alpha-value>)` nên tất cả tiện ích alpha (`bg-primary/15`, `border-border/50`) đều dùng được.

## Khi nào KHÔNG dùng

- **Đừng thêm giá trị màu thật vào preset này.** Màu chỉ sống ở `design-tokens`; ở đây chỉ có tên biến. Viết ở hai nơi là mở đường cho lệch màu.
- **Đừng thêm spacing/font scale riêng cho một dự án.** Cái đó thuộc `tailwind.config.ts` của app.
