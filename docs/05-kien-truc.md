# 05 — Kiến trúc

Vì sao design system này được dựng như vậy. Đọc khi anh muốn **sửa** kiến trúc, hoặc khi thấy một luật vô lý và muốn biết nó chống lỗi gì.

---

## Mục tiêu duy nhất

> Sửa một chỗ là mọi app đổi theo.

Mọi quyết định dưới đây đều quy về câu đó. Chỗ nào một thay đổi phải sửa ở **hai** nơi, chỗ đó sớm muộn sẽ trôi lệch.

---

## Ba tầng

```
L2  forms · filters · feedback · map   → import L1, L0
L1  ui                                 → import L0
L0  design-tokens · tailwind-config
    eslint-config · typescript-config  → không import ai
```

Luật: **package tầng dưới không được import package tầng trên**. `guard:layers` quét mọi file và chặn ngay.

### Luật này chống ba thứ

**1. Phụ thuộc vòng.** Không có luật, sáu tháng nữa `ui` gọi `forms`, `forms` gọi lại `ui`. Bundler vẫn build được — nên không ai biết — cho tới hôm nó đẻ ra `undefined` lúc runtime ở đúng thứ tự import xui xẻo.

**2. Lẫn cái riêng vào cái chung.** Đây mới là tác dụng lớn nhất. Ví dụ thật từ `marketplace-fe`:

```ts
// shared/config/axios.config.ts
import { useAuthStore } from '@/store/auth-store';
```

Cục axios dính chặt vào auth-store của riêng một app. Copy sang dự án mới là kéo theo cả mớ. Luật tầng **phát hiện ra** những sợi dây kiểu này — vì `http` nằm dưới `store` nên không được import lên.

**3. App nhỏ phải gánh đồ của app lớn.** Không tách package thì app chỉ cần `Button` cũng phải cài Leaflet.

### Vì sao 3 tầng, không phải 4

Bản NextX dùng 4 tầng vì có 28 package. Ở quy mô này (8 package) tầng thứ tư chỉ thêm thủ tục mà không chặn thêm lỗi nào.

---

## Một nguồn chân lý cho mỗi thứ

Đây là mô-típ lặp lại khắp repo:

| Thứ | Nguồn duy nhất | Sinh ra cái gì |
|---|---|---|
| Bảng màu | `design-tokens/src/tokens.ts` | `tokens.css` (sinh lúc build) · preset Tailwind · `lightColors`/`darkColors` cho RN |
| Style ô nhập | `ui/components/field.ts` | `Input` · `Textarea` · `SelectTrigger` · `MultiSelect` |
| Bề mặt hộp thoại | `ui/components/dialog-surface.ts` | `Dialog` · `DialogShell` · `AlertDialog` · `Sheet` · `Drawer` |
| Chống đóng nhầm | `ui/lib/use-modal-dismiss.ts` | `Dialog` · `Sheet` · `Drawer` |
| Chữ trong component | `ui/provider/labels.ts` | mọi component |

`tokens.css` **sinh tự động** chứ không viết tay là ví dụ rõ nhất: viết tay thì có hai bản màu song song, và chúng sẽ lệch nhau — không phải "có thể", mà là chắc chắn, chỉ là sớm hay muộn.

---

## Vì sao có máy gác

Ba luật quan trọng nhất đều là loại **không tự phát hiện được**: vi phạm thì build vẫn xanh, test vẫn qua, chỉ có giao diện lệch dần hoặc bug runtime hiếm gặp.

| Gác | Chặn lỗi im lặng nào |
|---|---|
| `guard:hardcode` | Một chỗ viết `bg-[#3b82f6]` là cơ chế token **thủng** — đổi `--primary` không đổi được chỗ đó |
| `guard:layers` | Dep ngược tầng → phụ thuộc vòng, chỉ lộ ra lúc runtime |
| `guard:junk` | `exports` trỏ `src` → app import trúng TypeScript chưa biên dịch |

Không có máy gác thì ba luật trên chỉ là lời khuyên trong README, và lời khuyên thì **trôi**.

`guard:hardcode` cho phép `black`/`white` không kèm bậc số — chúng tuyệt đối, dùng cho lớp phủ modal, không phụ thuộc bảng màu thương hiệu.

---

## Vì sao thư viện không tự dịch

Cách dễ nhất là để component gọi thẳng `t('table.empty')`. Nhưng như vậy **ép mọi app**:

