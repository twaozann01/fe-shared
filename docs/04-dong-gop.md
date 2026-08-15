# 04 — Đóng góp

Thêm hoặc sửa component **trong chính repo này**.

---

## Chuẩn bị

```bash
git clone https://github.com/twaozann01/fe-shared.git
cd fe-shared
pnpm install
pnpm build        # BẮT BUỘC chạy trước — Storybook đọc dist, không đọc src
pnpm storybook    # http://localhost:6006
```

Node ≥20 (CI dùng 22), pnpm 11.6.

---

## Vòng làm việc

```bash
pnpm --filter @twaozann01/ui test --watch   # test chạy nền
pnpm storybook                              # xem bằng mắt
pnpm verify                                 # trước khi mở PR
pnpm changeset                              # mô tả thay đổi
```

`pnpm verify` = guard + lint + typecheck + test + build. **Chạy nó trước khi mở PR** — CI chạy đúng bộ đó, thất bại ở máy nhanh hơn thất bại trên CI.

---

## Thêm component mới

### 1. Nó có thuộc về đây không?

Ba câu hỏi, **sai một câu là không thuộc**:

- Có phải nó **không** import kiểu dữ liệu hay hằng số của một domain cụ thể?
- Có **ít nhất một** chỗ dùng thật, ngay bây giờ?
- Có ≥2 app sẽ dùng, hoặc chắc chắn dự án sau sẽ dùng?

> Component thừa **khó bỏ hơn** component thiếu nhiều. Bỏ một component đã publish là breaking change cho mọi app.

### 2. Đặt vào tầng nào

| Component | Tầng |
|---|---|
| Primitive không phụ thuộc gì | `ui` (L1) |
| Cần React Hook Form | `forms` (L2) |
| Control lọc | `filters` (L2) |
| Trạng thái toàn trang | `feedback` (L2) |
| Cần Leaflet | `map` (L2) |

Không vừa chỗ nào → có thể cần package mới, xem [mục dưới](#thêm-package-mới).

### 3. Viết

```
packages/ui/src/components/tên-component.tsx    kebab-case
packages/ui/src/components/tên-component.test.tsx
apps/storybook/src/ui/tên-component.stories.tsx
```

Rồi thêm export vào `packages/ui/src/index.ts` — **chỉ những gì xuất ở đó mới là hợp đồng**.

### 4. Bốn luật khi viết

**a. Nhận `className` và gộp qua `cn()`.** Không có thì app không tuỳ biến được và sẽ phải `!important`.

```tsx
<div className={cn('flex items-center gap-2', className)} />
```

**b. Màu qua token, không bao giờ viết cứng.**

```tsx
className="bg-primary text-primary-foreground"   // ✅
className="bg-blue-500"                           // ❌ guard:hardcode chặn
className="bg-[#3b82f6]"                          // ❌ chặn
```

**c. Không giữ trạng thái nghiệp vụ.** Nhận `value` + `onChange`.

**d. Không tự dịch.** Chữ component sinh ra → thêm vào `UILabels` trong `provider/labels.ts` (**cả** interface lẫn `defaultLabels`). Chữ app truyền vào → nhận `ReactNode`, app tự dịch trước.

### 5. Story phải phủ trạng thái xấu

Không chỉ trạng thái đẹp. Ít nhất: **rỗng · đang tải · lỗi · chữ dài tràn dòng · disabled**. Đó là lúc design system hay vỡ nhất.

### 6. Test cái gì

Không test "render ra đúng class" — đó là test lại Tailwind. Test **hành vi dễ sai**:

- Logic thuần (`getPageItems`, `mergeLabels`)
- Prop có ưu tiên đè nhau (`emptyMessage` thắng `UIProvider`)
- Bẫy đã biết (chọn Select trong Dialog không làm đóng Dialog)
- Bất biến (lớp mờ nấc sâu phải nằm trên thân nấc nông)

---

## Thêm token màu

1. Thêm tên vào `ColorToken` trong `packages/design-tokens/src/tokens.ts`.
2. Thêm giá trị vào **cả** `lightTokens` và `darkTokens` — TypeScript báo lỗi nếu thiếu một bên.
3. Khai trong `packages/tailwind-config/index.js`.
4. `pnpm build` — `tokens.css` sinh lại tự động.

**Không sửa `tokens.css` bằng tay.** File đó sinh ra lúc build và sẽ bị ghi đè.

---

## Thêm package mới

**Không tự thêm.** Package mới phải được cấp chỗ trong kiến trúc trước:

1. Bổ sung vào bảng tầng ở [README gốc](../README.md).
2. Khai `twaozann.layer` trong `package.json` của nó.
3. Thêm glob vào `sharedContent` của `tailwind-config` nếu nó có class Tailwind.
4. Rồi mới tạo thư mục.

`guard:layers` chặn nếu làm ngược lại — package không khai tầng thì không qua CI.

---

## Ba máy gác

| Lệnh | Chặn gì | Cách sửa khi bị chặn |
|---|---|---|
| `guard:layers` | Dep ngược tầng · package chưa khai tầng | Đảo phụ thuộc bằng props/callback, hoặc chuyển phần dùng chung xuống tầng dưới |
| `guard:hardcode` | `#hex` · `bg-blue-500` · `rgb()` | Dùng token ngữ nghĩa |
| `guard:junk` | Thiếu README/entry · `exports` không trỏ `dist` · file tên `utils.ts` | Theo đúng thông báo lỗi |

**Escape có chủ đích:** thêm `ds-allow: <lý do>` vào đúng dòng đó. Reviewer sẽ soi từng chỗ — đừng dùng để đi tắt.

`black`/`white` không kèm bậc số **được phép** (lớp phủ modal), vì chúng tuyệt đối và không phụ thuộc bảng màu thương hiệu.

---

## README của package

`guard:junk` bắt buộc mỗi package có README **4 mục**:

1. **Tầng** — L0/L1/L2 và import được gì
2. **Consumer** — ai dùng
3. **Public API** — ví dụ dùng thật
4. **Khi nào KHÔNG dùng** — quan trọng nhất, ngăn package phình ra

---

## Changeset

```bash
pnpm changeset
```

Chọn package · chọn mức tăng · viết mô tả.

| Mức | Khi nào |
|---|---|
| `patch` | Sửa lỗi, không đổi API |
| `minor` | Thêm prop/component mới, cũ vẫn chạy |
| `major` | Đổi/xoá API — app phải sửa code |

Mô tả viết cho **người dùng thư viện**, không phải cho người review code:

- ✅ `DialogShell nhận width/height bằng số px khi 5 nấc size không đủ`
- ❌ `refactor DialogShell`

Mọi package tăng version **cùng nhau** — một dòng version cho cả bộ, app không phải nhớ `ui@2.1` hợp với `forms@1.7` hay `1.8`.

CI có job nhắc nếu PR sửa package mà quên changeset. **Cảnh báo chứ không chặn** — PR chỉ sửa docs thì không cần.

---

## Quy ước commit

Conventional Commits:

```
feat(ui): DialogShell nhận cỡ bằng số px
fix(forms): NumberField trả undefined thay vì '' khi ô rỗng
docs: thêm API reference
chore: nâng turbo lên 2.10
```

---

## Phát hành

Xem [mục Phát hành ở README gốc](../README.md#phát-hành). Tóm tắt: merge PR có changeset → CI mở PR version → merge PR đó → CI publish.

Không ai publish thẳng từ máy cá nhân.
