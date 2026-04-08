import { useState } from 'react';
import { Plus, Trash2, Copy, Check, Key } from 'lucide-react';
import { format } from 'date-fns';
import { DATETIME_FORMAT } from '@/lib/constants';
import { Modal, Button, ConfirmModal } from '@/presentation/components/ui';
import type { EcommerceResponse, ApiKeyResponse, ApiKeyCreateResponse } from '@/domain/types';

interface ApiKeysModalProps {
  ecommerce: EcommerceResponse | null;
  apiKeys: ApiKeyResponse[];
  onClose: () => void;
  onCreateKey: () => Promise<void>;
  onDeleteKey: (keyId: string) => Promise<void>;
  newKey: ApiKeyCreateResponse | null;
}

export function ApiKeysModal({ ecommerce, apiKeys, onClose, onCreateKey, onDeleteKey, newKey }: ApiKeysModalProps) {
  const [copiedKey, setCopiedKey] = useState(false);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);

  const copyKey = async (key: string) => {
    await navigator.clipboard.writeText(key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <>
      <Modal
        isOpen={!!ecommerce}
        onClose={onClose}
        title={`API Keys — ${ecommerce?.name || ''}`}
        description="Manage API keys for this store."
      >
        <div className="space-y-4">
          {newKey && (
            <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2">
                Save this key — it won't be shown again
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-white dark:bg-slate-900 px-3 py-2 rounded border border-slate-200 dark:border-slate-700 font-mono break-all">
                  {newKey.key}
                </code>
                <Button variant="outline" size="icon" onClick={() => copyKey(newKey.key)}>
                  {copiedKey ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button size="sm" className="gap-1.5" onClick={onCreateKey}>
              <Plus className="h-4 w-4" /> Generate API Key
            </Button>
          </div>
          {apiKeys.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Key className="h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No API Keys. Generate one to connect your store.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {apiKeys.map((key) => (
                <div
                  key={key.keyId}
                  className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800"
                >
                  <div>
                    <span className="font-mono text-sm text-slate-700 dark:text-slate-300">
                      ****{key.prefix}
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Created: {format(new Date(key.createdAt), DATETIME_FORMAT)}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setDeletingKey(key.keyId)}>
                    <Trash2 className="h-4 w-4 text-rose-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      <ConfirmModal
        isOpen={!!deletingKey}
        onClose={() => setDeletingKey(null)}
        onConfirm={() => {
          if (deletingKey) {
            onDeleteKey(deletingKey);
            setDeletingKey(null);
          }
        }}
        title="Delete API Key"
        message="This action cannot be undone. The API Key will stop working immediately."
      />
    </>
  );
}
