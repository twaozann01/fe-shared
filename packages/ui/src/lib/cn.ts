import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Gộp className có điều kiện + xử lý xung đột class Tailwind (vd 'p-2' + 'p-4' → 'p-4').
// Mọi component trong design system đều nhận `className` và gộp qua hàm này, nhờ vậy app
// luôn override được style mà không cần `!important`.
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
