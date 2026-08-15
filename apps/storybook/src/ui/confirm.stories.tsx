import { Badge, Button, ConfirmProvider, useConfirm } from '@twaozann01/ui';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

const meta: Meta = {
  title: 'UI/Confirm',
  parameters: {
    docs: {
      description: {
        component:
          'confirm() trả về Promise<boolean>, nên viết được `if (await confirm(...))` liền mạch — không phải dựng useState mở/đóng dialog ở từng màn hình.',
      },
    },
  },
};

export default meta;

function Demo() {
  const confirm = useConfirm();
  const [log, setLog] = useState<string[]>([]);

  const push = (text: string) => setLog((prev) => [text, ...prev].slice(0, 5));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="destructive"
          onClick={async () => {
            const ok = await confirm({
              description: 'Đơn hàng sẽ bị xoá vĩnh viễn.',
              confirmText: 'Xoá',
              destructive: true,
            });
            push(ok ? 'Đã xoá' : 'Đã huỷ thao tác xoá');
          }}
        >
          Xoá đơn hàng
        </Button>

        <Button
          variant="outline"
          onClick={async () => {
            const ok = await confirm({
              title: 'Rời khỏi trang?',
              description: 'Thay đổi chưa lưu sẽ mất.',
            });
            push(ok ? 'Đã rời trang' : 'Ở lại trang');
          }}
        >
          Rời trang
        </Button>

        <Button
          variant="secondary"
          onClick={async () => {
            const ok = await confirm();
            push(ok ? 'Đồng ý' : 'Từ chối');
          }}
        >
          Không truyền gì (dùng mặc định)
        </Button>
      </div>

      <div className="space-y-1 rounded-lg border p-4">
        <p className="text-sm text-muted-foreground">Kết quả Promise trả về:</p>
        {log.length === 0 ? (
          <p className="text-sm">Chưa có thao tác nào.</p>
        ) : (
          log.map((entry, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <Badge variant={i === 0 ? 'info' : 'secondary'}>{i === 0 ? 'mới nhất' : ''}</Badge>
              {entry}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export const HopThoaiXacNhan: StoryObj = {
  name: 'Hộp thoại xác nhận',
  render: () => (
    <ConfirmProvider>
      <Demo />
    </ConfirmProvider>
  ),
};
