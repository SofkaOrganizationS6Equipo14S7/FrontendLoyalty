import { FormModal, Input } from '@/presentation/components/ui';
import type { CustomerTierResponse } from '@/domain/types';

interface TierFormState {
  name: string;
  discountPercentage: string;
  hierarchyLevel: string;
}

interface TierFormModalProps {
  isOpen: boolean;
  editingTier: CustomerTierResponse | null;
  form: TierFormState;
  saving: boolean;
  onClose: () => void;
  onFormChange: (form: TierFormState) => void;
  onSave: () => void;
}

export function TierFormModal({
  isOpen, editingTier, form, saving,
  onClose, onFormChange, onSave,
}: TierFormModalProps) {
  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={editingTier ? 'Edit Tier' : 'Create Tier'}
      description="Configure loyalty tier details."
      onSubmit={onSave}
      submitLabel={editingTier ? 'Save Changes' : 'Create Tier'}
      saving={saving}
      submitDisabled={!form.name || !form.discountPercentage || !form.hierarchyLevel}
    >
      <Input label="Tier Name" value={form.name} onChange={(e) => onFormChange({ ...form, name: e.target.value })} placeholder="e.g. Gold" />
      <Input label="Discount %" type="number" value={form.discountPercentage} onChange={(e) => onFormChange({ ...form, discountPercentage: e.target.value })} placeholder="15" />
      <Input label="Hierarchy Level" type="number" value={form.hierarchyLevel} onChange={(e) => onFormChange({ ...form, hierarchyLevel: e.target.value })} placeholder="1" />
    </FormModal>
  );
}
