import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable } from '@/presentation/components/ui/tables/DataTable';

interface Item {
  id: string;
  name: string;
}

const columns = [
  { key: 'name', header: 'Name', render: (row: Item) => row.name },
];

const data: Item[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
];

describe('DataTable', () => {
  it('renders loading state', () => {
    const { container } = render(
      <DataTable columns={columns} data={[]} keyExtractor={(r) => r.id} isLoading />
    );
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders empty message when no data', () => {
    render(
      <DataTable columns={columns} data={[]} keyExtractor={(r) => r.id} />
    );
    expect(screen.getByText('No hay datos disponibles')).toBeInTheDocument();
  });

  it('renders custom empty message', () => {
    render(
      <DataTable columns={columns} data={[]} keyExtractor={(r) => r.id} emptyMessage="Nothing here" />
    );
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('renders table with data', () => {
    render(
      <DataTable columns={columns} data={data} keyExtractor={(r) => r.id} />
    );
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    render(
      <DataTable columns={columns} data={data} keyExtractor={(r) => r.id} />
    );
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('calls onRowClick when row clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <DataTable columns={columns} data={data} keyExtractor={(r) => r.id} onRowClick={onClick} />
    );
    await user.click(screen.getByText('Alice'));
    expect(onClick).toHaveBeenCalledWith(data[0]);
  });

  it('applies rowClassName', () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        keyExtractor={(r) => r.id}
        rowClassName={(r) => r.name === 'Alice' ? 'highlight' : ''}
      />
    );
    expect(screen.getByText('Alice').closest('tr')?.className).toContain('highlight');
  });

  it('alternates row backgrounds', () => {
    render(
      <DataTable columns={columns} data={data} keyExtractor={(r) => r.id} />
    );
    const rows = screen.getAllByRole('row');
    // First data row (index 1 since row 0 is header)
    expect(rows[1].className).toContain('bg-white');
    expect(rows[2].className).toContain('bg-slate-50/50');
  });

  it('renders multiple columns', () => {
    const multiCols = [
      { key: 'name', header: 'Name', render: (r: Item) => r.name },
      { key: 'id', header: 'ID', render: (r: Item) => r.id },
    ];
    render(
      <DataTable columns={multiCols} data={data} keyExtractor={(r) => r.id} />
    );
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
