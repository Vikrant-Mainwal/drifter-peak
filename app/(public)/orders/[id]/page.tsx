"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, MapPin } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { PageSpinner } from "@/components/ui/Spinner";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { getOrderById } from "@/lib/supabase/queries/orders";
import type { Order } from "@/types";

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
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

  const getImageUrl = (img: any): string => {
    if (!img) return "/placeholder.png"; // fallback

    try {
      // If already array
      if (Array.isArray(img)) return img[0];

      // If stringified array
      if (typeof img === "string" && img.startsWith("[")) {
        const parsed = JSON.parse(img);
        return Array.isArray(parsed) ? parsed[0] : img;
      }

      // Normal string
      return img;
    } catch {
      return "/placeholder.png";
    }
  };

  if (loading) return <PageSpinner />;
  if (!order) return null;

  const date = new Date(order.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const payment = order.payments?.[0];
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
            #{order.id.slice(0, 8).toUpperCase()}
          </p>
          <p className="text-sm text-neutral-500 mt-1">{date}</p>
        </div>
        <OrderStatusBadge status={order.status} />
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
                    src={getImageUrl(item.product_image)}
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
                    Size: {item.size} · Qty: {item.quantity}
                  </p>
                  <p className="text-sm font-semibold text-neutral-900 mt-1">
                    {fmt(item.price * item.quantity)}
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
              <span>{order.shipping === 0 ? "FREE" : fmt(order.shipping)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>GST (18%)</span>
              <span>{fmt(order.tax)}</span>
            </div>
            <div className="border-t border-neutral-100 pt-2 flex justify-between font-semibold text-neutral-900">
              <span>Total</span>
              <span>{fmt(order.total)}</span>
            </div>
          </div>
          {payment && (
            <div className="mt-4 pt-4 border-t border-neutral-100">
              <p className="text-xs text-neutral-500 uppercase tracking-wide mb-2">
                Payment Info
              </p>
              <div className="text-xs text-neutral-600 space-y-1">
                <p>
                  Status:{" "}
                  <span
                    className={`font-medium ${payment.status === "success" ? "text-green-600" : "text-red-600"}`}
                  >
                    {payment.status.toUpperCase()}
                  </span>
                </p>
                {payment.razorpay_payment_id && (
                  <p className="font-mono">
                    Ref: {payment.razorpay_payment_id}
                  </p>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Address */}
        {order.address && (
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={14} className="text-neutral-500" />
              <h2 className="text-base font-semibold text-neutral-900">
                Delivered To
              </h2>
            </div>
            <div className="text-sm text-neutral-700 space-y-1">
              <p className="font-medium">{order.address.full_name}</p>
              <p>
                {order.address.line1}
                {order.address.line2 && `, ${order.address.line2}`}
              </p>
              <p>
                {order.address.city}, {order.address.state} —{" "}
                {order.address.pincode}
              </p>
              <p className="text-neutral-500">{order.address.phone}</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
