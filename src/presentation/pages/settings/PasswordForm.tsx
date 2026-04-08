import { Lock } from 'lucide-react';
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
  Input, Button,
} from '@/presentation/components/ui';

interface PasswordFormProps {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  saving: boolean;
  onCurrentPasswordChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function PasswordForm({
  currentPassword, newPassword, confirmPassword, saving,
  onCurrentPasswordChange, onNewPasswordChange, onConfirmPasswordChange, onSubmit,
}: PasswordFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your login password</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input label="Current Password" type="password" value={currentPassword} onChange={(e) => onCurrentPasswordChange(e.target.value)} required autoComplete="current-password" />
          <Input label="New Password" type="password" value={newPassword} onChange={(e) => onNewPasswordChange(e.target.value)} required autoComplete="new-password" />
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            required
            error={confirmPassword && newPassword !== confirmPassword ? 'Passwords do not match' : undefined}
            autoComplete="new-password"
          />
          <div className="pt-2">
            <Button type="submit" isLoading={saving} className="gap-2">
              <Lock className="h-4 w-4" /> Change Password
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
