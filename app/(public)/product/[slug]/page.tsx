import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MediaGallery from "@/features/product/components/product-page/MediaGallery";
import ProductDetails from "@/features/product/components/product-page/ProductDetails";
import { getProductBySlugOrId } from "@/features/product/api/getProduct";
import { PLACEHOLDER_IMAGE } from "@/lib/utils";
import type { ProductMedia } from "@/features/product/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const product = await getProductBySlugOrId(supabase, slug);

  if (!product) notFound();

  const { data: variants } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", product.id);

  const { data: media } = await supabase
    .from("product_media")
    .select("*")
    .eq("product_id", product.id)
    .order("sort_order", { ascending: true });

  const sortedMedia: ProductMedia[] = media ?? [];

  return (
    <main>
      <div className="md:grid md:grid-cols-[60fr_40fr] md:min-h-[calc(100vh-56px)] mt-2">
        <div className="md:sticky md:top-14 md:h-[calc(100vh-56px)] md:overflow-y-auto no-scrollbar">
          <MediaGallery
            media={sortedMedia}
            productTitle={product.list_title}
          />
        </div>
        <div
          className="
            px-5 py-7
            pb-32
            md:pb-12 md:px-8 md:py-10
            border-l border-neutral-100
          "
        >
          <ProductDetails
            product={product}
            variants={variants ?? []}
            image={sortedMedia[0]?.url ?? PLACEHOLDER_IMAGE}
          />
        </div>
      </div>
    </main>
  );
}