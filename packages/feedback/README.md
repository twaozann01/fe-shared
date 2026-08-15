# @twaozann01/feedback

Trạng thái toàn trang: bắt lỗi render, 404, 403, và trang giữ chỗ cho tính năng chưa xong.

## Tầng

**L2** — import `@twaozann01/ui` (L1).

## Consumer

Mọi app web.

## Public API

```tsx
<ErrorBoundary onError={(e) => Sentry.captureException(e)}>
  <App />
</ErrorBoundary>

<NotFound action={<Link to="/" className="text-primary hover:underline">Về trang chủ</Link>} />
<Forbidden action={<Link to="/">Về trang chủ</Link>} />
<FeaturePlaceholder title={t('report.title')} icon={<BarChart className="h-5 w-5" />} />
<StatusPage title="503" description="Đang bảo trì" />
```

`action` cố ý là **ReactNode chứ không phải `href`**: thư viện không biết app dùng react-router, TanStack Router hay thẻ `<a>` thường, nên để app tự đưa link của mình vào. Đây là điểm khác so với bản trong `marketplace-fe` — bản cũ import thẳng `react-router-dom` và hằng `ROUTES`, khiến nó không tái dùng được.

`ErrorBoundary` chỉ bắt lỗi **render**. Lỗi mạng/API không đi qua đây — chúng thuộc lớp data-fetching của app.

## Khi nào KHÔNG dùng

- **Đừng import router vào package này.** Link truyền từ ngoài vào qua `action`.
- **Đừng đặt minh hoạ/branding riêng của một dự án ở đây.** Muốn màn hình 404 có hình riêng thì dùng `StatusPage` và tự dựng trong app, hoặc truyền `fallback` cho `ErrorBoundary`.
- **Đừng dùng `ErrorBoundary` để bắt lỗi API** — nó không bắt được lỗi trong promise/effect bất đồng bộ.
