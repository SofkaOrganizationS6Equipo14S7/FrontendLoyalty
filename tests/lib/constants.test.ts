import { DATE_FORMAT, DATETIME_FORMAT, DATETIME_FULL_FORMAT } from '@/lib/constants';

describe('constants', () => {
  it('exports DATE_FORMAT', () => {
    expect(DATE_FORMAT).toBe('yyyy-MM-dd');
  });

  it('exports DATETIME_FORMAT', () => {
    expect(DATETIME_FORMAT).toBe('yyyy-MM-dd HH:mm');
  });

  it('exports DATETIME_FULL_FORMAT', () => {
    expect(DATETIME_FULL_FORMAT).toBe('yyyy-MM-dd HH:mm:ss');
  });
});
