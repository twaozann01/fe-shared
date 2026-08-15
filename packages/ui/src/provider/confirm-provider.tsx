import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { Button } from '../components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/dialog';
import { useUILabels } from './ui-provider';

export interface ConfirmOptions {
  title?: ReactNode;
  description?: ReactNode;
  confirmText?: ReactNode;
  cancelText?: ReactNode;
  /** Nút xác nhận màu cảnh báo — dùng cho xoá/huỷ. */
  destructive?: boolean;
}

/** Gọi để hỏi người dùng; Promise trả `true` nếu họ bấm xác nhận. */
export type ConfirmFn = (options?: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

export interface ConfirmProviderProps {
  children: ReactNode;
}

/**
 * Cấp hàm `confirm()` trả về Promise cho toàn app — thay cho `window.confirm()` xấu xí
 * và thay cho việc mỗi màn hình tự dựng một `useState(openDeleteDialog)` riêng.
 *
 * ```tsx
 * <ConfirmProvider><App /></ConfirmProvider>
 *
 * const confirm = useConfirm();
 * if (await confirm({ description: 'Xoá đơn này?', destructive: true })) {
 *   await deleteOrder(id);
 * }
 * ```
 *
 * Chỉ có MỘT Dialog cho cả app: nó nằm ở đây, ai gọi cũng dùng chung.
 */
export function ConfirmProvider({ children }: ConfirmProviderProps) {
  const labels = useUILabels();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({});

  // Giữ hàm `resolve` của Promise đang chờ, để trả kết quả khi người dùng bấm nút.
  const resolver = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback<ConfirmFn>((opts) => {
    setOptions(opts ?? {});
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  // Đóng hộp thoại và trả kết quả. Xoá resolver để lần đóng thứ hai không resolve lại.
  const settle = (result: boolean) => {
    setOpen(false);
    resolver.current?.(result);
    resolver.current = null;
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {/* Bấm ra ngoài hoặc nhấn Esc = từ chối, không phải đồng ý. */}
      <Dialog open={open} onOpenChange={(next) => !next && settle(false)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{options.title ?? labels.confirm.title}</DialogTitle>
            {options.description && <DialogDescription>{options.description}</DialogDescription>}
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => settle(false)}>
              {options.cancelText ?? labels.common.cancel}
            </Button>
            <Button
              variant={options.destructive ? 'destructive' : 'default'}
              onClick={() => settle(true)}
            >
              {options.confirmText ?? labels.common.confirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConfirmContext.Provider>
  );
}

/** Ném lỗi nếu quên bọc provider — trả về hàm rỗng sẽ khiến hành động im lặng không chạy. */
export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error('useConfirm phải nằm trong <ConfirmProvider>. Bọc nó ở gốc app.');
  }
  return ctx;
}
