import { Select } from '@/presentation/components/ui';
import type { EcommerceResponse } from '@/domain/types';

const ENTITY_OPTIONS = [
  { value: '', label: 'All entities' },
  { value: 'app_user', label: 'Users' },
  { value: 'rule', label: 'Rules' },
  { value: 'ecommerce', label: 'Stores' },
  { value: 'api_key', label: 'API Keys' },
  { value: 'customer_tier', label: 'Tiers' },
  { value: 'discount_settings', label: 'Discount Config' },
];

interface AuditFiltersProps {
  ecommerces: EcommerceResponse[];
  filterEcommerce: string;
  filterEntity: string;
  onEcommerceChange: (value: string) => void;
  onEntityChange: (value: string) => void;
}

export function AuditFilters({
  ecommerces,
  filterEcommerce,
  filterEntity,
  onEcommerceChange,
  onEntityChange,
}: AuditFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3 p-4 border-b border-slate-100 dark:border-slate-800">
      <div className="w-48">
        <Select
          value={filterEcommerce}
          onChange={(e) => onEcommerceChange(e.target.value)}
          options={[
            { value: '', label: 'All stores' },
            ...ecommerces.map((ec) => ({ value: ec.uid, label: ec.name })),
          ]}
        />
      </div>
      <div className="w-48">
        <Select
          value={filterEntity}
          onChange={(e) => onEntityChange(e.target.value)}
          options={ENTITY_OPTIONS}
        />
      </div>
    </div>
  );
}
