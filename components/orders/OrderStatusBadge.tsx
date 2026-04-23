import type { OrderStatus } from '@/types/index';
import { cn } from '@/lib/utils';

const styles: Record<OrderStatus, string> = {
  pending:    'bg-yellow-50 text-yellow-700 border border-yellow-200',
  confirmed:  'bg-blue-50 text-blue-700 border border-blue-200',
  processing: 'bg-purple-50 text-purple-700 border border-purple-200',
  shipped:    'bg-indigo-50 text-indigo-700 border border-indigo-200',
  delivered:  'bg-green-50 text-green-700 border border-green-200',
  cancelled:  'bg-red-50 text-red-700 border border-red-200',
  refunded:   'bg-neutral-100 text-neutral-600 border border-neutral-200',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={cn('text-xs font-medium tracking-wide px-2.5 py-1 uppercase', styles[status])}>
      {status}
    </span>
  );
}