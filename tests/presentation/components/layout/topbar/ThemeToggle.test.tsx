import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from '@/presentation/components/layout/topbar/ThemeToggle';

let mockTheme = 'light';
const mockSetTheme = vi.fn();

vi.mock('@/infrastructure/store', () => ({
  useThemeStore: vi.fn(() => ({ theme: mockTheme, setTheme: mockSetTheme })),
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTheme = 'light';
  });

  it('renders toggle button', () => {
    render(<ThemeToggle />);
    expect(screen.getByText('Toggle dark mode')).toBeInTheDocument();
  });

  it('calls setTheme with dark when current is light', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    await user.click(screen.getByRole('button'));
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });
});
