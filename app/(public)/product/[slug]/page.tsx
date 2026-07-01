import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MediaGallery from "@/features/product/components/product-page/MediaGallery";
import ProductDetails from "@/features/product/components/product-page/ProductDetails";
import type { ProductMedia } from "@/features/product/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

const { data: product, error } = await supabase
  .from("products")
  .select("*")
  .eq(isUUID ? "id" : "slug", slug)
  .eq("is_active", true)
  .single();


  // Fetch product
  // const { data: product } = await supabase
  //   .from("products")
  //   .select("*")
  //   .eq("slug", slug)
  //   .eq("is_active", true)
  //   .single();

  

  if (!product) notFound();

  console.log("prodct" , product.list_title)

  //  Fetch variants
  const { data: variants } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", product.id);

  //  Fetch all media — images + videos together, sorted by sort_order ─
  // sort_order is set in the admin. Index 0 is the hero slot.
  // Shopkeeper uploads images and videos in one go; sort_order controls
  // the display sequence in the gallery.
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
          />
        </div>
      </div>

      {/* <MobileStickyBar /> */}
    </main>
  );
}

// Separated so it can be a client component without making the whole page client 
// import MobileStickyBarClient from "@/features/product/components/MobileStickyBar";

// function MobileStickyBar() {
//   return <MobileStickyBarClient />;
// }