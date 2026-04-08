import { Download } from 'lucide-react';
import {
  Card,
  Button,
  PageHeader,
  TableLoading,
  PaginationFooter,
} from '@/presentation/components/ui';
import { TransactionsToolbar } from './TransactionsToolbar';
import { TransactionsTable } from './TransactionsTable';
import { useTransactions } from './useTransactions';

export function TransactionsPage() {
  const {
    logs, loading, searchQuery, setSearchQuery,
    page, setPage, totalPages, totalElements, PAGE_SIZE,
    handleSearch, handleExportCSV,
  } = useTransactions();

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
