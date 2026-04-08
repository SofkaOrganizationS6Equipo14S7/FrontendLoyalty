import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { rulesService, tiersService } from '@/infrastructure/api';
import type { CustomerTierResponse, ClassificationRuleResponse } from '@/domain/types';

interface TierFormState {
  name: string;
  discountPercentage: string;
  hierarchyLevel: string;
}

interface ClassFormState {
  metricType: string;
  minValue: string;
  maxValue: string;
  priority: string;
}

const EMPTY_TIER_FORM: TierFormState = { name: '', discountPercentage: '', hierarchyLevel: '' };
const EMPTY_CLASS_FORM: ClassFormState = { metricType: '', minValue: '', maxValue: '', priority: '' };

export function useTiers(ecommerceId: string) {
  const [tiers, setTiers] = useState<CustomerTierResponse[]>([]);

  // Tier form
  const [showForm, setShowForm] = useState(false);
  const [editingTier, setEditingTier] = useState<CustomerTierResponse | null>(null);
  const [form, setForm] = useState<TierFormState>(EMPTY_TIER_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CustomerTierResponse | null>(null);

  // Classification rules
  const [expandedTier, setExpandedTier] = useState<string | null>(null);
  const [classRules, setClassRules] = useState<Record<string, ClassificationRuleResponse[]>>({});
  const [showClassForm, setShowClassForm] = useState(false);
  const [classFormTierId, setClassFormTierId] = useState('');
  const [editingClassRule, setEditingClassRule] = useState<ClassificationRuleResponse | null>(null);
  const [classForm, setClassForm] = useState<ClassFormState>(EMPTY_CLASS_FORM);
  const [savingClass, setSavingClass] = useState(false);

  const loadTiers = useCallback(async () => {
    try {
      const res = await tiersService.list();
      setTiers(res.content || []);
    } catch { /* handled */ }
  }, []);

  // ── Tier CRUD ───────────────────────────────────────────
  const openCreate = () => {
    setEditingTier(null);
    setForm(EMPTY_TIER_FORM);
    setShowForm(true);
  };

  const openEdit = (tier: CustomerTierResponse) => {
    setEditingTier(tier);
    setForm({
      name: tier.name,
      discountPercentage: String(tier.discountPercentage),
      hierarchyLevel: String(tier.hierarchyLevel),
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingTier) {
        await tiersService.update(editingTier.id, {
          name: form.name,
          discountPercentage: Number(form.discountPercentage),
          hierarchyLevel: Number(form.hierarchyLevel),
        });
        toast.success('Tier updated');
      } else {
        await tiersService.create({
          ecommerceId,
          name: form.name,
          discountPercentage: Number(form.discountPercentage),
          hierarchyLevel: Number(form.hierarchyLevel),
        });
        toast.success('Tier created');
      }
      setShowForm(false);
      loadTiers();
    } catch {
      toast.error('Error saving tier');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await tiersService.delete(deleteTarget.id);
      toast.success('Tier deleted');
      setDeleteTarget(null);
      loadTiers();
    } catch {
      toast.error('Error deleting tier');
    }
  };

  const handleActivate = async (tier: CustomerTierResponse) => {
    try {
      await tiersService.activate(tier.id);
      toast.success('Tier reactivated');
      loadTiers();
    } catch {
      toast.error('Error activating tier');
    }
  };

  // ── Classification Rules ────────────────────────────────
  const loadClassRules = async (tierId: string) => {
    try {
      const data = await rulesService.getClassificationRules(tierId);
      setClassRules((prev) => ({ ...prev, [tierId]: data }));
    } catch {
      setClassRules((prev) => ({ ...prev, [tierId]: [] }));
    }
  };

  const toggleTierExpand = (tierId: string) => {
    if (expandedTier === tierId) {
      setExpandedTier(null);
    } else {
      setExpandedTier(tierId);
      loadClassRules(tierId);
    }
  };

  const openClassCreate = (tierId: string) => {
    setClassFormTierId(tierId);
    setEditingClassRule(null);
    setClassForm(EMPTY_CLASS_FORM);
    setShowClassForm(true);
  };

  const openClassEdit = (tierId: string, rule: ClassificationRuleResponse) => {
    setClassFormTierId(tierId);
    setEditingClassRule(rule);
    setClassForm({
      metricType: rule.metricType,
      minValue: String(rule.minValue),
      maxValue: String(rule.maxValue),
      priority: String(rule.priority),
    });
    setShowClassForm(true);
  };

  const handleClassSave = async () => {
    setSavingClass(true);
    try {
      const data = {
        metricType: classForm.metricType,
        minValue: Number(classForm.minValue),
        maxValue: Number(classForm.maxValue),
        priority: Number(classForm.priority),
      };
      if (editingClassRule) {
        await rulesService.updateClassificationRule(classFormTierId, editingClassRule.id, data);
        toast.success('Classification rule updated');
      } else {
        await rulesService.createClassificationRule(classFormTierId, data);
        toast.success('Classification rule created');
      }
      setShowClassForm(false);
      loadClassRules(classFormTierId);
    } catch {
      toast.error('Error saving classification rule');
    } finally {
      setSavingClass(false);
    }
  };

  const handleClassDelete = async (tierId: string, ruleId: string) => {
    try {
      await rulesService.deleteClassificationRule(tierId, ruleId);
      toast.success('Classification rule deleted');
      loadClassRules(tierId);
    } catch {
      toast.error('Error deleting classification rule');
    }
  };

  return {
    tiers, loadTiers,
    // Tier form
    showForm, setShowForm, editingTier, form, setForm, saving,
    openCreate, openEdit, handleSave,
    // Delete
    deleteTarget, setDeleteTarget, handleDelete,
    // Activate
    handleActivate,
    // Classification
    expandedTier, classRules,
    showClassForm, setShowClassForm, editingClassRule, classForm, setClassForm, savingClass,
    toggleTierExpand, openClassCreate, openClassEdit, handleClassSave, handleClassDelete,
  };
}
