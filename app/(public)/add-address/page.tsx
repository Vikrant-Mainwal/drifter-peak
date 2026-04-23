import { AddressForm } from '@/components/checkout/AddressForm';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AddAddressPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/checkout"
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-800 mb-8 w-fit">
        <ArrowLeft size={14} /> Back to Checkout
      </Link>
      <Card>
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 mb-6">Add New Address</h1>
        <AddressForm redirectTo="/checkout" />
      </Card>
    </div>
  );
}