import { Badge } from '@twaozann/ui';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    docs: {
      description: {
        component:
          'success / warning / info dùng token ngữ nghĩa, không dùng bảng màu thô của Tailwind — nên đổi được từ design-tokens và hợp cả light lẫn dark.',
      },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TatCa: Story = {
  name: 'Tất cả biến thể',
  args: { children: 'Nhãn' },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Mặc định</Badge>
      <Badge variant="secondary">Phụ</Badge>
      <Badge variant="outline">Viền</Badge>
      <Badge variant="destructive">Huỷ</Badge>
      <Badge variant="success">Hoàn tất</Badge>
      <Badge variant="warning">Chờ xử lý</Badge>
      <Badge variant="info">Đang chạy</Badge>
    </div>
  ),
};
