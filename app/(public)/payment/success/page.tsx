"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="max-w-md w-full text-center border border-neutral-800 p-8">
        
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <CheckCircle className="text-green-500" size={48} />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold mb-2">
          Payment Successful
        </h1>

        {/* Subtitle */}
        <p className="text-neutral-400 text-sm mb-4">
          Your order has been placed successfully.
        </p>

        {/* Order ID */}
        {orderId && (
          <p className="text-xs text-neutral-500 mb-6">
            Order ID:{" "}
            <span className="text-white font-medium">
              {orderId.slice(0, 8).toUpperCase()}
            </span>
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href={`/orders/${orderId}`}
            className="bg-white text-black py-2 text-sm font-medium hover:bg-neutral-200 transition"
          >
            View Order
          </Link>

          <Link
            href="/shop"
            className="border border-neutral-700 py-2 text-sm hover:border-neutral-400 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}