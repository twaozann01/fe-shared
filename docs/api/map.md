# `@twaozann01/map`

**Tầng L2** · import `@twaozann01/ui` (chỉ để lấy `cn`) · [README](../../packages/map/README.md)

Hai bản đồ Leaflet: chọn một điểm, và theo dõi một điểm đang di chuyển.

**peerDependencies:** `react` ≥18 · `react-dom` ≥18 · `leaflet` ≥1.9 · `react-leaflet` ≥4.2

```bash
pnpm add @twaozann01/map leaflet react-leaflet
```

```ts
import { MapPicker, TrackingMap, type LatLng } from '@twaozann01/map';
```

Package tách riêng vì Leaflet khá nặng — app không dùng bản đồ thì không phải cài.

---

## `LatLng`

```ts
type LatLng = { lat: number; lng: number };
```

Kiểu dùng chung cho cả hai component.

---

## `MapPicker`

Chọn một điểm: bấm lên bản đồ để đặt, kéo marker để tinh chỉnh.

| Prop | Kiểu | Mặc định | Mô tả |
|---|---|---|---|
| `value` | `LatLng \| null` | — | **Bắt buộc**. `null` = chưa chọn |
| `onChange` | `(pos: LatLng) => void` | — | **Bắt buộc** |
| `className` | `string` | `h-64 w-full` | |

```tsx
const [pos, setPos] = useState<LatLng | null>(null);
<MapPicker value={pos} onChange={setPos} />
```

Bản đồ **tự dời** khi `value` đổi từ bên ngoài — nên app gọi geocoding rồi `setPos` là bản đồ chạy theo, không cần làm gì thêm.

> Bên trong chỉ phụ thuộc vào **toạ độ** chứ không phải object `value`: parent thường tạo object mới mỗi lần render, nếu phụ thuộc object thì bản đồ sẽ giật về giữa liên tục.

---

## `TrackingMap`

Một marker di chuyển realtime + một marker đích cố định.

| Prop | Kiểu | Mặc định | Mô tả |
|---|---|---|---|
| `position` | `LatLng \| null` | — | **Bắt buộc** — vị trí đang di chuyển |
| `destination` | `LatLng \| null` | | Điểm đến; chỉ vẽ marker khi có |
| `positionLabel` | `ReactNode` | | Popup của marker di chuyển |
| `destinationLabel` | `ReactNode` | | Popup của marker đích |
| `className` | `string` | `h-72 w-full` | |

Bản đồ tự `panTo` theo `position` mới nhất, **không đổi zoom**.

Marker đích tô bằng token `--destructive` (không phải mã màu cứng) nên đổi bảng màu ở `design-tokens` là bản đồ đổi theo.

> Tên prop cố ý **trung lập nghiệp vụ** — `position`/`destination` chứ không phải `repairman`/`customer`. Bản trong `marketplace-fe` đặt tên theo domain nên không tái dùng được cho dự án khác.

---

## Hằng số

| Export | Giá trị | Mô tả |
|---|---|---|
| `DEFAULT_CENTER` | `[10.7769, 106.7009]` | Trung tâm TP.HCM — dùng khi chưa có toạ độ nào |
| `DEFAULT_ZOOM` | `13` | |
| `OSM_TILE_URL` | `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png` | |
| `OSM_ATTRIBUTION` | chuỗi HTML | **Bắt buộc theo giấy phép OSM** |

Tile dùng OpenStreetMap: miễn phí, không cần API key. Đổi nguồn tile thì sửa `leaflet-setup.ts` — và **nhớ giữ đúng attribution** theo giấy phép của nhà cung cấp mới.

---

## Vá đường dẫn icon

Leaflet nạp ảnh marker qua URL tương đối → vỡ khi bundle bằng Vite/webpack. `leaflet-setup.ts` vá lại bằng asset đã import. **Import bất kỳ component nào của package này là bản vá tự chạy** — app không phải làm gì.

---

## Khi nào KHÔNG dùng

- **Đừng nhét geocoding hay gọi API tìm địa chỉ vào đây.** Đó là nghiệp vụ; component chỉ nhận `LatLng` và trả `LatLng`.
- **Đừng thêm vẽ tuyến đường, cluster marker, heatmap** trước khi có dự án thứ hai thật sự cần — mỗi thứ kéo thêm một plugin Leaflet.
