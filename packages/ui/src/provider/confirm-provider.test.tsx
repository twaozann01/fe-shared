import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Button } from '../components/button';
import { ConfirmProvider, useConfirm } from './confirm-provider';

function DeleteButton({ onResult }: { onResult: (ok: boolean) => void }) {
  const confirm = useConfirm();

  return (
    <Button
      onClick={async () => {
        onResult(await confirm({ description: 'Xoá đơn này?', destructive: true }));
      }}
    >
      Xoá
    </Button>
  );
}

describe('ConfirmProvider', () => {
  it('Promise trả true khi người dùng bấm xác nhận', async () => {
    const user = userEvent.setup();
    let result: boolean | undefined;

    render(
      <ConfirmProvider>
        <DeleteButton onResult={(ok) => (result = ok)} />
      </ConfirmProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Xoá' }));
    expect(screen.getByText('Xoá đơn này?')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Xác nhận' }));

    expect(result).toBe(true);
  });

  it('Promise trả false khi người dùng bấm huỷ', async () => {
    const user = userEvent.setup();
    let result: boolean | undefined;

    render(
      <ConfirmProvider>
        <DeleteButton onResult={(ok) => (result = ok)} />
      </ConfirmProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Xoá' }));
    await user.click(screen.getByRole('button', { name: 'Huỷ' }));

    expect(result).toBe(false);
  });

  it('nhấn Esc cũng là từ chối, không phải đồng ý', async () => {
    const user = userEvent.setup();
    let result: boolean | undefined;

    render(
      <ConfirmProvider>
        <DeleteButton onResult={(ok) => (result = ok)} />
      </ConfirmProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Xoá' }));
    await user.keyboard('{Escape}');

    expect(result).toBe(false);
  });

  it('dùng tiêu đề mặc định khi nơi gọi không truyền', async () => {
    const user = userEvent.setup();

    render(
      <ConfirmProvider>
        <DeleteButton onResult={() => undefined} />
      </ConfirmProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Xoá' }));

    expect(screen.getByText('Bạn có chắc không?')).toBeInTheDocument();
  });
});
