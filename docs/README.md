# Tài liệu

| Đọc cái nào | Khi nào |
|---|---|
| [01 — Bắt đầu](01-bat-dau.md) | Lần đầu cắm design system vào một app |
| [02 — Công thức](02-cong-thuc.md) | Đã cắm xong, giờ dựng màn hình thật |
| [03 — Chuyển app cũ sang](03-chuyen-app-cu.md) | App đã có sẵn component riêng, muốn thay dần |
| [04 — Đóng góp](04-dong-gop.md) | Thêm/sửa component trong chính repo này |
| [05 — Kiến trúc](05-kien-truc.md) | Muốn hiểu vì sao nó được dựng như vậy |
| **[API Reference](api/README.md)** | Tra props và kiểu của từng component |

**Storybook** là tài liệu chính về từng component — xem được mọi trạng thái, đổi light/dark, chỉnh props trực tiếp:

👉 **https://twaozann01.github.io/fe-shared/**

Mỗi package còn có README riêng nói rõ **tầng · ai dùng · public API · khi nào KHÔNG dùng**:

- [`design-tokens`](../packages/design-tokens/README.md) — bảng màu, nguồn chân lý duy nhất
- [`tailwind-config`](../packages/tailwind-config/README.md) — preset Tailwind
- [`ui`](../packages/ui/README.md) — primitives + theme + hộp thoại
- [`forms`](../packages/forms/README.md) — field nối React Hook Form
- [`filters`](../packages/filters/README.md) — thanh lọc danh sách
- [`feedback`](../packages/feedback/README.md) — 404 · 403 · ErrorBoundary
- [`map`](../packages/map/README.md) — bản đồ Leaflet
- [`eslint-config`](../packages/eslint-config/README.md) · [`typescript-config`](../configs/typescript-config/README.md)
