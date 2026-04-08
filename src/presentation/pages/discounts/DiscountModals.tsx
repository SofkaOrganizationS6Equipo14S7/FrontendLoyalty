import { ConfirmModal } from '@/presentation/components/ui';
import { RuleFormModal } from './RuleFormModal';
import { TierFormModal } from './TierFormModal';
import { ClassificationRuleModal } from './ClassificationRuleModal';
import { TierAssignModal } from './TierAssignModal';
import type { useRules } from './useRules';
import type { useTiers } from './useTiers';

interface DiscountModalsProps {
  ruleState: ReturnType<typeof useRules>;
  tierState: ReturnType<typeof useTiers>;
}

export function DiscountModals({ ruleState, tierState }: DiscountModalsProps) {
  return (
    <>
      <RuleFormModal
        isOpen={ruleState.showForm}
        editingRule={ruleState.editingRule}
        form={ruleState.form}
        attributes={ruleState.attributes}
        priorities={ruleState.priorities}
        saving={ruleState.saving}
        onClose={() => ruleState.setShowForm(false)}
        onFormChange={ruleState.setForm}
        onSave={ruleState.handleSave}
      />

      <ConfirmModal
        isOpen={!!ruleState.deleteTarget}
        onClose={() => ruleState.setDeleteTarget(null)}
        onConfirm={ruleState.handleDelete}
        title="Delete Rule"
        message={`Are you sure you want to delete "${ruleState.deleteTarget?.name}"?`}
      />

      <TierFormModal
        isOpen={tierState.showForm}
        editingTier={tierState.editingTier}
        form={tierState.form}
        saving={tierState.saving}
        onClose={() => tierState.setShowForm(false)}
        onFormChange={tierState.setForm}
        onSave={tierState.handleSave}
      />

      <ConfirmModal
        isOpen={!!tierState.deleteTarget}
        onClose={() => tierState.setDeleteTarget(null)}
        onConfirm={tierState.handleDelete}
        title="Delete Tier"
        message={`Are you sure you want to delete tier "${tierState.deleteTarget?.name}"?`}
      />

      <ClassificationRuleModal
        isOpen={tierState.showClassForm}
        editingRule={tierState.editingClassRule}
        form={tierState.classForm}
        saving={tierState.savingClass}
        onClose={() => tierState.setShowClassForm(false)}
        onFormChange={tierState.setClassForm}
        onSave={tierState.handleClassSave}
      />

      <TierAssignModal
        isOpen={ruleState.showTierAssign}
        tiers={tierState.tiers}
        assignedTiers={ruleState.assignedTiers}
        selectedTierIds={ruleState.selectedTierIds}
        onClose={() => ruleState.setShowTierAssign(false)}
        onToggleTier={ruleState.handleToggleTier}
        onSave={ruleState.handleAssignTiers}
      />
    </>
  );
}
