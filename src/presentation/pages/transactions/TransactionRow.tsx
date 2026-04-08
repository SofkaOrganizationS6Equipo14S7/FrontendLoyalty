import { AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { DATE_FORMAT } from '@/lib/constants';
import { Badge, TableRow, TableCell } from '@/presentation/components/ui';
import type { DiscountApplicationLogResponse } from '@/domain/types';

interface TransactionRowProps {
  log: DiscountApplicationLogResponse;
}

function isCapped(log: DiscountApplicationLogResponse): boolean {
  return Number(log.discountApplied) < Number(log.originalAmount) - Number(log.finalAmount);
}

export function TransactionRow({ log }: TransactionRowProps) {
  return (
    <TableRow className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <TableCell>
        <span className="font-mono text-xs text-slate-600 dark:text-slate-400">
          TRX-{log.externalOrderId || log.id.slice(0, 4)}
        </span>
      </TableCell>
      <TableCell>
        <div>
          <p className="font-medium text-slate-900 dark:text-slate-100">
            {log.ecommerceId?.slice(0, 12) || 'Store'}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-slate-500">
              {log.appliedRulesDetails?.[0]?.ruleName || 'Direct'}
            </span>
            {isCapped(log) && (
              <span className="inline-flex items-center gap-0.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded px-1.5 py-0.5">
                <AlertTriangle className="h-3 w-3" /> Capped
              </span>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right text-slate-700 dark:text-slate-300">
        ${Number(log.originalAmount).toFixed(2)}
      </TableCell>
      <TableCell className="text-right font-medium text-emerald-600 dark:text-emerald-400">
        -${Number(log.discountApplied).toFixed(2)}
      </TableCell>
      <TableCell>
        <Badge variant="success">Completed</Badge>
      </TableCell>
      <TableCell className="text-right text-slate-500">
        {format(new Date(log.createdAt), DATE_FORMAT)}
      </TableCell>
    </TableRow>
  );
}
