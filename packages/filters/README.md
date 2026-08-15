# @twaozann01/filters

Bộ control lọc danh sách: tìm kiếm có debounce, dropdown, chọn nhiều, khoảng số, khoảng ngày, ba trạng thái, sắp xếp.

## Tầng

**L2** — import `@twaozann01/ui` (L1).

## Consumer

App web có màn hình danh sách/bảng.

## Public API

Mọi component đều **controlled** — nhận `value` + `onChange`, không giữ state bên trong (trừ ô search giữ text tạm để debounce). App tự quản state lọc bằng zustand, `useState`, hay query string tuỳ ý.

```tsx
<FilterBar onReset={reset}>
  <SearchInput value={q} onChange={setQ} />
  <SelectFilter value={status} onChange={setStatus} options={statusOptions} />
  <RangeFilter value={price} onChange={setPrice} />
  <SortSelect value={sort} onChange={setSort} options={sortOptions} />
</FilterBar>
```

| Component | Kiểu `value` | Nghĩa của "không lọc" |
|---|---|---|
| `SearchInput` | `string` | `''` |
| `SelectFilter` · `SortSelect` | `string \| undefined` | `undefined` |
| `MultiSelectFilter` | `string[]` | `[]` |
| `RangeFilter` | `{ min?, max? }` | cả hai `undefined` |
| `DateRangeFilter` | `{ from?, to? }` | cả hai `undefined` |
| `BooleanFilter` | `boolean \| undefined` | `undefined` |

Radix Select không nhận chuỗi rỗng làm value, nên `SelectFilter`/`SortSelect` dùng sentinel nội bộ (`__all__`, `__default__`) và map ra `undefined` cho bên ngoài. Chi tiết đó không lộ ra API.

## Khi nào KHÔNG dùng

- **Đừng đưa store lọc vào đây.** `createFilterStore` (zustand), đồng bộ query string, phân trang — đều là việc của app. Package này chỉ vẽ control.
- **Đừng thêm filter biết domain** (`OrderStatusFilter` với danh sách trạng thái cứng). Truyền `options` từ ngoài.
- **Đừng thêm thư viện date-picker.** `DateRangeFilter` cố ý dùng `<input type="date">` native: nhẹ, không phụ thuộc, và mỗi dự án thường có gu date-picker riêng.
