import { Modal, Button, Badge } from '@/presentation/components/ui';
import type { CustomerTierResponse, RuleCustomerTierDTO } from '@/domain/types';

interface TierAssignModalProps {
  isOpen: boolean;
  tiers: CustomerTierResponse[];
  assignedTiers: RuleCustomerTierDTO[];
  selectedTierIds: string[];
  onClose: () => void;
  onToggleTier: (tierId: string, checked: boolean) => void;
  onSave: () => void;
}

export function TierAssignModal({
  isOpen, tiers, assignedTiers, selectedTierIds,
  onClose, onToggleTier, onSave,
}: TierAssignModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Tiers to Rule" description="Select which customer tiers should be linked to this discount rule.">
      <div className="space-y-3">
        {tiers.length === 0 ? (
          <p className="text-sm text-slate-500">No tiers available. Create tiers first.</p>
        ) : (
          tiers.map((tier) => (
            <label
              key={tier.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedTierIds.includes(tier.id)}
                onChange={(e) => onToggleTier(tier.id, e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="flex-1">
                <span className="font-medium text-sm text-slate-900 dark:text-slate-100">{tier.name}</span>
                <span className="text-xs text-slate-500 ml-2">Level {tier.hierarchyLevel} &bull; {tier.discountPercentage}%</span>
              </div>
              {assignedTiers.some((a) => a.customerTierId === tier.id) && (
                <Badge variant="outline" className="text-[10px]">Linked</Badge>
              )}
            </label>
          ))
        )}
        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onSave}>Save Assignment</Button>
        </div>
      </div>
    </Modal>
  );
}
