# @twaozann/eslint-config

Flat config ESLint 9 dùng chung cho các package trong repo này.

## Tầng

**L0**.

## Consumer

Mọi package của design system. App tiêu dùng có thể dùng lại, nhưng không bắt buộc.

## Public API

```js
// eslint.config.js của package
import config from '@twaozann/eslint-config';
export default config;
```

Gồm: `@eslint/js` recommended, `typescript-eslint` recommended, `react-hooks`, và `eslint-config-prettier` đặt cuối để tắt các luật đụng format.

Hai luật siết thêm so với mặc định:

- `@typescript-eslint/no-explicit-any`: **error** — `any` lọt vào public API của thư viện là mất kiểu ở mọi app tiêu dùng.
- `consistent-type-imports`: ép `import type` để tsup tree-shake sạch.

## Khi nào KHÔNG dùng

- **Đừng thêm luật chỉ đúng cho một app** (ví dụ luật về cấu trúc feature-based). Cái đó thuộc `eslint.config.js` của app đó.
