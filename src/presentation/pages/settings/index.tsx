import { PageHeader } from '@/presentation/components/ui';
import { ProfileForm } from './ProfileForm';
import { PasswordForm } from './PasswordForm';
import { DiscountConfigSection } from './DiscountConfigSection';
import { useSettings } from './useSettings';

export function SettingsPage() {
  const {
    isAdmin,
    name, email, setEmail, savingProfile, handleProfileSave,
    currentPassword, setCurrentPassword,
    newPassword, setNewPassword,
    confirmPassword, setConfirmPassword,
    savingPassword, handlePasswordChange,
    loadingConfig, capType, setCapType, maxCap, setMaxCap,
    currency, setCurrency, roundingRule, setRoundingRule,
    priorities, savingConfig, movePriority, handleSaveConfig,
  } = useSettings();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile Settings"
        description="Manage your account and platform configuration."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <ProfileForm
          name={name}
          email={email}
          saving={savingProfile}
          onEmailChange={setEmail}
          onSubmit={handleProfileSave}
        />

        <PasswordForm
          currentPassword={currentPassword}
          newPassword={newPassword}
          confirmPassword={confirmPassword}
          saving={savingPassword}
          onCurrentPasswordChange={setCurrentPassword}
          onNewPasswordChange={setNewPassword}
          onConfirmPasswordChange={setConfirmPassword}
          onSubmit={handlePasswordChange}
        />
      </div>

      {isAdmin && !loadingConfig && (
        <DiscountConfigSection
          capType={capType}
          maxCap={maxCap}
          currency={currency}
          roundingRule={roundingRule}
          priorities={priorities}
          saving={savingConfig}
          onCapTypeChange={setCapType}
          onMaxCapChange={setMaxCap}
          onCurrencyChange={setCurrency}
          onRoundingRuleChange={setRoundingRule}
          onMovePriority={movePriority}
          onSave={handleSaveConfig}
        />
      )}
    </div>
  );
}
