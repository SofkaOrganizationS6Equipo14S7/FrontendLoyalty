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
import type React from 'react';
import type { AuditLogResponse } from '@/domain/types';

const ACTION_VARIANTS: Record<string, 'success' | 'warning' | 'destructive' | 'secondary' | 'default'> = {
  CREATE: 'success',
  UPDATE: 'warning',
  DELETE: 'destructive',
  READ: 'secondary',
};

function formatValue(val: Record<string, unknown>): React.ReactNode {
  const entries = Object.entries(val).filter(([, v]) => v != null && v !== '');
  if (entries.length === 0) return JSON.stringify(val);
  return entries.map(([k, v]) => (
    <div key={k}><span className="font-medium">{k.replace(/_/g, ' ')}:</span> {String(v)}</div>
  ));
}

function DiffRenderer({ oldVal, newVal }: { oldVal: Record<string, unknown> | null; newVal: Record<string, unknown> | null }) {
  if (!oldVal && !newVal) return <span className="text-slate-400">-</span>;
  return (
    <div className="text-xs space-y-1 max-w-xs">
      {oldVal && <div className="text-rose-500 line-through">{formatValue(oldVal)}</div>}
      {newVal && <div className="text-emerald-600">{formatValue(newVal)}</div>}
    </div>
  );
}

interface AuditTableProps {
  logs: AuditLogResponse[];
  users?: Map<string, string>;
}

export function AuditTable({ logs, users }: AuditTableProps) {
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
            <TableCell className="font-mono text-xs">{users?.get(log.userId) || log.userId?.slice(0, 8) || '-'}</TableCell>
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
