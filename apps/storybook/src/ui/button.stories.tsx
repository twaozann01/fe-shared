import { Button } from '@twaozann/ui';
import type { Meta, StoryObj } from '@storybook/react';
import { Plus } from 'lucide-react';

const meta = {
  title: 'UI/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: { control: 'select', options: ['default', 'sm', 'lg', 'icon'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MacDinh: Story = {
  name: 'Mặc định',
  args: { children: 'Lưu thay đổi' },
};

export const TatCaBienThe: Story = {
  name: 'Tất cả biến thể',
  args: { children: 'Nút' },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Mặc định</Button>
      <Button variant="secondary">Phụ</Button>
      <Button variant="outline">Viền</Button>
      <Button variant="ghost">Trong suốt</Button>
      <Button variant="destructive">Xoá</Button>
      <Button variant="link">Liên kết</Button>
    </div>
  ),
};

export const KichThuoc: Story = {
  name: 'Kích thước',
  args: { children: 'Nút' },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Nhỏ</Button>
      <Button>Vừa</Button>
      <Button size="lg">Lớn</Button>
      <Button size="icon" aria-label="Thêm">
        <Plus />
      </Button>
    </div>
  ),
};

export const TrangThai: Story = {
  name: 'Trạng thái',
  args: { children: 'Nút' },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Bình thường</Button>
      <Button disabled>Vô hiệu</Button>
      <Button variant="outline" disabled>
        Viền vô hiệu
      </Button>
    </div>
  ),
};
