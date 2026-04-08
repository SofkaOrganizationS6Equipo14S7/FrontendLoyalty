interface TableLoadingProps {
  rows?: number;
  rowHeight?: string;
}

export function TableLoading({ rows = 5, rowHeight = 'h-12' }: TableLoadingProps) {
  return (
    <div className="animate-pulse space-y-2 p-6">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={`${rowHeight} bg-slate-100 dark:bg-slate-800 rounded`} />
      ))}
    </div>
  );
}
