import '@testing-library/jest-dom/vitest';

// jsdom không cài đặt Pointer Capture API và `scrollIntoView`. Radix Select/Popover gọi thẳng
// chúng khi mở danh sách, nên thiếu là test ném `hasPointerCapture is not a function` — lỗi của
// môi trường test chứ không phải của component. Vá tối thiểu, đủ để Radix chạy.
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false;
  Element.prototype.setPointerCapture = () => undefined;
  Element.prototype.releasePointerCapture = () => undefined;
}
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => undefined;
}
