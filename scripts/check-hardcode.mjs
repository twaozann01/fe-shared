// GÁC MÀU CỨNG: đây là máy gác quan trọng nhất với mục tiêu "sửa một chỗ, đổi toàn app".
//
// Chỉ cần MỘT chỗ viết `bg-[#3b82f6]` hay `text-blue-500` là cơ chế token thủng: đổi
// --primary trong design-tokens sẽ không đổi được chỗ đó, và giao diện lệch dần theo thời gian.
//
// Cho phép: `black` / `white` không kèm bậc số — dùng cho lớp phủ modal, là quy ước phổ biến
// và không phụ thuộc bảng màu thương hiệu.
//
// Escape có chủ đích: thêm `ds-allow: <lý do>` vào đúng dòng đó.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { display, listPackages, report, walk } from './lib/workspace.mjs';

const PALETTE = [
  'slate', 'gray', 'zinc', 'neutral', 'stone',
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal',
  'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose',
];

const UTILITIES = [
  'bg', 'text', 'border', 'ring', 'fill', 'stroke', 'from', 'via', 'to',
  'decoration', 'outline', 'shadow', 'accent', 'caret', 'divide', 'placeholder',
];

const RULES = [
  {
    // #fff, #3b82f6, và cả dạng arbitrary bg-[#3b82f6]
    re: /#[0-9a-fA-F]{3,8}\b/,
    message:
      'Mã màu hex. Dùng token thay thế: class Tailwind (bg-primary, text-muted-foreground) hoặc hsl(var(--token)).',
  },
  {
    re: new RegExp(`\\b(?:${UTILITIES.join('|')})-(?:${PALETTE.join('|')})-\\d{2,3}\\b`),
    message:
      'Màu thô từ bảng màu Tailwind. Dùng token ngữ nghĩa: primary / secondary / destructive / success / warning / info / muted / accent.',
  },
  {
    re: /\b(?:rgb|rgba)\(/,
    message: 'Màu rgb() viết cứng. Dùng hsl(var(--token)) để theo được light/dark.',
  },
];

const packages = await listPackages();
const problems = [];
let checked = 0;

for (const { dir } of packages) {
  const files = await walk(join(dir, 'src'), ['.ts', '.tsx', '.css']);

  for (const file of files) {
    checked += 1;
    const lines = (await readFile(file, 'utf8')).split('\n');

    lines.forEach((text, index) => {
      if (text.includes('ds-allow')) return;

      for (const rule of RULES) {
        const match = rule.re.exec(text);
        if (match) {
          problems.push({
            file: display(file),
            line: index + 1,
            message: `"${match[0]}" — ${rule.message}`,
          });
          break; // một dòng báo một lần là đủ
        }
      }
    });
  }
}

report('guard:hardcode', problems, checked);
