"use client";

import { useState } from "react";
import { cancelOrder } from "../api/ordersQueries";
import { CANCELLABLE_STATUSES, type Order } from "../types";

export function CancelOrderButton({
  order,
  onCancelled,
}: {
  order: Order;
  onCancelled: (updated: Order) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  if (!CANCELLABLE_STATUSES.includes(order.status)) return null;

  async function handleCancel() {
    setLoading(true);
    setError(null);
    try {
      const updated = await cancelOrder(order.id);
      onCancelled(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't cancel this order");
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="text-sm font-medium text-red-600 underline underline-offset-2"
      >
        Cancel order
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-neutral-700">
        Cancel this order? This can&apos;t be undone.
      </p>
      <div className="flex gap-3">
        <button
          onClick={handleCancel}
          disabled={loading}
          className="text-sm font-semibold text-white bg-red-600 px-4 py-2 disabled:opacity-40"
        >
          {loading ? "Cancelling…" : "Yes, cancel"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={loading}
          className="text-sm font-medium text-neutral-600 px-4 py-2"
        >
          Never mind
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
