import { cn } from '@/lib/utils';

interface PaginationFooterProps {
  page: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

export function PaginationFooter({
  page,
  pageSize,
  totalPages,
  totalElements,
  onPageChange,
  maxVisiblePages = 5,
}: PaginationFooterProps) {
  if (totalPages <= 1) return null;

  const start = page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, totalElements);

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800">
      <p className="text-sm text-slate-500">
        Showing <span className="font-medium">{start}</span> to{' '}
        <span className="font-medium">{end}</span> of{' '}
        <span className="font-medium">{totalElements}</span> results
      </p>
      <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
        <button
          onClick={() => onPageChange(Math.max(0, page - 1))}
          disabled={page === 0}
          className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 text-sm"
        >
          &lt;
        </button>
        {Array.from({ length: Math.min(totalPages, maxVisiblePages) }).map((_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={cn(
              'relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset',
              page === i
                ? 'z-10 bg-indigo-600 text-white ring-indigo-600'
                : 'text-slate-900 dark:text-slate-300 ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800',
            )}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
          disabled={page >= totalPages - 1}
          className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 text-sm"
        >
          &gt;
        </button>
      </nav>
    </div>
  );
}
