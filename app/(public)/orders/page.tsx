'use client';
import { useEffect, useState } from 'react';
import { Package } from 'lucide-react';
import { OrderCard } from '@/components/orders/OrderCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageSpinner } from '@/components/ui/Spinner';
import { getOrders } from '@/lib/supabase/queries/orders';
import type { Order } from '@/types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders().then(setOrders).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageSpinner />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Package size={20} className="text-neutral-700" />
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Your Orders</h1>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="Your orders will appear here after you make a purchase"
          action="Start Shopping"
          actionHref="/shop"
        />
      ) : (
        <div className="space-y-4">
          {orders.map(order => <OrderCard key={order.id} order={order} />)}
        </div>
      )}
    </div>
  );
}