import { useEffect, useState } from 'react';
import { auditService, ecommercesService } from '@/infrastructure/api';
import {
  Card,
  EmptyState,
  PageHeader,
  TableLoading,
  PaginationFooter,
} from '@/presentation/components/ui';
import type { AuditLogResponse, EcommerceResponse } from '@/domain/types';
import { AuditFilters } from './AuditFilters';
import { AuditTable } from './AuditTable';

const PAGE_SIZE = 20;

export function AuditPage() {
  const [logs, setLogs] = useState<AuditLogResponse[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [ecommerces, setEcommerces] = useState<EcommerceResponse[]>([]);
  const [filterEcommerce, setFilterEcommerce] = useState('');
  const [filterEntity, setFilterEntity] = useState('');

  const load = async (p = page) => {
    setLoading(true);
    try {
      const data = await auditService.list({
        page: p,
        size: PAGE_SIZE,
        ecommerceId: filterEcommerce || undefined,
        entityName: filterEntity || undefined,
      });
      setLogs(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch {
      /* handled */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    ecommercesService.list({ size: 100 }).then((d) => setEcommerces(d.content)).catch(() => {});
    load();
  }, []);

  useEffect(() => {
    load();
  }, [page, filterEcommerce, filterEntity]);

  const handleEcommerceChange = (value: string) => {
    setFilterEcommerce(value);
    setPage(0);
  };

  const handleEntityChange = (value: string) => {
    setFilterEntity(value);
    setPage(0);
  };

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
            <AuditTable logs={logs} />
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
