import { cn } from '@twaozann/ui';
import L from 'leaflet';
import type { ReactNode } from 'react';
import { useEffect, useMemo } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  OSM_ATTRIBUTION,
  OSM_TILE_URL,
  type LatLng,
} from './leaflet-setup';

export interface TrackingMapProps {
  /** Vị trí đang di chuyển (cập nhật realtime). */
  position: LatLng | null;
  /** Điểm đến cố định — chỉ vẽ marker khi có. */
  destination?: LatLng | null;
  positionLabel?: ReactNode;
  destinationLabel?: ReactNode;
  className?: string;
}

// Icon riêng cho điểm đến, phân biệt với marker mặc định của đối tượng đang di chuyển.
// Dùng divIcon để khỏi thêm asset; màu lấy từ token --destructive nên tự hợp light/dark
// và đổi theo design-tokens thay vì phải sửa một mã màu đỏ viết cứng ở đây.
const destinationIcon = L.divIcon({
  className: '',
  html:
    '<div style="width:14px;height:14px;border-radius:9999px;' +
    'background:hsl(var(--destructive));border:2px solid hsl(var(--background));' +
    'box-shadow:0 0 0 1px hsl(var(--foreground) / 0.3)"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

// Pan bản đồ theo vị trí mới nhất (không đổi zoom).
function FollowPosition({ pos }: { pos: LatLng | null }) {
  const map = useMap();
  useEffect(() => {
    if (pos) map.panTo([pos.lat, pos.lng]);
  }, [pos, map]);
  return null;
}

// Bản đồ theo dõi: một marker di chuyển realtime + một marker đích cố định.
// Không biết domain — app quyết định "ai" đang di chuyển và đặt nhãn tương ứng.
export function TrackingMap({
  position,
  destination,
  positionLabel,
  destinationLabel,
  className,
}: TrackingMapProps) {
  const center = useMemo<[number, number]>(
    () =>
      position
        ? [position.lat, position.lng]
        : destination
          ? [destination.lat, destination.lng]
          : DEFAULT_CENTER,
    [position, destination],
  );

  return (
    <div className={cn('h-72 w-full overflow-hidden rounded-md border border-input', className)}>
      <MapContainer center={center} zoom={DEFAULT_ZOOM} className="h-full w-full" scrollWheelZoom>
        <TileLayer url={OSM_TILE_URL} attribution={OSM_ATTRIBUTION} />
        {destination && (
          <Marker position={[destination.lat, destination.lng]} icon={destinationIcon}>
            {destinationLabel && <Popup>{destinationLabel}</Popup>}
          </Marker>
        )}
        {position && (
          <Marker position={[position.lat, position.lng]}>
            {positionLabel && <Popup>{positionLabel}</Popup>}
          </Marker>
        )}
        <FollowPosition pos={position} />
      </MapContainer>
    </div>
  );
}
