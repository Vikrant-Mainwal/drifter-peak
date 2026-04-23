'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function PaymentFailurePage() {
  const params  = useSearchParams();
  const router  = useRouter();
  const orderId = params.get('order_id');

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-red-50 border-2 border-red-200 flex items-center justify-center">
          <XCircle size={40} className="text-red-500" />
        </div>
      </div>

      <h1 className="text-3xl font-bold text-neutral-900 mb-2">Payment Failed</h1>
      <p className="text-neutral-500 mb-2">
        Your payment could not be processed. No money has been deducted.
      </p>
      {orderId && (
        <p className="text-xs text-neutral-400 font-mono mb-8">
          Ref: #{orderId.slice(0, 8).toUpperCase()}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          onClick={() => router.push('/checkout')}
          variant="primary" size="lg"
          className="flex items-center gap-2 justify-center"
        >
          <RefreshCw size={16} /> Retry Payment
        </Button>
        <Button onClick={() => router.push('/shop')} variant="outline" size="lg">
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}