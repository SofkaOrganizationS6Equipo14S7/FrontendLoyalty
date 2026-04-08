import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import {
  Badge,
  Button,
  StatusBadge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/presentation/components/ui';
import type { UserResponse } from '@/domain/types';

interface UserActionsMenuProps {
  user: UserResponse;
  isOpen: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function UserActionsMenu({ isOpen, onToggle, onEdit, onDelete }: UserActionsMenuProps) {
  return (
    <div className="relative inline-block">
      <Button variant="ghost" size="icon" onClick={onToggle}>
        <MoreHorizontal className="h-4 w-4" />
      </Button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-36 rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950 z-10">
          <button
            className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-t-lg"
            onClick={onEdit}
          >
            Edit
          </button>
          <button
            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-b-lg"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

interface UsersTableProps {
  users: UserResponse[];
  loading: boolean;
  pageSize: number;
  onEdit: (user: UserResponse) => void;
  onDelete: (user: UserResponse) => void;
}

export function UsersTable({ users, loading, pageSize, onEdit, onDelete }: UsersTableProps) {
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
            <TableRow key={u.uid}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-slate-900 dark:text-slate-100">{u.username}</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{u.email || 'No email'}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{u.roleName.replace('_', ' ')}</Badge>
              </TableCell>
              <TableCell>
                <StatusBadge active={u.isActive} />
              </TableCell>
              <TableCell className="text-right">
                <UserActionsMenu
                  user={u}
                  isOpen={openMenu === u.uid}
                  onToggle={() => setOpenMenu(openMenu === u.uid ? null : u.uid)}
                  onEdit={() => {
                    onEdit(u);
                    setOpenMenu(null);
                  }}
                  onDelete={() => {
                    onDelete(u);
                    setOpenMenu(null);
                  }}
                />
              </TableCell>
            </TableRow>
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
