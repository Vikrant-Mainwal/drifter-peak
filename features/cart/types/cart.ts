export interface CartItem {
  variant_id: string;
  product_id: string;
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