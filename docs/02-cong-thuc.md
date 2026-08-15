# 02 — Công thức

Những màn hình hay gặp nhất, dựng bằng design system. Xem bản chạy được ở **[Storybook](https://twaozann01.github.io/fe-shared/)**.

---

## Trang danh sách: lọc + bảng + phân trang

Ba mảnh ghép lại. Lưu ý: **state lọc do app giữ**, thư viện chỉ vẽ.

```tsx
import { DataTable, Pagination, Badge, type Column } from '@twaozann01/ui';
import { FilterBar, SearchInput, SelectFilter } from '@twaozann01/filters';
import { useState } from 'react';

interface Order {
  id: string;
  code: string;
  status: 'done' | 'pending' | 'cancelled';
  total: number;
}

// App tự map trạng thái nghiệp vụ → variant. DataTable không biết gì về "đơn hàng".
const STATUS_VARIANT = {
  done: 'success',
  pending: 'warning',
  cancelled: 'destructive',
} as const;

export function OrdersPage() {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<string | undefined>();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useOrders({ q, status, page }); // hook của app

  const columns: Column<Order>[] = [
    { key: 'code', header: t('order.code') },
    {
      key: 'status',
      header: t('order.status'),
      cell: (row) => <Badge variant={STATUS_VARIANT[row.status]}>{t(`order.${row.status}`)}</Badge>,
    },
    {
      key: 'total',
      header: t('order.total'),
      className: 'text-right',
      cell: (row) => row.total.toLocaleString('vi-VN') + ' ₫',
    },
  ];

  return (
    <div className="space-y-4">
      <FilterBar onReset={() => { setQ(''); setStatus(undefined); setPage(1); }}>
        <SearchInput value={q} onChange={setQ} className="w-64" />
        <SelectFilter value={status} onChange={setStatus} options={statusOptions} />
      </FilterBar>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        getRowId={(row) => row.id}
        onRowClick={(row) => navigate(`/orders/${row.id}`)}
      />

      <Pagination page={page} totalPages={data?.totalPages ?? 1} onPageChange={setPage} />
    </div>
  );
}
```

**Đừng quên `getRowId`.** Không có nó, React dùng index làm key — xoá một dòng giữa bảng là các dòng sau nhảy lung tung.

---

## Form trong dialog

Đây là chỗ hay vỡ nhất ở các thư viện khác (chọn option trong Select làm đóng luôn dialog). Ở đây đã vá sẵn, không phải làm gì.

```tsx
import { DialogShell, Button } from '@twaozann01/ui';
import { Form, TextField, SelectField, NumberField } from '@twaozann01/forms';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Wrench } from 'lucide-react';

export function ServiceFormDialog({ open, onOpenChange, service }) {
  const form = useForm<ServiceValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: service?.name ?? '',
      price: service?.price,          // number | undefined
      categoryId: service?.categoryId ?? '',
    },
  });

  return (
    <DialogShell
      open={open}
      onOpenChange={onOpenChange}
      title={service ? t('service.edit') : t('service.create')}
      icon={<Wrench className="h-5 w-5" />}
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t('common.cancel')}</Button>
          <Button type="submit" form="service-form" disabled={form.formState.isSubmitting}>
            {t('common.save')}
          </Button>
        </>
      }
    >
      <Form id="service-form" form={form} onSubmit={onSubmit} className="space-y-4">
        <TextField name="name" label={t('service.name')} required />
        <NumberField name="price" label={t('service.price')} />
        <SelectField name="categoryId" label={t('service.category')} options={categoryOptions} />
      </Form>
    </DialogShell>
  );
}
```

**Nút Lưu nằm ở `footer` nhưng submit được form ở `children`** nhờ cặp `form="service-form"` + `<Form id="service-form">`. Đây là cách duy nhất đúng khi chân dialog tách khỏi thân.

`defaultValues` phải khớp kiểu của field, xem bảng trong [README của `forms`](../packages/forms/README.md) — sai kiểu thì React cảnh báo "uncontrolled to controlled".

---

## Hỏi trước khi xoá

```tsx
import { useConfirm } from '@twaozann01/ui';

const confirm = useConfirm();

async function handleDelete(id: string) {
  const ok = await confirm({
    description: t('order.confirmDelete'),
    confirmText: t('common.delete'),
    destructive: true,
  });
  if (!ok) return;

  await deleteOrder(id);
  toast.success(t('order.deleted'));
}
```

Trả `Promise<boolean>` nên viết được `if (!ok) return;` liền mạch — không phải dựng `useState(openDeleteDialog)` ở từng màn.

Cần hộp thoại **buộc chọn**, không cho bấm ra ngoài để né? Dùng `AlertDialog` thay vì `confirm()`.

---

## Theme trong thanh header

```tsx
import { ThemeToggle, LanguageSwitcher, MobileDrawer } from '@twaozann01/ui';

<header className="flex items-center gap-2">
  <ThemeToggle iconOnly />
  <LanguageSwitcher
    languages={[{ value: 'vi', label: 'VI' }, { value: 'en', label: 'EN' }]}
    current={i18n.resolvedLanguage}
    onChange={(lng) => i18n.changeLanguage(lng)}
  />
</header>
```

`ThemeToggle` tự lấy trạng thái từ `ThemeProvider`. `LanguageSwitcher` thì không — nó stateless, app quyết định có bao nhiêu ngôn ngữ và đổi ra sao.

---

## Panel lọc trên mobile

Màn nhỏ không đủ chỗ cho `FilterBar` nằm ngang. Nhét nó vào `Sheet`:

```tsx
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, Button } from '@twaozann01/ui';
import { SlidersHorizontal } from 'lucide-react';

<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline" size="icon" className="md:hidden">
      <SlidersHorizontal />
    </Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>{t('filter.title')}</SheetTitle>
    </SheetHeader>
    <div className="space-y-3 p-4">
      <SearchInput value={q} onChange={setQ} />
      <SelectFilter value={status} onChange={setStatus} options={statusOptions} />
    </div>
  </SheetContent>
</Sheet>
```

---

## Bọc lỗi + trang 404

```tsx
import { ErrorBoundary, NotFound, Forbidden } from '@twaozann01/feedback';
import { Link } from 'react-router-dom';

const homeLink = <Link to="/" className="text-primary hover:underline">{t('error.backHome')}</Link>;

<ErrorBoundary onError={(e) => Sentry.captureException(e)}>
  <Routes>
    {/* … */}
    <Route path="*" element={<NotFound action={homeLink} />} />
  </Routes>
</ErrorBoundary>
```

`action` là **ReactNode chứ không phải `href`** — thư viện không biết app dùng router nào, nên app tự đưa link của mình vào.

---

## Chọn ảnh

```tsx
import { ImageField } from '@twaozann01/forms';

<ImageField name="avatar" label={t('user.avatar')} maxSizeMB={2} />
```

Component chỉ **chọn + kiểm tra** file rồi trả `File` ra ngoài. **Upload là việc của app** — làm lúc submit:

```tsx
async function onSubmit(values: UserValues) {
  const avatarKey = values.avatar instanceof File
    ? (await uploadFile(values.avatar)).key
    : undefined;                       // string = ảnh cũ, không gửi lại

  await updateUser({ ...values, avatar: avatarKey });
}
```

---

## Bản đồ chọn vị trí

```tsx
import { MapPicker, type LatLng } from '@twaozann01/map';

const [pos, setPos] = useState<LatLng | null>(null);

<MapPicker value={pos} onChange={setPos} />
```

Geocoding (nhập địa chỉ → ra toạ độ) là nghiệp vụ, không nằm trong thư viện. App tự gọi API rồi `setPos` — bản đồ sẽ tự dời theo.

---

Tiếp theo: [03 — Chuyển app cũ sang](03-chuyen-app-cu.md)
