import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../provider/theme-provider';
import { ThemeToggle } from './theme-toggle';

describe('ThemeToggle', () => {
  it('lấy trạng thái từ ThemeProvider và lật được theme', async () => {
    const user = userEvent.setup();
    document.documentElement.classList.remove('dark');

    render(
      <ThemeProvider defaultTheme="light" persist={false}>
        <ThemeToggle />
      </ThemeProvider>,
    );

    // Đang sáng → nút mời chuyển sang tối.
    await user.click(screen.getByRole('button', { name: 'Tối' }));

    expect(document.documentElement).toHaveClass('dark');
    expect(screen.getByRole('button', { name: 'Sáng' })).toBeInTheDocument();
  });

  it('chạy ở chế độ controlled khi app tự quản theme', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();

    render(<ThemeToggle theme="dark" onToggle={onToggle} />);

    await user.click(screen.getByRole('button', { name: 'Sáng' }));

    expect(onToggle).toHaveBeenCalledOnce();
  });
});
