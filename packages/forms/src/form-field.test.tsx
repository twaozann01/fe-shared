import { UIProvider } from '@twaozann/ui';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FormField } from './form-field';

describe('FormField', () => {
  it('hiện nguyên chuỗi lỗi khi app không khai translateError', () => {
    render(
      <FormField label="Email" error="Email không hợp lệ">
        <input />
      </FormField>,
    );

    expect(screen.getByText('Email không hợp lệ')).toBeInTheDocument();
  });

  it('dịch key lỗi của Zod qua translateError', () => {
    const dict: Record<string, string> = { 'validation.email': 'Email sai định dạng' };

    render(
      <UIProvider translateError={(key) => dict[key] ?? key}>
        <FormField label="Email" error="validation.email">
          <input />
        </FormField>
      </UIProvider>,
    );

    expect(screen.getByText('Email sai định dạng')).toBeInTheDocument();
  });

  it('gắn dấu * khi required', () => {
    const { container } = render(
      <FormField label="Tên" required>
        <input />
      </FormField>,
    );

    expect(container.querySelector('.text-destructive')).toHaveTextContent('*');
  });
});
