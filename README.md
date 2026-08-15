# fe-shared

[![CI](https://github.com/twaozann01/fe-shared/actions/workflows/ci.yml/badge.svg)](https://github.com/twaozann01/fe-shared/actions/workflows/ci.yml)
[![Release](https://github.com/twaozann01/fe-shared/actions/workflows/release.yml/badge.svg)](https://github.com/twaozann01/fe-shared/actions/workflows/release.yml)

> Design system dùng chung cho các FE web. **Chỉ giao diện** — không http, không nghiệp vụ.
> Mục tiêu: sửa một chỗ là mọi app đổi theo.
>
> Publish dưới scope `@twaozann01/*` trên GitHub Packages.

📖 **[Storybook](https://twaozann01.github.io/fe-shared/)** — xem component chạy thật, đổi light/dark, chỉnh props
📚 **[Tài liệu](docs/README.md)** — [Bắt đầu](docs/01-bat-dau.md) · [Công thức](docs/02-cong-thuc.md) · [Chuyển app cũ](docs/03-chuyen-app-cu.md) · [Đóng góp](docs/04-dong-gop.md) · [Kiến trúc](docs/05-kien-truc.md)
🔎 **[API Reference](docs/api/README.md)** — bảng props đầy đủ từng component

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
pnpm add @twaozann01/design-tokens @twaozann01/ui @twaozann01/forms
```

```ts
// tailwind.config.ts
import preset from '@twaozann01/tailwind-config';

export default {
  presets: [preset],
  content: ['./index.html', './src/**/*.{ts,tsx}', ...preset.sharedContent],
};
```

`preset.sharedContent` **bắt buộc phải có** — thiếu nó Tailwind purge mất class của thư viện và component hiện ra trần trụi.

```tsx
// main.tsx
import '@twaozann01/design-tokens/tokens.css';

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
4. App chạy `pnpm up @twaozann01/design-tokens`.

Xong. Không sửa dòng code nào trong app mà button, badge, ring, link, bảng đều đổi màu — cả light lẫn dark.

## Ranh giới: cái gì KHÔNG vào đây

`http`/axios · store auth · realtime socket · catalog quyền · hằng số trạng thái nghiệp vụ · schema Zod · file dịch của app · route.

Dấu hiệu nhận biết: nếu một thứ phải import kiểu dữ liệu hay hằng số của một domain cụ thể, nó thuộc về app chứ không phải design system.

Zalo Mini App (`zmp-ui`) và React Native **không dùng được component** ở đây vì chúng không chạy Tailwind/DOM — nhưng vẫn dùng chung được **màu** qua `lightColors` / `darkColors` của `@twaozann01/design-tokens`.

## Thêm package mới

Không tự thêm. Package mới phải được cấp chỗ trong kiến trúc trước: bổ sung vào bảng tầng ở README này, khai `twaozann.layer` trong `package.json`, rồi mới tạo thư mục. `guard:layers` sẽ chặn nếu làm ngược lại.

## Phát hành

Đi qua **hai nhịp**, cả hai đều tự động — không ai publish thẳng từ máy cá nhân.

```
sửa code + pnpm changeset  →  merge vào main
        ↓
release.yml thấy có changeset  →  mở PR "chore: version packages"
        ↓                            (tăng version + viết CHANGELOG)
      merge PR đó
        ↓
release.yml thấy hết changeset  →  pnpm verify  →  changeset publish  →  gắn git tag
```

Nhịp đầu cho anh **xem trước** version mới và CHANGELOG trong một PR, thay vì phát hiện sau khi đã lên registry — npm không cho publish đè cùng một version, nên sai là phải bump số.

### Viết changeset

```bash
pnpm changeset      # chọn package + mức tăng (patch/minor/major) + mô tả
git add .changeset && git commit
```

CI có một job nhắc nếu PR sửa package mà quên changeset. Nó **cảnh báo chứ không chặn** — PR chỉ sửa docs hoặc CI thì không cần.

Mọi package tăng version **cùng nhau** (`fixed` trong `.changeset/config.json`): một dòng version duy nhất cho cả bộ, app không phải nhớ `ui@2.1` hợp với `forms@1.7` hay `forms@1.8`.

### Dùng package đã publish trong app khác

GitHub Packages cần xác thực **kể cả với package public**. Trong app tiêu dùng, tạo `.npmrc`:

```
@twaozann01:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

rồi đặt `NODE_AUTH_TOKEN` bằng một Personal Access Token có scope `read:packages`. **Không commit token** — để nó ở biến môi trường hoặc `~/.npmrc`.

```bash
pnpm add @twaozann01/ui @twaozann01/design-tokens @twaozann01/forms
```

### Lưu ý về scope

GitHub Packages **bắt buộc scope npm trùng tên chủ repo**. Chủ repo là `twaozann01` nên scope là `@twaozann01/*`. Muốn tên gọn hơn (`@twaozann/*`) thì phải tạo một GitHub **organization** tên `twaozann` và chuyển repo sang đó — không có cách nào khác.

### Trong lúc phát triển

Không cần publish sau mỗi lần sửa. Dùng `pnpm link` (hoặc `overrides` trỏ đường dẫn) để app đọc thẳng `dist` trong máy, publish chỉ khi thật sự muốn phát hành.
