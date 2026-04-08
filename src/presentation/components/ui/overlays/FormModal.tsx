import { Modal } from './Modal';
import { Button } from '../Button';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  onSubmit: () => void;
  submitLabel?: string;
  saving?: boolean;
  submitDisabled?: boolean;
}

export function FormModal({
  isOpen, onClose, title, description, children,
  onSubmit, submitLabel = 'Save', saving = false, submitDisabled = false,
}: FormModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} description={description}>
      <div className="space-y-4">
        {children}
        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onSubmit} isLoading={saving} disabled={submitDisabled}>
            {submitLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
