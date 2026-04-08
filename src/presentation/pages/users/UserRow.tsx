import {
  Badge,
  StatusBadge,
  TableRow,
  TableCell,
} from '@/presentation/components/ui';
import type { UserResponse } from '@/domain/types';
import { UserActionsMenu } from './UserActionsMenu';

interface UserRowProps {
  user: UserResponse;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  onEdit: () => void;
  onToggleActive: () => void;
  onDelete: () => void;
}

export function UserRow({ user, isMenuOpen, onMenuToggle, onEdit, onToggleActive, onDelete }: UserRowProps) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium text-slate-900 dark:text-slate-100">{user.username}</span>
          <span className="text-sm text-slate-500 dark:text-slate-400">{user.email || 'No email'}</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{user.roleName.replace('_', ' ')}</Badge>
      </TableCell>
      <TableCell>
        <StatusBadge active={user.isActive} />
      </TableCell>
      <TableCell className="text-right">
        <UserActionsMenu
          user={user}
          isOpen={isMenuOpen}
          onToggle={onMenuToggle}
          onEdit={onEdit}
          onToggleActive={onToggleActive}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
}
