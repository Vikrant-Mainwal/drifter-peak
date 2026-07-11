export interface CartItem {
  variant_id: string;
  product_id: string;
  /**
   * Product slugs are optional in the DB and may be null. Every place a
   * CartItem is built (cartQueries.ts, ProductDetails.tsx) resolves this
   * with `product.slug || product.id`, so by the time it lands here it's
   * guaranteed to be a usable URL segment — consumers never need to
   * null-check it.
   */
  slug: string;
  name: string;
  mrp:number;
  price: number;
  size: string;
  color: string | null;
  image: string;
  quantity: number;
  stock: number;
}