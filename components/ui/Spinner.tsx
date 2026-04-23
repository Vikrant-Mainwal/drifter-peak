import { cn } from '@/lib/utils';

export function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn('w-5 h-5 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin', className)} />
  );
}

export function PageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner className="w-8 h-8" />
    </div>
  );
}