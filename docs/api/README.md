# API Reference

Tra cứu đầy đủ mọi thứ được xuất ra. Muốn **xem** component chạy thật thì vào [Storybook](https://twaozann01.github.io/fe-shared/); trang này để tra **props và kiểu**.

| Package | Nội dung |
|---|---|
| [`design-tokens`](design-tokens.md) | 25 token màu · `lightColors` / `darkColors` · `tokens.css` |
| [`ui`](ui.md) | 47 component · 3 provider · 5 họ hộp thoại · tiện ích |
| [`forms`](forms.md) | 11 component nối React Hook Form |
| [`filters`](filters.md) | 8 control lọc |
| [`feedback`](feedback.md) | 5 component trạng thái |
| [`map`](map.md) | 2 bản đồ + hằng số |

---

## Quy ước đọc

- **Bắt buộc** — prop không có dấu `?`.
- Cột **Mặc định** để trống nghĩa là không có giá trị mặc định.
- `…HTMLAttributes` nghĩa là component nhận **mọi thuộc tính HTML** của thẻ đó (`onClick`, `id`, `aria-*`…) và chuyển thẳng xuống DOM.
- Mọi component đều nhận `className` và gộp qua `cn()` (clsx + tailwind-merge), nên class của app **luôn đè được** class mặc định mà không cần `!important`.

## Ba luật xuyên suốt

Hiểu ba luật này thì đoán được API của component chưa đọc bao giờ:

1. **Không giữ trạng thái nghiệp vụ.** Component nhận `value` + `onChange`. Ngoại lệ duy nhất là `ThemeProvider` — theme thuộc về giao diện, và để mỗi dự án viết lại thì đúng là thứ design system sinh ra để tránh.
2. **Không tự dịch.** Chữ do component sinh ra đi qua `UIProvider`. Chữ do app truyền vào (`label`, `header`, `placeholder`) thì truyền **chuỗi đã dịch sẵn**.
3. **Không gọi API.** `ImageUpload` chỉ chọn file rồi trả `File`; `MapPicker` chỉ trả `LatLng`. Upload và geocoding là việc của app.

## Bảng tra nhanh — component nào cho việc gì

| Cần làm | Dùng |
|---|---|
| Nút bấm | [`Button`](ui.md#button) |
| Nhãn trạng thái | [`Badge`](ui.md#badge) |
| Khối nội dung có viền | [`Card`](ui.md#card) |
| Bảng dữ liệu có loading + rỗng | [`DataTable`](ui.md#datatable) |
| Bảng tự dựng từng ô | [`Table`](ui.md#table) |
| Phân trang | [`Pagination`](ui.md#pagination) |
| Hộp thoại thường | [`Dialog`](ui.md#dialog) |
| Hộp thoại có header/thân cuộn/chân | [`DialogShell`](ui.md#dialogshell) |
| Cảnh báo buộc chọn | [`AlertDialog`](ui.md#alertdialog) |
| Panel trượt từ cạnh | [`Sheet`](ui.md#sheet) |
| Panel kéo để đóng (mobile) | [`Drawer`](ui.md#drawer) |
| Hỏi "có chắc không?" | [`useConfirm`](ui.md#confirmprovider--useconfirm) |
| Form | [`forms`](forms.md) |
| Lọc danh sách | [`filters`](filters.md) |
| Trang 404 / 403 / lỗi | [`feedback`](feedback.md) |
| Bản đồ | [`map`](map.md) |
| Dark mode | [`ThemeProvider`](ui.md#themeprovider) |
