# `@twaozann01/filters`

**Tầng L2** · import `@twaozann01/ui` · [README](../../packages/filters/README.md)

Bộ control lọc danh sách. Tất cả đều **controlled** — nhận `value` + `onChange`, không giữ state bên trong.

```ts
import { FilterBar, SearchInput, SelectFilter /* … */ } from '@twaozann01/filters';
```

---

## Bảng tra nhanh

| Component | Kiểu `value` | "Không lọc" là |
|---|---|---|
| `SearchInput` | `string` | `''` |
| `SelectFilter` | `string \| undefined` | `undefined` |
| `SortSelect` | `string \| undefined` | `undefined` |
| `MultiSelectFilter` | `string[]` | `[]` |
| `RangeFilter` | `{ min?, max? }` | cả hai `undefined` |
| `DateRangeFilter` | `{ from?, to? }` | cả hai `undefined` |
| `BooleanFilter` | `boolean \| undefined` | `undefined` |

**State lọc do app giữ** — zustand, `useState`, hay query string tuỳ ý. Package này chỉ vẽ control.

---

## `FilterBar`

Khung chứa các control lọc. Chỉ lo bố cục và nút "Đặt lại".

| Prop | Kiểu | Mô tả |
|---|---|---|
| `children` | `ReactNode` | **Bắt buộc** |
| `onReset` | `() => void` | Truyền vào thì hiện nút "Đặt lại"; không truyền thì không có nút |
| `className` | `string` | |

---

## `SearchInput`

Ô tìm kiếm có debounce: gõ xong chờ `debounceMs` mới gọi `onChange`, giảm số lần gọi API.

| Prop | Kiểu | Mặc định | Mô tả |
|---|---|---|---|
| `value` | `string` | — | **Bắt buộc** |
| `onChange` | `(value: string) => void` | — | **Bắt buộc** |
| `placeholder` | `string` | `labels.common.search` | |
| `debounceMs` | `number` | `400` | |
| `className` | `string` | | |

Giữ text tạm bên trong để gõ mượt, nhưng **đồng bộ ngược** khi `value` bên ngoài đổi — nên bấm "Đặt lại" là ô cũng trống theo, không lệch.

---

## `SelectFilter`

Lọc theo một field.

| Prop | Kiểu | Mặc định | Mô tả |
|---|---|---|---|
| `value` | `string \| undefined` | — | `undefined` = không lọc |
| `onChange` | `(value: string \| undefined) => void` | — | **Bắt buộc** |
| `options` | `FilterOption[]` | — | **Bắt buộc** — `{ value: string; label: ReactNode }` |
| `placeholder` | `string` | | |
| `allLabel` | `ReactNode` | `labels.filter.all` | Nhãn mục "Tất cả" |
| `className` | `string` | `w-[180px]` | |

> Radix Select không nhận chuỗi rỗng làm `value`, nên bên trong dùng sentinel `__all__` rồi map ra `undefined`. Chi tiết đó **không lộ ra API** — app chỉ thấy `string | undefined`.

## `SortSelect`

Như `SelectFilter` nhưng có icon sắp xếp và mục "Mặc định".

| Prop | Kiểu | Mặc định |
|---|---|---|
| `value` | `string \| undefined` | |
| `onChange` | `(value: string \| undefined) => void` | **Bắt buộc** |
| `options` | `FilterOption[]` | **Bắt buộc** |
| `placeholder` | `string` | `labels.filter.sort` |
| `className` | `string` | `w-[200px]` |

Quy ước `value` của option: `field:asc` / `field:desc` — khớp quy ước BE của app. `undefined` = không gửi `sort`, để BE dùng thứ tự mặc định.

## `MultiSelectFilter`

Lọc nhiều giá trị trên cùng một field (vd nhiều trạng thái).

| Prop | Kiểu | Mặc định |
|---|---|---|
| `value` | `string[]` | **Bắt buộc** |
| `onChange` | `(value: string[]) => void` | **Bắt buộc** |
| `options` | `MultiSelectOption[]` | **Bắt buộc** |
| `placeholder` | `string` | `labels.filter.all` |
| `className` | `string` | `w-[200px]` |

## `BooleanFilter`

Ba trạng thái: Tất cả / Có / Không.

| Prop | Kiểu | Mặc định |
|---|---|---|
| `value` | `boolean \| undefined` | `undefined` = không lọc |
| `onChange` | `(value: boolean \| undefined) => void` | **Bắt buộc** |
| `placeholder` | `string` | |
| `trueLabel` | `ReactNode` | `labels.filter.yes` |
| `falseLabel` | `ReactNode` | `labels.filter.no` |
| `className` | `string` | `w-[160px]` |

## `RangeFilter`

Khoảng số — giá, số lượng.

| Prop | Kiểu | Mặc định |
|---|---|---|
| `value` | `RangeValue` = `{ min?: number; max?: number }` | **Bắt buộc** |
| `onChange` | `(value: RangeValue) => void` | **Bắt buộc** |
| `minPlaceholder` | `string` | `labels.filter.min` |
| `maxPlaceholder` | `string` | `labels.filter.max` |
| `className` | `string` | |

Ô rỗng thành `undefined` chứ không phải `0`.

## `DateRangeFilter`

Khoảng thời gian.

| Prop | Kiểu | Mô tả |
|---|---|---|
| `value` | `DateRangeValue` = `{ from?: string; to?: string }` | **Bắt buộc** — ISO `'yyyy-mm-dd'` |
| `onChange` | `(value: DateRangeValue) => void` | **Bắt buộc** |
| `className` | `string` | |

Dùng `<input type="date">` native — cố ý **không thêm thư viện date-picker**: nhẹ, không phụ thuộc, và mỗi dự án thường có gu date-picker riêng. `min`/`max` đặt chéo nhau để trình duyệt tự chặn khoảng không hợp lệ.

---

## Khi nào KHÔNG dùng

- **Đừng đưa store lọc vào đây.** `createFilterStore`, đồng bộ query string, phân trang — đều là việc của app.
- **Đừng thêm filter biết domain** (`OrderStatusFilter` với danh sách trạng thái cứng). Truyền `options` từ ngoài.
