import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings2 } from 'lucide-react';
import { rulesService, ecommercesService, setSelectedEcommerceId } from '@/infrastructure/api';
import { useAuthStore } from '@/infrastructure/store';
import { Button, PageHeader, Tabs } from '@/presentation/components/ui';
import { useIsAdmin } from '@/presentation/hooks';
import type { DiscountTypeDTO, EcommerceResponse } from '@/domain/types';
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
  const isSuperAdmin = !user?.ecommerceId;

  const [activeTab, setActiveTab] = useState<TabKey>('SEASONAL');
  const [discountTypes, setDiscountTypes] = useState<DiscountTypeDTO[]>([]);
  const [ecommerces, setEcommerces] = useState<EcommerceResponse[]>([]);
  const [selectedEcommerce, setSelectedEcommerce] = useState<string>('');

  const ruleState = useRules(discountTypes, activeTab);
  const tierState = useTiers(user?.ecommerceId || selectedEcommerce || '');

  useEffect(() => {
    rulesService.getDiscountTypes().then(setDiscountTypes).catch(() => {});
    if (isSuperAdmin) {
      ecommercesService.list().then((res) => {
        const items = (res.content || []).filter((e: EcommerceResponse) => e.status === 'ACTIVE');
        setEcommerces(items);
        if (items.length > 0) {
          setSelectedEcommerce(items[0].uid);
          setSelectedEcommerceId(items[0].uid);
          // Load rules after ecommerce header is set
          ruleState.loadRules();
          tierState.loadTiers();
        }
      }).catch(() => {});
    } else {
      ruleState.loadRules();
      tierState.loadTiers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEcommerceChange = (uid: string) => {
    setSelectedEcommerce(uid);
    setSelectedEcommerceId(uid);
    ruleState.loadRules();
    tierState.loadTiers();
  };

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

      {isSuperAdmin && ecommerces.length > 0 && (
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ecommerce:</label>
          <select
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
            value={selectedEcommerce}
            onChange={(e) => handleEcommerceChange(e.target.value)}
          >
            {ecommerces.map((ec) => (
              <option key={ec.uid} value={ec.uid}>{ec.name}</option>
            ))}
          </select>
        </div>
      )}

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
