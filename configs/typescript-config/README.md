# @twaozann01/typescript-config

Hai tsconfig gốc dùng chung cho mọi package trong repo.

## Tầng

**L0**.

## Consumer

Mọi package của design system. App tiêu dùng có thể dùng lại nhưng không bắt buộc.

## Public API

```json
// tsconfig.json của package không có JSX
{ "extends": "@twaozann01/typescript-config/base.json", "include": ["src"] }

// tsconfig.json của package React
{ "extends": "@twaozann01/typescript-config/react-library.json", "include": ["src"] }
```

`base.json` bật `strict` cùng ba luật siết thêm, vì đây là thư viện dùng cho nhiều dự án — kiểu sai lọt ra ngoài thì mọi app tiêu dùng đều chịu:

- `noUncheckedIndexedAccess` — `arr[i]` trả `T | undefined`, ép xử lý trường hợp ngoài mảng.
- `noImplicitOverride` — bắt buộc từ khoá `override`, tránh vô tình đè nhầm method.
- `noUnusedLocals` / `noUnusedParameters` — export thừa trong thư viện là nợ vĩnh viễn.

`noEmit: true` là cố ý: file `.d.ts` do **tsup** sinh ra lúc build, `tsc` ở đây chỉ dùng để kiểm kiểu.

## Khi nào KHÔNG dùng

- **Đừng nới lỏng luật ở đây** để một package hết lỗi. Sửa package đó, hoặc nếu thật sự cần thì tắt cục bộ trong `tsconfig.json` của chính nó kèm lý do.
- **Đừng thêm `paths` alias.** Package trỏ nhau qua tên npm (`@twaozann01/ui`), không qua đường dẫn tương đối — nhờ vậy build ra dist mới đúng.
