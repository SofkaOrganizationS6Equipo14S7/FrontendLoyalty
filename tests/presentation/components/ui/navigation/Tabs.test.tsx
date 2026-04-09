import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs, TabPanels, useTabState } from '@/presentation/components/ui/navigation/Tabs';
import { renderHook, act } from '@testing-library/react';

describe('Tabs', () => {
  const tabs = [
    { key: 'a', label: 'Tab A' },
    { key: 'b', label: 'Tab B' },
  ];

  describe('underline variant (default)', () => {
    it('renders all tabs', () => {
      render(<Tabs tabs={tabs} activeTab="a" onChange={() => {}} />);
      expect(screen.getByText('Tab A')).toBeInTheDocument();
      expect(screen.getByText('Tab B')).toBeInTheDocument();
    });

    it('applies active styles to selected tab', () => {
      render(<Tabs tabs={tabs} activeTab="a" onChange={() => {}} />);
      expect(screen.getByText('Tab A').className).toContain('border-indigo-600');
    });

    it('applies inactive styles to unselected tab', () => {
      render(<Tabs tabs={tabs} activeTab="a" onChange={() => {}} />);
      expect(screen.getByText('Tab B').className).toContain('border-transparent');
    });

    it('calls onChange when clicking a tab', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Tabs tabs={tabs} activeTab="a" onChange={onChange} />);
      await user.click(screen.getByText('Tab B'));
      expect(onChange).toHaveBeenCalledWith('b');
    });
  });

  describe('pill variant', () => {
    it('renders pill-styled tabs', () => {
      render(<Tabs tabs={tabs} activeTab="a" onChange={() => {}} variant="pill" />);
      expect(screen.getByText('Tab A')).toBeInTheDocument();
      expect(screen.getByText('Tab B')).toBeInTheDocument();
    });

    it('applies active pill styles', () => {
      render(<Tabs tabs={tabs} activeTab="a" onChange={() => {}} variant="pill" />);
      expect(screen.getByText('Tab A').className).toContain('bg-white');
    });

    it('calls onChange on pill tab click', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Tabs tabs={tabs} activeTab="a" onChange={onChange} variant="pill" />);
      await user.click(screen.getByText('Tab B'));
      expect(onChange).toHaveBeenCalledWith('b');
    });
  });

  it('renders tab icons', () => {
    const tabsWithIcon = [{ key: 'a', label: 'Tab A', icon: <span data-testid="icon">★</span> }];
    render(<Tabs tabs={tabsWithIcon} activeTab="a" onChange={() => {}} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Tabs tabs={tabs} activeTab="a" onChange={() => {}} className="custom" />);
    expect(container.firstChild).toHaveClass('custom');
  });
});

describe('TabPanels', () => {
  it('renders the active panel content', () => {
    render(
      <TabPanels activeTab="a">
        {{ a: <div>Panel A</div>, b: <div>Panel B</div> }}
      </TabPanels>
    );
    expect(screen.getByText('Panel A')).toBeInTheDocument();
    expect(screen.queryByText('Panel B')).toBeNull();
  });

  it('switches panel when activeTab changes', () => {
    const { rerender } = render(
      <TabPanels activeTab="a">
        {{ a: <div>Panel A</div>, b: <div>Panel B</div> }}
      </TabPanels>
    );
    rerender(
      <TabPanels activeTab="b">
        {{ a: <div>Panel A</div>, b: <div>Panel B</div> }}
      </TabPanels>
    );
    expect(screen.getByText('Panel B')).toBeInTheDocument();
    expect(screen.queryByText('Panel A')).toBeNull();
  });
});

describe('useTabState', () => {
  it('initializes with default tab', () => {
    const { result } = renderHook(() => useTabState('first'));
    expect(result.current.activeTab).toBe('first');
  });

  it('updates active tab', () => {
    const { result } = renderHook(() => useTabState('first'));
    act(() => result.current.setActiveTab('second'));
    expect(result.current.activeTab).toBe('second');
  });
});
