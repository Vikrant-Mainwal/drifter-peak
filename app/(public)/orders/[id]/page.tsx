"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, MapPin } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { PageSpinner } from "@/components/ui/Spinner";
import {
  OrderStatusBadge,
  CancelOrderButton,
  getOrderById,
  type Order,
} from "@/features/order";
import { PLACEHOLDER_IMAGE } from "@/lib/utils";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(id)
      .then((data) => {
        if (!data) {
          router.replace("/orders");
          return;
        }
        setOrder(data);
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) return <PageSpinner />;
  if (!order) return null;

  const date = new Date(order.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <button
        onClick={() => router.push("/orders")}
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-800 mb-8"
      >
        <ArrowLeft size={14} /> All Orders
      </button>

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
            Order
          </p>
          <p className="text-xl font-bold font-mono text-neutral-900">
            {order.order_number}
          </p>
          <p className="text-sm text-neutral-500 mt-1">{date}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="mb-8">
        <CancelOrderButton order={order} onCancelled={setOrder} />
      </div>

      <div className="space-y-5">
        {/* Items */}
        <Card>
          <h2 className="text-base font-semibold text-neutral-900 mb-4">
            Items ({order.order_items?.length ?? 0})
          </h2>
          <div className="space-y-4">
            {order.order_items?.map((item) => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="relative w-16 h-20 bg-neutral-100 flex-shrink-0 overflow-hidden">
                  <Image
                    src={item.thumbnail_url || PLACEHOLDER_IMAGE}
                    alt={item.product_name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-900">
                    {item.product_name}
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Size: {item.size}
                    {item.color ? ` · ${item.color}` : ""} · Qty:{" "}
                    {item.quantity}
                  </p>
                  <p className="text-sm font-semibold text-neutral-900 mt-1">
                    {fmt(item.line_total)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Price breakdown */}
        <Card>
          <h2 className="text-base font-semibold text-neutral-900 mb-4">
            Payment Summary
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span>{fmt(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Shipping</span>
              <span>
                {order.shipping_fee === 0 ? "FREE" : fmt(order.shipping_fee)}
              </span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-neutral-600">
                <span>Discount</span>
                <span>-{fmt(order.discount_amount)}</span>
              </div>
            )}
            <div className="border-t border-neutral-100 pt-2 flex justify-between font-semibold text-neutral-900">
              <span>Total</span>
              <span>{fmt(order.total_amount)}</span>
            </div>
          </div>
          {order.razorpay_payment_id && (
            <div className="mt-4 pt-4 border-t border-neutral-100">
              <p className="text-xs text-neutral-500 uppercase tracking-wide mb-2">
                Payment Info
              </p>
              <div className="text-xs text-neutral-600 space-y-1">
                <p>
                  Status:{" "}
                  <span
                    className={`font-medium ${order.paid_at ? "text-green-600" : "text-red-600"}`}
                  >
                    {order.paid_at ? "PAID" : "PENDING"}
                  </span>
                </p>
                <p className="font-mono">Ref: {order.razorpay_payment_id}</p>
              </div>
            </div>
          )}
        </Card>

        {/* Address — a snapshot taken at order time, not a live address */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={14} className="text-neutral-500" />
            <h2 className="text-base font-semibold text-neutral-900">
              Delivered To
            </h2>
          </div>
          <div className="text-sm text-neutral-700 space-y-1">
            <p className="font-medium">{order.shipping_name}</p>
            <p>
              {order.shipping_house_number}, {order.shipping_address_line},{" "}
              {order.shipping_locality}
            </p>
            <p>
              {order.shipping_city}, {order.shipping_state} —{" "}
              {order.shipping_pincode}
            </p>
            <p className="text-neutral-500">{order.shipping_phone}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
