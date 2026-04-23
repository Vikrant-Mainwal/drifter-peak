import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { OrderStatusBadge } from "./OrderStatusBadge";
import type { Order } from "@/types/index";

export function OrderCard({ order }: { order: Order }) {
  const date = new Date(order.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const preview = order.order_items?.slice(0, 3) ?? [];

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

  return (
    <Link href={`/orders/${order.id}`}>
      <div className="border border-neutral-200 p-5 hover:border-neutral-400 transition-colors">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <OrderStatusBadge status={order.status} />
              <span className="text-xs text-neutral-500">
                #{order.id.slice(0, 8).toUpperCase()}
              </span>
              <span className="text-xs text-neutral-500">{date}</span>
            </div>

            <div className="flex gap-2 mt-3">
              {preview.map((item) => (
                <div
                  key={item.id}
                  className="relative w-12 h-14 bg-neutral-100 overflow-hidden flex-shrink-0"
                >
                  <Image
                    src={getImageUrl(item.product_image)}
                    alt={item.product_name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
              ))}
              {(order.order_items?.length ?? 0) > 3 && (
                <div className="w-12 h-14 bg-neutral-100 flex items-center justify-center text-xs text-neutral-500">
                  +{(order.order_items?.length ?? 0) - 3}
                </div>
              )}
            </div>

            <p className="text-sm font-semibold text-neutral-900 mt-3">
              ₹{order.total.toLocaleString("en-IN")}
            </p>
          </div>
          <ChevronRight
            size={16}
            className="text-neutral-400 flex-shrink-0 mt-1"
          />
        </div>
      </div>
    </Link>
  );
}
