import { cn } from '@twaozann/ui';
import { useEffect, useMemo } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  OSM_ATTRIBUTION,
  OSM_TILE_URL,
  type LatLng,
} from './leaflet-setup';

export interface MapPickerProps {
  value: LatLng | null;
  onChange: (pos: LatLng) => void;
  className?: string;
}

// Bắt click trên bản đồ → đặt điểm.
function ClickHandler({ onChange }: { onChange: (pos: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

// Recenter khi value đổi từ bên ngoài (vd người dùng chọn địa chỉ ở ô tìm kiếm).
// Đặt trong useEffect và chỉ phụ thuộc toạ độ → không giật lại mỗi lần parent re-render.
function Recenter({ value }: { value: LatLng | null }) {
  const map = useMap();
  // Cố ý phụ thuộc vào TOẠ ĐỘ chứ không phải object `value`: parent thường tạo object mới
  // mỗi lần render, nếu phụ thuộc `value` thì bản đồ sẽ giật về giữa liên tục.
  useEffect(() => {
    if (value) map.setView([value.lat, value.lng], map.getZoom());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.lat, value?.lng, map]);
  return null;
}

// Bản đồ chọn 1 điểm: click để đặt, kéo marker để tinh chỉnh. Controlled qua value/onChange.
export function MapPicker({ value, onChange, className }: MapPickerProps) {
  const center = useMemo<[number, number]>(
    () => (value ? [value.lat, value.lng] : DEFAULT_CENTER),
    [value],
  );

  return (
    <div className={cn('h-64 w-full overflow-hidden rounded-md border border-input', className)}>
      <MapContainer center={center} zoom={DEFAULT_ZOOM} className="h-full w-full" scrollWheelZoom>
        <TileLayer url={OSM_TILE_URL} attribution={OSM_ATTRIBUTION} />
        <ClickHandler onChange={onChange} />
        <Recenter value={value} />
        {value && (
          <Marker
            position={[value.lat, value.lng]}
            draggable
            eventHandlers={{
              dragend(e) {
                const p = e.target.getLatLng();
                onChange({ lat: p.lat, lng: p.lng });
              },
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
