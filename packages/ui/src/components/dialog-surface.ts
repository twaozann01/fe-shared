// MỘT bộ class cho MỌI bề mặt hộp thoại. Cùng vai trò với `field.ts` ở phía control nhập liệu:
// sửa ở đây là mọi hộp thoại đổi theo, thay vì mỗi chỗ tự khai một kiểu rồi trôi lệch dần.
//
// Hiện mới có một họ (Dialog). Khi thêm sheet / drawer / alert-dialog thì chúng dùng lại đúng
// bộ này — đó là lý do tách ra file riêng ngay từ bây giờ thay vì để rải trong dialog.tsx.

/**
 * Nền hộp thoại.
 *
 * `bg-card` chứ KHÔNG phải `bg-background`:
 *
 * |                 | light     | dark      |
 * |-----------------|-----------|-----------|
 * | `bg-background` | rất nhạt  | rất tối   | ← nền TRANG. Dùng cái này thì hộp thoại cùng màu với trang phía sau.
 * | `bg-card`       | trắng     | tối vừa   | ← đang dùng
 *
 * Giữ đúng ba nấc: trang < hộp thoại < ô nhập & popover. Bản port từ marketplace-fe dùng
 * `bg-background` nên ở dark mode hộp thoại chìm vào nền trang, chỉ còn nhận ra nhờ cái viền.
 */
export const DIALOG_BG_CLASS = 'bg-card';

/**
 * Độ đậm lớp mờ.
 *
 * `/50` chứ không nhạt hơn: nhạt quá thì nền và thanh tiêu đề lộ nguyên sau hộp thoại,
 * mắt không biết đâu là lớp đang thao tác.
 */
export const DIALOG_OVERLAY_CLASS = 'fixed inset-0 bg-black/50';

/** Cỡ chữ tiêu đề — dùng chung cho mọi họ hộp thoại. */
export const DIALOG_TITLE_CLASS = 'text-lg font-semibold leading-none tracking-tight';

/** Cỡ chữ mô tả phụ dưới tiêu đề. */
export const DIALOG_DESCRIPTION_CLASS = 'text-sm text-muted-foreground';

// ───────── Khung 3 tầng (DialogShell) ─────────
//
// Hai nhóm hằng, ranh giới rõ để không dùng nhầm:
//
//  - Nhóm trên (`DIALOG_BG/OVERLAY/TITLE/DESCRIPTION`) dùng cho MỌI họ hộp thoại.
//  - Nhóm dưới (`DIALOG_SHELL/HEADER/BODY/FOOTER/…`) CHỈ dùng cho khung 3 tầng có viền ngăn.
//    Các primitive trần (`DialogHeader`, `SheetHeader`) KHÔNG dùng nhóm này: chúng chỉ khai
//    hướng flex + khoảng hở, còn lề do thẻ cha lo. Nhét `px-6` vào đó là mọi `<Dialog>` thô
//    lãnh lề chồng lề.

/** Vỏ ngoài khung 3 tầng: bỏ lề mặc định, tự cắt nội dung tràn, xếp dọc không khe hở. */
export const DIALOG_SHELL_CLASS = 'flex flex-col gap-0 overflow-hidden p-0';

/** Tầng header: icon + tiêu đề + mô tả, ngăn với thân bằng một đường viền. */
export const DIALOG_HEADER_CLASS =
  'flex-none flex-row items-center gap-2.5 space-y-0 border-b border-border px-6 py-4 text-left';

/** Tầng thân: chiếm hết chỗ còn lại và tự cuộn khi dài. */
export const DIALOG_BODY_CLASS = 'min-h-0 flex-1 overflow-y-auto px-6 py-5';

/** Tầng footer: cụm nút, ngăn với thân bằng một đường viền. */
export const DIALOG_FOOTER_CLASS = 'flex-none border-t border-border px-6 py-3';

/** Icon cạnh tiêu đề — cùng cỡ ở mọi hộp thoại. */
export const DIALOG_ICON_CLASS = 'h-5 w-5 shrink-0';

/**
 * Cụm tiêu đề + mô tả trong header.
 *
 * `min-w-0` là BẮT BUỘC: header là flex-row, thiếu nó thì tiêu đề dài đẩy nở header
 * thay vì bị cắt bằng `truncate`.
 */
export const DIALOG_TITLE_BLOCK_CLASS = 'min-w-0 space-y-0.5';
