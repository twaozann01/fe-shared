// Radix portal nội dung của Select / Popover / DropdownMenu ra thẳng `document.body` — tức là
// NẰM NGOÀI cây DOM của Dialog. Hệ quả là mấy lỗi dưới đây, và cả ba đều rất khó lần vì
// build xanh, không có exception, chỉ có hành vi sai.
//
// Bộ helper này là bản port từ nextx-fe-shared, nơi ba lỗi đó đã bị bắt và vá trong thực tế.

/** Các lớp được portal ra body mà ta phải coi là "vẫn nằm trong dialog". */
const PORTALLED_LAYER_SELECTOR = [
  '[data-radix-popper-content-wrapper]', // select · popover · dropdown-menu
  '[data-radix-select-viewport]',
  '[role="listbox"]',
  '[data-radix-menu-content]',
].join(',');

/**
 * LỖI 1 — bấm một option của Select nằm trong Dialog thì Dialog đóng theo.
 *
 * Option được portal ra body nên lớp dismiss của Dialog đọc cú bấm đó là "click ra ngoài".
 * Hàm này cho `onPointerDownOutside` biết cú bấm thực ra rơi vào một lớp portal.
 */
export function isInsidePortalledLayer(node: EventTarget | null): boolean {
  return node instanceof Element && node.closest(PORTALLED_LAYER_SELECTOR) !== null;
}

const OPEN_PORTALLED_LAYER_SELECTOR = [
  '[data-radix-popper-content-wrapper] [data-state="open"]',
  '[data-radix-menu-content][data-state="open"]',
].join(',');

function isPortalledLayerOpenNow(): boolean {
  if (typeof document === 'undefined') return false;
  return document.querySelector(OPEN_PORTALLED_LAYER_SELECTOR) !== null;
}

// Radix lật `data-state` của popper sang "closed" NGAY TRONG cú pointerdown đang đóng nó,
// và việc đó xảy ra TRƯỚC khi guard của Dialog chạy. Nên kiểm tra ở thời điểm guard là đã
// muộn. Cách vá: chụp lại trạng thái ở pha capture (chạy trước handler bubble của Radix),
// rồi dùng ảnh chụp đó cho hết cú pointerdown này.
let layerOpenAtPointerDown = false;
if (typeof document !== 'undefined') {
  document.addEventListener(
    'pointerdown',
    () => {
      layerOpenAtPointerDown = isPortalledLayerOpenNow();
    },
    true,
  );
}

/**
 * LỖI 2 — Select đang mở trong Dialog, bấm ra ngoài thì đóng luôn cả Dialog.
 *
 * Cú bấm đó là để đóng Select, không phải đóng Dialog. Sau khi vá, muốn đóng Dialog lúc
 * Select đang mở thì cần hai lần bấm: lần đầu đóng Select, lần sau đóng Dialog — đúng như
 * người dùng mong đợi.
 */
export function hasOpenPortalledLayer(): boolean {
  return isPortalledLayerOpenNow() || layerOpenAtPointerDown;
}

// 300ms phủ được một cú double-click nhanh (ngưỡng dblclick của trình duyệt ~500ms, thao tác
// thật thường trong 200ms). Cao hơn nữa sẽ bắt đầu nuốt cả những cú bấm ra ngoài hợp lệ.
const RECENT_CLOSE_GRACE_MS = 300;

let lastPortalledLayerClosedAt = 0;
let portalCloseTrackerStarted = false;

/**
 * LỖI 3 — double-click vào một option trong Dialog làm Dialog đóng, mất dữ liệu form đang nhập.
 *
 * Nhịp đầu chọn option → Radix gỡ popper khỏi DOM. Nhịp sau rơi vào lớp overlay vừa lộ ra,
 * lúc này `hasOpenPortalledLayer()` đã trả false vì popper không còn nữa.
 *
 * Vá bằng cách theo dõi thời điểm popper bị gỡ. Gọi bao nhiêu lần cũng được, observer chỉ
 * chạy một lần cho mỗi document.
 */
export function ensurePortalCloseTracker(): void {
  if (portalCloseTrackerStarted) return;
  if (typeof window === 'undefined' || typeof MutationObserver === 'undefined') return;

  portalCloseTrackerStarted = true;
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.removedNodes) {
        if (!(node instanceof Element)) continue;
        if (
          node.matches(PORTALLED_LAYER_SELECTOR) ||
          node.querySelector(PORTALLED_LAYER_SELECTOR) !== null
        ) {
          lastPortalledLayerClosedAt = performance.now();
          return;
        }
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

/** True nếu một lớp portal vừa bị gỡ trong khoảng ân hạn — nhịp bấm kèm theo không phải ý đóng dialog. */
export function hasRecentlyClosedPortalledLayer(graceMs = RECENT_CLOSE_GRACE_MS): boolean {
  if (lastPortalledLayerClosedAt === 0) return false;
  return performance.now() - lastPortalledLayerClosedAt < graceMs;
}

const OPEN_DIALOG_SELECTOR =
  '[role="dialog"][data-state="open"],[role="alertdialog"][data-state="open"]';

/**
 * LỖI 4 — cả trang không bấm được gì nữa, phải F5.
 *
 * Radix khoá `body { pointer-events: none }` bằng bộ đếm tham chiếu. Khi một menu và một
 * Dialog chồng lên nhau (bấm item trong menu để mở dialog, lúc menu còn đang chạy animation
 * đóng), bộ đếm có thể lệch và body kẹt ở `none` sau khi mọi thứ đã đóng.
 *
 * Chính vì body đang `pointer-events: none` nên không cú bấm nào nổ ra được để tự chữa —
 * phải chủ động gọi hàm này lúc Dialog đóng.
 *
 * Chỉ gỡ khi CHẮC CHẮN là kẹt: body đang `none` mà không còn dialog thật nào mở. Cố ý chỉ
 * xét dialog, không xét menu/select — một menu bị mồ côi trong DOM với `data-state="open"`
 * cũ chính là thứ vừa gây kẹt vừa đánh lừa hàm này bỏ qua.
 */
export function unstickBodyPointerEvents(): void {
  if (typeof document === 'undefined') return;
  if (document.body.style.pointerEvents !== 'none') return;
  if (document.querySelector(OPEN_DIALOG_SELECTOR)) return; // khoá đang đúng, đừng đụng
  document.body.style.pointerEvents = '';
}
