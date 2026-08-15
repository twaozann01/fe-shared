# @twaozann/design-tokens

Nguồn chân lý duy nhất của bảng màu. Đây là package **quan trọng nhất** của design system: đổi một giá trị ở đây là toàn bộ app đổi theo.

## Tầng

**L0** — không import package nào khác.

## Consumer

Mọi app web (qua `tokens.css` + `@twaozann/tailwind-config`), và cả Zalo Mini App / React Native (qua `lightColors` / `darkColors`, vì hai môi trường đó không có CSS variables).

## Public API

```ts
import { lightTokens, darkTokens, lightColors, darkColors, radius, hsl } from '@twaozann/design-tokens';
import '@twaozann/design-tokens/tokens.css'; // web: nạp một lần ở entry
```

| Export | Dạng | Dùng ở đâu |
|---|---|---|
| `lightTokens` / `darkTokens` | `'217 91% 60%'` (bộ ba HSL trần) | Tailwind preset, sinh CSS |
| `lightColors` / `darkColors` | `'hsl(217 91% 60%)'` | zmp-ui, React Native StyleSheet |
| `radius` | `'0.5rem'` | bo góc gốc |
| `hsl(token)` | hàm bọc | tự ghép màu khi cần |
| `tokens.css` | file CSS | web — khai `:root` và `.dark` |

Bộ ba HSL **cố tình không bọc `hsl()`** để Tailwind viết được `hsl(var(--primary) / <alpha-value>)` — nhờ vậy `bg-primary/15` mới hoạt động.

`dist/tokens.css` được **sinh tự động** từ `src/tokens.ts` lúc build (`scripts/build-css.mjs`). Đừng sửa tay file CSS: nó sẽ bị ghi đè, và quan trọng hơn là để không tồn tại hai bản màu song song rồi trôi lệch nhau.

## Khi nào KHÔNG dùng

- **Đừng thêm màu chỉ một dự án cần.** Token ở đây là ngôn ngữ chung; màu riêng của một app thì để trong app đó.
- **Đừng import package này để lấy màu rồi viết inline style.** Trên web hãy dùng class Tailwind (`bg-primary`, `text-muted-foreground`) — `lightColors` chỉ dành cho nơi không có Tailwind.
- **Đừng thêm token spacing/typography vào đây** trước khi có ít nhất hai app thật sự cần; token thừa khó bỏ hơn token thiếu.
