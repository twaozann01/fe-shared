import { useEffect } from 'react';
import {
  ensurePortalCloseTracker,
  hasOpenPortalledLayer,
  hasRecentlyClosedPortalledLayer,
  isInsidePortalledLayer,
  unstickBodyPointerEvents,
} from './portal-layers';

/**
 * Radix truyền một event có `detail.originalEvent`; chỉ cần đúng chừng đó.
 * Khai tối giản để dùng lại được cho cả Radix Dialog lẫn vaul Drawer — hai bên khai kiểu
 * sự kiện riêng, nhưng cùng hình dạng này.
 */
interface OutsideEvent {
  detail: { originalEvent: { target: EventTarget | null } };
  preventDefault: () => void;
}

// Cú tương tác bắt nguồn từ một lớp portal (option của Select, nội dung Popover) KHÔNG phải
// là "bấm ra ngoài" — dù xét theo cây DOM thì đúng là ngoài thật.
function isPortalNoise(target: EventTarget | null): boolean {
  return (
    isInsidePortalledLayer(target) || hasOpenPortalledLayer() || hasRecentlyClosedPortalledLayer()
  );
}

/**
 * Bọc một handler `onPointerDownOutside` / `onInteractOutside` để nó bỏ qua các cú tương tác
 * thực ra thuộc về một lớp portal bên trong.
 *
 * Generic giữ nguyên kiểu sự kiện của bên gọi, nên gắn được vào Radix Dialog, Radix Sheet
 * và vaul Drawer mà không phải ép kiểu ở nơi dùng.
 */
export function guardOutside<E extends OutsideEvent>(handler?: (event: E) => void) {
  return (event: E) => {
    if (isPortalNoise(event.detail.originalEvent.target)) event.preventDefault();
    handler?.(event);
  };
}

/**
 * Bật tracker lớp portal, và gỡ `pointer-events: none` bị kẹt trên body khi lớp che đóng.
 *
 * Gom về một hook vì Dialog · Sheet · Drawer có cùng vấn đề và phải vá y hệt nhau — để mỗi
 * file tự chép lại thì ba bản sẽ trôi lệch, rồi vá được chỗ này quên chỗ kia.
 */
export function useModalDismissGuard(): void {
  useEffect(() => {
    ensurePortalCloseTracker();
    return () => {
      // Chạy SAU khi Radix khôi phục và sau animation đóng — nên thử lại vài nhịp
      // chứ không gọi một lần rồi thôi.
      requestAnimationFrame(() => requestAnimationFrame(unstickBodyPointerEvents));
      window.setTimeout(unstickBodyPointerEvents, 150);
      window.setTimeout(unstickBodyPointerEvents, 400);
    };
  }, []);
}
