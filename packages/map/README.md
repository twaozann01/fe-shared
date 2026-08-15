# @twaozann01/map

Hai bản đồ Leaflet dùng chung: chọn một điểm, và theo dõi một điểm đang di chuyển.

## Tầng

**L2** — import `@twaozann01/ui` (chỉ để lấy `cn`). `leaflet` và `react-leaflet` là **peerDependency**.

## Consumer

App web có tính năng bản đồ. Package tách riêng vì Leaflet khá nặng — app không dùng bản đồ thì không phải cài.

## Public API

```tsx
<MapPicker value={pos} onChange={setPos} />

<TrackingMap
  position={courierPos}          // marker di chuyển realtime
  destination={orderPos}         // marker đích cố định
  positionLabel={t('order.courier')}
  destinationLabel={t('order.address')}
/>
```

Tile dùng OpenStreetMap, miễn phí và không cần API key. Đổi nguồn tile thì sửa `OSM_TILE_URL` trong `leaflet-setup.ts` — nhớ giữ đúng attribution theo giấy phép của nhà cung cấp.

`leaflet-setup.ts` cũng vá đường dẫn icon marker (Leaflet trỏ URL tương đối nên vỡ khi bundle). Import bất kỳ component nào của package này là bản vá tự chạy.

Marker đích tô bằng token `--destructive` thay vì mã màu cứng, nên đổi bảng màu ở `design-tokens` là bản đồ đổi theo.

## Khi nào KHÔNG dùng

- **Đừng nhét geocoding / gọi API tìm địa chỉ vào đây.** Đó là nghiệp vụ; component chỉ nhận `LatLng` và trả `LatLng`.
- **Đừng đặt tên prop theo domain.** `TrackingMap` cố tình dùng `position`/`destination` chứ không phải `repairman`/`customer` — bản trong `marketplace-fe` đặt theo domain nên không tái dùng được cho dự án khác.
- **Đừng thêm vẽ tuyến đường, cluster marker, heatmap** trước khi có dự án thứ hai thật sự cần; mỗi thứ đó kéo thêm một plugin Leaflet.
