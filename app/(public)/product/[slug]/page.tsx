// "use client";

// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { createClient } from "@/lib/supabase/client";
// import Image from "next/image";

// interface ProductMedia {
//   id: string;
//   media_type: "image" | "video";
//   url: string;
//   variant_id: string | null;
// }

// interface ProductVariant {
//   id: string;
//   color: string | null;
//   size: string | null;
//   stock: number;
//   price: number | null;
// }

// interface Product {
//   id: string;
//   list_title: string;
//   detail_title: string | null;
//   slogan: string | null;
//   description: string | null;
//   specs: Record<string, string> | null;
//   brand: string | null;
//   mrp: number;
//   selling_price: number;
//   size_chart_url: string | null;
//   is_returnable: boolean;
//   is_exchangeable: boolean;
//   exchange_window_days: number | null;
// }

// export default function ProductPage() {
//   const { slug } = useParams<{ slug: string }>();

//   const supabase = createClient();
//   const [product, setProduct] = useState<Product | null>(null);
//   const [variants, setVariants] = useState<ProductVariant[]>([]);
//   const [media, setMedia] = useState<ProductMedia[]>([]);
//   const [selectedColor, setSelectedColor] = useState<string | null>(null);
//   const [selectedSize, setSelectedSize] = useState<string | null>(null);
//   const [showSizeChart, setShowSizeChart] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [activeImg, setActiveImg] = useState(0);

//   useEffect(() => {
//     loadProduct();
//   }, [slug]);

//   async function loadProduct() {
//     setLoading(true);

//     let { data: productData } = await supabase
//       .from("products")
//       .select("*")
//       .eq("slug", slug)
//       .maybeSingle();

//     if (!productData) {
//       const { data } = await supabase
//         .from("products")
//         .select("*")
//         .eq("id", slug)
//         .maybeSingle();

//       productData = data;
//     }

//     if (!productData) {
//       setLoading(false);
//       return;
//     }
//     setProduct(productData);

//     const { data: variantData } = await supabase
//       .from("product_variants")
//       .select("*")
//       .eq("product_id", productData.id);
//     setVariants(variantData ?? []);

//     const { data: mediaData } = await supabase
//       .from("product_media")
//       .select("*")
//       .eq("product_id", productData.id)
//       .order("sort_order");
//     setMedia(mediaData ?? []);

//     setLoading(false);
//   }

//   if (loading) return <div className="p-8 text-sm text-gray-500">Loading…</div>;
//   if (!product)
//     return <div className="p-8 text-sm text-red-600">Product not found.</div>;

//   const colors = Array.from(
//     new Set(variants.map((v) => v.color).filter(Boolean)),
//   );
//   const sizes = Array.from(
//     new Set(variants.map((v) => v.size).filter(Boolean)),
//   );

//   const matchedVariant = variants.find(
//     (v) => v.color === selectedColor && v.size === selectedSize,
//   );
//   const displayPrice = matchedVariant?.price ?? product.selling_price;
//   const discountPct = Math.round(
//     ((product.mrp - displayPrice) / product.mrp) * 100,
//   );

//   const images = media.filter((m) => m.media_type === "image");
//   const videos = media.filter((m) => m.media_type === "video");

//   return (
//     <div className="max-w-4xl mx-auto p-8 grid md:grid-cols-2 gap-8 mt-20">
//       <div>
//         <div className="space-y-4">
//           <div className="relative aspect-[4/5] overflow-hidden">
//             <Image
//               src={images?.[activeImg]?.url}
//               alt={product.list_title}
//               fill
//               className="object-cover"
//             />
//           </div>
//           <div className="grid grid-cols-4 gap-3">
//             {images?.map((img, i) => (
//               <button
//                 key={img.id}
//                 onClick={() => setActiveImg(i)}
//                 className={`${
//                   activeImg === i ? "scale-215 border-2 border-black" : ""
//                 }`}
//               >
//                 <Image
//                   src={img.url}
//                   alt=""
//                   width={100}
//                   height={100}
//                   className="object-cover"
//                 />
//               </button>
//             ))}
//           </div>
//         </div>

//         {videos.length > 0 && (
//           <div className="mt-4 space-y-3">
//             {videos.map((vid) => (
//               <video
//                 key={vid.id}
//                 src={vid.url}
//                 controls
//                 className="w-full rounded-lg"
//               />
//             ))}
//           </div>
//         )}
//       </div>

//       <div>
//         {product.brand && (
//           <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
//         )}
//         <h1 className="text-5xl font-bold text-gray-900">
//           {product.detail_title || product.list_title}
//         </h1>
//         {/* {product.slogan && (
//           <p className="text-sm text-gray-600 mt-1">{product.slogan}</p>
//         )} */}

//         <div className="flex items-center gap-2 mt-4">
//           <span className="text-lg font-bold text-gray-900">
//             ₹{displayPrice}
//           </span>
//           {displayPrice < product.mrp && (
//             <>
//               <span className="text-sm text-gray-400 line-through">
//                 ₹{product.mrp}
//               </span>
//               <span className="text-sm text-green-600">{discountPct}% off</span>
//             </>
//           )}
//         </div>

