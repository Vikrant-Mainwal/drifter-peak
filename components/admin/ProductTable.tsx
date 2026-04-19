"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Trash2, Search } from "lucide-react";
import { Column, Table } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { ConfirmModal } from "@/components/ui/Modal";
import { ProductTableSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/product.types";

interface ProductTableProps {
  products: Product[];
  loading?: boolean;
  onDelete: (id: string) => Promise<void>;
}

export function ProductTable({
  products,
  loading,
  onDelete,
}: ProductTableProps) {
  const [query, setQuery] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase()),
  );

  const handleDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    await onDelete(confirmId);
    setDeleting(false);
    setConfirmId(null);
  };

  if (loading) return <ProductTableSkeleton />;

  // Column config — add/remove columns here
  const columns : Column<Product>[] = [
    {
      key: "image",
      header: "IMG",
      width: "80px",
      render: (p: Product) => (
        <div
          className="relative w-12 h-12 overflow-hidden flex-shrink-0"
          style={{ background: "var(--border)" }}
        >
          {p.images?.[0] && (
            <Image
              src={p.images[0]}
              alt={p.name}
              fill
              className="object-cover"
              sizes="48px"
               unoptimized
            />
          )}
        </div>
      ),
    },
    {
      key: "name",
      header: "PRODUCT",
      render: (p: Product) => (
        <div>
          <p
            className="font-display text-base uppercase"
            style={{ color: "var(--fg)" }}
          >
            {p.name}
          </p>
          {p.limited && <Badge variant="accent">LIMITED</Badge>}
        </div>
      ),
    },
    {
      key: "category",
      header: "CATEGORY",
      render: (p: Product) => (
        <span
          className="font-mono text-xs uppercase"
          style={{ color: "var(--muted)" }}
        >
          {p.category}
        </span>
      ),
    },
    {
      key: "price",
      header: "PRICE",
      render: (p: Product) => (
        <div>
          <p className="font-display text-base" style={{ color: "var(--fg)" }}>
            {formatPrice(p.price)}
          </p>
          <p
            className="font-mono text-[10px] line-through"
            style={{ color: "var(--muted)" }}
          >
            {formatPrice(p.original_price)}
          </p>
        </div>
      ),
    },
    {
      key: "stock",
      header: "STOCK",
      render: (p: Product) => (
        <Badge
          variant={
            p.stock < 10 ? "danger" : p.stock < 30 ? "warning" : "success"
          }
        >
          {String(p.stock)}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "ACTIONS",
      width: "100px",
      render: (p: Product) => (
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/products/${p.id}`}
            className="opacity-50 hover:opacity-100 transition-opacity"
            style={{ color: "var(--fg)" }}
          >
            <Pencil size={13} />
          </Link>
          <button
            onClick={() => setConfirmId(p.id)}
            className="opacity-50 hover:opacity-100 transition-opacity"
            style={{ color: "var(--red)" }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-5">
        <div className="relative w-full sm:w-72">
          <Search
            size={12}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--muted)" }}
          />
          <Input
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Link href="/admin/products/new">
          <Button variant="accent" size="sm">
            + Add Product
          </Button>
        </Link>
      </div>

      {/* Generic Table with config columns */}
      <Table<Product>
        columns={columns}
        data={filtered}
        keyField="id"
        emptyMessage="No products found"
      />

      {/* Confirm delete modal */}
      <ConfirmModal
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="This cannot be undone. The product will be permanently removed."
        danger
      />
    </>
  );
}
