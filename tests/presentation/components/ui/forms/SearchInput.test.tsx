import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchInput } from '@/presentation/components/ui/forms/SearchInput';

describe('SearchInput', () => {
  it('renders input with default placeholder', () => {
    render(<SearchInput value="" onChange={() => {}} />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('renders custom placeholder', () => {
    render(<SearchInput value="" onChange={() => {}} placeholder="Find users..." />);
    expect(screen.getByPlaceholderText('Find users...')).toBeInTheDocument();
  });

  it('displays the current value', () => {
    render(<SearchInput value="test" onChange={() => {}} />);
    expect(screen.getByDisplayValue('test')).toBeInTheDocument();
  });

  it('calls onChange when typing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchInput value="" onChange={onChange} />);
    await user.type(screen.getByPlaceholderText('Search...'), 'a');
    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('calls onSubmit on form submit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<SearchInput value="query" onChange={() => {}} onSubmit={onSubmit} />);
    const input = screen.getByPlaceholderText('Search...');
    await user.type(input, '{Enter}');
    expect(onSubmit).toHaveBeenCalled();
  });

  it('does not crash without onSubmit', async () => {
    const user = userEvent.setup();
    render(<SearchInput value="" onChange={() => {}} />);
    const input = screen.getByPlaceholderText('Search...');
    await user.type(input, '{Enter}');
  });

  it('applies custom className', () => {
    const { container } = render(<SearchInput value="" onChange={() => {}} className="my-class" />);
    expect(container.querySelector('form')?.className).toContain('my-class');
  });
});
