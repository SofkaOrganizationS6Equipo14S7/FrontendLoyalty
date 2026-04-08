import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings2 } from 'lucide-react';
import { rulesService } from '@/infrastructure/api';
import { useAuthStore } from '@/infrastructure/store';
import { Button, PageHeader, Tabs } from '@/presentation/components/ui';
import { useIsAdmin } from '@/presentation/hooks';
import type { DiscountTypeDTO } from '@/domain/types';
import { RulesTab } from './RulesTab';
import { TiersTab } from './TiersTab';
import { DiscountModals } from './DiscountModals';
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

      <Tabs
        variant="pill"
        tabs={TABS}
        activeTab={activeTab}
        onChange={(key) => setActiveTab(key as TabKey)}
      />

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

      <DiscountModals ruleState={ruleState} tierState={tierState} />
    </div>
  );
}
