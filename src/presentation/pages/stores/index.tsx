import { Plus, Store } from 'lucide-react';
import {
  Card,
  Button,
  EmptyState,
  PageHeader,
  TableLoading,
  PaginationFooter,
} from '@/presentation/components/ui';
import { StoresTable } from './StoresTable';
import { CreateStoreModal } from './CreateStoreModal';
import { ApiKeysModal } from './ApiKeysModal';
import { useStores } from './useStores';

export function StoresPage() {
  const {
    ecommerces, loading, page, setPage, totalPages, totalElements, PAGE_SIZE,
    showCreate, setShowCreate, handleCreate,
    handleToggleStatus,
    detailEcommerce, setDetailEcommerce, apiKeys, newKey,
    openDetail, handleCreateKey, handleDeleteKey,
  } = useStores();

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
