import { describe, expect, it } from 'vitest';
import { defaultLabels, mergeLabels } from './labels';

describe('mergeLabels', () => {
  it('trả về nguyên bản khi không có override', () => {
    expect(mergeLabels(defaultLabels)).toBe(defaultLabels);
  });

  it('ghi đè từng key mà không xoá các key khác cùng nhóm', () => {
    const merged = mergeLabels(defaultLabels, { table: { empty: 'No data' } });

    expect(merged.table.empty).toBe('No data');
    expect(merged.common.close).toBe(defaultLabels.common.close);
  });

  it('ghi đè được cả nhãn dạng hàm', () => {
    const merged = mergeLabels(defaultLabels, {
      multiSelect: { selected: (count) => `${count} selected` },
    });

    expect(merged.multiSelect.selected(3)).toBe('3 selected');
  });

  it('không làm hỏng bản gốc', () => {
    mergeLabels(defaultLabels, { table: { empty: 'X' } });

    expect(defaultLabels.table.empty).toBe('Không có dữ liệu');
  });
});
