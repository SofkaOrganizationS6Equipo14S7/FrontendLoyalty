import { navigation, pageTitles } from '@/presentation/components/layout/navigation.config';

describe('navigation config', () => {
  it('has 7 navigation items', () => {
    expect(navigation).toHaveLength(7);
  });

  it('Dashboard has no role restriction', () => {
    const dashboard = navigation.find((n) => n.name === 'Dashboard');
    expect(dashboard).toBeDefined();
    expect(dashboard!.href).toBe('/dashboard');
    expect(dashboard!.roles).toBeUndefined();
  });

  it('Users requires SUPER_ADMIN or STORE_ADMIN', () => {
    const users = navigation.find((n) => n.name === 'Users');
    expect(users).toBeDefined();
    expect(users!.roles).toEqual(['SUPER_ADMIN', 'STORE_ADMIN']);
  });

  it('Stores requires SUPER_ADMIN', () => {
    const stores = navigation.find((n) => n.name === 'Stores');
    expect(stores).toBeDefined();
    expect(stores!.roles).toEqual(['SUPER_ADMIN']);
  });

  it('Discounts has no role restriction', () => {
    const discounts = navigation.find((n) => n.name === 'Discounts');
    expect(discounts).toBeDefined();
    expect(discounts!.roles).toBeUndefined();
  });

  it('Transactions has no role restriction', () => {
    const tx = navigation.find((n) => n.name === 'Transactions');
    expect(tx).toBeDefined();
    expect(tx!.roles).toBeUndefined();
  });

  it('Audit Log requires SUPER_ADMIN', () => {
    const audit = navigation.find((n) => n.name === 'Audit Log');
    expect(audit).toBeDefined();
    expect(audit!.roles).toEqual(['SUPER_ADMIN']);
  });

  it('Roles requires SUPER_ADMIN', () => {
    const roles = navigation.find((n) => n.name === 'Roles');
    expect(roles).toBeDefined();
    expect(roles!.roles).toEqual(['SUPER_ADMIN']);
  });

  it('every nav item has icon and href', () => {
    navigation.forEach((item) => {
      expect(item.icon).toBeDefined();
      expect(item.href).toBeTruthy();
    });
  });
});

describe('pageTitles', () => {
  it('has title for all main routes', () => {
    expect(pageTitles['/dashboard']).toBe('Dashboard');
    expect(pageTitles['/users']).toBe('Users');
    expect(pageTitles['/stores']).toBe('Stores');
    expect(pageTitles['/discounts']).toBe('Discounts');
    expect(pageTitles['/transactions']).toBe('Transactions');
    expect(pageTitles['/audit']).toBe('Audit Log');
    expect(pageTitles['/roles']).toBe('Roles & Permissions');
    expect(pageTitles['/settings']).toBe('Settings');
  });

  it('has 8 entries', () => {
    expect(Object.keys(pageTitles)).toHaveLength(8);
  });
});
