import {
  Badge,
  Button,
  DialogShell,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@twaozann/ui';
import type { Meta, StoryObj } from '@storybook/react';
import { Wrench } from 'lucide-react';
import { useState } from 'react';

const meta: Meta = {
  title: 'UI/DialogShell',
  parameters: {
    docs: {
      description: {
        component:
          'Khung 3 tầng dùng chung: header (viền dưới) · thân (tự cuộn, scroll mảnh) · chân (viền trên). Thay cho việc mỗi màn tự dựng lại DialogContent + p-0 + border + overflow — dựng tay thì mỗi nơi một nhịp lề.',
      },
    },
  },
};

export default meta;

const footer = (
  <>
    <Button variant="outline">Huỷ</Button>
    <Button>Lưu</Button>
  </>
);

export const CoBan: StoryObj = {
  name: 'Cơ bản',
  render: function Render() {
    const [open, setOpen] = useState(false);

    return (
      <DialogShell
        open={open}
        onOpenChange={setOpen}
        trigger={<Button>Sửa dịch vụ</Button>}
        title="Sửa dịch vụ"
        description="Thay đổi sẽ áp dụng ngay sau khi lưu."
        icon={<Wrench className="h-5 w-5" />}
        footer={footer}
      >
        <div className="space-y-3">
          <Input placeholder="Tên dịch vụ" />
          <Input type="number" placeholder="Giá" />
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dien">Điện</SelectItem>
              <SelectItem value="nuoc">Nước</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </DialogShell>
    );
  },
};

export const ThanCuon: StoryObj = {
  name: 'Thân dài — tự cuộn',
  parameters: {
    docs: {
      description: {
        story: 'Header và footer đứng yên, chỉ thân cuộn. Chiều cao trần mặc định 90dvh.',
      },
    },
  },
  render: () => (
    <DialogShell
      trigger={<Button>Mở danh sách dài</Button>}
      title="Lịch sử đơn hàng"
      icon={<Wrench className="h-5 w-5" />}
      footer={footer}
    >
      <div className="space-y-2">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between rounded-md border px-3 py-2">
            <span className="text-sm">Đơn hàng DH-{String(i + 1).padStart(3, '0')}</span>
            <Badge variant={i % 3 === 0 ? 'success' : 'secondary'}>
              {i % 3 === 0 ? 'Hoàn tất' : 'Chờ'}
            </Badge>
          </div>
        ))}
      </div>
    </DialogShell>
  ),
};

export const CacCo: StoryObj = {
  name: 'Các cỡ',
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(['sm', 'md', 'lg', 'xl', 'full'] as const).map((size) => (
        <DialogShell
          key={size}
          size={size}
          trigger={<Button variant="outline">size={size}</Button>}
          title={`Cỡ ${size}`}
          footer={footer}
        >
          <p className="text-sm text-muted-foreground">
            {size === 'full'
              ? 'Toàn màn trên điện thoại (bo góc 0), rộng dần theo màn ở trên. Hợp form nhiều field.'
              : `Bề rộng tối đa theo nấc ${size}.`}
          </p>
        </DialogShell>
      ))}

      <DialogShell
        width={900}
        height={500}
        trigger={<Button variant="secondary">width=900 height=500</Button>}
        title="Cỡ bằng số px"
        footer={footer}
      >
        <p className="text-sm text-muted-foreground">
          Cỡ bằng số đi vào inline style nên không đấu độ ưu tiên với class nào, và tự kẹp theo
          màn để không tràn mép trên điện thoại. Khi có số thì class cỡ bị bỏ hẳn — tránh hai
          nguồn cùng nói về bề rộng.
        </p>
      </DialogShell>
    </div>
  ),
};

export const HeaderToNen: StoryObj = {
  name: 'Header tô nền',
  render: () => (
    <DialogShell
      accentHeader
      trigger={<Button>Mở</Button>}
      title="Giao việc cho thợ"
      description="Header tô tông accent để nhấn mạnh."
      icon={<Wrench className="h-5 w-5" />}
      footer={footer}
    >
      <p className="text-sm text-muted-foreground">Nội dung.</p>
    </DialogShell>
  ),
};
