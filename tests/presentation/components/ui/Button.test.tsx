import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/presentation/components/ui/Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await userEvent.click(screen.getByText('Click'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled').closest('button')).toBeDisabled();
  });

  it('is disabled when isLoading is true', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByText('Loading').closest('button')).toBeDisabled();
  });

  it('shows loading spinner when isLoading', () => {
    render(<Button isLoading>Loading</Button>);
    const button = screen.getByText('Loading').closest('button');
    expect(button?.querySelector('svg')).toBeInTheDocument();
  });

  it('renders with default variant', () => {
    render(<Button>Default</Button>);
    const btn = screen.getByText('Default').closest('button');
    expect(btn?.className).toContain('indigo');
  });

  it('renders with destructive variant', () => {
    render(<Button variant="destructive">Delete</Button>);
    const btn = screen.getByText('Delete').closest('button');
    expect(btn?.className).toContain('red');
  });

  it('renders with outline variant', () => {
    render(<Button variant="outline">Outline</Button>);
    const btn = screen.getByText('Outline').closest('button');
    expect(btn?.className).toContain('border');
  });

  it('renders with ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByText('Ghost')).toBeInTheDocument();
  });

  it('renders with sm size', () => {
    render(<Button size="sm">Small</Button>);
    const btn = screen.getByText('Small').closest('button');
    expect(btn?.className).toContain('h-8');
  });

  it('renders with lg size', () => {
    render(<Button size="lg">Large</Button>);
    const btn = screen.getByText('Large').closest('button');
    expect(btn?.className).toContain('h-10');
  });

  it('applies custom className', () => {
    render(<Button className="my-custom">Custom</Button>);
    const btn = screen.getByText('Custom').closest('button');
    expect(btn?.className).toContain('my-custom');
  });

  it('has displayName', () => {
    expect(Button.displayName).toBe('Button');
  });
});
