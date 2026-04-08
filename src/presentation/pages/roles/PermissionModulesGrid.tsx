import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from '@/presentation/components/ui';
import type { PermissionResponse } from '@/domain/types';

interface PermissionModulesGridProps {
  modules: string[];
  allPermissions: PermissionResponse[];
}

export function PermissionModulesGrid({ modules, allPermissions }: PermissionModulesGridProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Permission Modules</CardTitle>
        <CardDescription>Overview of available permissions grouped by module.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {modules.map((mod) => {
            const count = allPermissions.filter((p) => p.module === mod).length;
            return (
              <div
                key={mod}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
              >
                <span className="font-medium text-sm text-slate-700 dark:text-slate-300">{mod}</span>
                <Badge variant="outline">{count}</Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