- phải dùng i18next (không dùng thư viện khác được),
- phải đặt key đúng tên mà thư viện đoán,
- phải nạp đúng namespace, nếu không thì hiện ra chính cái key.

Nên chữ đi qua `UIProvider`, có bản mặc định tiếng Việt để **cắm vào là chạy**, và app bơm bản dịch của mình vào khi cần.

Chữ có tham số là **hàm** (`tooLarge: (mb) => ...`) chứ không phải chuỗi có placeholder — để TypeScript bắt được lỗi thiếu tham số ngay lúc biên dịch.

---

## Vì sao theme là ngoại lệ

Luật "không giữ trạng thái nghiệp vụ" có đúng một ngoại lệ: `ThemeProvider`.

Lý do: theme **thuộc về giao diện**, không phải nghiệp vụ. Và nó là thứ mọi app đều cần, làm đúng thì hơi rắc rối (nhớ lựa chọn, theo cài đặt hệ điều hành, chống nháy trắng). Để mỗi dự án tự viết lại chính là thứ design system sinh ra để tránh.

Vẫn có lối thoát: app đã có store theme riêng thì bỏ `ThemeProvider` và dùng `<ThemeToggle theme onToggle />` ở chế độ controlled.

---

## Vì sao z-index suy theo độ sâu

Cách cũ: mỗi họ hộp thoại khai một `z-index` cố định. Cố định nghĩa là hai dialog **bằng z nhau**, thứ tự vẽ do thứ tự node trong DOM quyết định — hên xui theo lúc portal được gắn. Dialog mở sau không chắc nằm trên, và lớp mờ của nó cũng bằng z với thân dialog trước nên dialog trước **không bị phủ bóng**.

Nay z suy theo **độ sâu lồng nhau**: mỗi lớp che đọc độ sâu từ context rồi cấp cho con nó độ sâu + 1. React context đi xuyên portal (theo cây React chứ không theo cây DOM) nên dialog lồng trong dialog nhận đúng nấc, dù Radix đã bốc nó ra `document.body`.

Trả về **class** chứ không inline `style`: app đôi khi cần leo lên trên một lớp portal ngoài hệ (widget chat, iframe). Class thì `cn()` cho bên gọi đè lại được; inline style thì đè ngược.

---

## Vì sao ship class Tailwind, không ship CSS build sẵn

| | Ship class (đang dùng) | Ship CSS build sẵn |
|---|---|---|
| App tuỳ biến | Được, qua `className` + tailwind-merge | Rất khó, phải đấu độ ưu tiên |
| Bundle | Chỉ class thật sự dùng | Cả bộ, kể cả không dùng |
| Dùng chung token với app | Có | Không |
| App bắt buộc dùng Tailwind | **Có** | Không |

Đánh đổi rõ ràng: app phải dùng Tailwind. Chấp nhận được vì mọi app web trong hệ đều dùng.

Cái giá: app **bắt buộc** thêm `preset.sharedContent` vào `content`. Quên là class bị purge sạch mà không có lỗi nào báo — đây là lỗi số một khi cắm lần đầu.

---

## Cái gì cố ý KHÔNG có

| Không có | Vì sao |
|---|---|
| `http` · store · realtime · permissions | Nghiệp vụ, không phải giao diện |
| `Toast` · `Tooltip` · `Tabs` · `Accordion` | Chưa có chỗ dùng thật |
| date-picker | Nặng, và mỗi dự án một gu; `<input type="date">` đủ dùng |
| Thang typography ngữ nghĩa | Chưa có hai app cần |
| Component chạy được cả web lẫn React Native | Đắt gấp nhiều lần, hiếm khi đáng. RN dùng chung **token màu** là đủ |

> Component thừa khó bỏ hơn component thiếu. Bỏ một component đã publish là breaking change cho mọi app đang dùng.

---

## Giới hạn đã biết

- **Zalo Mini App và React Native không dùng được component** — chúng không chạy Tailwind/DOM. Chỉ dùng chung được `lightColors`/`darkColors`.
- **Chưa có visual regression test.** Style vỡ vẫn có thể lọt qua CI. `guard:hardcode` chặn được nguyên nhân phổ biến nhất nhưng không chặn hết. Muốn kín thì cần Chromatic hoặc chụp ảnh so sánh.
- **Test tập trung ở chỗ dễ sai**, không phủ đều. `Card`/`Table` chỉ được kiểm qua typecheck và Storybook.
