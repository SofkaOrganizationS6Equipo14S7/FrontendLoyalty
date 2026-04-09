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
        <span className="text-sm text-slate-400">{totalElements} entries</span>
      </div>
    </div>
  );
}
