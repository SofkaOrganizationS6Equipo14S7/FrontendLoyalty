import { render, screen } from '@testing-library/react';
import { LoginBranding } from '@/presentation/pages/login/LoginBranding';

describe('LoginBranding', () => {
  it('renders app name', () => {
    render(<LoginBranding />);
    expect(screen.getByText('LoyaltyEngine')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<LoginBranding />);
    expect(screen.getByText('Discount Engine Platform')).toBeInTheDocument();
  });
});
