import type { OrderStatus } from "../types";
import { cn } from "@/lib/utils";

const config: Record<OrderStatus, { label: string; className: string }> = {
  pending_payment: {
    label: "Payment Pending",
    className: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  },
  paid: {
    label: "Paid",
    className: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  processing: {
    label: "Processing",
    className: "bg-purple-50 text-purple-700 border border-purple-200",
  },
  packed: {
    label: "Packed",
    className: "bg-purple-50 text-purple-700 border border-purple-200",
  },
  shipped: {
    label: "Shipped",
    className: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  },
  delivered: {
    label: "Delivered",
    className: "bg-green-50 text-green-700 border border-green-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-50 text-red-700 border border-red-200",
  },
  returned: {
    label: "Returned",
    className: "bg-neutral-100 text-neutral-600 border border-neutral-200",
  },
  exchanged: {
    label: "Exchanged",
    className: "bg-neutral-100 text-neutral-600 border border-neutral-200",
  },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, className } = config[status];

  return (
    <span
      className={cn(
        "text-xs font-medium tracking-wide px-2.5 py-1 uppercase",
        className,
      )}
    >
      {label}
    </span>
  );
}
