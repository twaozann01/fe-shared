import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';
import { cn } from '../lib/cn';
import { LayerDepthProvider, layerZClass, useLayerDepth } from '../lib/layer-stack';
import { guardOutside, useModalDismissGuard } from '../lib/use-modal-dismiss';
import {
  DIALOG_BG_CLASS,
  DIALOG_DESCRIPTION_CLASS,
  DIALOG_OVERLAY_CLASS,
  DIALOG_TITLE_CLASS,
} from './dialog-surface';

/**
 * Khác `Sheet` ở đúng một điểm, nhưng là điểm quan trọng trên điện thoại: **kéo để đóng**.
 * Panel đi theo ngón tay và đóng khi vuốt đủ xa — cử chỉ mà người dùng mobile mặc định mong đợi.
 *
 * Trên desktop hầu như không có khác biệt, nên nếu chỉ làm web thì `Sheet` là đủ và nhẹ hơn
 * (không kéo thêm `vaul`).
 */
const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
);
Drawer.displayName = 'Drawer';

const DrawerTrigger = DrawerPrimitive.Trigger;
const DrawerPortal = DrawerPrimitive.Portal;
const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => {
  const depth = useLayerDepth();
  return (
    <DrawerPrimitive.Overlay
      ref={ref}
      className={cn(DIALOG_OVERLAY_CLASS, layerZClass(depth, 'overlay'), className)}
      {...props}
    />
  );
});
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

export interface DrawerContentProps
  extends React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> {
  overlayClassName?: string;
  /** Ẩn thanh kéo ở đầu panel. Chỉ nên ẩn khi đã có cách đóng khác thật rõ. */
  hideHandle?: boolean;
}

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  DrawerContentProps
>(
  (
    { className, children, overlayClassName, hideHandle, onPointerDownOutside, ...props },
    ref,
  ) => {
    const depth = useLayerDepth();
    // vaul dựng trên Radix Dialog nên dính đúng bốn cái bẫy portal như Dialog/Sheet.
    useModalDismissGuard();

    return (
      <DrawerPortal>
        <DrawerOverlay className={overlayClassName} />
        <DrawerPrimitive.Content
          ref={ref}
          className={cn(
            'fixed inset-x-0 bottom-0 mt-24 flex h-auto flex-col rounded-t-lg border',
            DIALOG_BG_CLASS,
            layerZClass(depth, 'content'),
            className,
          )}
          onPointerDownOutside={guardOutside(onPointerDownOutside)}
          {...props}
        >
          {!hideHandle && (
            // Vạch kéo: dấu hiệu thị giác duy nhất cho biết panel này kéo được.
            <div className="mx-auto mt-4 h-2 w-[100px] shrink-0 rounded-full bg-muted" />
          )}
          <LayerDepthProvider depth={depth + 1}>{children}</LayerDepthProvider>
        </DrawerPrimitive.Content>
      </DrawerPortal>
    );
  },
);
DrawerContent.displayName = 'DrawerContent';

const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('grid gap-1.5 p-4 text-left', className)} {...props} />
);
DrawerHeader.displayName = 'DrawerHeader';

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />
);
DrawerFooter.displayName = 'DrawerFooter';

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title ref={ref} className={cn(DIALOG_TITLE_CLASS, className)} {...props} />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn(DIALOG_DESCRIPTION_CLASS, className)}
    {...props}
  />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  Drawer,
  DrawerTrigger,
  DrawerPortal,
  DrawerClose,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
