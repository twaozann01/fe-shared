// GÁC TẦNG: package tầng dưới không được import package tầng trên.
//
// Vì sao cần: không có luật này thì sau vài tháng `ui` gọi `forms`, `forms` gọi lại `ui`,
// bundler vẫn build được nhưng sinh phụ thuộc vòng — lỗi chỉ lộ ra lúc chạy, rất khó lần.
//
// Thêm package mới: phải khai `twaozann.layer` trong package.json, nếu không script này chặn.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { display, listPackages, report, walk } from './lib/workspace.mjs';

// 'app' là bậc dành cho thứ chỉ TIÊU THỤ thư viện (Storybook, và sau này là app thật):
// nó đứng trên mọi tầng nên import gì cũng được, nhưng không package nào được import ngược lại nó.
const LAYER_RANK = { L0: 0, L1: 1, L2: 2, app: 99 };

const IMPORT_RE = /(?:from|import)\s+['"](@twaozann\/[a-z-]+)['"]/g;

const packages = await listPackages();
const layerOf = new Map();
const problems = [];

for (const { name, pkg, relDir } of packages) {
  const layer = pkg.twaozann?.layer;
  if (!layer) {
    problems.push({
      file: `${relDir}/package.json`,
      line: 1,
      message: `Package "${name}" chưa khai "twaozann.layer". Mỗi package phải có chỗ rõ ràng trong kiến trúc trước khi được dùng.`,
    });
    continue;
  }
  if (!(layer in LAYER_RANK)) {
    problems.push({
      file: `${relDir}/package.json`,
      line: 1,
      message: `Tầng "${layer}" không hợp lệ. Chỉ có: ${Object.keys(LAYER_RANK).join(', ')}.`,
    });
    continue;
  }
  layerOf.set(name, layer);
}

let checked = 0;

for (const { name, dir } of packages) {
  const layer = layerOf.get(name);
  if (!layer) continue;

  const files = await walk(join(dir, 'src'), ['.ts', '.tsx']);
  for (const file of files) {
    checked += 1;
    const lines = (await readFile(file, 'utf8')).split('\n');

    lines.forEach((text, index) => {
      if (text.includes('ds-allow')) return; // escape có chủ đích, reviewer sẽ soi

      for (const match of text.matchAll(IMPORT_RE)) {
        const target = match[1];
        const targetLayer = layerOf.get(target);
        if (!targetLayer) continue; // không phải package trong repo này

        if (LAYER_RANK[targetLayer] >= LAYER_RANK[layer]) {
          problems.push({
            file: display(file),
            line: index + 1,
            message: `${name} (${layer}) import ${target} (${targetLayer}). Chỉ được import tầng THẤP HƠN. Cách sửa: đảo phụ thuộc bằng props/callback, hoặc chuyển phần dùng chung xuống tầng dưới.`,
          });
        }
      }
    });
  }
}

report('guard:layers', problems, checked);
