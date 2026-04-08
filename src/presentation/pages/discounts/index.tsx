import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings2 } from 'lucide-react';
import { rulesService } from '@/infrastructure/api';
import { useAuthStore } from '@/infrastructure/store';
import { cn } from '@/lib/utils';
import { Button, ConfirmModal, PageHeader } from '@/presentation/components/ui';
import { useIsAdmin } from '@/presentation/hooks';
import type { DiscountTypeDTO } from '@/domain/types';
import { RulesTab } from './RulesTab';
import { TiersTab } from './TiersTab';
import { RuleFormModal } from './RuleFormModal';
import { TierFormModal } from './TierFormModal';
import { ClassificationRuleModal } from './ClassificationRuleModal';
import { TierAssignModal } from './TierAssignModal';
import { useRules } from './useRules';
import { useTiers } from './useTiers';

type TabKey = 'SEASONAL' | 'PRODUCT_BASED' | 'LOYALTY_TIERS';
const TABS: { key: TabKey; label: string }[] = [
  { key: 'SEASONAL', label: 'Seasonal' },
  { key: 'PRODUCT_BASED', label: 'Product-Based' },
  { key: 'LOYALTY_TIERS', label: 'Loyalty Tiers' },
];

export function DiscountsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isAdmin = useIsAdmin();

  const [activeTab, setActiveTab] = useState<TabKey>('SEASONAL');
  const [discountTypes, setDiscountTypes] = useState<DiscountTypeDTO[]>([]);

  const ruleState = useRules(discountTypes, activeTab);
  const tierState = useTiers(user?.ecommerceId || '');

  useEffect(() => {
    rulesService.getDiscountTypes().then(setDiscountTypes).catch(() => {});
    ruleState.loadRules();
    tierState.loadTiers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeTabLabel = TABS.find((t) => t.key === activeTab)?.label || '';

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Discount Engine"
        description="Configure multi-layered discount rules and their priority."
        actions={
          isAdmin ? (
            <Button className="gap-2" onClick={() => navigate('/settings')}>
              <Settings2 className="h-4 w-4" /> Global Config
            </Button>
          ) : undefined
        }
      />

      {/* Pill tabs */}
      <div className="flex space-x-1 rounded-lg bg-slate-100 dark:bg-slate-800/50 p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-out',
              activeTab === tab.key
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:text-white dark:ring-slate-700'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:bg-slate-700/50',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab !== 'LOYALTY_TIERS' ? (
        <RulesTab
          rules={ruleState.rules}
          tabLabel={activeTabLabel}
          isAdmin={isAdmin}
          onCreateRule={ruleState.openCreate}
          onEditRule={ruleState.openEdit}
          onDeleteRule={ruleState.setDeleteTarget}
          onToggleActive={ruleState.handleToggleActive}
          onAssignTiers={ruleState.openTierAssign}
        />
      ) : (
        <TiersTab
          tiers={tierState.tiers}
          isAdmin={isAdmin}
          expandedTier={tierState.expandedTier}
          classRules={tierState.classRules}
          onCreateTier={tierState.openCreate}
          onEditTier={tierState.openEdit}
          onDeleteTier={tierState.setDeleteTarget}
          onActivateTier={tierState.handleActivate}
          onToggleExpand={tierState.toggleTierExpand}
          onCreateClassRule={tierState.openClassCreate}
          onEditClassRule={tierState.openClassEdit}
          onDeleteClassRule={tierState.handleClassDelete}
        />
      )}

      {/* Modals */}
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
    </div>
  );
}
