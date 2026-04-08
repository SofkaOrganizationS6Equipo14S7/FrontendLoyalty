import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/presentation/components/ui';
import type { DiscountApplicationLogResponse } from '@/domain/types';
import { TransactionRow } from './TransactionRow';

interface TransactionsTableProps {
  logs: DiscountApplicationLogResponse[];
}

export function TransactionsTable({ logs }: TransactionsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Transaction ID</TableHead>
          <TableHead>Store & Rule</TableHead>
          <TableHead className="text-right">Order Amount</TableHead>
          <TableHead className="text-right">Discount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center text-slate-400">
              No transactions found.
            </TableCell>
          </TableRow>
        ) : (
          logs.map((log) => (
            <TransactionRow key={log.id} log={log} />
          ))
        )}
      </TableBody>
    </Table>
  );
}
