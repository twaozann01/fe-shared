import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from './button';

describe('Button', () => {
  it('gộp className của app đè lên class mặc định', () => {
    render(<Button className="h-20">Bấm</Button>);

    const btn = screen.getByRole('button', { name: 'Bấm' });
    // tailwind-merge phải bỏ h-9 mặc định và giữ h-20 do app truyền vào.
    expect(btn.className).toContain('h-20');
    expect(btn.className).not.toContain('h-9');
  });

  it('render thẻ con khi asChild', () => {
    render(
      <Button asChild>
        <a href="/x">Đi</a>
      </Button>,
    );

    expect(screen.getByRole('link', { name: 'Đi' })).toBeInTheDocument();
  });
});
