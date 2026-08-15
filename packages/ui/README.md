# @twaozann/ui

Primitives giao diện: nút, thẻ, bảng, hộp thoại, và toàn bộ control nhập liệu.

## Tầng

**L1** — chỉ import `@twaozann/design-tokens` (gián tiếp, qua class Tailwind). Không import package L2 nào.

## Consumer

Mọi app web dùng React + Tailwind, và các package L2 (`forms`, `filters`, `feedback`, `map`).

## Public API

Xem `src/index.ts` — chỉ những gì xuất ở đó mới là hợp đồng.

### Cài đặt trong app

```tsx
// main.tsx
import '@twaozann/design-tokens/tokens.css';

<ThemeProvider defaultTheme="system">
  <UIProvider
    labels={{ table: { empty: t('table.empty') } }}   // tuỳ chọn
    onError={(msg) => toast.error(msg)}               // tuỳ chọn
    translateError={(key) => t(key)}                  // tuỳ chọn
  >
    <App />
  </UIProvider>
</ThemeProvider>
```

`UIProvider` **không bắt buộc** — không bọc thì component rơi về bản chữ mặc định tiếng Việt và `onError` ghi ra console. Bọc khi muốn nối vào i18n và toast của app.

### Theme sáng/tối

`ThemeProvider` là thứ **duy nhất** app cần để có dark mode. Nó nhớ lựa chọn vào `localStorage`, theo được cài đặt hệ điều hành (`system`), và gắn class `.dark` lên `<html>` — đúng chỗ Tailwind `darkMode: 'class'` tìm.

```tsx
const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

<ThemeToggle />              // tự lấy trạng thái từ ThemeProvider
<ThemeToggle iconOnly />     // chỉ icon, hợp header chật
```

`theme` là lựa chọn của người dùng (`light` | `dark` | `system`); `resolvedTheme` là theme đang thật sự hiển thị. Đổi cài đặt hệ điều hành lúc đang mở app thì giao diện tự đổi theo.

**Chống nháy trắng lúc tải trang.** Không có bước này, trang hiện nền sáng một nhịp rồi mới nhảy sang tối. Dán script vào `<head>` của `index.html`, trước khi React chạy:

```ts
import { getThemeInitScript } from '@twaozann/ui';
console.log(getThemeInitScript()); // chép chuỗi này vào <script> trong index.html
```

App nào đã có store theme riêng thì bỏ qua `ThemeProvider` và dùng `<ThemeToggle theme={...} onToggle={...} />` ở chế độ controlled.

### Dialog — bốn cái bẫy đã vá sẵn

Radix portal nội dung của `Select`/`Popover` ra thẳng `document.body`, tức **ngoài** cây DOM của Dialog. Sinh ra bốn lỗi mà build vẫn xanh, không exception, chỉ hành vi sai:

| Lỗi | Vá bằng |
|---|---|
| Bấm option của Select trong Dialog → Dialog đóng theo | `isInsidePortalledLayer` |
| Select đang mở, bấm ra ngoài → đóng luôn Dialog | `hasOpenPortalledLayer` (chụp trạng thái ở pha capture) |
| Double-click option → Dialog đóng, mất dữ liệu form | `hasRecentlyClosedPortalledLayer` (ân hạn 300ms) |
| Cả trang không bấm được, phải F5 | `unstickBodyPointerEvents` |

Ngoài ra `z-index` **suy theo độ sâu lồng nhau** thay vì cố định: dialog mở từ trong dialog khác tự nhảy lên nấc trên và phủ bóng trọn cái dưới. `Select`/`Popover` đứng ở `POPPER_Z` — trên mọi nấc dialog, nếu không thì menu xổ ra trong dialog sẽ chui xuống dưới chính nó.

Toàn bộ là hành vi mặc định, app không phải làm gì. `Sheet` và `Drawer` dùng chung đúng bộ guard này (`lib/use-modal-dismiss.ts`); `AlertDialog` không cần vì nó vốn không đóng khi bấm ra ngoài.

### Bốn họ hộp thoại — một bề mặt, một ngăn xếp

| Component | Khi nào dùng | Đóng khi bấm ra ngoài |
|---|---|---|
| `Dialog` | Hộp thoại thường | Có |
| `DialogShell` | Dialog có khung 3 tầng: header viền dưới · thân tự cuộn · chân viền trên | Có |
| `AlertDialog` | Cảnh báo buộc chọn một trong hai nút | **Không** (Esc vẫn đóng) |
| `Sheet` | Panel trượt từ cạnh (trái/phải/trên/dưới) | Có |
| `Drawer` | Như Sheet nhưng **kéo để đóng** — cử chỉ mobile | Có |

