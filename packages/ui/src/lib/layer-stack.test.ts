import { describe, expect, it } from 'vitest';
import { layerZClass, MAX_LAYER_DEPTH, POPPER_Z } from './layer-stack';

// Ý nghĩa của bộ số: lớp mờ của nấc sâu hơn phải nằm TRÊN thân của nấc nông hơn, nếu không
// dialog dưới sẽ không bị phủ bóng và hai lớp nội dung đứng cạnh nhau trông như một mớ.
const z = (cls: string) => Number(cls.replace(/\D/g, ''));

describe('layerZClass', () => {
  it('thân luôn nằm trên lớp mờ của chính nó', () => {
    for (let depth = 0; depth <= MAX_LAYER_DEPTH; depth += 1) {
      expect(z(layerZClass(depth, 'content'))).toBeGreaterThan(z(layerZClass(depth, 'overlay')));
    }
  });

  it('lớp mờ của nấc sâu hơn phủ trọn thân của nấc nông hơn', () => {
    for (let depth = 0; depth < MAX_LAYER_DEPTH; depth += 1) {
      expect(z(layerZClass(depth + 1, 'overlay'))).toBeGreaterThan(
        z(layerZClass(depth, 'content')),
      );
    }
  });

  it('popper đứng trên mọi nấc dialog', () => {
    expect(z(POPPER_Z)).toBeGreaterThan(z(layerZClass(MAX_LAYER_DEPTH, 'content')));
  });

  it('kẹp độ sâu vượt trần thay vì trả undefined', () => {
    expect(layerZClass(99, 'content')).toBe(layerZClass(MAX_LAYER_DEPTH, 'content'));
    expect(layerZClass(-5, 'overlay')).toBe(layerZClass(0, 'overlay'));
  });

  it('trả về class nguyên văn để Tailwind quét tĩnh được', () => {
    // Ghép chuỗi lúc chạy thì Tailwind không sinh CSS, và class không tồn tại bị bỏ qua lặng lẽ.
    expect(layerZClass(0, 'overlay')).toMatch(/^z-\[\d+\]$/);
  });
});
