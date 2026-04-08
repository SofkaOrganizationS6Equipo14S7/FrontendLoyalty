import { useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/presentation/components/ui';
import type { UserResponse } from '@/domain/types';
import { UserRow } from './UserRow';

interface UsersTableProps {
  users: UserResponse[];
  loading: boolean;
  pageSize: number;
  onEdit: (user: UserResponse) => void;
  onToggleActive: (user: UserResponse) => void;
  onDelete: (user: UserResponse) => void;
}

export function UsersTable({ users, loading, pageSize, onEdit, onToggleActive, onDelete }: UsersTableProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          Array.from({ length: pageSize }).map((_, i) => (
            <TableRow key={i}>
              <TableCell colSpan={4}>
                <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
              </TableCell>
            </TableRow>
          ))
        ) : users.length > 0 ? (
          users.map((u) => (
            <UserRow
              key={u.uid}
              user={u}
              isMenuOpen={openMenu === u.uid}
              onMenuToggle={() => setOpenMenu(openMenu === u.uid ? null : u.uid)}
              onEdit={() => { onEdit(u); setOpenMenu(null); }}
              onToggleActive={() => { onToggleActive(u); setOpenMenu(null); }}
              onDelete={() => { onDelete(u); setOpenMenu(null); }}
            />
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="h-24 text-center text-slate-500 dark:text-slate-400">
              No users found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
