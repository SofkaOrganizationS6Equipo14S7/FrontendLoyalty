import { format } from 'date-fns';
import { DATETIME_FULL_FORMAT } from '@/lib/constants';
import {
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/presentation/components/ui';
import type { AuditLogResponse } from '@/domain/types';

const ACTION_VARIANTS: Record<string, 'success' | 'warning' | 'destructive' | 'secondary' | 'default'> = {
  CREATE: 'success',
  UPDATE: 'warning',
  DELETE: 'destructive',
  READ: 'secondary',
};

function DiffRenderer({ oldVal, newVal }: { oldVal: Record<string, unknown> | null; newVal: Record<string, unknown> | null }) {
  if (!oldVal && !newVal) return <span className="text-slate-400">-</span>;
  return (
    <div className="text-xs space-y-0.5 max-w-xs">
      {oldVal && <div className="text-rose-500 line-through truncate">{JSON.stringify(oldVal).slice(0, 80)}</div>}
      {newVal && <div className="text-emerald-600 truncate">{JSON.stringify(newVal).slice(0, 80)}</div>}
    </div>
  );
}

interface AuditTableProps {
  logs: AuditLogResponse[];
}

export function AuditTable({ logs }: AuditTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Action</TableHead>
          <TableHead>Entity</TableHead>
          <TableHead>Changes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => (
          <TableRow key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <TableCell className="whitespace-nowrap text-slate-600 dark:text-slate-400">
              {format(new Date(log.createdAt), DATETIME_FULL_FORMAT)}
            </TableCell>
            <TableCell className="font-mono text-xs">{log.userId?.slice(0, 8) || '-'}</TableCell>
            <TableCell>
              <Badge variant={ACTION_VARIANTS[log.action] || 'default'}>{log.action}</Badge>
            </TableCell>
            <TableCell className="text-slate-700 dark:text-slate-300">{log.entityName}</TableCell>
            <TableCell>
              <DiffRenderer oldVal={log.oldValue} newVal={log.newValue} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
