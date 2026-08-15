import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SearchInput } from './search-input';

describe('SearchInput', () => {
  beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
  afterEach(() => vi.useRealTimers());

  it('chỉ gọi onChange một lần sau khi ngừng gõ', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const onChange = vi.fn();

    render(<SearchInput value="" onChange={onChange} debounceMs={300} />);
    await user.type(screen.getByRole('searchbox'), 'abc');

    expect(onChange).not.toHaveBeenCalled();

    // Bọc act() vì hết debounce là component setState — không bọc thì React cảnh báo.
    await act(() => vi.advanceTimersByTimeAsync(300));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('abc');
  });

  it('đồng bộ ngược khi value bên ngoài đổi (vd bấm Đặt lại)', () => {
    const onChange = vi.fn();
    const { rerender } = render(<SearchInput value="abc" onChange={onChange} />);

    rerender(<SearchInput value="" onChange={onChange} />);

    expect(screen.getByRole('searchbox')).toHaveValue('');
  });
});
