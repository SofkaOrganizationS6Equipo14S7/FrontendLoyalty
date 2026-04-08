import { FormModal, Input, Select } from '@/presentation/components/ui';
import type { ClassificationRuleResponse } from '@/domain/types';

interface ClassFormState {
  metricType: string;
  minValue: string;
  maxValue: string;
  priority: string;
}

const METRIC_OPTIONS = [
  { value: 'TOTAL_PURCHASES', label: 'Total Purchases' },
  { value: 'ORDER_COUNT', label: 'Order Count' },
  { value: 'ACCOUNT_AGE', label: 'Account Age (days)' },
  { value: 'AVERAGE_ORDER_VALUE', label: 'Average Order Value' },
];

interface ClassificationRuleModalProps {
  isOpen: boolean;
  editingRule: ClassificationRuleResponse | null;
  form: ClassFormState;
  saving: boolean;
  onClose: () => void;
  onFormChange: (form: ClassFormState) => void;
  onSave: () => void;
}

export function ClassificationRuleModal({
  isOpen, editingRule, form, saving,
  onClose, onFormChange, onSave,
}: ClassificationRuleModalProps) {
  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={editingRule ? 'Edit Classification Rule' : 'Add Classification Rule'}
      description="Define metrics that assign customers to this tier."
      onSubmit={onSave}
      submitLabel={editingRule ? 'Save Changes' : 'Create'}
      saving={saving}
      submitDisabled={!form.metricType || !form.minValue || !form.maxValue}
    >
      <Select
        label="Metric Type"
        options={METRIC_OPTIONS}
        value={form.metricType}
        onChange={(e) => onFormChange({ ...form, metricType: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Min Value" type="number" value={form.minValue} onChange={(e) => onFormChange({ ...form, minValue: e.target.value })} placeholder="0" />
        <Input label="Max Value" type="number" value={form.maxValue} onChange={(e) => onFormChange({ ...form, maxValue: e.target.value })} placeholder="1000" />
      </div>
      <Input label="Priority" type="number" value={form.priority} onChange={(e) => onFormChange({ ...form, priority: e.target.value })} placeholder="1" />
    </FormModal>
  );
}
