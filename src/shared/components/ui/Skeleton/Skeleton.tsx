import { cn } from '../../../utils/cn';

export function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div aria-hidden className={cn('rounded-md animate-shimmer', className)}
      style={{ background:'linear-gradient(90deg,#E2E8F0 25%,#F1F5F9 50%,#E2E8F0 75%)', backgroundSize:'800px 100%', ...style }} />
  );
}

export function SkeletonText({ lines = 1, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-4" style={{ width: i === lines - 1 && lines > 1 ? '70%' : '100%' }} />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('p-5 rounded-xl border border-border bg-surface flex flex-col gap-3', className)}>
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
        <div className="flex-1"><Skeleton className="h-4 w-3/4 mb-1.5" /><Skeleton className="h-3 w-1/2" /></div>
      </div>
      <Skeleton className="h-3 w-full" /><Skeleton className="h-3 w-5/6" />
    </div>
  );
}

export function SkeletonTable({ rows = 8, cols = 5, className }: { rows?: number; cols?: number; className?: string }) {
  return (
    <div className={cn('rounded-xl border border-border overflow-hidden', className)}>
      <div className="bg-surface-secondary px-4 py-3 flex gap-4 border-b border-border">
        {Array.from({ length: cols }).map((_, i) => <Skeleton key={i} className="h-3.5" style={{ flex: i === 0 ? 0.5 : 1 }} />)}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-4 py-3.5 flex gap-4 border-b border-border last:border-0">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className="h-4" style={{ flex: j === 0 ? 0.5 : 1, opacity: 1 - i * 0.08 }} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ModuleLoader() {
  return (
    <div role="status" aria-label="Loading module…" className="p-6 max-w-4xl mx-auto space-y-4">
      <Skeleton className="h-7 w-48" />
      {[0,1,2].map(i => (
        <div key={i} className="grid grid-cols-2 gap-4">
          {[0,1].map(j => (
            <div key={j} className="space-y-2">
              <Skeleton className="h-3.5 w-1/3" /><Skeleton className="h-9 rounded-lg" />
            </div>
          ))}
        </div>
      ))}
      <div className="flex gap-3 pt-2"><Skeleton className="h-10 w-28 rounded-lg" /><Skeleton className="h-10 w-20 rounded-lg" /></div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
