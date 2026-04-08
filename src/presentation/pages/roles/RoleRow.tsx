import {
  Badge,
  Button,
  TableRow,
  TableCell,
} from '@/presentation/components/ui';
import type { RoleResponse } from '@/domain/types';

interface RoleRowProps {
  role: RoleResponse;
  onManagePermissions: (role: RoleResponse) => void;
}

export function RoleRow({ role, onManagePermissions }: RoleRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium text-slate-900 dark:text-slate-100">{role.name}</TableCell>
      <TableCell>
        <Badge variant={role.isActive ? 'success' : 'secondary'}>
          {role.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </TableCell>
      <TableCell className="text-sm text-slate-500">
        {new Date(role.createdAt).toLocaleDateString()}
      </TableCell>
      <TableCell className="text-right">
        <Button variant="outline" size="sm" onClick={() => onManagePermissions(role)}>
          Manage Permissions
        </Button>
      </TableCell>
    </TableRow>
  );
}
