import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from './error-boundary';

function Boom(): never {
  throw new Error('vỡ rồi');
}

describe('ErrorBoundary', () => {
  // React log lỗi ra console khi boundary bắt được — tắt cho output test sạch.
  beforeEach(() => vi.spyOn(console, 'error').mockImplementation(() => {}));
  afterEach(() => vi.restoreAllMocks());

  it('render children khi không có lỗi', () => {
    render(
      <ErrorBoundary>
        <p>ổn</p>
      </ErrorBoundary>,
    );

    expect(screen.getByText('ổn')).toBeInTheDocument();
  });

  it('hiện fallback mặc định và báo lỗi ra onError', () => {
    const onError = vi.fn();

    render(
      <ErrorBoundary onError={onError}>
        <Boom />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Đã có lỗi xảy ra')).toBeInTheDocument();
    expect(onError).toHaveBeenCalledOnce();
  });

  it('dùng fallback riêng của app khi được truyền vào', () => {
    render(
      <ErrorBoundary fallback={<p>màn hình riêng</p>}>
        <Boom />
      </ErrorBoundary>,
    );

    expect(screen.getByText('màn hình riêng')).toBeInTheDocument();
  });
});
