import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { useUILabels } from '../provider/ui-provider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';

export interface Column<T> {
  /** Khóa định danh cột (dùng làm React key). */
  key: string;
  /** Tiêu đề cột — truyền chuỗi đã dịch sẵn. */
  header: ReactNode;
  /** Render ô; mặc định hiển thị `row[key]`. */
  cell?: (row: T) => ReactNode;
  /** class cho ô + header (canh phải, độ rộng…). */
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  /** Số dòng skeleton khi loading. */
  skeletonRows?: number;
  /** Nội dung khi rỗng — mặc định lấy từ UIProvider. */
  emptyMessage?: ReactNode;
  /** Lấy id mỗi dòng làm React key — mặc định dùng index. */
  getRowId?: (row: T, index: number) => string;
  onRowClick?: (row: T) => void;
  className?: string;
}

// Bảng dữ liệu generic dùng cho mọi danh sách. Không biết domain: app truyền columns + data.
export function DataTable<T>({
  columns,
  data,
  isLoading,
  skeletonRows = 5,
  emptyMessage,
  getRowId,
  onRowClick,
  className,
}: DataTableProps<T>) {
  const labels = useUILabels();

  return (
    <div className={cn('rounded-lg border', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key} className={col.className}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: skeletonRows }).map((_, r) => (
              <TableRow key={`skeleton-${r}`}>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    <div className="h-4 w-full animate-pulse rounded bg-muted" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                {emptyMessage ?? labels.table.empty}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow
                key={getRowId ? getRowId(row, index) : index}
                className={cn(onRowClick && 'cursor-pointer')}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((col) => (
                  <TableCell key={col.key} className={col.className}>
                    {col.cell ? col.cell(row) : ((row as Record<string, ReactNode>)[col.key] ?? null)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