//         {colors.length > 0 && (
//           <div className="mt-5">
//             <p className="text-xs text-gray-500 mb-2">Color</p>
//             <div className="flex gap-2">
//               {colors.map((color) => (
//                 <button
//                   key={color}
//                   onClick={() => setSelectedColor(color)}
//                   className={`text-sm px-3 py-1.5 rounded-lg border ${
//                     selectedColor === color
//                       ? "border-gray-900 bg-gray-900 text-white"
//                       : "border-gray-300 text-gray-700"
//                   }`}
//                 >
//                   {color}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}

//         {sizes.length > 0 && (
//           <div className="mt-5">
//             <div className="flex items-center justify-between mb-2">
//               <p className="text-xs text-gray-500">Size</p>
//               {product.size_chart_url && (
//                 <button
//                   onClick={() => setShowSizeChart(true)}
//                   className="text-xs text-gray-600 underline"
//                 >
//                   Size chart
//                 </button>
//               )}
//             </div>
//             <div className="flex gap-2 flex-wrap">
//               {sizes.map((size) => {
//                 const variantForSize = variants.find(
//                   (v) =>
//                     v.size === size &&
//                     (!selectedColor || v.color === selectedColor),
//                 );
//                 const outOfStock =
//                   !variantForSize || variantForSize.stock === 0;
//                 return (
//                   <button
//                     key={size}
//                     disabled={outOfStock}
//                     onClick={() => setSelectedSize(size)}
//                     className={`text-sm px-3 py-1.5 rounded-lg border ${
//                       selectedSize === size
//                         ? "border-gray-900 bg-gray-900 text-white"
//                         : "border-gray-300 text-gray-700"
//                     } ${outOfStock ? "opacity-30 cursor-not-allowed" : ""}`}
//                   >
//                     {size}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {showSizeChart && product.size_chart_url && (
//           <div
//             className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//             onClick={() => setShowSizeChart(false)}
//           >
//             <img
//               src={product.size_chart_url}
//               alt="Size chart"
//               className="max-w-md rounded-lg"
//             />
//           </div>
//         )}

//         <button
//           // onClick={handleAdd}
//           className="bg-black text-white py-4 w-full rounded"
//         >
//           {/* {added ? "ADDED " : "ADD TO CART"} */}
//           ADD TO CART
//         </button>

//         {product.description && (
//           <p className="text-sm text-gray-700 mt-6">{product.description}</p>
//         )}

//         {product.specs && (
//           <div className="mt-5">
//             <p className="text-sm font-semibold text-gray-900 mb-2">
//               Product Specs
//             </p>
//             <table className="text-sm text-gray-700 w-full">
//               <tbody>
//                 {Object.entries(product.specs).map(([label, value]) => (
//                   <tr key={label} className="border-b border-gray-100">
//                     <td className="py-1.5 text-gray-500 w-1/3">{label}</td>
//                     <td className="py-1.5">{value}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         <div className="mt-5 text-xs text-gray-500 space-y-1">
//           {product.is_returnable && <p>✓ Returnable</p>}
//           {product.is_exchangeable && (
//             <p>✓ Exchange within {product.exchange_window_days} days</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// app/(public)/product/[slug]/page.tsx

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

  // Fetch product
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!product) notFound();

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
      {/*
         Responsive grid
        Mobile  : single column, media stacks above details.
                  Detail col has bottom padding (pb-32) so the sticky
                  mobile ATC bar never covers content.
        Desktop : 60/40 split. Left (media) is sticky so it stays
                  in view while the right (details) column scrolls.
         */}
      <div className="md:grid md:grid-cols-[60fr_40fr] md:min-h-[calc(100vh-56px)]">

        {/* LEFT: media gallery */}
        {/*
          Sticky on desktop so the images stay in view while details scroll.
          On mobile it's just normal flow — stacks above the details.
        */}
        <div className="md:sticky md:top-14 md:h-[calc(100vh-56px)] md:overflow-y-auto">
          <MediaGallery
            media={sortedMedia}
            productTitle={product.list_title}
          />
        </div>

        {/* RIGHT: product details */}
        {/*
          Scrolls independently on desktop.
          pb-32 on mobile reserves space for the sticky ATC bar at bottom.
        */}
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

      {/*
        Mobile sticky ATC bar
        Only visible on mobile (md:hidden).
        Tapping it scrolls to the size selector so the user picks a size
        then hits the real CTA button inside ProductDetails.
        When you wire up the cart store, you can replace this with a full
        add-to-cart action and remove the scroll behavior.
      */}
      {/* <MobileStickyBar /> */}
    </main>
  );
}

// Separated so it can be a client component without making the whole page client 
// import MobileStickyBarClient from "@/features/product/components/MobileStickyBar";

// function MobileStickyBar() {
//   return <MobileStickyBarClient />;
// }