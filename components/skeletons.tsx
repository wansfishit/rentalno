export function CarCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-pulse">
      <div className="aspect-[16/9] bg-slate-200 dark:bg-slate-800" />
      <div className="p-4">
        <div className="mb-3 space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-lg" />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="animate-pulse">
      {[...Array(cols)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-16" />
      </div>
      <div className="h-7 bg-slate-200 dark:bg-slate-700 rounded w-24 mb-2" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32" />
    </div>
  );
}
