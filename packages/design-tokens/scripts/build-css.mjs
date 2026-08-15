// Sinh `dist/tokens.css` TỪ `src/tokens.ts` (đã build ra dist/index.js).
// Mục đích: không có hai bản màu song song để trôi lệch nhau — sửa tokens.ts là CSS đổi theo.
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, '..', 'dist');

const { lightTokens, darkTokens, colorTokenNames, radius } = await import(
  new URL('../dist/index.js', import.meta.url).href
);

const declare = (scale, indent) =>
  colorTokenNames.map((name) => `${indent}--${name}: ${scale[name]};`).join('\n');

const css = `/* SINH TỰ ĐỘNG bởi scripts/build-css.mjs — ĐỪNG sửa tay.
   Nguồn: packages/design-tokens/src/tokens.ts */

@layer base {
  :root {
${declare(lightTokens, '    ')}
    --radius: ${radius};
  }

  .dark {
${declare(darkTokens, '    ')}
  }
}
`;

await writeFile(join(dist, 'tokens.css'), css, 'utf8');
console.log(`design-tokens: viết dist/tokens.css (${colorTokenNames.length} token × 2 theme)`);
