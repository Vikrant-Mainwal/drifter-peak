"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { ProductForm } from "@/components/admin/ProductForm";
import { ProductService } from "@/services/product.service";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/ui/Toast";
import { FormSkeleton } from "@/components/ui/Skeleton";
import type { Product, ProductInsert } from "@/types/product.types";
import { uploadImages } from "@/services/upload.service";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id }  = params;
  const isNew   = id === "new";
  const router  = useRouter();
  const { toasts, show, dismiss } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    if (isNew) return;
    ProductService.getById(id)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const handleSubmit = async (data: any) => {
      setSaving(true);

      try {
        let imageUrls: string[] = [];

        if (data.images && data.images.length > 0 && data.images[0] instanceof File) {
          imageUrls = await uploadImages(data.images);
        } else {
          imageUrls = data.images || []; // already URLs from edit form
        }

        const finalData = {
          ...data,
          images: imageUrls,
        };

        if (isNew) {
          await ProductService.create(finalData);
          show("Product created!", "success");
        } else {
          await ProductService.update(id, finalData);
          show("Product updated!", "success");
        }

        setTimeout(() => router.push("/admin/products"), 800);

      } catch (err) {
        console.error(err);
        show("Something went wrong", "error");
      } finally {
        setSaving(false);
      }
  };

  return (
    <>
      <Card padding="lg" className="max-w-3xl">
        <CardHeader>
          <CardTitle>{isNew ? "Add Product" : "Edit Product"}</CardTitle>
        </CardHeader>
        {loading
          ? <FormSkeleton />
          : <ProductForm
              initialValues={product ?? {}}
              onSubmit={handleSubmit}
              loading={saving}
              submitLabel={isNew ? "Create Product" : "Save Changes"}
            />
        }
      </Card>
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </>
  );
}