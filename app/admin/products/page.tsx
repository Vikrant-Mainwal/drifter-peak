"use client";
import { useEffect, useState } from "react";
import { ProductTable } from "@/components/admin/ProductTable";
import { ProductService } from "@/services/product.service";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/ui/Toast";
import type { Product } from "@/types/product.types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const { toasts, show, dismiss } = useToast();

  useEffect(() => {
    ProductService.getAll()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await ProductService.delete(id);
      setProducts(p => p.filter(x => x.id !== id));
      show("Product deleted", "success");
    } catch {
      show("Failed to delete", "error");
    }
  };

  return (
    <>
      <ProductTable products={products} loading={loading} onDelete={handleDelete} />
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </>
  );
}