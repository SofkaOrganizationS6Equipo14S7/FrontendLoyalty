import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { format } from 'date-fns';
import { DATE_FORMAT } from '@/lib/constants';
import toast from 'react-hot-toast';
import { discountLogsService } from '@/infrastructure/api';
import { useAuthStore } from '@/infrastructure/store';
import { exportToCsv } from '@/presentation/hooks';
import {
  Card,
  Button,
  PageHeader,
  TableLoading,
  PaginationFooter,
} from '@/presentation/components/ui';
import type { DiscountApplicationLogResponse } from '@/domain/types';
import { TransactionsToolbar } from './TransactionsToolbar';
import { TransactionsTable } from './TransactionsTable';

const PAGE_SIZE = 10;

export function TransactionsPage() {
  const { user } = useAuthStore();
  const [logs, setLogs] = useState<DiscountApplicationLogResponse[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const load = async (p = page) => {
    setLoading(true);
    try {
      const data = await discountLogsService.list({
        ecommerceId: user?.ecommerceId || undefined,
        externalOrderId: searchQuery || undefined,
        page: p,
        size: PAGE_SIZE,
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
    load();
  }, [page]);

  const handleSearch = () => {
    setPage(0);
    load(0);
  };

  const handleExportCSV = () => {
    if (logs.length === 0) {
      toast.error('No data to export');
      return;
    }
    const headers = ['Transaction ID', 'Store', 'Rule', 'Order Amount', 'Discount Applied', 'Status', 'Date'];
    const rows = logs.map((log) => [
      log.externalOrderId || log.id.slice(0, 8),
      log.ecommerceId || '',
      log.appliedRulesDetails?.[0]?.ruleName || '',
      Number(log.originalAmount).toFixed(2),
      Number(log.discountApplied).toFixed(2),
      'Completed',
      format(new Date(log.createdAt), DATE_FORMAT),
    ]);
    exportToCsv(headers, rows, `transactions-${format(new Date(), DATE_FORMAT)}.csv`);
    toast.success('CSV exported');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transaction History"
        description="View and audit all discount applications across connected stores."
        actions={
          <Button variant="outline" className="gap-2" onClick={handleExportCSV}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        }
      />

      <Card>
        <TransactionsToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={handleSearch}
          totalElements={totalElements}
        />

        <div className="overflow-x-auto">
          {loading ? (
            <TableLoading rows={5} rowHeight="h-14" />
          ) : (
            <TransactionsTable logs={logs} />
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
