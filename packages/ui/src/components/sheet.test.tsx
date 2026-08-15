import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Sheet, SheetContent, SheetTitle } from './sheet';

describe('Sheet', () => {
  it('mặc định trượt từ phải', () => {
    render(
      <Sheet defaultOpen>
        <SheetContent>
          <SheetTitle>Bộ lọc</SheetTitle>
        </SheetContent>
      </Sheet>,
    );

    expect(screen.getByRole('dialog').className).toContain('right-0');
  });

  it('đổi cạnh theo prop side', () => {
    render(
      <Sheet defaultOpen>
        <SheetContent side="bottom">
          <SheetTitle>Bộ lọc</SheetTitle>
        </SheetContent>
      </Sheet>,
    );

    const content = screen.getByRole('dialog');
    expect(content.className).toContain('bottom-0');
    expect(content.className).not.toContain('right-0');
  });

  it('dùng chung bộ chống-đóng-nhầm với Dialog', async () => {
    const user = userEvent.setup();

    render(
      <Sheet defaultOpen>
        <SheetContent>
          <SheetTitle>Bộ lọc</SheetTitle>
          <Select>
            <SelectTrigger aria-label="Danh mục">
              <SelectValue placeholder="Chọn" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dien">Điện</SelectItem>
            </SelectContent>
          </Select>
        </SheetContent>
      </Sheet>,
    );

    await user.click(screen.getByLabelText('Danh mục'));
    await user.click(await screen.findByText('Điện'));

    expect(screen.getByText('Bộ lọc')).toBeInTheDocument();
  });
});
