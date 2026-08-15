import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from './alert-dialog';
import { Dialog, DialogContent, DialogTitle } from './dialog';

function Warning({ onAction }: { onAction?: () => void }) {
  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent data-testid="canh-bao">
        <AlertDialogTitle>Xoá vĩnh viễn?</AlertDialogTitle>
        <AlertDialogDescription>Không hoàn tác được.</AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Huỷ</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onAction}>
            Xoá
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

describe('AlertDialog', () => {
  it('KHÔNG đóng khi bấm ra ngoài — buộc người dùng chọn một trong hai nút', () => {
    render(<Warning />);

    // fireEvent chứ không userEvent: lớp che của modal chặn pointer, userEvent sẽ từ chối
    // "bấm" vào phần tử không nhận được sự kiện. Radix nghe `pointerdown` ở cấp document.
    fireEvent.pointerDown(document.body);
    fireEvent.mouseDown(document.body);
    fireEvent.click(document.body);

    expect(screen.getByText('Xoá vĩnh viễn?')).toBeInTheDocument();
  });

  it('VẪN đóng khi nhấn Esc — lối thoát bằng bàn phím, bỏ đi là hỏng a11y', async () => {
    const user = userEvent.setup();
    render(<Warning />);

    await user.keyboard('{Escape}');

    expect(screen.queryByText('Xoá vĩnh viễn?')).not.toBeInTheDocument();
  });

  it('Action và Cancel tự mang style nút, không phải bọc asChild', () => {
    render(<Warning />);

    // Nếu quên style thì hai nút trông khác nhau giữa các màn — đây là chỗ hay sai nhất.
    expect(screen.getByRole('button', { name: 'Xoá' }).className).toContain('bg-destructive');
    expect(screen.getByRole('button', { name: 'Huỷ' }).className).toContain('border');
  });

  it('gọi onClick của Action', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<Warning onAction={onAction} />);

    await user.click(screen.getByRole('button', { name: 'Xoá' }));

    expect(onAction).toHaveBeenCalledOnce();
  });

  it('cảnh báo nằm TRÊN dialog cùng nấc', () => {
    render(
      <>
        <Dialog defaultOpen>
          <DialogContent data-testid="dialog">
            <DialogTitle>Dialog thường</DialogTitle>
          </DialogContent>
        </Dialog>
        <Warning />
      </>,
    );

    // Cả hai đều ở độ sâu 0 (AlertDialog khai ở cấp trang), nhưng `urgent` cộng thêm 4.
    // Dùng testid chứ không dùng role: Dialog modal gắn aria-hidden lên anh em của nó,
    // mà getByRole thì bỏ qua phần tử bị aria-hidden.
    expect(screen.getByTestId('dialog').className).toContain('z-[1101]');
    expect(screen.getByTestId('canh-bao').className).toContain('z-[1105]');
  });
});
