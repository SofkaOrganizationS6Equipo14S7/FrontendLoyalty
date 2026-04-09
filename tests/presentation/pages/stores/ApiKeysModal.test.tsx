import { render, screen } from '@testing-library/react';
import { ApiKeysModal } from '@/presentation/pages/stores/ApiKeysModal';
import type { EcommerceResponse, ApiKeyResponse } from '@/domain/types';

vi.mock('date-fns', () => ({ format: () => '2024-01-15 10:30' }));

const ecommerce = { uid: 'e1', name: 'My Store' } as EcommerceResponse;
const apiKey: ApiKeyResponse = { keyId: 'k1', prefix: 'abc123', createdAt: '2024-01-15' } as ApiKeyResponse;

describe('ApiKeysModal', () => {
  const base = {
    ecommerce,
    apiKeys: [],
    onClose: vi.fn(),
    onCreateKey: vi.fn().mockResolvedValue(undefined),
    onDeleteKey: vi.fn().mockResolvedValue(undefined),
    newKey: null,
  };

  it('renders title with store name', () => {
    render(<ApiKeysModal {...base} />);
    expect(screen.getByText(/API Keys — My Store/)).toBeInTheDocument();
  });

  it('renders Generate API Key button', () => {
    render(<ApiKeysModal {...base} />);
    expect(screen.getByText('Generate API Key')).toBeInTheDocument();
  });

  it('renders empty state when no keys', () => {
    render(<ApiKeysModal {...base} />);
    expect(screen.getByText(/No API Keys/)).toBeInTheDocument();
  });

  it('renders API key list', () => {
    render(<ApiKeysModal {...base} apiKeys={[apiKey]} />);
    expect(screen.getByText(/\*\*\*\*abc123/)).toBeInTheDocument();
  });

  it('renders new key warning when newKey exists', () => {
    render(<ApiKeysModal {...base} newKey={{ key: 'secret-key-123' } as any} />);
    expect(screen.getByText(/Save this key/)).toBeInTheDocument();
    expect(screen.getByText('secret-key-123')).toBeInTheDocument();
  });

  it('does not open when ecommerce is null', () => {
    render(<ApiKeysModal {...base} ecommerce={null} />);
    expect(screen.queryByText('Generate API Key')).not.toBeInTheDocument();
  });

  it('calls onCreateKey when Generate clicked', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    const onCreateKey = vi.fn().mockResolvedValue(undefined);
    render(<ApiKeysModal {...base} onCreateKey={onCreateKey} />);
    await user.click(screen.getByText('Generate API Key'));
    expect(onCreateKey).toHaveBeenCalled();
  });

  it('copies new key to clipboard', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      writable: true,
      configurable: true,
    });
    render(<ApiKeysModal {...base} newKey={{ key: 'secret-key' } as any} />);
    // The copy button is the icon button right after the code element with the key
    const codeEl = screen.getByText('secret-key');
    const copyBtn = codeEl.parentElement?.querySelector('button');
    if (copyBtn) await user.click(copyBtn);
    expect(writeText).toHaveBeenCalledWith('secret-key');
  });

  it('opens delete confirmation on trash click', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    render(<ApiKeysModal {...base} apiKeys={[apiKey]} />);
    const btns = screen.getAllByRole('button');
    // The trash button is the icon button that does NOT contain text "Generate API Key"
    const trashBtn = btns.find(b => b.querySelector('.lucide-trash-2'));
    if (trashBtn) await user.click(trashBtn);
    expect(screen.getByText('Delete API Key')).toBeInTheDocument();
  });
});