Cả năm dùng chung `components/dialog-surface.ts` (nền · lớp mờ · cỡ tiêu đề · cỡ mô tả · 6 hằng cho khung 3 tầng) — cùng vai trò với `field.ts` ở phía control nhập liệu. Sửa một chỗ là cả năm đổi theo, và mở hai cái liên tiếp không thấy lệch nhịp lề.

`AlertDialog` nằm ở nấc `urgent` (+4 cùng nấc), nên cảnh báo khai ở cấp trang vẫn cắt ngang được dialog đang mở.

### `DialogShell` — cỡ bằng số px

```tsx
<DialogShell title="Sửa dịch vụ" icon={<Wrench />} size="lg" footer={<>…</>}>
```

Năm nấc `size`: `sm` `md` `lg` `xl` `full`. Khi năm nấc không đủ thì truyền `width` / `maxWidth` / `height` bằng **số px**.

Vì sao là số chứ không phải class: `SIZES` khai `sm:max-w-*` (có tiền tố breakpoint). Truyền `max-w-[900px]` không tiền tố qua `className` thì tailwind-merge coi là thuộc tính khác nên **giữ cả hai**, và từ 640px trở lên cái `sm:` thắng — ô không rộng ra. Người viết thấy "không ăn" liền thêm `!important`. Số đi vào inline `style` nên không đấu độ ưu tiên với class nào cả, và tự kẹp theo màn để không tràn mép trên điện thoại.

Thứ tự đè: `width` > `maxWidth` > `size` · `height` > `maxHeight`. Có cỡ bằng số thì class cỡ bị bỏ hẳn — để lại là hai nguồn cùng nói về bề rộng.

### Hộp thoại xác nhận

```tsx
<ConfirmProvider><App /></ConfirmProvider>

const confirm = useConfirm();
if (await confirm({ description: 'Xoá đơn này?', destructive: true })) {
  await deleteOrder(id);
}
```

`confirm()` trả `Promise<boolean>` nên viết được `if (await ...)` liền mạch — không phải dựng `useState(openDeleteDialog)` ở từng màn hình. Cả app dùng chung **một** Dialog nằm trong provider. Bấm ra ngoài hoặc nhấn Esc = từ chối.

### Ba quy tắc thiết kế xuyên suốt

1. **Không giữ trạng thái nghiệp vụ.** `LanguageSwitcher` nhận `languages` + `current` + `onChange`; danh sách đơn hàng, người dùng, quyền hạn — tất cả là việc của app. Ngoại lệ có chủ đích duy nhất là **theme**: nó thuộc về giao diện chứ không phải nghiệp vụ, và để mỗi dự án tự viết lại thì đúng là thứ design system sinh ra để tránh.
2. **Không tự dịch.** Mọi chữ component sinh ra đều đi qua `UIProvider`; nhãn do app truyền (`header`, `label`, `placeholder`) thì truyền chuỗi đã dịch sẵn.
3. **Không gọi API.** `ImageUpload` chỉ chọn + validate file rồi trả `File` ra ngoài; upload là việc của app.

### `fieldBaseClass` — một chỗ sửa, mọi ô nhập đổi theo

`Input`, `Textarea`, `SelectTrigger`, `MultiSelect` đều dựng trên hai hằng trong `components/field.ts`. Muốn đổi border/nền/focus của **tất cả** ô nhập thì sửa đúng ở đó.

## Khi nào KHÔNG dùng

- **Đừng nhét component có nghiệp vụ vào đây** (`OrderStatusBadge`, `RepairmanCard`…). Chúng thuộc app. Dấu hiệu nhận biết: component phải import kiểu dữ liệu hay hằng số của một domain cụ thể.
- **Đừng import `@twaozann/forms` / `filters` / `map`** từ package này — dep ngược tầng, `guard:layers` sẽ chặn.
- **Đừng hardcode màu.** Viết `bg-primary`, `text-muted-foreground`, không viết `bg-[#3b82f6]` hay `bg-blue-500`. `guard:hardcode` sẽ chặn.
- **Đừng thêm thư viện toast/router/i18n vào dependencies.** Nếu thấy cần, gần như chắc chắn thứ đó phải do app truyền vào qua props hoặc `UIProvider`.
