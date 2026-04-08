import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Users,
  Store,
  Tag,
  History,
  ActivitySquare,
  Shield,
} from 'lucide-react';

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  roles?: string[];
}

export const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/users', icon: Users, roles: ['SUPER_ADMIN', 'STORE_ADMIN'] },
  { name: 'Stores', href: '/stores', icon: Store, roles: ['SUPER_ADMIN'] },
  { name: 'Discounts', href: '/discounts', icon: Tag },
  { name: 'Transactions', href: '/transactions', icon: History },
  { name: 'Audit Log', href: '/audit', icon: ActivitySquare, roles: ['SUPER_ADMIN'] },
  { name: 'Roles', href: '/roles', icon: Shield, roles: ['SUPER_ADMIN'] },
];

export const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/users': 'Users',
  '/stores': 'Stores',
  '/discounts': 'Discounts',
  '/transactions': 'Transactions',
  '/audit': 'Audit Log',
  '/roles': 'Roles & Permissions',
  '/settings': 'Settings',
};
