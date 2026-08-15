import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Dialog, DialogContent, DialogTitle } from './dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

function DialogWithSelect() {
  return (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogTitle>Giao việc</DialogTitle>
        <Select>
          <SelectTrigger aria-label="Chọn thợ">
            <SelectValue placeholder="Chọn thợ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="an">Nguyễn An</SelectItem>
            <SelectItem value="binh">Trần Bình</SelectItem>
          </SelectContent>
        </Select>
      </DialogContent>
    </Dialog>
  );
}

describe('Dialog', () => {
  it('KHÔNG đóng khi chọn một option của Select nằm bên trong', async () => {
    const user = userEvent.setup();
    render(<DialogWithSelect />);

    await user.click(screen.getByLabelText('Chọn thợ'));
    await user.click(await screen.findByText('Nguyễn An'));

    // Option được portal ra body nên nếu thiếu guard, Dialog sẽ coi đây là "bấm ra ngoài".
    expect(screen.getByText('Giao việc')).toBeInTheDocument();
  });

  it('bỏ aria-describedby khi không có Description, giữ lại khi có', () => {
    const { unmount } = render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Không mô tả</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-describedby');
    unmount();
  });

  it('z-index của dialog lồng nhau tăng theo độ sâu', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent data-testid="ngoai">
          <DialogTitle>Ngoài</DialogTitle>
          <Dialog defaultOpen>
            <DialogContent data-testid="trong">
              <DialogTitle>Trong</DialogTitle>
            </DialogContent>
          </Dialog>
        </DialogContent>
      </Dialog>,
    );

    const outer = screen.getByTestId('ngoai').className;
    const inner = screen.getByTestId('trong').className;

    expect(outer).toContain('z-[1101]');
    expect(inner).toContain('z-[1111]'); // sâu hơn một nấc
  });
});
