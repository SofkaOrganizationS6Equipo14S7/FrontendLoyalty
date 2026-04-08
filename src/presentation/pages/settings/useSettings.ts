import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { authService, configService, rulesService } from '@/infrastructure/api';
import { useAuthStore } from '@/infrastructure/store';
import { getApiErrorMessage } from '@/lib/utils';
import { useIsAdmin } from '@/presentation/hooks';
import type { DiscountTypeDTO } from '@/domain/types';

interface PriorityItem {
  type: string;
  displayName: string;
  order: number;
}

export function useSettings() {
  const { user, setUser } = useAuthStore();
  const isAdmin = useIsAdmin();
  const ecommerceId = user?.ecommerceId || '';

  const [name] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const [, setDiscountTypes] = useState<DiscountTypeDTO[]>([]);
  const [maxCap, setMaxCap] = useState('');
  const [capType, setCapType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [currency, setCurrency] = useState('CLP');
  const [roundingRule, setRoundingRule] = useState('ROUND_HALF_UP');
  const [priorities, setPriorities] = useState<PriorityItem[]>([]);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);

  useEffect(() => {
    if (!isAdmin) { setLoadingConfig(false); return; }
    async function loadConfig() {
      try {
        const types = await rulesService.getDiscountTypes();
        setDiscountTypes(types);
        if (ecommerceId) {
          try {
            const config = await configService.get(ecommerceId);
            setMaxCap(String(config.maxDiscountCap || ''));
            setCurrency(config.currencyCode || 'CLP');
            setRoundingRule(config.roundingRule || 'ROUND_HALF_UP');
          } catch { /* no config yet */ }
        }
        setPriorities(types.map((t, i) => ({ type: t.code, displayName: t.displayName, order: i + 1 })));
      } catch { /* handled */ } finally {
        setLoadingConfig(false);
      }
    }
    loadConfig();
  }, [ecommerceId, isAdmin]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const updated = await authService.updateProfile({ email });
      setUser(updated);
      toast.success('Profile updated');
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Error updating profile'));
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setSavingPassword(true);
    try {
      await authService.changePassword({ currentPassword, newPassword, confirmPassword });
      toast.success('Password updated');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Error changing password'));
    } finally {
      setSavingPassword(false);
    }
  };

  const movePriority = (index: number, direction: 'up' | 'down') => {
    const newPriorities = [...priorities];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newPriorities.length) return;
    [newPriorities[index], newPriorities[targetIndex]] = [newPriorities[targetIndex], newPriorities[index]];
    setPriorities(newPriorities.map((p, i) => ({ ...p, order: i + 1 })));
  };

  const handleSaveConfig = async () => {
    setSavingConfig(true);
    try {
      await configService.createConfiguration({
        ecommerceId,
        currency,
        roundingRule,
        cap: { type: capType, value: parseFloat(maxCap) },
        priority: priorities.map((p) => ({ type: p.type, order: p.order })),
      });
      toast.success('Configuration saved');
    } catch {
      try {
        await configService.patchConfiguration(ecommerceId, {
          currency,
          roundingRule,
          cap: { type: capType, value: parseFloat(maxCap) },
          priority: priorities.map((p) => ({ type: p.type, order: p.order })),
        });
        toast.success('Configuration updated');
      } catch {
        toast.error('Error saving configuration');
      }
    } finally {
      setSavingConfig(false);
    }
  };

  return {
    isAdmin,
    // Profile
    name, email, setEmail, savingProfile, handleProfileSave,
    // Password
    currentPassword, setCurrentPassword,
    newPassword, setNewPassword,
    confirmPassword, setConfirmPassword,
    savingPassword, handlePasswordChange,
    // Config
    loadingConfig, capType, setCapType, maxCap, setMaxCap,
    currency, setCurrency, roundingRule, setRoundingRule,
    priorities, savingConfig, movePriority, handleSaveConfig,
  };
}
