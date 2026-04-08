import { Shield } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
} from '@/presentation/components/ui';
import type { RoleResponse } from '@/domain/types';
import { RoleRow } from './RoleRow';

interface RolesTableProps {
  roles: RoleResponse[];
  loading: boolean;
  onManagePermissions: (role: RoleResponse) => void;
}

export function RolesTable({ roles, loading, onManagePermissions }: RolesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-indigo-500" /> System Roles
          <Badge variant="secondary" className="ml-2 font-normal text-xs">{roles.length} Total</Badge>
        </CardTitle>
        <CardDescription>Click "Manage Permissions" to configure what each role can access.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <RoleRow key={role.id} role={role} onManagePermissions={onManagePermissions} />
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
