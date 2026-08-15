// Nguồn style DUY NHẤT cho mọi control nhập liệu (Input, Textarea, Select trigger, MultiSelect…).
// Sửa ở đây → đồng bộ màu / border / nền / chữ / focus / disabled cho TẤT CẢ.
// Mục đích: các ô nhập luôn giống hệt nhau về thị giác. Đừng hardcode lại class này ở component.

// Phần nền chung: border, bg, bo góc, cỡ chữ, shadow, placeholder, focus ring, trạng thái disabled.
export const fieldBaseClass =
  'w-full rounded-md border border-input bg-transparent text-sm shadow-sm transition-colors ' +
  'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 ' +
  'focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50';

// Chiều cao + padding chuẩn cho control 1 dòng (Input, Select trigger).
export const fieldSingleLineClass = 'h-9 px-3 py-1';
