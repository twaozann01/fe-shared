import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Input,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@twaozann01/ui';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@twaozann01/ui/drawer';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'UI/Lớp che khác',
  parameters: {
    docs: {
      description: {
        component:
          'Ba họ còn lại, dùng chung một bộ class bề mặt và một ngăn xếp z với Dialog — nên mở liên tiếp không thấy lệch nhịp lề hay lệch tầng.',
      },
    },
  },
};

export default meta;

export const CanhBao: StoryObj = {
  name: 'AlertDialog',
  parameters: {
    docs: {
      description: {
        story:
          'Không đóng khi bấm ra ngoài — buộc chọn một trong hai nút. Esc thì vẫn đóng (lối thoát bằng bàn phím). Nút Action/Cancel tự mang style nút, không phải bọc asChild.',
      },
    },
  },
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Xoá tài khoản</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xoá tài khoản vĩnh viễn?</AlertDialogTitle>
          <AlertDialogDescription>
            Toàn bộ đơn hàng và lịch sử giao dịch sẽ bị xoá. Không khôi phục được.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Huỷ</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Xoá vĩnh viễn</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const PanelTruot: StoryObj = {
  name: 'Sheet — 4 cạnh',
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(['right', 'left', 'top', 'bottom'] as const).map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="outline">side={side}</Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Bộ lọc</SheetTitle>
              <SheetDescription>Panel trượt từ cạnh {side}.</SheetDescription>
            </SheetHeader>
            <div className="space-y-3 p-4">
              <Input placeholder="Từ khoá" />
              <Input type="date" />
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button>Áp dụng</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  ),
};

export const KeoDeDong: StoryObj = {
  name: 'Drawer — kéo để đóng',
  parameters: {
    docs: {
      description: {
        story:
          'Khác Sheet đúng một điểm nhưng quan trọng trên điện thoại: kéo vạch ở đầu panel xuống là đóng. Chỉ làm web thì Sheet đủ và nhẹ hơn (không cần vaul).',
      },
    },
  },
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Mở drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Chọn phương thức thanh toán</DrawerTitle>
          <DrawerDescription>Kéo vạch ở trên xuống để đóng.</DrawerDescription>
        </DrawerHeader>
        <div className="space-y-2 px-4">
          {['Ví NextX', 'VNPay', 'Tiền mặt'].map((method) => (
            <button
              key={method}
              className="w-full rounded-md border px-3 py-3 text-left text-sm hover:bg-accent hover:text-accent-foreground"
            >
              {method}
            </button>
          ))}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Đóng</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};
