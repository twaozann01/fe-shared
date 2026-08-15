# twaozann-shared

> Design system dùng chung cho các FE web. **Chỉ giao diện** — không http, không nghiệp vụ.
> Mục tiêu: sửa một chỗ là mọi app đổi theo.

## Bản đồ tầng

| Tầng | Package | Luật |
|---|---|---|
| **L2** | `forms` · `filters` · `feedback` · `map` | import L1↓ |
| **L1** | `ui` | import L0↓ |
| **L0** | `design-tokens` · `tailwind-config` · `eslint-config` · `typescript-config` | không import ai |

`apps/storybook` đứng ngoài graph (bậc `app`) — nó chỉ tiêu thụ thư viện.

Luật một chiều này không phải thủ tục: nó là thứ phát hiện ra chỗ nào đang lẫn cái riêng của một dự án vào cái chung. Không có nó, sáu tháng nữa thư viện sẽ đầy những sợi dây kéo ngược về app đầu tiên, và dự án thứ hai cắm vào không chạy.

## Máy gác (chạy mọi PR)

| Lệnh | Gác gì |
|---|---|
| `pnpm guard:layers` | Dep ngược tầng · package chưa khai `twaozann.layer` |
| `pnpm guard:hardcode` | Mã hex · màu thô Tailwind (`bg-blue-500`) · `rgb()` |
| `pnpm guard:junk` | Thiếu README/entry · `exports` không trỏ `dist` · file tên `utils.ts`/`helpers.ts` |
| `pnpm verify` | guard + lint + typecheck + test + build — chạy trước khi mở PR |

`guard:hardcode` là cái quan trọng nhất: chỉ cần **một** chỗ viết `bg-[#3b82f6]` là cơ chế token thủng — đổi `--primary` sẽ không đổi được chỗ đó, và giao diện lệch dần.

Escape có chủ đích: thêm `ds-allow: <lý do>` vào đúng dòng đó, reviewer sẽ soi từng chỗ.

## Bắt đầu

```bash
pnpm install
pnpm build          # design-tokens sinh dist/tokens.css, các package build ra dist
pnpm storybook      # http://localhost:6006 — xem toàn bộ component, đổi light/dark
pnpm verify         # chạy trọn bộ kiểm tra
```

## Dùng trong một app

```bash
pnpm add @twaozann/design-tokens @twaozann/ui @twaozann/forms
```

```ts
// tailwind.config.ts
import preset from '@twaozann/tailwind-config';

export default {
  presets: [preset],
  content: ['./index.html', './src/**/*.{ts,tsx}', ...preset.sharedContent],
};
```

`preset.sharedContent` **bắt buộc phải có** — thiếu nó Tailwind purge mất class của thư viện và component hiện ra trần trụi.

```tsx
// main.tsx
import '@twaozann/design-tokens/tokens.css';

<ThemeProvider defaultTheme="system">
  <UIProvider labels={{ table: { empty: t('table.empty') } }} translateError={(k) => t(k)}>
    <App />
  </UIProvider>
</ThemeProvider>
```

## Đổi màu toàn bộ hệ thống

1. Sửa giá trị trong `packages/design-tokens/src/tokens.ts` — đây là **nguồn chân lý duy nhất**; `tokens.css` được sinh tự động lúc build.
2. `pnpm changeset` → ghi một dòng mô tả thay đổi.
3. `pnpm release`.
4. App chạy `pnpm up @twaozann/design-tokens`.

Xong. Không sửa dòng code nào trong app mà button, badge, ring, link, bảng đều đổi màu — cả light lẫn dark.

## Ranh giới: cái gì KHÔNG vào đây

`http`/axios · store auth · realtime socket · catalog quyền · hằng số trạng thái nghiệp vụ · schema Zod · file dịch của app · route.

Dấu hiệu nhận biết: nếu một thứ phải import kiểu dữ liệu hay hằng số của một domain cụ thể, nó thuộc về app chứ không phải design system.

Zalo Mini App (`zmp-ui`) và React Native **không dùng được component** ở đây vì chúng không chạy Tailwind/DOM — nhưng vẫn dùng chung được **màu** qua `lightColors` / `darkColors` của `@twaozann/design-tokens`.

## Thêm package mới

Không tự thêm. Package mới phải được cấp chỗ trong kiến trúc trước: bổ sung vào bảng tầng ở README này, khai `twaozann.layer` trong `package.json`, rồi mới tạo thư mục. `guard:layers` sẽ chặn nếu làm ngược lại.

## Publish

Scope hiện tại là `@twaozann/*`. GitHub Packages **bắt buộc scope trùng tên chủ repo**, nên nếu publish dưới tài khoản `twaozann01` thì phải đổi scope thành `@twaozann01/*` và bỏ comment hai dòng registry trong `.npmrc`.
