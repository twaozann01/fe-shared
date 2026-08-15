import { act, render, renderHook, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider, useTheme, type ThemeStorage } from './theme-provider';

function makeStorage(initial?: string): ThemeStorage {
  const box = { value: initial ?? null };
  return {
    get: () => box.value,
    set: (_key, value) => {
      box.value = value;
    },
  };
}

/** Giả lập prefers-color-scheme của hệ điều hành. */
function mockMatchMedia(dark: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches: dark && query.includes('dark'),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark');
    vi.unstubAllGlobals();
  });

  it('gắn class dark lên <html> khi theme là dark', () => {
    render(
      <ThemeProvider defaultTheme="dark" storage={makeStorage()}>
        <p>x</p>
      </ThemeProvider>,
    );

    expect(document.documentElement).toHaveClass('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });

  it('gỡ class dark khi theme là light', () => {
    document.documentElement.classList.add('dark');

    render(
      <ThemeProvider defaultTheme="light" storage={makeStorage()}>
        <p>x</p>
      </ThemeProvider>,
    );

    expect(document.documentElement).not.toHaveClass('dark');
  });

  it('ưu tiên lựa chọn đã lưu hơn defaultTheme', () => {
    render(
      <ThemeProvider defaultTheme="light" storage={makeStorage('dark')}>
        <p>x</p>
      </ThemeProvider>,
    );

    expect(document.documentElement).toHaveClass('dark');
  });

  it('theo cài đặt hệ điều hành khi chọn system', () => {
    mockMatchMedia(true);

    render(
      <ThemeProvider defaultTheme="system" storage={makeStorage()}>
        <p>x</p>
      </ThemeProvider>,
    );

    expect(document.documentElement).toHaveClass('dark');
  });

  it('toggleTheme lật trạng thái và ghi vào storage', () => {
    const storage = makeStorage();
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => (
        <ThemeProvider defaultTheme="light" storage={storage}>
          {children}
        </ThemeProvider>
      ),
    });

    expect(result.current.resolvedTheme).toBe('light');

    act(() => result.current.toggleTheme());

    expect(result.current.resolvedTheme).toBe('dark');
    expect(storage.get('twaozann-theme')).toBe('dark');
    expect(document.documentElement).toHaveClass('dark');
  });

  it('không nhớ lựa chọn khi persist = false', () => {
    render(
      <ThemeProvider defaultTheme="dark" persist={false}>
        <p>ổn</p>
      </ThemeProvider>,
    );

    expect(screen.getByText('ổn')).toBeInTheDocument();
    expect(window.localStorage.getItem('twaozann-theme')).toBeNull();
  });
});
