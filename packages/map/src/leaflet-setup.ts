import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

// Leaflet nạp icon marker qua URL tương đối → vỡ khi bundle bằng Vite/webpack.
// Trỏ lại bằng asset đã import để bundler tự xử lý đường dẫn.
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export type LatLng = { lat: number; lng: number };

/** Toạ độ mặc định (trung tâm TP.HCM) khi chưa có vị trí nào được chọn. */
export const DEFAULT_CENTER: [number, number] = [10.7769, 106.7009];
export const DEFAULT_ZOOM = 13;

/** Tile OpenStreetMap (miễn phí, không cần API key). */
export const OSM_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
export const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
