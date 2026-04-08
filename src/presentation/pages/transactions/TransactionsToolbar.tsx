import { Filter } from 'lucide-react';
import { SearchInput } from '@/presentation/components/ui';

interface TransactionsToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  totalElements: number;
}

export function TransactionsToolbar({
  searchQuery,
  onSearchChange,
  onSearch,
  totalElements,
}: TransactionsToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-slate-100 dark:border-slate-800">
      <SearchInput
        value={searchQuery}
        onChange={onSearchChange}
        onSubmit={onSearch}
        placeholder="Search by Order ID..."
        className="w-full sm:max-w-sm"
      />
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <Filter className="h-4 w-4" /> Filters
        </button>
        <span className="text-sm text-slate-400">{totalElements} entries</span>
      </div>
    </div>
  );
}
