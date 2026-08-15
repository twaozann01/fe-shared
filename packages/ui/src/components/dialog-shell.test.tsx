import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DialogShell } from './dialog-shell';

describe('DialogShell', () => {
  it('bỏ class cỡ của mình khi truyền width bằng số', () => {
    // Để lại cả hai là hai nguồn cùng nói về bề rộng, người đọc không biết cái nào thắng —
    // chính chỗ đẻ ra mấy dấu `!important` trong app. Class nền của DialogContent vẫn còn,
    // nhưng inline style luôn thắng class nên không có tranh chấp.
    render(
      <DialogShell open title="Sửa dịch vụ" width={900}>
        <p>nội dung</p>
      </DialogShell>,
    );

    const content = screen.getByRole('dialog');
    expect(content.className).not.toContain('sm:max-w-2xl'); // SIZES.lg — cỡ mặc định
    // jsdom chèn dấu `*` khi chuẩn hoá `min()`, nên so khớp từng mảnh thay vì so chuỗi nguyên.
    expect(content.style.width).toContain('900px');
    expect(content.style.width).toContain('calc(100vw - 2rem)');
    expect(content.style.maxWidth).toContain('900px');
  });

  it('vẫn dùng class cỡ khi không truyền số', () => {
    render(
      <DialogShell open title="Sửa dịch vụ" size="xl">
        <p>nội dung</p>
      </DialogShell>,
    );

    expect(screen.getByRole('dialog').className).toContain('sm:max-w-4xl');
  });

  it('kẹp chiều cao theo màn để bàn phím ảo không che footer', () => {
    render(
      <DialogShell open title="X" height={800}>
        <p>nội dung</p>
      </DialogShell>,
    );

    const content = screen.getByRole('dialog');
    expect(content.style.height).toContain('90dvh');
    expect(content.style.maxHeight).toContain('90dvh');
    expect(content.style.height).toContain('800px');
  });

  it('width đè maxWidth', () => {
    render(
      <DialogShell open title="X" width={900} maxWidth={500}>
        <p>nội dung</p>
      </DialogShell>,
    );

    expect(screen.getByRole('dialog').style.maxWidth).toContain('900px');
    expect(screen.getByRole('dialog').style.maxWidth).not.toContain('500px');
  });

  it('không dựng header khi không có title lẫn icon', () => {
    render(
      <DialogShell open>
        <p>chỉ có thân</p>
      </DialogShell>,
    );

    expect(screen.getByText('chỉ có thân')).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('không dựng footer khi không truyền footer', () => {
    const { container } = render(
      <DialogShell open title="X">
        <p>thân</p>
      </DialogShell>,
    );

    expect(container.querySelector('.border-t')).toBeNull();
  });

  it('dựng đủ ba tầng khi có title + footer', () => {
    render(
      <DialogShell open title="Sửa dịch vụ" description="Mô tả" footer={<button>Lưu</button>}>
        <p>thân</p>
      </DialogShell>,
    );

    expect(screen.getByText('Sửa dịch vụ')).toBeInTheDocument();
    expect(screen.getByText('Mô tả')).toBeInTheDocument();
    expect(screen.getByText('thân')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Lưu' })).toBeInTheDocument();
  });
});
