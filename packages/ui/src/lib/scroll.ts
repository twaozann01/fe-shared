/**
 * Thanh cuộn MẢNH dùng chung — áp vào mọi vùng cuộn (thân dialog, bảng, panel…) để scroll
 * trông giống nhau ở mọi chỗ. Thumb dùng token `--border` nên tự hợp light/dark.
 *
 *   <div className={cn('overflow-y-auto', THIN_SCROLL)}>…</div>
 *
 * Viết bằng arbitrary property của Tailwind, không cần plugin.
 */
export const THIN_SCROLL =
  '[scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar]:w-1.5 ' +
  '[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border ' +
  '[&::-webkit-scrollbar-track]:bg-transparent';
