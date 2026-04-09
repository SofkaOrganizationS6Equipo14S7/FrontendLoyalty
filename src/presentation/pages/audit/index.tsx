import {
  Card,
  EmptyState,
  PageHeader,
  TableLoading,
  PaginationFooter,
} from '@/presentation/components/ui';
import { AuditFilters } from './AuditFilters';
import { AuditTable } from './AuditTable';
import { useAudit } from './useAudit';

export function AuditPage() {
  const {
    logs, loading, ecommerces, users,
    page, setPage, totalPages, totalElements, PAGE_SIZE,
    filterEcommerce, filterEntity,
    handleEcommerceChange, handleEntityChange,
  } = useAudit();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Log"
        description="Chronological history of all platform changes."
      />

      <Card>
        <AuditFilters
          ecommerces={ecommerces}
          filterEcommerce={filterEcommerce}
          filterEntity={filterEntity}
          onEcommerceChange={handleEcommerceChange}
          onEntityChange={handleEntityChange}
        />

        <div className="overflow-x-auto">
          {loading ? (
            <TableLoading rows={5} />
          ) : logs.length === 0 ? (
            <EmptyState title="No audit logs found" description="Try adjusting your filters." className="px-6 py-16" />
          ) : (
            <AuditTable logs={logs} users={users} />
          )}
        </div>

        <PaginationFooter
          page={page}
          pageSize={PAGE_SIZE}
          totalPages={totalPages}
          totalElements={totalElements}
          onPageChange={setPage}
        />
      </Card>
    </div>
  );
}
