import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { THIN_SCROLL } from '../lib/scroll';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import {
  DIALOG_BODY_CLASS,
  DIALOG_FOOTER_CLASS,
  DIALOG_HEADER_CLASS,
  DIALOG_ICON_CLASS,
  DIALOG_SHELL_CLASS,
  DIALOG_TITLE_BLOCK_CLASS,
} from './dialog-surface';

const SIZES = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
  /** Toàn màn trên điện thoại (bo góc 0), rộng dần theo màn ở trên. Hợp form nhiều field. */
  full:
    'max-sm:w-screen max-sm:max-w-none max-sm:rounded-none max-sm:border-0 ' +
    'sm:w-[min(96vw,720px)] sm:max-w-none lg:w-[min(94vw,1100px)]',
} as const;

export type DialogShellSize = keyof typeof SIZES;

export interface DialogShellProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Phần tử mở dialog. Bỏ qua nếu điều khiển bằng `open`. */
  trigger?: ReactNode;

  title?: ReactNode;
  description?: ReactNode;
  /** Icon cạnh tiêu đề — truyền phần tử luôn, vd `<Wrench />`. */
  icon?: ReactNode;
  /** Tô nền header bằng tông accent. */
  accentHeader?: boolean;

  /** Nội dung tầng thân (tự cuộn nếu dài). */
  children?: ReactNode;
  /** Cụm nút tầng chân. Bỏ trống = không có chân. */
  footer?: ReactNode;

  /** Bề rộng tối đa theo nấc (mặc định `lg`). Bị `width`/`maxWidth` đè. */
  size?: DialogShellSize;
  /**
   * Chiều cao tối đa (mặc định `90dvh`) — thân cuộn khi vượt.
   *
   * `dvh` chứ KHÔNG `vh`: `vh` tính theo viewport lúc thanh URL đã ẩn, nên trên điện thoại
   * footer (và nút Lưu) bị bàn phím ảo che.
   */
  maxHeight?: string | number;

  /**
   * Bề rộng CỐ ĐỊNH tính bằng **px**. Đè `size` và `maxWidth`.
   *
   * Vì sao là SỐ chứ không phải class: `SIZES` khai `sm:max-w-*` (có tiền tố breakpoint).
   * Truyền `max-w-[900px]` không tiền tố qua `className` thì tailwind-merge coi là thuộc tính
   * khác nên GIỮ CẢ HAI, và từ 640px trở lên cái `sm:` thắng — ô không rộng ra. Người viết
   * thấy "không ăn" liền thêm `!important`. Số đi vào inline `style` nên không đấu độ ưu tiên
   * với class nào cả.
   *
   * Khác `maxWidth`: `width` ép đúng cỡ đó kể cả khi nội dung hẹp hơn (hợp form nhiều cột,
   * để lưới không nhảy cỡ theo nội dung); `maxWidth` chỉ chặn trần, dialog vẫn co theo nội dung.
   */
  width?: number;
  /** Trần bề rộng tính bằng **px**. Đè `size`; bị `width` đè. */
  maxWidth?: number;
  /** Chiều cao CỐ ĐỊNH tính bằng **px**. Đè `maxHeight`. Hợp danh sách cuộn, khung xem trước. */
  height?: number;

  className?: string;
  bodyClassName?: string;
  overlayClassName?: string;
}

/**
 * Khung dialog 3 tầng DÙNG CHUNG — header (viền dưới, tô nền được) · thân (tự cuộn, scroll
 * mảnh) · chân (viền trên).
 *
 * Thay cho việc mỗi màn tự dựng lại `DialogContent + p-0 + border + overflow + footer`, mà
 * dựng tay thì mỗi nơi một nhịp lề, mở hai dialog liên tiếp là thấy lệch.
 *
 * ```tsx
 * <DialogShell
 *   open={open} onOpenChange={setOpen}
 *   title="Sửa dịch vụ" icon={<Wrench />}
 *   size="lg"
 *   footer={<><Button variant="outline">Huỷ</Button><Button>Lưu</Button></>}
 * >
 *   <Form …/>
 * </DialogShell>
 * ```
 */
export function DialogShell({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  icon,
  accentHeader = false,
  children,
  footer,
  size = 'lg',
  maxHeight = '90dvh',
  width,
  maxWidth,
  height,
  className,
  bodyClassName,
  overlayClassName,
}: DialogShellProps) {
  const hasHeader = Boolean(title || icon);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent
        style={{
          /*
           * MỌI cỡ bằng số đều đi qua inline `style`, và đều TỰ KẸP theo màn. Kẹp là bắt buộc
           * chứ không phải cho đẹp: inline style đè mất `max-w-[calc(100%-2rem)]` của
           * DialogContent — chốt duy nhất giữ dialog không tràn mép trên điện thoại.
           *
           * Thứ tự đè: width > maxWidth > size · height > maxHeight.
           */
          ...(height != null
            ? { height: `min(${height}px, 90dvh)`, maxHeight: `min(${height}px, 90dvh)` }
            : {
                maxHeight:
                  typeof maxHeight === 'number' ? `min(${maxHeight}px, 90dvh)` : maxHeight,
              }),
          ...(width != null
            ? {
                width: `min(${width}px, calc(100vw - 2rem))`,
                maxWidth: `min(${width}px, calc(100vw - 2rem))`,
              }
            : maxWidth != null
              ? { maxWidth: `min(${maxWidth}px, calc(100vw - 2rem))` }
              : null),
        }}
        overlayClassName={overlayClassName}
        className={cn(
          DIALOG_SHELL_CLASS,
          // Có cỡ bằng số thì bỏ hẳn class cỡ — để lại là hai nguồn cùng nói về bề rộng,
          // và người đọc không biết cái nào thắng.
          width == null && maxWidth == null && SIZES[size],
          className,
        )}
      >
        {hasHeader && (
          <DialogHeader className={cn(DIALOG_HEADER_CLASS, accentHeader && 'bg-accent')}>
            {icon ? (
              <span
                className={cn(
                  DIALOG_ICON_CLASS,
                  accentHeader ? 'text-accent-foreground' : 'text-muted-foreground',
                )}
              >
                {icon}
              </span>
            ) : null}
            <div className={DIALOG_TITLE_BLOCK_CLASS}>
              {title ? (
                <DialogTitle className={cn('truncate', accentHeader && 'text-accent-foreground')}>
                  {title}
                </DialogTitle>
              ) : null}
              {description ? <DialogDescription>{description}</DialogDescription> : null}
            </div>
          </DialogHeader>
        )}

        <div className={cn(DIALOG_BODY_CLASS, THIN_SCROLL, bodyClassName)}>{children}</div>

        {footer ? <DialogFooter className={DIALOG_FOOTER_CLASS}>{footer}</DialogFooter> : null}
      </DialogContent>
    </Dialog>
  );
}
