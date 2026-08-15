// GÁC RÁC: bắt những thứ làm thư viện khó dùng về lâu dài.
//
//  1. Thiếu README  → người dùng phải đọc code mới biết package làm gì.
//  2. Thiếu entry point rõ ràng → không biết đâu là public API.
//  3. `exports` không trỏ vào dist → app import trúng file nguồn TypeScript, vỡ lúc build.
//  4. File tên utils.ts / helpers.ts / shared.ts → chỗ đổ rác, sớm muộn gì cũng phình.
import { join } from 'node:path';
import { display, exists, listPackages, report, walk } from './lib/workspace.mjs';

const DUMPING_GROUND = ['utils.ts', 'helpers.ts', 'shared.ts', 'common.ts', 'misc.ts'];

const packages = await listPackages();
const problems = [];
let checked = 0;

for (const { name, dir, relDir, pkg } of packages) {
  checked += 1;

  // App chỉ tiêu thụ thư viện, không phải thư viện → không áp luật public API cho nó.
  const isLibrary = pkg.twaozann?.layer !== 'app';

  for (const file of await walk(join(dir, 'src'), ['.ts', '.tsx'])) {
    const base = file.split(/[/\\]/).pop();
    if (DUMPING_GROUND.includes(base)) {
      problems.push({
        file: display(file),
        line: 1,
        message: `Tên file "${base}" là chỗ đổ rác — đặt tên theo việc nó làm (vd format-currency.ts).`,
      });
    }
  }

  if (!isLibrary) continue;

  if (!(await exists(join(dir, 'README.md')))) {
    problems.push({
      file: `${relDir}/README.md`,
      line: 1,
      message: `Package "${name}" thiếu README. Cần 4 mục: Tầng / Consumer / Public API / Khi nào KHÔNG dùng.`,
    });
  }

  // Entry hợp lệ: src/index.ts (package build bằng tsup), index.js (preset/config chạy thẳng),
  // hoặc base.json (package chỉ chứa tsconfig dùng chung).
  const entryCandidates = ['src/index.ts', 'index.js', 'base.json'];
  let hasEntry = false;
  for (const candidate of entryCandidates) {
    if (await exists(join(dir, candidate))) {
      hasEntry = true;
      break;
    }
  }

  if (!hasEntry) {
    problems.push({
      file: `${relDir}/src/index.ts`,
      line: 1,
      message: `Package "${name}" không có entry point rõ ràng. Public API phải gom về đúng một file.`,
    });
  }

  // Package build ra dist thì exports phải trỏ vào dist, không được trỏ vào src.
  const buildsToDist = pkg.scripts?.build?.includes('tsup');
  if (buildsToDist) {
    const serialized = JSON.stringify(pkg.exports ?? {});
    if (serialized.includes('./src/')) {
      problems.push({
        file: `${relDir}/package.json`,
        line: 1,
        message: `"exports" của "${name}" trỏ vào src/. App tiêu dùng sẽ import trúng TypeScript chưa biên dịch. Phải trỏ vào dist/.`,
      });
    }
    if (!serialized.includes('./dist/')) {
      problems.push({
        file: `${relDir}/package.json`,
        line: 1,
        message: `"${name}" build bằng tsup nhưng "exports" không trỏ vào dist/.`,
      });
    }
  }
}

report('guard:junk', problems, checked);
