import { ShoppingBag } from 'lucide-react';
import { Button } from './Button';
import Link from 'next/link';

export function EmptyState({
  title, description, action, actionHref,
}: {
  title: string; description: string; action?: string; actionHref?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <ShoppingBag size={48} className="text-neutral-300" />
      <div>
        <p className="text-lg font-semibold text-neutral-800">{title}</p>
        <p className="text-sm text-neutral-500 mt-1">{description}</p>
      </div>
      {action && actionHref && (
        <Link href={actionHref}>
          <Button variant="primary" size="md">{action}</Button>
        </Link>
      )}
    </div>
  );
}