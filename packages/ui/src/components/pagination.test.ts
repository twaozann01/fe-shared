import { describe, expect, it } from 'vitest';
import { getPageItems } from './pagination';

describe('getPageItems', () => {
  it('chèn dấu … ở cả hai phía khi trang hiện tại ở giữa', () => {
    expect(getPageItems(5, 10)).toEqual([1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]);
  });

  it('không chèn … khi các trang liền nhau', () => {
    expect(getPageItems(2, 4)).toEqual([1, 2, 3, 4]);
  });

  it('không sinh trang ngoài khoảng [1, totalPages]', () => {
    expect(getPageItems(1, 3)).toEqual([1, 2, 3]);
    expect(getPageItems(3, 3)).toEqual([1, 2, 3]);
  });

  it('trả về đúng một trang khi chỉ có một trang', () => {
    expect(getPageItems(1, 1)).toEqual([1]);
  });
});
