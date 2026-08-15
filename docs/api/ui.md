# `@twaozann01/ui`

**Tầng L1** · [README](../../packages/ui/README.md) · [Storybook](https://twaozann01.github.io/fe-shared/)

Primitives giao diện, ba provider, năm họ hộp thoại.

**peerDependencies:** `react` ≥18 · `react-dom` ≥18

```ts
import { Button, Card, Dialog /* … */ } from '@twaozann01/ui';
```

**Mục lục** · [Provider](#provider) · [Primitives](#primitives) · [Hộp thoại](#hộp-thoại) · [Dữ liệu](#hiển-thị-dữ-liệu) · [Khung app](#khung-app) · [Tiện ích](#tiện-ích)

---

# Provider

## `UIProvider`

Bơm bản dịch và cách báo lỗi của app vào design system. **Không bắt buộc** — không bọc thì component rơi về bản mặc định tiếng Việt.

| Prop | Kiểu | Mặc định | Mô tả |
|---|---|---|---|
| `children` | `ReactNode` | — | **Bắt buộc** |
| `labels` | `UILabelsOverride` | | Ghi đè chữ theo từng nhóm; nhóm không khai giữ bản mặc định |
| `onError` | `(message: string) => void` | `console.warn` | Gọi khi có lỗi người dùng cần biết (ảnh sai định dạng, quá nặng) |
| `translateError` | `(message: string) => string` | `x => x` | Dịch thông điệp lỗi validate. Schema Zod thường trả **key i18n** thay vì câu tiếng Việt |

```tsx
<UIProvider
  labels={{ table: { empty: t('table.empty') } }}
  onError={(msg) => toast.error(msg)}
  translateError={(key) => t(key)}
>
```

### Hook

| Hook | Trả về |
|---|---|
| `useUI()` | `{ labels, onError, translateError }` |
| `useUILabels()` | `UILabels` — lối tắt cho `useUI().labels` |

### `UILabels` — 8 nhóm chữ

| Nhóm | Key |
|---|---|
| `common` | `close` `search` `dark` `light` `cancel` `confirm` |
| `confirm` | `title` |
| `table` | `empty` |
| `multiSelect` | `selected(count)` |
| `pagination` | `previous` `next` `page(n)` |
| `filter` | `reset` `all` `yes` `no` `min` `max` `sort` `sortDefault` `from` `to` |
| `image` | `hint` `remove` `invalidType` `tooLarge(mb)` |
| `error` | `title` `description` `reload` `notFound` `forbidden` `backHome` |
| `placeholder` | `wip` `comingSoon` |

Chữ có tham số là **hàm** chứ không phải chuỗi có placeholder — TypeScript bắt được lỗi thiếu tham số ngay lúc biên dịch.

`defaultLabels` được xuất ra nếu anh cần đọc bản gốc.

---

## `ThemeProvider`

Thứ **duy nhất** app cần để có dark mode: nhớ lựa chọn, theo cài đặt hệ điều hành, gắn class `.dark` lên `<html>`.

| Prop | Kiểu | Mặc định | Mô tả |
|---|---|---|---|
| `children` | `ReactNode` | — | **Bắt buộc** |
| `defaultTheme` | `'light' \| 'dark' \| 'system'` | `'system'` | Dùng khi chưa có lựa chọn nào được lưu |
| `storageKey` | `string` | `'twaozann-theme'` | Đổi nếu một tên miền chạy nhiều app muốn theme riêng |
| `persist` | `boolean` | `true` | `false` = không nhớ giữa các lần mở |
| `storage` | `ThemeStorage` | `localStorage` | Thay chỗ lưu (test, hoặc app tự quản bằng cookie) |
| `element` | `() => HTMLElement \| null` | `document.documentElement` | Phần tử được gắn class `dark` |

### `useTheme()`

Ném lỗi nếu không có provider — im lặng trả mặc định sẽ khiến bug rất khó tìm.

| Trả về | Kiểu | Mô tả |
|---|---|---|
| `theme` | `'light' \| 'dark' \| 'system'` | **Lựa chọn của người dùng** |
| `resolvedTheme` | `'light' \| 'dark'` | Theme **đang thật sự hiển thị**, sau khi giải `system` |
| `setTheme` | `(theme) => void` | Đặt lựa chọn, ghi vào storage |
| `toggleTheme` | `() => void` | Lật sáng/tối dựa trên `resolvedTheme` |

`useOptionalTheme()` — như trên nhưng trả `null` thay vì ném, cho component chạy được cả khi không có provider.

### `getThemeInitScript(storageKey?)`

Trả về chuỗi JavaScript chống "nháy trắng". Dán vào `<head>` của `index.html`, **trước** script của app — không có nó, trang hiện nền sáng một nhịp rồi mới nhảy sang tối.

---

## `ConfirmProvider` · `useConfirm`

Cấp hàm `confirm()` trả `Promise<boolean>` cho toàn app. Chỉ có **một** Dialog cho cả app, nằm trong provider.

```tsx
const confirm = useConfirm();
if (await confirm({ description: 'Xoá đơn này?', destructive: true })) {
  await deleteOrder(id);
}
```

### `ConfirmOptions`

| Prop | Kiểu | Mặc định | Mô tả |
|---|---|---|---|
| `title` | `ReactNode` | `labels.confirm.title` | |
| `description` | `ReactNode` | | Không truyền thì không render dòng mô tả |
| `confirmText` | `ReactNode` | `labels.common.confirm` | |
| `cancelText` | `ReactNode` | `labels.common.cancel` | |
| `destructive` | `boolean` | `false` | Nút xác nhận màu cảnh báo |

Bấm ra ngoài hoặc nhấn Esc = **từ chối** (`false`), không phải đồng ý.

---

# Primitives

## `Button`

| Prop | Kiểu | Mặc định |
|---|---|---|
| `variant` | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | `'default'` |
| `size` | `'default' \| 'sm' \| 'lg' \| 'icon'` | `'default'` |
| `asChild` | `boolean` | `false` |
| …`ButtonHTMLAttributes` | | |

`asChild` render thẻ con thay vì `<button>` — dùng khi cần `<Link>` nhưng vẫn muốn style nút:

```tsx
<Button asChild><Link to="/orders">Xem đơn</Link></Button>
```

`buttonVariants({ variant, size })` được xuất ra để dùng lại class nút ở nơi không phải `<button>` (đó là cách `AlertDialogAction` hoạt động).

## `Badge`

| Prop | Kiểu | Mặc định |
|---|---|---|
| `variant` | `'default' \| 'secondary' \| 'destructive' \| 'outline' \| 'success' \| 'warning' \| 'info'` | `'default'` |
| …`HTMLAttributes<HTMLSpanElement>` | | |

`success`/`warning`/`info` dùng token ngữ nghĩa, **không** dùng bảng màu thô của Tailwind — nên đổi được từ `design-tokens` và hợp cả light lẫn dark.

## `Card`

Sáu phần, dùng phần nào lấy phần đó. Tất cả nhận `HTMLAttributes<HTMLDivElement>`.

`Card` · `CardHeader` · `CardTitle` · `CardDescription` · `CardContent` · `CardFooter`

## `Input` · `Textarea`

Nhận toàn bộ props của `<input>` / `<textarea>`.

Cả hai dựng trên `fieldBaseClass` — **sửa hằng đó là mọi ô nhập trong hệ đổi theo**.

## `Checkbox` · `Switch`

Nhận props của Radix (`checked`, `onCheckedChange`, `disabled`, `id`…).

## `RadioGroup` · `RadioGroupItem`

```tsx
<RadioGroup value={v} onValueChange={setV}>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="a" id="a" />
    <label htmlFor="a">Lựa chọn A</label>
  </div>
</RadioGroup>
```

## `Select`

Bộ 6: `Select` · `SelectGroup` · `SelectValue` · `SelectTrigger` · `SelectContent` · `SelectItem`

```tsx
<Select value={v} onValueChange={setV}>
  <SelectTrigger><SelectValue placeholder="Chọn" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="dien">Điện</SelectItem>
  </SelectContent>
</Select>
```

> **Radix không nhận chuỗi rỗng làm `value`.** Cần mục "Tất cả" thì dùng sentinel rồi map ra `undefined` — hoặc dùng thẳng [`SelectFilter`](filters.md#selectfilter), nó đã làm sẵn.

`SelectContent` đứng ở `POPPER_Z` nên **luôn nằm trên mọi hộp thoại**.

## `MultiSelect`

| Prop | Kiểu | Mặc định | Mô tả |
|---|---|---|---|
| `value` | `string[]` | — | **Bắt buộc** |
| `onChange` | `(value: string[]) => void` | — | **Bắt buộc** |
| `options` | `MultiSelectOption[]` | — | **Bắt buộc** — `{ value: string; label: ReactNode }` |
| `placeholder` | `string` | | Hiện khi chưa chọn gì |
| `disabled` | `boolean` | `false` | |
| `id` | `string` | | Để gắn `<label htmlFor>` |
| `className` | `string` | | |

Trigger hiện `labels.multiSelect.selected(n)` khi đã chọn.

## `Popover`

`Popover` · `PopoverTrigger` · `PopoverContent` · `PopoverAnchor` — props của Radix.

---

# Hộp thoại

Năm họ, **dùng chung một bộ class bề mặt và một ngăn xếp z**. Mở hai cái liên tiếp không thấy lệch nhịp lề hay lệch tầng.

| Họ | Khi nào dùng | Đóng khi bấm ra ngoài | Esc |
|---|---|---|---|
| `Dialog` | Hộp thoại thường | Có | Có |
| `DialogShell` | Có header/thân cuộn/chân | Có | Có |
| `AlertDialog` | Buộc chọn một trong hai nút | **Không** | Có |
| `Sheet` | Panel trượt từ cạnh | Có | Có |
| `Drawer` | Kéo để đóng (mobile) | Có | Có |

## Bốn cái bẫy đã vá sẵn

Radix portal nội dung `Select`/`Popover` ra thẳng `document.body`, tức **ngoài** cây DOM của Dialog. Sinh ra bốn lỗi mà build vẫn xanh, không exception, chỉ hành vi sai:

| Hiện tượng | Vá bằng |
|---|---|
| Bấm option của Select trong Dialog → Dialog đóng theo | `isInsidePortalledLayer` |
| Select đang mở, bấm ra ngoài → đóng luôn Dialog | `hasOpenPortalledLayer` — chụp trạng thái ở pha capture, vì Radix lật `data-state` **trước** khi guard chạy |
| Double-click option → Dialog đóng, mất form đang nhập | `hasRecentlyClosedPortalledLayer` — ân hạn 300ms |
| Cả trang không bấm được, phải F5 | `unstickBodyPointerEvents` |

Là hành vi **mặc định**, app không phải làm gì. `Sheet` và `Drawer` dùng chung bộ guard này; `AlertDialog` không cần vì vốn không đóng khi bấm ra ngoài.

---

## `Dialog`

`Dialog` · `DialogTrigger` · `DialogClose` · `DialogPortal` · `DialogOverlay` · `DialogContent` · `DialogHeader` · `DialogFooter` · `DialogTitle` · `DialogDescription`

### `DialogContent`

| Prop | Kiểu | Mặc định | Mô tả |
|---|---|---|---|
| `closeLabel` | `string` | `labels.common.close` | Nhãn cho trình đọc màn hình ở nút X |
| `overlayClassName` | `string` | | Class riêng cho lớp mờ |
| …props của Radix Content | | | `onOpenAutoFocus`, `onEscapeKeyDown`… |

`DialogContent` có `p-6` sẵn, nên `DialogHeader`/`DialogFooter` **không tự khai lề** — khác `SheetHeader`.

## `DialogShell`

Khung 3 tầng: header (viền dưới) · thân (tự cuộn, scroll mảnh) · chân (viền trên). Thay cho việc mỗi màn tự dựng lại `DialogContent + p-0 + border + overflow`.

| Prop | Kiểu | Mặc định | Mô tả |
|---|---|---|---|
| `open` | `boolean` | | Controlled |
| `onOpenChange` | `(open: boolean) => void` | | |
| `trigger` | `ReactNode` | | Phần tử mở dialog. Bỏ qua nếu dùng `open` |
| `title` | `ReactNode` | | Không có `title` lẫn `icon` thì **không dựng header** |
| `description` | `ReactNode` | | Dòng nhỏ dưới tiêu đề |
| `icon` | `ReactNode` | | Truyền phần tử luôn: `<Wrench className="h-5 w-5" />` |
| `accentHeader` | `boolean` | `false` | Tô nền header tông accent |
| `children` | `ReactNode` | | Tầng thân — tự cuộn khi dài |
| `footer` | `ReactNode` | | Cụm nút. Bỏ trống = **không có chân** |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'lg'` | Bị `width`/`maxWidth` đè |
| `maxHeight` | `string \| number` | `'90dvh'` | |
| `width` | `number` | | Bề rộng **cố định** tính px. Đè `size` và `maxWidth` |
| `maxWidth` | `number` | | Trần bề rộng tính px. Đè `size`; bị `width` đè |
| `height` | `number` | | Chiều cao **cố định** tính px. Đè `maxHeight` |
| `className` `bodyClassName` `overlayClassName` | `string` | | |

**Thứ tự đè:** `width` > `maxWidth` > `size` · `height` > `maxHeight`

### Vì sao cỡ là số px chứ không phải class

`SIZES` khai `sm:max-w-*` (**có tiền tố breakpoint**). Truyền `max-w-[900px]` không tiền tố qua `className` thì tailwind-merge coi là thuộc tính khác nên **giữ cả hai**, và từ 640px trở lên cái `sm:` thắng — ô không rộng ra. Người viết thấy "không ăn" liền thêm `!important`.

Số đi vào inline `style` nên không đấu độ ưu tiên với class nào cả. Và mọi cỡ số đều **tự kẹp theo màn** (`calc(100vw - 2rem)`, `90dvh`) để không tràn mép trên điện thoại.

> `dvh` chứ không `vh`: `vh` đo viewport lúc thanh URL đã ẩn, nên trên điện thoại bàn phím ảo che mất chân dialog và nút Lưu.

Có cỡ bằng số thì class cỡ **bị bỏ hẳn** — để lại là hai nguồn cùng nói về bề rộng, người đọc không biết cái nào thắng.

### `size` là gì

| Nấc | Bề rộng |
|---|---|
| `sm` | `max-w-md` |
| `md` | `max-w-lg` |
| `lg` | `max-w-2xl` |
| `xl` | `max-w-4xl` |
| `full` | Toàn màn trên điện thoại (bo góc 0), 720px từ `sm`, 1100px từ `lg`. Hợp form nhiều field |

## `AlertDialog`

`AlertDialog` · `AlertDialogTrigger` · `AlertDialogPortal` · `AlertDialogOverlay` · `AlertDialogContent` · `AlertDialogHeader` · `AlertDialogFooter` · `AlertDialogTitle` · `AlertDialogDescription` · `AlertDialogAction` · `AlertDialogCancel`

Khác `Dialog` ở ba điểm:

- **Không đóng khi bấm ra ngoài** — buộc chọn một trong hai nút. (Esc **vẫn** đóng: đó là lối thoát bằng bàn phím, bỏ đi là hỏng a11y.)
- `role="alertdialog"` — trình đọc màn hình đọc ngay thay vì chờ.
- Focus mặc định rơi vào nút Cancel, không phải nút hành động.

`AlertDialogAction` và `AlertDialogCancel` nhận `variant` + `size` như `Button` và **tự mang style nút** — không phải bọc `asChild`, mà bọc thì rất dễ quên, dẫn tới hai nút trông khác nhau giữa các màn.

| Prop | Mặc định |
|---|---|
| `AlertDialogAction` — `variant` | `'default'` |
| `AlertDialogCancel` — `variant` | `'outline'` |

Nằm ở nấc **urgent** (+4 cùng nấc) nên cảnh báo khai ở cấp trang vẫn cắt ngang được dialog đang mở.

## `Sheet`

`Sheet` · `SheetTrigger` · `SheetClose` · `SheetPortal` · `SheetOverlay` · `SheetContent` · `SheetHeader` · `SheetFooter` · `SheetTitle` · `SheetDescription`

### `SheetContent`

| Prop | Kiểu | Mặc định |
|---|---|---|
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'right'` |
| `closeLabel` | `string` | `labels.common.close` |
| `overlayClassName` | `string` | |
| …props của Radix Content | | |

Trái/phải chiếm hết chiều cao màn (`w-3/4`, trần `sm:max-w-sm`); trên/dưới cao theo nội dung.

> `SheetContent` **không có lề**, nên `SheetHeader`/`SheetFooter` tự khai `p-4` của mình. Khác `Dialog`.

## `Drawer`

Dựng trên [`vaul`](https://github.com/emilkowalski/vaul). Khác `Sheet` đúng một điểm nhưng quan trọng trên điện thoại: **kéo để đóng**.

`Drawer` · `DrawerTrigger` · `DrawerPortal` · `DrawerClose` · `DrawerOverlay` · `DrawerContent` · `DrawerHeader` · `DrawerFooter` · `DrawerTitle` · `DrawerDescription`

| Prop | Kiểu | Mặc định | Mô tả |
|---|---|---|---|
| `Drawer` — `shouldScaleBackground` | `boolean` | `true` | Thu nhỏ nền phía sau khi mở |
| `DrawerContent` — `hideHandle` | `boolean` | `false` | Ẩn vạch kéo. **Chỉ ẩn khi đã có cách đóng khác thật rõ** — vạch đó là dấu hiệu thị giác duy nhất cho biết panel kéo được |
| `DrawerContent` — `overlayClassName` | `string` | | |

Chỉ làm web thì `Sheet` là đủ và nhẹ hơn (không kéo thêm `vaul`).

---

# Hiển thị dữ liệu

## `DataTable`

Bảng generic. **Không biết domain** — app truyền `columns` + `data`.

| Prop | Kiểu | Mặc định | Mô tả |
|---|---|---|---|
| `columns` | `Column<T>[]` | — | **Bắt buộc** |
| `data` | `T[]` | — | **Bắt buộc** |
| `isLoading` | `boolean` | `false` | Hiện skeleton thay vì dữ liệu |
| `skeletonRows` | `number` | `5` | Số dòng skeleton |
| `emptyMessage` | `ReactNode` | `labels.table.empty` | Nội dung khi rỗng |
| `getRowId` | `(row: T, index: number) => string` | dùng index | **Nên truyền** |
| `onRowClick` | `(row: T) => void` | | Có thì con trỏ thành `pointer` |
| `className` | `string` | | |

### `Column<T>`

| Field | Kiểu | Mô tả |
|---|---|---|
| `key` | `string` | **Bắt buộc** — dùng làm React key; cũng là field mặc định để đọc giá trị |
| `header` | `ReactNode` | **Bắt buộc** — truyền chuỗi **đã dịch sẵn** |
| `cell` | `(row: T) => ReactNode` | Không có thì hiển thị `row[key]` |
| `className` | `string` | Áp cho **cả** ô và header — canh phải, độ rộng |

> **Nên truyền `getRowId`.** Không có nó React dùng index làm key — xoá một dòng giữa bảng là các dòng sau nhảy lung tung.

## `Table`

Sáu phần thô để tự dựng khi `DataTable` không đủ: `Table` · `TableHeader` · `TableBody` · `TableRow` · `TableHead` · `TableCell`. Tất cả nhận HTML attributes của thẻ tương ứng.

## `Pagination`

| Prop | Kiểu | Mô tả |
|---|---|---|
| `page` | `number` | **Bắt buộc** — trang hiện tại, **1-based** |
| `totalPages` | `number` | **Bắt buộc** |
| `onPageChange` | `(page: number) => void` | **Bắt buộc** |
| `className` | `string` | |

Trả `null` khi `totalPages <= 1` — không cần tự ẩn.

Luôn hiện trang 1, trang cuối và quanh trang hiện tại ±1, chèn `…` ở chỗ đứt quãng.

`getPageItems(page, totalPages)` được xuất ra riêng (trả `(number | 'ellipsis')[]`) để test hoặc tự dựng giao diện phân trang khác.

---

# Khung app

## `ThemeToggle`

| Prop | Kiểu | Mặc định | Mô tả |
|---|---|---|---|
| `theme` | `'light' \| 'dark'` | từ `ThemeProvider` | Truyền vào để chạy controlled |
| `onToggle` | `() => void` | từ `ThemeProvider` | |
| `iconOnly` | `boolean` | `false` | Chỉ icon, hợp header chật |
| `className` | `string` | | |

Không có `ThemeProvider` **và** không truyền props thì **ném lỗi** kèm hướng dẫn — thà báo rõ còn hơn hiện một cái nút bấm không ăn.

## `LanguageSwitcher`

Stateless — app quyết định có bao nhiêu ngôn ngữ và đổi ra sao.

| Prop | Kiểu | Mô tả |
|---|---|---|
| `languages` | `LanguageOption[]` | **Bắt buộc** — `{ value: string; label: string }` |
| `current` | `string` | **Bắt buộc** |
| `onChange` | `(value: string) => void` | **Bắt buộc** |
| `className` | `string` | |

## `MobileDrawer`

Panel trượt từ trái, **chỉ hiện dưới `md`** (`md:hidden`). Tự dựng, không thêm thư viện.

| Prop | Kiểu | Mô tả |
|---|---|---|
| `open` | `boolean` | **Bắt buộc** |
| `onClose` | `() => void` | **Bắt buộc** — gọi khi bấm nền mờ |
| `children` | `ReactNode` | **Bắt buộc** |
| `className` | `string` | |

Luôn render (để có hiệu ứng trượt); khi đóng thì `pointer-events-none` nên không chặn thao tác.

Cần panel cho **mọi** cỡ màn, hoặc trượt từ cạnh khác → dùng [`Sheet`](#sheet).

## `ImageUpload`

Chọn + xem trước một ảnh: bấm hoặc kéo-thả.

| Prop | Kiểu | Mặc định | Mô tả |
|---|---|---|---|
| `value` | `File \| string \| null` | — | **Bắt buộc**. `File` = ảnh mới · `string` = URL ảnh cũ · `null` = trống |
| `onChange` | `(value: File \| null) => void` | — | **Bắt buộc** |
| `accept` | `string` | `'image/*'` | |
| `maxSizeMB` | `number` | `5` | |
| `disabled` | `boolean` | `false` | |
| `id` | `string` | | Để gắn `<label htmlFor>` |
| `onBlur` | `() => void` | | Cho React Hook Form |
| `className` | `string` | | |

**Chỉ chọn và kiểm tra, KHÔNG tự upload** — upload là nghiệp vụ của app, làm lúc submit.

Lỗi validate đi qua `onError` của `UIProvider`, không gọi thẳng toast — mỗi app một hệ thông báo riêng.

---

# Tiện ích

| Export | Kiểu | Mô tả |
|---|---|---|
| `cn(...inputs)` | `(ClassValue[]) => string` | clsx + tailwind-merge. Xử lý xung đột: `cn('p-2','p-4')` → `'p-4'` |
| `useDebounce(value, delay?)` | `<T>(T, number) => T` | Trả giá trị trễ `delay` ms (mặc định `400`) sau lần đổi cuối |
| `fieldBaseClass` | `string` | Nền chung của mọi ô nhập: border, bg, focus ring, disabled |
| `fieldSingleLineClass` | `string` | Chiều cao + padding cho control một dòng |
| `THIN_SCROLL` | `string` | Thanh cuộn mảnh, thumb dùng token `--border` |

## Hằng bề mặt hộp thoại

Sửa một chỗ là cả năm họ đổi theo — cùng vai trò với `fieldBaseClass` ở phía ô nhập.

`DIALOG_BG_CLASS` · `DIALOG_OVERLAY_CLASS` · `DIALOG_TITLE_CLASS` · `DIALOG_DESCRIPTION_CLASS` · `DIALOG_SHELL_CLASS` · `DIALOG_HEADER_CLASS` · `DIALOG_BODY_CLASS` · `DIALOG_FOOTER_CLASS` · `DIALOG_ICON_CLASS` · `DIALOG_TITLE_BLOCK_CLASS`

## Ngăn xếp lớp che

| Export | Mô tả |
|---|---|
| `layerZClass(depth, part, urgent?)` | Trả class `z-*` cho `'overlay'` hoặc `'content'` |
| `POPPER_Z` | `'z-[1205]'` — Select/Popover, trên mọi nấc dialog |
| `MAX_LAYER_DEPTH` | `4` |
| `LayerDepthProvider` · `useLayerDepth()` | Đọc/đặt độ sâu lồng nhau |

z **suy theo độ sâu lồng nhau**, không cố định:

```
sâu 0:  mờ 1100 · thân 1101
sâu 1:  mờ 1110 · thân 1111   ← 1110 > 1101 nên PHỦ TRỌN dialog sâu 0
sâu 2:  mờ 1120 · thân 1121
```

Cố định thì hai dialog **bằng z nhau**, thứ tự vẽ do thứ tự node trong DOM quyết định — hên xui theo lúc portal được gắn, và dialog dưới không bị phủ bóng.

Trả về **class** chứ không phải inline `style` là có lý do: app đôi khi cần leo lên trên một lớp portal ngoài hệ (widget chat, iframe nhúng). Class thì `cn()` cho bên gọi đè lại được; inline style thì đè ngược.
