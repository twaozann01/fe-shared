// Tiện ích chung cho các script gác: liệt kê package và duyệt file nguồn.
import { readdir, readFile, stat } from 'node:fs/promises';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

const WORKSPACE_DIRS = ['packages', 'configs', 'apps'];

/** @returns {Promise<Array<{name: string, dir: string, relDir: string, pkg: object}>>} */
export async function listPackages() {
  const found = [];

  for (const group of WORKSPACE_DIRS) {
    const groupDir = join(repoRoot, group);
    let entries;
    try {
      entries = await readdir(groupDir, { withFileTypes: true });
    } catch {
      continue; // nhóm chưa tồn tại thì bỏ qua
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const dir = join(groupDir, entry.name);
      try {
        const pkg = JSON.parse(await readFile(join(dir, 'package.json'), 'utf8'));
        found.push({ name: pkg.name, dir, relDir: `${group}/${entry.name}`, pkg });
      } catch {
        // thư mục không phải package (vd node_modules rơi vãi) → bỏ qua
      }
    }
  }

  return found.sort((a, b) => a.name.localeCompare(b.name));
}

const SKIP_DIRS = new Set(['node_modules', 'dist', '.turbo', 'storybook-static', 'coverage']);

/** Duyệt đệ quy các file có phần mở rộng cho trước. */
export async function walk(dir, extensions) {
  const out = [];

  async function visit(current) {
    let entries;
    try {
      entries = await readdir(current, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const full = join(current, entry.name);
      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name)) continue;
        await visit(full);
      } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
        out.push(full);
      }
    }
  }

  await visit(dir);
  return out;
}

export async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

/** Đường dẫn hiển thị trong báo lỗi — luôn dùng '/' để copy-paste được trên mọi OS. */
export function display(path) {
  return relative(repoRoot, path).split(sep).join('/');
}

/**
 * In kết quả và thoát với mã phù hợp.
 * @param {string} title tên máy gác
 * @param {Array<{file: string, line: number, message: string}>} problems
 */
export function report(title, problems, checkedCount) {
  if (problems.length === 0) {
    console.log(`✓ ${title} — sạch (${checkedCount} file)`);
    return;
  }

  console.error(`✗ ${title} — ${problems.length} vi phạm:\n`);
  for (const p of problems) {
    console.error(`  ${p.file}:${p.line}`);
    console.error(`    ${p.message}\n`);
  }
  process.exitCode = 1;
}
