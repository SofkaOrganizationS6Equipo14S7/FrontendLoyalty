import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { ecommercesService } from '@/infrastructure/api';
import { getApiErrorMessage } from '@/lib/utils';
import type { EcommerceResponse, ApiKeyResponse, ApiKeyCreateResponse } from '@/domain/types';

const PAGE_SIZE = 10;

export function useStores() {
  const [ecommerces, setEcommerces] = useState<EcommerceResponse[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const [detailEcommerce, setDetailEcommerce] = useState<EcommerceResponse | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKeyResponse[]>([]);
  const [newKey, setNewKey] = useState<ApiKeyCreateResponse | null>(null);

  const load = useCallback(async (p = page) => {
    setLoading(true);
    try {
      const data = await ecommercesService.list({ page: p, size: PAGE_SIZE });
      setEcommerces(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch {
      /* handled */
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (name: string, slug: string) => {
    try {
      await ecommercesService.create({ name, slug });
      toast.success('Store created');
      setShowCreate(false);
      load();
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Error creating store'));
    }
  };

  const handleToggleStatus = async (ecommerce: EcommerceResponse) => {
    const newStatus = ecommerce.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await ecommercesService.updateStatus(ecommerce.uid, { status: newStatus });
      toast.success(`Store ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'}`);
      load();
    } catch {
      toast.error('Error updating status');
    }
  };

  const openDetail = async (ecommerce: EcommerceResponse) => {
    setDetailEcommerce(ecommerce);
    setNewKey(null);
    try {
      const keys = await ecommercesService.listApiKeys(ecommerce.uid);
      setApiKeys(keys);
    } catch {
      setApiKeys([]);
    }
  };

  const handleCreateKey = async () => {
    if (!detailEcommerce) return;
    try {
      const key = await ecommercesService.createApiKey(detailEcommerce.uid);
      setNewKey(key);
      const keys = await ecommercesService.listApiKeys(detailEcommerce.uid);
      setApiKeys(keys);
      toast.success('API Key created');
    } catch {
      toast.error('Error creating API Key');
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    if (!detailEcommerce) return;
    try {
      await ecommercesService.deleteApiKey(detailEcommerce.uid, keyId);
      setApiKeys((prev) => prev.filter((k) => k.keyId !== keyId));
      toast.success('API Key deleted');
    } catch {
      toast.error('Error deleting API Key');
    }
  };

  return {
    ecommerces, loading, page, setPage, totalPages, totalElements, PAGE_SIZE,
    showCreate, setShowCreate, handleCreate,
    handleToggleStatus,
    detailEcommerce, setDetailEcommerce, apiKeys, newKey,
    openDetail, handleCreateKey, handleDeleteKey,
  };
}
