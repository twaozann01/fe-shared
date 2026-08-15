import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { defaultLabels, mergeLabels, type UILabels, type UILabelsOverride } from './labels';

export interface UIContextValue {
  labels: UILabels;
  /** Component gọi khi có lỗi người dùng cần biết (vd ảnh quá nặng). App nối vào toast của mình. */
  onError: (message: string) => void;
  /**
   * Chuyển thông điệp lỗi validate thành chữ hiển thị.
   *
   * Schema Zod thường trả về *key i18n* (`'validation.email'`) thay vì câu tiếng Việt,
   * để một schema dùng được cho nhiều ngôn ngữ. Thư viện không biết dịch, nên app đưa
   * hàm dịch vào đây. Mặc định trả nguyên chuỗi — schema viết thẳng tiếng Việt vẫn chạy.
   */
  translateError: (message: string) => string;
}

const fallbackOnError = (message: string): void => {
  // Không kéo `sonner`/toast vào thư viện: mỗi app một hệ thông báo riêng.
  // Chưa nối gì thì ít nhất cũng thấy trong console thay vì im lặng nuốt lỗi.
  console.warn('[@twaozann01/ui]', message);
};

const identity = (message: string): string => message;

const fallbackValue: UIContextValue = {
  labels: defaultLabels,
  onError: fallbackOnError,
  translateError: identity,
};

const UIContext = createContext<UIContextValue | null>(null);

export interface UIProviderProps {
  /** Ghi đè chữ theo từng nhóm; nhóm không khai thì giữ bản mặc định tiếng Việt. */
  labels?: UILabelsOverride;
  onError?: (message: string) => void;
  translateError?: (message: string) => string;
  children: ReactNode;
}

/**
 * Bọc MỘT LẦN ở gốc app để bơm bản dịch và cách báo lỗi của app vào design system.
 *
 * ```tsx
 * <UIProvider
 *   labels={{ table: { empty: t('table.empty') } }}
 *   onError={(msg) => toast.error(msg)}
 *   translateError={(key) => t(key)}
 * >
 * ```
 */
export function UIProvider({
  labels,
  onError,
  translateError,
  children,
}: UIProviderProps) {
  const value = useMemo<UIContextValue>(
    () => ({
      labels: mergeLabels(defaultLabels, labels),
      onError: onError ?? fallbackOnError,
      translateError: translateError ?? identity,
    }),
    [labels, onError, translateError],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

/**
 * Không bọc UIProvider vẫn dùng được — rơi về mặc định.
 * Cố ý như vậy để `<Button>` chạy ngay trong một file test hay một trang thử nghiệm.
 */
export function useUI(): UIContextValue {
  return useContext(UIContext) ?? fallbackValue;
}

export function useUILabels(): UILabels {
  return useUI().labels;
}
