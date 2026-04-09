import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/presentation/components/layout';
import { RoleGuard } from './RoleGuard';
import {
  LoginPage,
  DashboardPage,
  StoresPage,
  UsersPage,
  DiscountsPage,
  TransactionsPage,
  AuditPage,
  SettingsPage,
  RolesPermissionsPage,
  NotFoundPage,
} from '@/presentation/pages';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      {
        path: 'stores',
        element: (
          <RoleGuard allowedRoles={['SUPER_ADMIN']}>
            <StoresPage />
          </RoleGuard>
        ),
      },
      {
        path: 'users',
        element: (
          <RoleGuard allowedRoles={['SUPER_ADMIN', 'STORE_ADMIN']}>
            <UsersPage />
          </RoleGuard>
        ),
      },
      { path: 'discounts', element: <DiscountsPage /> },
      { path: 'transactions', element: <TransactionsPage /> },
      {
        path: 'audit',
        element: (
          <RoleGuard allowedRoles={['SUPER_ADMIN']}>
            <AuditPage />
          </RoleGuard>
        ),
      },
      {
        path: 'roles',
        element: (
          <RoleGuard allowedRoles={['SUPER_ADMIN']}>
            <RolesPermissionsPage />
          </RoleGuard>
        ),
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
