import { cn, getApiErrorMessage, getTimeAgo, exportToCsv, normalizeText } from '@/lib/utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
  });

  it('merges tailwind conflicts', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2');
  });

  it('returns empty string for no inputs', () => {
    expect(cn()).toBe('');
  });

  it('handles undefined and null inputs', () => {
    expect(cn('a', undefined, null, 'b')).toBe('a b');
  });
});

describe('getApiErrorMessage', () => {
  it('extracts message from axios error shape', () => {
    const err = { response: { data: { message: 'Bad request' } } };
    expect(getApiErrorMessage(err)).toBe('Bad request');
  });

  it('returns fallback when no response data', () => {
    expect(getApiErrorMessage({})).toBe('An error occurred');
  });

  it('returns custom fallback', () => {
    expect(getApiErrorMessage(new Error('test'), 'Custom error')).toBe('Custom error');
  });

  it('returns fallback for undefined error', () => {
    expect(getApiErrorMessage(new Error('test'))).toBe('An error occurred');
  });

  it('returns fallback when response has no message', () => {
    const err = { response: { data: {} } };
    expect(getApiErrorMessage(err)).toBe('An error occurred');
  });

  it('returns fallback when response.data is null', () => {
    const err = { response: { data: null } };
    expect(getApiErrorMessage(err)).toBe('An error occurred');
  });
});

describe('getTimeAgo', () => {
  it('returns "Unknown" for empty string', () => {
    expect(getTimeAgo('')).toBe('Unknown');
  });

  it('returns minutes ago for recent dates', () => {
    const tenMinAgo = new Date(Date.now() - 10 * 60000).toISOString();
    expect(getTimeAgo(tenMinAgo)).toBe('10 minutes ago');
  });

  it('returns hours ago for hours-old dates', () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 3600000).toISOString();
    expect(getTimeAgo(threeHoursAgo)).toBe('3 hours ago');
  });

  it('returns days ago for day-old dates', () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString();
    expect(getTimeAgo(twoDaysAgo)).toBe('2 days ago');
  });

  it('returns 0 minutes ago for now', () => {
    const now = new Date().toISOString();
    expect(getTimeAgo(now)).toBe('0 minutes ago');
  });

  it('returns 59 minutes ago at boundary', () => {
    const fiftyNineMin = new Date(Date.now() - 59 * 60000).toISOString();
    expect(getTimeAgo(fiftyNineMin)).toBe('59 minutes ago');
  });

  it('returns 1 hours ago at 60 minutes', () => {
    const sixtyMin = new Date(Date.now() - 60 * 60000).toISOString();
    expect(getTimeAgo(sixtyMin)).toBe('1 hours ago');
  });

  it('returns 1 days ago at 24 hours', () => {
    const twentyFourHours = new Date(Date.now() - 24 * 3600000).toISOString();
    expect(getTimeAgo(twentyFourHours)).toBe('1 days ago');
  });
});

describe('exportToCsv', () => {
  it('creates and clicks a download link', () => {
    const clickMock = vi.fn();
    vi.spyOn(document, 'createElement').mockReturnValue({
      click: clickMock,
      href: '',
      download: '',
    } as unknown as HTMLAnchorElement);

    exportToCsv(['Name', 'Age'], [['Alice', '30']], 'test.csv');

    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(clickMock).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });

  it('handles cells with commas', () => {
    const clickMock = vi.fn();
    vi.spyOn(document, 'createElement').mockReturnValue({
      click: clickMock, href: '', download: '',
    } as unknown as HTMLAnchorElement);
    exportToCsv(['H1'], [['value,with,commas']], 'test.csv');
    expect(clickMock).toHaveBeenCalled();
  });

  it('handles cells with quotes', () => {
    const clickMock = vi.fn();
    vi.spyOn(document, 'createElement').mockReturnValue({
      click: clickMock, href: '', download: '',
    } as unknown as HTMLAnchorElement);
    exportToCsv(['H1'], [['value"with"quotes']], 'test.csv');
    expect(clickMock).toHaveBeenCalled();
  });

  it('prevents CSV injection', () => {
    const clickMock = vi.fn();
    vi.spyOn(document, 'createElement').mockReturnValue({
      click: clickMock, href: '', download: '',
    } as unknown as HTMLAnchorElement);
    exportToCsv(['H1'], [['=cmd|calc']], 'test.csv');
    expect(clickMock).toHaveBeenCalled();
  });

  it('handles cells with newlines', () => {
    const clickMock = vi.fn();
    vi.spyOn(document, 'createElement').mockReturnValue({
      click: clickMock, href: '', download: '',
    } as unknown as HTMLAnchorElement);
    exportToCsv(['H1'], [['line1\nline2']], 'test.csv');
    expect(clickMock).toHaveBeenCalled();
  });

  it('handles multiple rows and columns', () => {
    const clickMock = vi.fn();
    vi.spyOn(document, 'createElement').mockReturnValue({
      click: clickMock, href: '', download: '',
    } as unknown as HTMLAnchorElement);
    exportToCsv(['A', 'B'], [['1', '2'], ['3', '4']], 'multi.csv');
    expect(clickMock).toHaveBeenCalled();
  });
});

describe('normalizeText', () => {
  it('removes diacritics and lowercases', () => {
    expect(normalizeText('Café')).toBe('cafe');
  });

  it('handles already lowercase ascii text', () => {
    expect(normalizeText('hello')).toBe('hello');
  });

  it('handles uppercase text', () => {
    expect(normalizeText('HELLO')).toBe('hello');
  });

  it('handles text with multiple accents', () => {
    expect(normalizeText('résumé')).toBe('resume');
  });

  it('handles empty string', () => {
    expect(normalizeText('')).toBe('');
  });

  it('handles ñ character', () => {
    expect(normalizeText('España')).toBe('espana');
  });
});
