import { Badge, DataTable, Pagination, type Column } from '@twaozann/ui';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

interface Order {
  id: string;
  code: string;
  customer: string;
  status: 'done' | 'pending' | 'cancelled';
  total: number;
}

const rows: Order[] = [
  { id: '1', code: 'DH-001', customer: 'Nguyễn An', status: 'done', total: 450000 },
  { id: '2', code: 'DH-002', customer: 'Trần Bình', status: 'pending', total: 1200000 },
  { id: '3', code: 'DH-003', customer: 'Lê Cường', status: 'cancelled', total: 300000 },
];

// App tự map trạng thái nghiệp vụ sang variant — DataTable không biết gì về "đơn hàng".
const statusVariant = {
  done: 'success',
  pending: 'warning',
  cancelled: 'destructive',
} as const;

const statusText = { done: 'Hoàn tất', pending: 'Chờ xử lý', cancelled: 'Đã huỷ' };

const columns: Column<Order>[] = [
  { key: 'code', header: 'Mã đơn' },
  { key: 'customer', header: 'Khách hàng' },
  {
    key: 'status',
    header: 'Trạng thái',
    cell: (row) => <Badge variant={statusVariant[row.status]}>{statusText[row.status]}</Badge>,
  },
  {
    key: 'total',
    header: 'Tổng tiền',
    className: 'text-right',
    cell: (row) => row.total.toLocaleString('vi-VN') + ' ₫',
  },
];

const meta: Meta = {
  title: 'UI/DataTable',
};

export default meta;

export const CoDuLieu: StoryObj = {
  name: 'Có dữ liệu',
  render: () => <DataTable columns={columns} data={rows} getRowId={(r) => r.id} />,
};

export const DangTai: StoryObj = {
  name: 'Đang tải',
  render: () => <DataTable columns={columns} data={[]} isLoading skeletonRows={4} />,
};

export const Rong: StoryObj = {
  name: 'Rỗng',
  render: () => <DataTable columns={columns} data={[]} />,
};

export const KemPhanTrang: StoryObj = {
  name: 'Kèm phân trang',
  render: function Render() {
    const [page, setPage] = useState(3);

    return (
      <div className="space-y-4">
        <DataTable columns={columns} data={rows} getRowId={(r) => r.id} />
        <Pagination page={page} totalPages={10} onPageChange={setPage} />
      </div>
    );
  },
};
