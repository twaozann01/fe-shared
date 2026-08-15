import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { UIProvider } from '../provider/ui-provider';
import { DataTable, type Column } from './data-table';

interface Row {
  id: string;
  name: string;
}

const columns: Column<Row>[] = [{ key: 'name', header: 'Tên' }];

describe('DataTable', () => {
  it('dùng chữ mặc định khi không bọc UIProvider', () => {
    render(<DataTable columns={columns} data={[]} />);

    expect(screen.getByText('Không có dữ liệu')).toBeInTheDocument();
  });

  it('dùng chữ do UIProvider bơm vào', () => {
    render(
      <UIProvider labels={{ table: { empty: 'No data' } }}>
        <DataTable columns={columns} data={[]} />
      </UIProvider>,
    );

    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('prop emptyMessage thắng cả UIProvider', () => {
    render(
      <UIProvider labels={{ table: { empty: 'No data' } }}>
        <DataTable columns={columns} data={[]} emptyMessage="Trống trơn" />
      </UIProvider>,
    );

    expect(screen.getByText('Trống trơn')).toBeInTheDocument();
  });

  it('render dữ liệu theo cột', () => {
    render(<DataTable columns={columns} data={[{ id: '1', name: 'An' }]} getRowId={(r) => r.id} />);

    expect(screen.getByText('An')).toBeInTheDocument();
  });
});
