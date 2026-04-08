import { FormModal, Input, Select } from '@/presentation/components/ui';
import type { RuleResponse, RuleAttributeMetadataDTO, DiscountPriorityDTO } from '@/domain/types';

interface RuleFormState {
  name: string;
  description: string;
  discountPercentage: string;
  discountPriorityId: string;
  attrs: Record<string, string>;
}

interface RuleFormModalProps {
  isOpen: boolean;
  editingRule: RuleResponse | null;
  form: RuleFormState;
  attributes: RuleAttributeMetadataDTO[];
  priorities: DiscountPriorityDTO[];
  saving: boolean;
  onClose: () => void;
  onFormChange: (form: RuleFormState) => void;
  onSave: () => void;
}

export function RuleFormModal({
  isOpen, editingRule, form, attributes, priorities, saving,
  onClose, onFormChange, onSave,
}: RuleFormModalProps) {
  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={editingRule ? 'Edit Rule' : 'Create Rule'}
      description="Configure discount rule details."
      onSubmit={onSave}
      submitLabel={editingRule ? 'Save Changes' : 'Create Rule'}
      saving={saving}
      submitDisabled={!form.name || !form.discountPercentage}
    >
      <Input label="Rule Name" value={form.name} onChange={(e) => onFormChange({ ...form, name: e.target.value })} placeholder="e.g. Black Friday Sale" />
      <Input label="Description" value={form.description} onChange={(e) => onFormChange({ ...form, description: e.target.value })} placeholder="Optional description" />
      <Input label="Discount %" type="number" value={form.discountPercentage} onChange={(e) => onFormChange({ ...form, discountPercentage: e.target.value })} placeholder="20" />
      {priorities.length > 0 && (
        <Select
          label="Priority"
          options={priorities.map((p) => ({ value: p.id, label: `Priority Level ${p.priorityLevel}` }))}
          value={form.discountPriorityId}
          onChange={(e) => onFormChange({ ...form, discountPriorityId: e.target.value })}
        />
      )}
      {attributes.map((attr) => (
        <Input
          key={attr.id}
          label={attr.attributeName}
          value={form.attrs[attr.id] || ''}
          onChange={(e) => onFormChange({ ...form, attrs: { ...form.attrs, [attr.id]: e.target.value } })}
          placeholder={`Enter ${attr.attributeName.toLowerCase()}`}
        />
      ))}
    </FormModal>
  );
}
