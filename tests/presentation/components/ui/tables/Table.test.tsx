import { render, screen } from '@testing-library/react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/presentation/components/ui/tables/Table';

describe('Table components', () => {
  it('renders a full table', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Alice</TableCell>
            <TableCell>30</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('Table applies custom className', () => {
    render(<Table className="custom" data-testid="tbl"><tbody><tr><td>X</td></tr></tbody></Table>);
    expect(screen.getByTestId('tbl').className).toContain('custom');
  });

  it('TableHeader applies custom className', () => {
    render(<table><TableHeader className="custom" data-testid="thead"><tr><th>H</th></tr></TableHeader></table>);
    expect(screen.getByTestId('thead').className).toContain('custom');
  });

  it('TableBody applies custom className', () => {
    render(<table><TableBody className="custom" data-testid="tbody"><tr><td>B</td></tr></TableBody></table>);
    expect(screen.getByTestId('tbody').className).toContain('custom');
  });

  it('TableRow applies custom className', () => {
    render(<table><tbody><TableRow className="custom" data-testid="tr"><td>R</td></TableRow></tbody></table>);
    expect(screen.getByTestId('tr').className).toContain('custom');
  });

  it('TableHead applies custom className', () => {
    render(<table><thead><tr><TableHead className="custom" data-testid="th">H</TableHead></tr></thead></table>);
    expect(screen.getByTestId('th').className).toContain('custom');
  });

  it('TableCell applies custom className', () => {
    render(<table><tbody><tr><TableCell className="custom" data-testid="td">C</TableCell></tr></tbody></table>);
    expect(screen.getByTestId('td').className).toContain('custom');
  });

  it('Table has displayName', () => {
    expect(Table.displayName).toBe('Table');
  });

  it('TableHeader has displayName', () => {
    expect(TableHeader.displayName).toBe('TableHeader');
  });

  it('TableBody has displayName', () => {
    expect(TableBody.displayName).toBe('TableBody');
  });

  it('TableRow has displayName', () => {
    expect(TableRow.displayName).toBe('TableRow');
  });

  it('TableHead has displayName', () => {
    expect(TableHead.displayName).toBe('TableHead');
  });

  it('TableCell has displayName', () => {
    expect(TableCell.displayName).toBe('TableCell');
  });

  it('Table forwards ref', () => {
    const ref = { current: null } as React.RefObject<HTMLTableElement | null>;
    render(<Table ref={ref}><tbody><tr><td>X</td></tr></tbody></Table>);
    expect(ref.current).toBeInstanceOf(HTMLTableElement);
  });
});
