# `@twaozann01/feedback`

**Tầng L2** · import `@twaozann01/ui` · [README](../../packages/feedback/README.md)

Trạng thái toàn trang: bắt lỗi render, 404, 403, trang giữ chỗ.

```ts
import { ErrorBoundary, NotFound, Forbidden, StatusPage, FeaturePlaceholder } from '@twaozann01/feedback';
```

---

## `ErrorBoundary`

Bắt lỗi **render** (exception trong cây React) → hiện fallback thay vì màn hình trắng.

| Prop | Kiểu | Mặc định | Mô tả |
|---|---|---|---|
| `children` | `ReactNode` | — | **Bắt buộc** |
| `onError` | `(error: Error, info: ErrorInfo) => void` | | Nhận lỗi để đẩy lên Sentry/log service |
| `onReset` | `() => void` | `window.location.reload()` | Chạy khi bấm "Tải lại" |
| `fallback` | `ReactNode` | màn hình mặc định | Thay hẳn bằng UI riêng của app |

```tsx
<ErrorBoundary onError={(e, info) => Sentry.captureException(e, { extra: info })}>
  <App />
</ErrorBoundary>
```

> **Chỉ bắt lỗi render.** Lỗi mạng/API **không** đi qua đây — React error boundary không bắt được exception trong promise, `setTimeout`, hay event handler. Lỗi API thuộc lớp data-fetching của app (interceptor axios, `onError` của TanStack Query).

Luôn `console.error` trước khi gọi `onError`, kể cả khi có `onError` — để lỗi vẫn thấy được lúc dev mà không cần mở Sentry.

---

## `StatusPage`

Khung chung cho mọi trang trạng thái toàn màn hình.

| Prop | Kiểu | Mô tả |
|---|---|---|
| `title` | `ReactNode` | **Bắt buộc** — dòng lớn nhất: mã lỗi hoặc tiêu đề ngắn |
| `description` | `ReactNode` | Không truyền thì không render |
| `action` | `ReactNode` | Nút/liên kết hành động |
| `className` | `string` | |

```tsx
<StatusPage title="503" description="Đang bảo trì" action={<Button onClick={retry}>Thử lại</Button>} />
```

### Vì sao `action` là ReactNode chứ không phải `href`

Thư viện **không biết** app dùng `react-router`, TanStack Router hay thẻ `<a>` thường. Nhận `href` thì phải chọn một router, và app dùng router khác sẽ mất hết tính năng điều hướng phía client.

Đây là điểm khác so với bản gốc trong `marketplace-fe`: bản cũ `import { Link } from 'react-router-dom'` và hằng `ROUTES` của app, nên không tái dùng được cho dự án khác.

---

## `NotFound` · `Forbidden`

Hai preset của `StatusPage` cho 404 và 403.

| Prop | Kiểu | Mặc định |
|---|---|---|
| `action` | `ReactNode` | |
| `description` | `ReactNode` | `labels.error.notFound` / `labels.error.forbidden` |

```tsx
const homeLink = <Link to="/" className="text-primary hover:underline">{t('error.backHome')}</Link>;

<Route path="*" element={<NotFound action={homeLink} />} />
```

Cần mã khác (500, 503) hoặc bố cục riêng → dùng thẳng `StatusPage`.

---

## `FeaturePlaceholder`

Trang giữ chỗ cho tính năng chưa làm xong — tránh trang trống hoặc 404 giữa chừng.

| Prop | Kiểu | Mặc định |
|---|---|---|
| `title` | `ReactNode` | **Bắt buộc** — đã dịch sẵn |
| `icon` | `ReactNode` | |
| `wipMessage` | `ReactNode` | `labels.placeholder.wip` |
| `comingSoonMessage` | `ReactNode` | `labels.placeholder.comingSoon` |

```tsx
<FeaturePlaceholder title={t('report.title')} icon={<BarChart3 className="h-5 w-5" />} />
```

---

## Khi nào KHÔNG dùng

- **Đừng import router vào package này.** Link truyền từ ngoài vào qua `action`.
- **Đừng đặt minh hoạ/branding riêng của một dự án ở đây.** Muốn 404 có hình riêng thì dùng `StatusPage` và tự dựng trong app.
- **Đừng dùng `ErrorBoundary` để bắt lỗi API.**
