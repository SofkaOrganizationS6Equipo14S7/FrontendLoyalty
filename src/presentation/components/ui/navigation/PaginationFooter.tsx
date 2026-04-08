import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationFooterProps {
  page: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

function getPageNumbers(page: number, totalPages: number, maxVisible: number): (number | 'ellipsis')[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  const pages: (number | 'ellipsis')[] = [];
  const sideCount = Math.floor((maxVisible - 3) / 2); // -3 for first, last, and current

  pages.push(0);

  let start = Math.max(1, page - sideCount);
  let end = Math.min(totalPages - 2, page + sideCount);

  // Adjust if near the beginning
  if (page < sideCount + 2) {
    end = Math.min(totalPages - 2, maxVisible - 2);
  }
  // Adjust if near the end
  if (page > totalPages - sideCount - 3) {
    start = Math.max(1, totalPages - maxVisible + 1);
  }

  if (start > 1) pages.push('ellipsis');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages - 2) pages.push('ellipsis');

  pages.push(totalPages - 1);

  return pages;
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
  const pageNumbers = getPageNumbers(page, totalPages, maxVisiblePages);

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800">
      <p className="text-sm text-slate-500">
        Showing <span className="font-medium">{start}</span> to{' '}
        <span className="font-medium">{end}</span> of{' '}
        <span className="font-medium">{totalElements}</span> results
      </p>
      <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
        <button
          onClick={() => onPageChange(Math.max(0, page - 1))}
          disabled={page === 0}
          aria-label="Previous page"
          className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 text-sm"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pageNumbers.map((item, idx) =>
          item === 'ellipsis' ? (
            <span
              key={`ellipsis-${idx}`}
              className="relative inline-flex items-center px-3 py-2 text-sm text-slate-500 ring-1 ring-inset ring-slate-300 dark:ring-slate-700"
            >
              &hellip;
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onPageChange(item)}
              aria-current={page === item ? 'page' : undefined}
              className={cn(
                'relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset',
                page === item
                  ? 'z-10 bg-indigo-600 text-white ring-indigo-600'
                  : 'text-slate-900 dark:text-slate-300 ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800',
              )}
            >
              {item + 1}
            </button>
          ),
        )}
        <button
          onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
          disabled={page >= totalPages - 1}
          aria-label="Next page"
          className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 text-sm"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>
    </div>
  );
}
