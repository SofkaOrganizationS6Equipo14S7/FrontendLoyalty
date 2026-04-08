import { useEffect, useState, useCallback } from 'react';
import { format } from 'date-fns';
import { DATE_FORMAT } from '@/lib/constants';
import toast from 'react-hot-toast';
import { discountLogsService } from '@/infrastructure/api';
import { useAuthStore } from '@/infrastructure/store';
import { exportToCsv } from '@/lib/utils';
import type { DiscountApplicationLogResponse } from '@/domain/types';

const PAGE_SIZE = 10;

export function useTransactions() {
  const { user } = useAuthStore();
  const [logs, setLogs] = useState<DiscountApplicationLogResponse[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const load = useCallback(async (p = page) => {
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
  }, [page, user?.ecommerceId, searchQuery]);

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

  return {
    logs, loading, searchQuery, setSearchQuery,
    page, setPage, totalPages, totalElements, PAGE_SIZE,
    handleSearch, handleExportCSV,
  };
}
