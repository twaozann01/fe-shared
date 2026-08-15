import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import * as React from 'react';
import { cn } from '../lib/cn';
import { LayerDepthProvider, layerZClass, useLayerDepth } from '../lib/layer-stack';
import { guardOutside, useModalDismissGuard } from '../lib/use-modal-dismiss';
import { useUILabels } from '../provider/ui-provider';
import {
  DIALOG_BG_CLASS,
  DIALOG_DESCRIPTION_CLASS,
  DIALOG_OVERLAY_CLASS,
  DIALOG_TITLE_CLASS,
} from './dialog-surface';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;
const DialogPortal = DialogPrimitive.Portal;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => {
  const depth = useLayerDepth();
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        DIALOG_OVERLAY_CLASS,
        // z theo ĐỘ SÂU lồng nhau, không cố định — dialog mở sau luôn phủ bóng dialog trước.
        layerZClass(depth, 'overlay'),
        className,
      )}
      {...props}
    />
  );
});
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

/**
 * Radix cảnh báo trong dev nếu DialogContent không có Description và cũng không khai
 * `aria-describedby={undefined}`. Quét đệ quy children để chỉ tắt cảnh báo khi thật sự
 * không có Description, thay vì tắt mù làm hỏng a11y của dialog đã có mô tả.
 */
function hasDialogDescription(children: React.ReactNode): boolean {
  let found = false;
  React.Children.forEach(children, (child) => {
    if (found || !React.isValidElement(child)) return;
    if (child.type === DialogDescription || child.type === DialogPrimitive.Description) {
      found = true;
      return;
    }
    const nested = (child.props as { children?: React.ReactNode })?.children;
    if (nested) found = hasDialogDescription(nested);
  });
  return found;
}

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /** Nhãn cho nút đóng ở góc — mặc định lấy từ UIProvider. */
  closeLabel?: string;
  /** Class riêng cho lớp mờ. */
  overlayClassName?: string;
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(
  (
    {
      className,
      children,
      closeLabel,
      overlayClassName,
      onPointerDownOutside,
      onInteractOutside,
      ...props
    },
    ref,
  ) => {
    const labels = useUILabels();
    const depth = useLayerDepth();
    useModalDismissGuard();

    return (
      <DialogPortal>
        <DialogOverlay className={overlayClassName} />
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            'fixed left-1/2 top-1/2 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg',
            // Kẹp mép trên điện thoại — không có dòng này dialog tràn ra ngoài màn hình nhỏ.
            'max-w-[calc(100%-2rem)] sm:max-w-lg',
            DIALOG_BG_CLASS,
            layerZClass(depth, 'content'),
            className,
          )}
          onPointerDownOutside={guardOutside(onPointerDownOutside)}
          onInteractOutside={guardOutside(onInteractOutside)}
          {...(props['aria-describedby'] === undefined && !hasDialogDescription(children)
            ? { 'aria-describedby': undefined }
            : {})}
          {...props}
        >
          {/*
           * Con của dialog này nằm sâu hơn MỘT nấc. Context đi xuyên portal (theo cây React,
           * không theo cây DOM) nên dialog lồng bên trong vẫn nhận đúng nấc dù Radix đã bốc
           * nó ra `document.body`.
           */}
          <LayerDepthProvider depth={depth + 1}>{children}</LayerDepthProvider>
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">{closeLabel ?? labels.common.close}</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPortal>
    );
  },
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 text-left', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn(DIALOG_TITLE_CLASS, className)} {...props} />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn(DIALOG_DESCRIPTION_CLASS, className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogOverlay,
  DialogPortal,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
