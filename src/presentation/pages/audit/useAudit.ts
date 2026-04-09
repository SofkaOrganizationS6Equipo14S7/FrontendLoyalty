import { useEffect, useState, useCallback } from 'react';
import { auditService, ecommercesService, usersService } from '@/infrastructure/api';
import type { AuditLogResponse, EcommerceResponse, UserResponse } from '@/domain/types';

const PAGE_SIZE = 20;

export function useAudit() {
  const [logs, setLogs] = useState<AuditLogResponse[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [ecommerces, setEcommerces] = useState<EcommerceResponse[]>([]);
  const [users, setUsers] = useState<Map<string, string>>(new Map());
  const [filterEcommerce, setFilterEcommerce] = useState('');
  const [filterEntity, setFilterEntity] = useState('');

  const load = useCallback(async (p = page) => {
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
  }, [page, filterEcommerce, filterEntity]);

  useEffect(() => {
    ecommercesService.list({ size: 100 }).then((d) => setEcommerces(d.content)).catch(() => {});
    usersService.list({ size: 100 }).then((d) => {
      const map = new Map<string, string>();
      d.content.forEach((u: UserResponse) => map.set(u.uid, u.username));
      setUsers(map);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleEcommerceChange = (value: string) => {
    setFilterEcommerce(value);
    setPage(0);
  };

  const handleEntityChange = (value: string) => {
    setFilterEntity(value);
    setPage(0);
  };

  return {
    logs, loading, ecommerces, users,
    page, setPage, totalPages, totalElements, PAGE_SIZE,
    filterEcommerce, filterEntity,
    handleEcommerceChange, handleEntityChange,
  };
}
