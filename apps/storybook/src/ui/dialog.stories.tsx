import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  MultiSelect,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@twaozann01/ui';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

const meta: Meta = {
  title: 'UI/Dialog',
};

export default meta;

const options = [
  { value: 'an', label: 'Nguyễn An' },
  { value: 'binh', label: 'Trần Bình' },
  { value: 'cuong', label: 'Lê Cường' },
];

export const XacNhan: StoryObj = {
  name: 'Hộp thoại xác nhận',
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Xoá đơn hàng</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xoá đơn hàng?</DialogTitle>
          <DialogDescription>
            Hành động này không thể hoàn tác. Đơn hàng sẽ bị xoá vĩnh viễn.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Huỷ</Button>
          </DialogClose>
          <Button variant="destructive">Xoá</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const ChuaSelect: StoryObj = {
  name: 'Chứa Select / MultiSelect',
  parameters: {
    docs: {
      description: {
        story:
          'Chọn một option — dialog KHÔNG được đóng theo. Radix portal option ra document.body nên lớp dismiss của dialog đọc cú bấm đó là "ngoài"; phần guard trong DialogContent chặn hiểu nhầm này. Thử cả double-click vào option, và bấm ra ngoài khi danh sách đang mở (lần đầu chỉ đóng danh sách).',
      },
    },
  },
  render: function Render() {
    const [tags, setTags] = useState<string[]>([]);

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>Giao việc cho thợ</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Giao việc</DialogTitle>
            <DialogDescription>Chọn thợ rồi bấm Giao.</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Chọn thợ chính" />
              </SelectTrigger>
              <SelectContent>
                {options.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <MultiSelect
              value={tags}
              onChange={setTags}
              options={options}
              placeholder="Thợ hỗ trợ (chọn nhiều)"
            />

            <Input placeholder="Ghi chú" />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Huỷ</Button>
            </DialogClose>
            <Button>Giao</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
};

export const LongNhau: StoryObj = {
  name: 'Dialog lồng nhau',
  parameters: {
    docs: {
      description: {
        story:
          'z-index suy theo độ sâu lồng nhau, không cố định. Dialog trong (nấc 1) phủ bóng trọn dialog ngoài (nấc 0) thay vì đứng cạnh nó.',
      },
    },
  },
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Mở dialog ngoài</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog ngoài — nấc 0</DialogTitle>
          <DialogDescription>Mở tiếp cái bên trong để thấy nó phủ bóng lên đây.</DialogDescription>
        </DialogHeader>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Mở dialog trong</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog trong — nấc 1</DialogTitle>
              <DialogDescription>
                Lớp mờ của nấc này nằm trên thân của nấc 0.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Đóng</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Đóng</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
