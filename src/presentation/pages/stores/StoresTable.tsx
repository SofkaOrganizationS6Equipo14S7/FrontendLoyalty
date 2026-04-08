import { Key } from 'lucide-react';
import { format } from 'date-fns';
import { DATE_FORMAT } from '@/lib/constants';
import {
  Button,
  StatusBadge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/presentation/components/ui';
import type { EcommerceResponse } from '@/domain/types';

interface StoresTableProps {
  ecommerces: EcommerceResponse[];
  onOpenDetail: (ecommerce: EcommerceResponse) => void;
  onToggleStatus: (ecommerce: EcommerceResponse) => void;
}

export function StoresTable({ ecommerces, onOpenDetail, onToggleStatus }: StoresTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ecommerces.map((ec) => (
          <TableRow key={ec.uid} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <TableCell className="font-medium text-slate-900 dark:text-slate-100">{ec.name}</TableCell>
            <TableCell className="font-mono text-xs text-slate-500">{ec.slug}</TableCell>
            <TableCell>
              <StatusBadge active={ec.status === 'ACTIVE'} />
            </TableCell>
            <TableCell className="text-slate-500">{format(new Date(ec.createdAt), DATE_FORMAT)}</TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => onOpenDetail(ec)}>
                  <Key className="h-4 w-4" /> API Keys
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onToggleStatus(ec)}>
                  {ec.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
