---
'@twaozann01/ui': minor
---

**BREAKING (0.x):** `Drawer` chuyển sang entry riêng `@twaozann01/ui/drawer`.

```diff
- import { Drawer, DrawerContent } from '@twaozann01/ui';
+ import { Drawer, DrawerContent } from '@twaozann01/ui/drawer';
```

Lý do: `vaul` (thư viện đứng sau `Drawer`) không khai `sideEffects: false`. Chỉ cần một dòng
`import ... from 'vaul'` nằm trong entry chung là bundler của app buộc phải giữ nguyên cả gói,
kể cả app không hề dùng `Drawer` — tree-shaking không cứu được.

Đo A/B trên `marketplace-fe` (app không dùng `Drawer`), chunk vendor:

|       | Raw           | Gzip         |
| ----- | ------------- | ------------ |
| Trước | 702.68 KB     | 216.80 KB    |
| Sau   | 690.38 KB     | 213.56 KB    |
|       | **−12.30 KB** | **−3.24 KB** |

Không to, nhưng đủ để app đó tụt xuống dưới ngưỡng `chunkSizeWarningLimit: 700` và hết cảnh
báo mỗi lần build. Quan trọng hơn con số: sau thay đổi này `dist/index.js` không còn _một tham
chiếu nào_ tới `vaul`, nên app không nhập `/drawer` thì không phải trả gì cả — và điều đó đúng
với mọi app tương lai, không riêng app này.

`MobileDrawer` KHÔNG bị ảnh hưởng — nó tự dựng bằng `div`, vẫn ở entry chung.
