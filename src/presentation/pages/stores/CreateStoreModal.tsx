import { useState } from 'react';
import { Modal, Input, Button } from '@/presentation/components/ui';

interface CreateStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, slug: string) => Promise<void>;
}

export function CreateStoreModal({ isOpen, onClose, onSubmit }: CreateStoreModalProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [creating, setCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await onSubmit(name, slug);
      setName('');
      setSlug('');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Store" description="Add a new ecommerce store to the platform.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="My Store" />
        <Input
          label="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
          required
          placeholder="my-store"
        />
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" onClick={onClose} type="button">Cancel</Button>
          <Button type="submit" isLoading={creating}>Create</Button>
        </div>
      </form>
    </Modal>
  );
}
