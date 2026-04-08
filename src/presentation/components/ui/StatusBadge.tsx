import { Badge } from './Badge';

interface StatusBadgeProps {
  active: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}

export function StatusBadge({ active, activeLabel = 'Active', inactiveLabel = 'Inactive' }: StatusBadgeProps) {
  return (
    <Badge variant={active ? 'success' : 'secondary'}>
      {active ? activeLabel : inactiveLabel}
    </Badge>
  );
}
