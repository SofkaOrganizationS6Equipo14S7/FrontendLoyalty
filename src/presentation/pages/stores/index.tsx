import { useEffect, useState } from 'react';
import { Plus, Store } from 'lucide-react';
import toast from 'react-hot-toast';
import { ecommercesService } from '@/infrastructure/api';
import { getApiErrorMessage } from '@/presentation/hooks';
import {
  Card,
  Button,
  EmptyState,
  PageHeader,
  TableLoading,
  PaginationFooter,
} from '@/presentation/components/ui';
import type { EcommerceResponse, ApiKeyResponse, ApiKeyCreateResponse } from '@/domain/types';
import { StoresTable } from './StoresTable';
import { CreateStoreModal } from './CreateStoreModal';
import { ApiKeysModal } from './ApiKeysModal';

const PAGE_SIZE = 10;

export function StoresPage() {
  const [ecommerces, setEcommerces] = useState<EcommerceResponse[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  // API Keys state
  const [detailEcommerce, setDetailEcommerce] = useState<EcommerceResponse | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKeyResponse[]>([]);
  const [newKey, setNewKey] = useState<ApiKeyCreateResponse | null>(null);

  const load = async (p = page) => {
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
  };

  useEffect(() => {
    load();
  }, [page]);

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ecommerce Management"
        description="Manage connected stores, API keys, and status."
        actions={
          <Button className="gap-2" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" />
            Add Store
          </Button>
        }
      />

      <Card>
        <div className="overflow-x-auto">
          {loading ? (
            <TableLoading rows={5} rowHeight="h-14" />
          ) : ecommerces.length === 0 ? (
            <EmptyState
              icon={<Store className="h-6 w-6" />}
              title="No stores yet"
              description="Create your first store to get started."
              action={
                <Button variant="outline" onClick={() => setShowCreate(true)}>
                  Create Store
                </Button>
              }
              className="py-16"
            />
          ) : (
            <StoresTable
              ecommerces={ecommerces}
              onOpenDetail={openDetail}
              onToggleStatus={handleToggleStatus}
            />
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

      <CreateStoreModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
      />

      <ApiKeysModal
        ecommerce={detailEcommerce}
        apiKeys={apiKeys}
        newKey={newKey}
        onClose={() => setDetailEcommerce(null)}
        onCreateKey={handleCreateKey}
        onDeleteKey={handleDeleteKey}
      />
    </div>
  );
}
