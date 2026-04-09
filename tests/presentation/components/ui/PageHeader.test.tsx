import { render, screen } from '@testing-library/react';
import { PageHeader } from '@/presentation/components/ui/PageHeader';

describe('PageHeader', () => {
  it('renders title', () => {
    render(<PageHeader title="Users" />);
    expect(screen.getByText('Users')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<PageHeader title="Users" description="Manage users" />);
    expect(screen.getByText('Manage users')).toBeInTheDocument();
  });

  it('renders actions when provided', () => {
    render(<PageHeader title="Test" actions={<button>Add</button>} />);
    expect(screen.getByText('Add')).toBeInTheDocument();
  });
});
