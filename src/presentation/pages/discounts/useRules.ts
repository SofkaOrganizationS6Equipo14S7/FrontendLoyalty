import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { rulesService } from '@/infrastructure/api';
import type {
  RuleResponse, RuleAttributeMetadataDTO, DiscountPriorityDTO,
  DiscountTypeDTO, RuleCustomerTierDTO,
} from '@/domain/types';

interface RuleFormState {
  name: string;
  description: string;
  discountPercentage: string;
  discountPriorityId: string;
  attrs: Record<string, string>;
}

const EMPTY_RULE_FORM: RuleFormState = { name: '', description: '', discountPercentage: '', discountPriorityId: '', attrs: {} };

export function useRules(discountTypes: DiscountTypeDTO[], activeTab: string) {
  const [rules, setRules] = useState<RuleResponse[]>([]);
  const [attributes, setAttributes] = useState<RuleAttributeMetadataDTO[]>([]);
  const [priorities, setPriorities] = useState<DiscountPriorityDTO[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<RuleResponse | null>(null);
  const [form, setForm] = useState<RuleFormState>(EMPTY_RULE_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<RuleResponse | null>(null);

  // Tier-rule assignment
  const [showTierAssign, setShowTierAssign] = useState(false);
  const [assignRuleId, setAssignRuleId] = useState('');
  const [assignedTiers, setAssignedTiers] = useState<RuleCustomerTierDTO[]>([]);
  const [selectedTierIds, setSelectedTierIds] = useState<string[]>([]);

  const loadRules = useCallback(async () => {
    try {
      const res = await rulesService.list();
      setRules(res.content || []);
    } catch { /* handled */ }
  }, []);

  const getTypeForTab = () => discountTypes.find((dt) => dt.code === activeTab);

  const loadAttributes = async () => {
    const type = getTypeForTab();
    if (type) {
      const [attrs, prios] = await Promise.all([
        rulesService.getAttributes(type.id),
        rulesService.getDiscountPriorities(type.id),
      ]);
      setAttributes(attrs);
      setPriorities(prios);
    }
  };

  const openCreate = async () => {
    setEditingRule(null);
    await loadAttributes();
    setForm(EMPTY_RULE_FORM);
    setShowForm(true);
  };

  const openEdit = async (rule: RuleResponse) => {
    setEditingRule(rule);
    await loadAttributes();
    setForm({
      name: rule.name,
      description: rule.description || '',
      discountPercentage: String(rule.discountPercentage),
      discountPriorityId: rule.discountPriorityId,
      attrs: {},
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = {
        name: form.name,
        description: form.description || undefined,
        discountPercentage: Number(form.discountPercentage),
        discountPriorityId: form.discountPriorityId,
        attributes: form.attrs,
      };
      if (editingRule) {
        await rulesService.update(editingRule.id, data);
        toast.success('Rule updated');
      } else {
        await rulesService.create(data);
        toast.success('Rule created');
      }
      setShowForm(false);
      loadRules();
    } catch {
      toast.error('Error saving rule');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await rulesService.delete(deleteTarget.id);
      toast.success('Rule deleted');
      setDeleteTarget(null);
      loadRules();
    } catch {
      toast.error('Error deleting rule');
    }
  };

  const handleToggleActive = async (rule: RuleResponse) => {
    try {
      await rulesService.update(rule.id, {
        name: rule.name,
        description: rule.description,
        discountPercentage: rule.discountPercentage,
        discountPriorityId: rule.discountPriorityId,
        attributes: {},
      });
      toast.success(rule.isActive ? 'Rule disabled' : 'Rule enabled');
      loadRules();
    } catch {
      toast.error('Error toggling rule');
    }
  };

  // Tier-rule assignment
  const openTierAssign = async (rule: RuleResponse) => {
    setAssignRuleId(rule.id);
    try {
      const assigned = await rulesService.getRuleTiers(rule.id);
      setAssignedTiers(assigned);
      setSelectedTierIds(assigned.map((a) => a.customerTierId));
    } catch {
      setAssignedTiers([]);
      setSelectedTierIds([]);
    }
    setShowTierAssign(true);
  };

  const handleAssignTiers = async () => {
    try {
      const currentIds = assignedTiers.map((a) => a.customerTierId);
      const toAdd = selectedTierIds.filter((id) => !currentIds.includes(id));
      const toRemove = currentIds.filter((id) => !selectedTierIds.includes(id));
      if (toAdd.length > 0) await rulesService.addTiers(assignRuleId, toAdd);
      for (const tierId of toRemove) await rulesService.removeTier(assignRuleId, tierId);
      toast.success('Tier assignment updated');
      setShowTierAssign(false);
    } catch {
      toast.error('Error updating tier assignment');
    }
  };

  const handleToggleTier = (tierId: string, checked: boolean) => {
    if (checked) setSelectedTierIds([...selectedTierIds, tierId]);
    else setSelectedTierIds(selectedTierIds.filter((id) => id !== tierId));
  };

  return {
    rules, loadRules, attributes, priorities,
    // Form
    showForm, setShowForm, editingRule, form, setForm, saving,
    openCreate, openEdit, handleSave,
    // Delete
    deleteTarget, setDeleteTarget, handleDelete,
    // Toggle
    handleToggleActive,
    // Tier assignment
    showTierAssign, setShowTierAssign, assignedTiers, selectedTierIds,
    openTierAssign, handleAssignTiers, handleToggleTier,
  };
}
