import { Save } from 'lucide-react';
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
  Input, Button,
} from '@/presentation/components/ui';

interface ProfileFormProps {
  name: string;
  email: string;
  saving: boolean;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ProfileForm({ name, email, saving, onNameChange, onEmailChange, onSubmit }: ProfileFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your name and email</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input label="Username" value={name} onChange={(e) => onNameChange(e.target.value)} required />
          <Input label="Email" type="email" value={email} onChange={(e) => onEmailChange(e.target.value)} required />
          <div className="pt-2">
            <Button type="submit" isLoading={saving} className="gap-2">
              <Save className="h-4 w-4" /> Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
