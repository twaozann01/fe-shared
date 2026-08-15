import { MapPicker, TrackingMap, type LatLng } from '@twaozann/map';
import { Card, CardContent } from '@twaozann/ui';
import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';

const meta: Meta = {
  title: 'Map/Bản đồ',
  parameters: {
    docs: {
      description: {
        component:
          'Leaflet + tile OpenStreetMap (không cần API key). Component chỉ nhận và trả LatLng — geocoding, gọi API là việc của app.',
      },
    },
  },
};

export default meta;

const HCM: LatLng = { lat: 10.7769, lng: 106.7009 };

export const ChonDiem: StoryObj = {
  name: 'MapPicker',
  render: function Render() {
    const [pos, setPos] = useState<LatLng | null>(null);

    return (
      <div className="max-w-2xl space-y-3">
        <MapPicker value={pos} onChange={setPos} />
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              Bấm lên bản đồ để đặt điểm, kéo marker để chỉnh.
            </p>
            <pre className="mt-2 rounded bg-muted p-2 text-xs">
              {pos ? JSON.stringify(pos, null, 2) : 'null'}
            </pre>
          </CardContent>
        </Card>
      </div>
    );
  },
};

export const TheoDoi: StoryObj = {
  name: 'TrackingMap',
  render: function Render() {
    // Giả lập một điểm đang di chuyển để thấy bản đồ tự pan theo.
    const [pos, setPos] = useState<LatLng>({ lat: 10.79, lng: 106.68 });

    useEffect(() => {
      const id = setInterval(() => {
        setPos((p) => ({ lat: p.lat - 0.0008, lng: p.lng + 0.0006 }));
      }, 1200);
      return () => clearInterval(id);
    }, []);

    return (
      <div className="max-w-2xl space-y-3">
        <TrackingMap
          position={pos}
          destination={HCM}
          positionLabel="Đang di chuyển"
          destinationLabel="Điểm đến"
        />
        <p className="text-sm text-muted-foreground">
          Marker xanh di chuyển mỗi 1,2 giây; chấm đỏ là điểm đến — màu lấy từ token
          <code className="mx-1">--destructive</code>nên đổi theo design-tokens.
        </p>
      </div>
    );
  },
};
