// NGUỒN CHÂN LÝ DUY NHẤT của bảng màu. Mọi thứ khác được sinh ra từ file này:
//   - `dist/tokens.css`  (CSS variables cho web)  ← scripts/build-css.mjs sinh ra
//   - `lightColors` / `darkColors` (chuỗi hsl() dùng cho Zalo Mini App / React Native)
//   - preset Tailwind trong @twaozann01/tailwind-config trỏ vào các biến này
//
// Giá trị là bộ ba HSL KHÔNG có `hsl()` bọc ngoài — đúng dạng Tailwind cần để
// viết `hsl(var(--primary) / <alpha-value>)`, nhờ vậy `bg-primary/15` mới chạy.

/** Tên mọi token màu. Thêm token mới thì thêm ở đây trước. */
export type ColorToken =
  | 'background'
  | 'foreground'
  | 'card'
  | 'card-foreground'
  | 'popover'
  | 'popover-foreground'
  | 'primary'
  | 'primary-foreground'
  | 'secondary'
  | 'secondary-foreground'
  | 'muted'
  | 'muted-foreground'
  | 'accent'
  | 'accent-foreground'
  | 'destructive'
  | 'destructive-foreground'
  | 'success'
  | 'success-foreground'
  | 'warning'
  | 'warning-foreground'
  | 'info'
  | 'info-foreground'
  | 'border'
  | 'input'
  | 'ring';

export type ColorScale = Record<ColorToken, string>;

/** LIGHT — tone xanh dương nhạt (nền hơi xanh, brand blue). */
export const lightTokens: ColorScale = {
  background: '210 60% 98%',
  foreground: '222.2 47% 11%',
  card: '0 0% 100%',
  'card-foreground': '222.2 47% 11%',
  popover: '0 0% 100%',
  'popover-foreground': '222.2 47% 11%',
  primary: '217 91% 60%',
  'primary-foreground': '0 0% 100%',
  secondary: '210 40% 94%',
  'secondary-foreground': '222.2 47% 11%',
  muted: '210 40% 94%',
  'muted-foreground': '215 16% 47%',
  accent: '210 95% 92%',
  'accent-foreground': '217 70% 30%',
  destructive: '0 84% 60%',
  'destructive-foreground': '0 0% 100%',
  // Bộ 3 màu ngữ nghĩa cho Badge/Alert. Trước đây hardcode emerald/amber/blue của
  // Tailwind — đưa thành token để đổi một chỗ là đổi mọi nơi, và để guard:hardcode gác được.
  success: '160 84% 39%',
  'success-foreground': '161 94% 24%',
  warning: '38 92% 50%',
  'warning-foreground': '26 90% 37%',
  info: '217 91% 60%',
  'info-foreground': '224 76% 48%',
  border: '214 32% 88%',
  input: '214 32% 88%',
  ring: '217 91% 60%',
};

/** DARK — navy + cùng brand blue cho nhất quán với light. */
export const darkTokens: ColorScale = {
  background: '222 47% 8%',
  foreground: '210 40% 98%',
  card: '222 47% 10%',
  'card-foreground': '210 40% 98%',
  popover: '222 47% 10%',
  'popover-foreground': '210 40% 98%',
  primary: '217 91% 60%',
  'primary-foreground': '0 0% 100%',
  secondary: '217 33% 18%',
  'secondary-foreground': '210 40% 98%',
  muted: '217 33% 18%',
  'muted-foreground': '215 20% 65%',
  accent: '217 33% 20%',
  'accent-foreground': '210 40% 98%',
  destructive: '0 62% 45%',
  'destructive-foreground': '0 0% 98%',
  // Nền tint giữ nguyên, chỉ chữ sáng lên để đủ tương phản trên nền navy.
  success: '160 84% 39%',
  'success-foreground': '156 72% 67%',
  warning: '38 92% 50%',
  'warning-foreground': '43 96% 56%',
  info: '217 91% 60%',
  'info-foreground': '213 94% 68%',
  border: '217 33% 20%',
  input: '217 33% 22%',
  ring: '217 91% 60%',
};

/** Bán kính bo góc gốc; Tailwind suy ra `md` = radius-2px, `sm` = radius-4px. */
export const radius = '0.5rem';

/** Bọc bộ ba HSL thành chuỗi màu CSS/RN hợp lệ. */
export function hsl(token: string): string {
  return `hsl(${token})`;
}

function toColors(scale: ColorScale): Record<ColorToken, string> {
  return Object.fromEntries(
    Object.entries(scale).map(([key, value]) => [key, hsl(value)]),
  ) as Record<ColorToken, string>;
}

/**
 * Màu dạng `hsl(...)` dùng được ngay ngoài Tailwind — cho `zmp-ui` (Zalo Mini App)
 * và `StyleSheet` của React Native, những nơi không có CSS variables.
 */
export const lightColors: Record<ColorToken, string> = toColors(lightTokens);
export const darkColors: Record<ColorToken, string> = toColors(darkTokens);

/** Thứ tự khai báo dùng khi sinh CSS — giữ ổn định để diff của tokens.css dễ đọc. */
export const colorTokenNames = Object.keys(lightTokens) as ColorToken[];
