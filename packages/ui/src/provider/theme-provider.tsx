import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

/** Lựa chọn của người dùng. `system` = đi theo cài đặt của hệ điều hành. */
export type ThemeMode = 'light' | 'dark' | 'system';

/** Theme thực sự đang hiển thị, sau khi đã giải `system`. */
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeContextValue {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
  /** Lật qua lại giữa sáng và tối, dựa trên theme ĐANG hiển thị. */
  toggleTheme: () => void;
}

/** Nơi lưu lựa chọn theme. Trừu tượng hoá để test được và để chạy được cả khi không có localStorage. */
export interface ThemeStorage {
  get: (key: string) => string | null;
  set: (key: string, value: string) => void;
}

const DARK_CLASS = 'dark';
const DEFAULT_STORAGE_KEY = 'twaozann-theme';

const noopStorage: ThemeStorage = { get: () => null, set: () => undefined };

// localStorage có thể ném lỗi (chế độ riêng tư của Safari, iframe bị chặn cookie),
// và không tồn tại khi render phía server → bọc lại cho an toàn.
const browserStorage: ThemeStorage = {
  get: (key) => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key, value) => {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // hết dung lượng hoặc bị chặn — theme vẫn chạy, chỉ là không nhớ giữa các lần mở
    }
  },
};

function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'light' || value === 'dark' || value === 'system';
}

function prefersDark(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function resolve(theme: ThemeMode): ResolvedTheme {
  if (theme !== 'system') return theme;
  return prefersDark() ? 'dark' : 'light';
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children: ReactNode;
  /** Dùng khi chưa có lựa chọn nào được lưu. Mặc định `system`. */
  defaultTheme?: ThemeMode;
  /** Khoá localStorage. Đổi nếu một tên miền chạy nhiều app mà muốn theme riêng. */
  storageKey?: string;
  /** Đặt `false` để không nhớ lựa chọn giữa các lần mở. */
  persist?: boolean;
  /** Thay chỗ lưu (test, hoặc app tự quản bằng cookie). */
  storage?: ThemeStorage;
  /**
   * Phần tử được gắn class `dark`. Mặc định `<html>` — đúng chỗ Tailwind `darkMode: 'class'` tìm.
   * Chỉ đổi khi nhúng app vào một trang khác và không được đụng vào <html>.
   */
  element?: () => HTMLElement | null;
}

/**
 * Quản lý theme sáng/tối cho toàn app: nhớ lựa chọn, theo được cài đặt hệ điều hành,
 * và gắn class `.dark` lên `<html>` đúng như Tailwind cần.
 *
 * ```tsx
 * <ThemeProvider defaultTheme="system">
 *   <App />
 * </ThemeProvider>
 * ```
 *
 * Đây là thứ DUY NHẤT app cần để có dark mode — không phải viết lại store theme ở mỗi dự án.
 */
export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = DEFAULT_STORAGE_KEY,
  persist = true,
  storage,
  element,
}: ThemeProviderProps) {
  const store = useMemo<ThemeStorage>(() => {
    if (storage) return storage;
    if (!persist || typeof window === 'undefined') return noopStorage;
    return browserStorage;
  }, [storage, persist]);

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = store.get(storageKey);
    return isThemeMode(saved) ? saved : defaultTheme;
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolve(theme));

  // Gắn/gỡ class trên phần tử gốc mỗi khi theme hiển thị đổi.
  useEffect(() => {
    const target = element?.() ?? (typeof document === 'undefined' ? null : document.documentElement);
    if (!target) return;

    target.classList.toggle(DARK_CLASS, resolvedTheme === 'dark');
    // Cho trình duyệt biết để vẽ scrollbar/form control native đúng tông.
    target.style.colorScheme = resolvedTheme;
  }, [resolvedTheme, element]);

  // Theo cài đặt hệ điều hành khi người dùng chọn `system`.
  useEffect(() => {
    setResolvedTheme(resolve(theme));

    if (theme !== 'system') return;
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setResolvedTheme(media.matches ? 'dark' : 'light');

    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [theme]);

  const setTheme = useCallback(
    (next: ThemeMode) => {
      setThemeState(next);
      store.set(storageKey, next);
    },
    [store, storageKey],
  );

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Ném lỗi nếu quên bọc ThemeProvider — im lặng trả mặc định sẽ khiến bug rất khó tìm. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme phải nằm trong <ThemeProvider>. Bọc nó ở gốc app.');
  }
  return ctx;
}

/** Như `useTheme` nhưng trả `null` thay vì ném — dùng cho component chạy được cả khi không có provider. */
export function useOptionalTheme(): ThemeContextValue | null {
  return useContext(ThemeContext);
}

/**
 * Script chống "nháy trắng" khi tải trang: chèn vào `<head>` của index.html, TRƯỚC khi React chạy.
 * Không có nó, trang sẽ hiện nền sáng một nhịp rồi mới nhảy sang tối.
 *
 * ```html
 * <script>/* dán chuỗi này *\/</script>
 * ```
 */
export function getThemeInitScript(storageKey = DEFAULT_STORAGE_KEY): string {
  return `(function(){try{var t=localStorage.getItem('${storageKey}');var d=t==='dark'||((!t||t==='system')&&matchMedia('(prefers-color-scheme: dark)').matches);var e=document.documentElement;e.classList.toggle('dark',d);e.style.colorScheme=d?'dark':'light';}catch(_){}})()`;
}
