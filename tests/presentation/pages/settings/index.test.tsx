import { render, screen } from '@testing-library/react';

const mockUseSettings = vi.hoisted(() => vi.fn());
vi.mock('@/presentation/pages/settings/useSettings', () => ({
  useSettings: mockUseSettings,
}));

import { SettingsPage } from '@/presentation/pages/settings';

describe('SettingsPage', () => {
  const baseState = {
    isAdmin: false,
    name: 'John',
    email: 'john@test.com',
    setEmail: vi.fn(),
    savingProfile: false,
    handleProfileSave: vi.fn((e: any) => e?.preventDefault?.()),
    currentPassword: '',
    setCurrentPassword: vi.fn(),
    newPassword: '',
    setNewPassword: vi.fn(),
    confirmPassword: '',
    setConfirmPassword: vi.fn(),
    savingPassword: false,
    handlePasswordChange: vi.fn((e: any) => e?.preventDefault?.()),
    loadingConfig: false,
    capType: 'PERCENTAGE',
    setCapType: vi.fn(),
    maxCap: '25',
    setMaxCap: vi.fn(),
    currency: 'CLP',
    setCurrency: vi.fn(),
    roundingRule: 'ROUND_HALF_UP',
    setRoundingRule: vi.fn(),
    priorities: [],
    savingConfig: false,
    movePriority: vi.fn(),
    handleSaveConfig: vi.fn(),
  };

  it('renders page header', () => {
    mockUseSettings.mockReturnValue(baseState);
    render(<SettingsPage />);
    expect(screen.getByText('Profile Settings')).toBeInTheDocument();
  });

  it('renders profile form', () => {
    mockUseSettings.mockReturnValue(baseState);
    render(<SettingsPage />);
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
  });

  it('renders password form', () => {
    mockUseSettings.mockReturnValue(baseState);
    render(<SettingsPage />);
    expect(screen.getByRole('heading', { name: /Change Password/ })).toBeInTheDocument();
  });

  it('does not render discount config for non-admin', () => {
    mockUseSettings.mockReturnValue(baseState);
    render(<SettingsPage />);
    expect(screen.queryByText('Cap Type')).not.toBeInTheDocument();
  });

  it('renders discount config for admin', () => {
    mockUseSettings.mockReturnValue({ ...baseState, isAdmin: true });
    render(<SettingsPage />);
    expect(screen.getByText('Cap Type')).toBeInTheDocument();
  });
});
