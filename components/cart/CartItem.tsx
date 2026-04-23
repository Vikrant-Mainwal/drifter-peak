'use client';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem as CartItemType } from '@/types/index';

interface Props {
  item: CartItemType;
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  disabled?: boolean;
}

export function CartItemRow({ item, onUpdateQty, onRemove, disabled }: Props) {
  return (
    <div className="flex gap-4 py-5 border-b border-neutral-100 last:border-0">
      <div className="relative w-20 h-24 flex-shrink-0 bg-neutral-100 overflow-hidden">
        <Image
          src={item.product_image}
          alt={item.product_name}
          fill className="object-cover"
          sizes="80px"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-neutral-900 truncate">{item.product_name}</p>
        <p className="text-xs text-neutral-500 mt-0.5">Size: {item.size}</p>
        <p className="text-sm font-medium text-neutral-900 mt-1">₹{item.price.toLocaleString('en-IN')}</p>

        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center border border-neutral-300">
            <button
              disabled={disabled || item.quantity <= 1}
              onClick={() => onUpdateQty(item.id, item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:opacity-40"
            >
              <Minus size={12} />
            </button>
            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
            <button
              disabled={disabled}
              onClick={() => onUpdateQty(item.id, item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:opacity-40"
            >
              <Plus size={12} />
            </button>
          </div>
          <button
            disabled={disabled}
            onClick={() => onRemove(item.id)}
            className="text-neutral-400 hover:text-red-500 transition-colors disabled:opacity-40"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-semibold text-neutral-900">
          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  );
}