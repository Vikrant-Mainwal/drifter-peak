export type Product = {
  id: string;
  list_title: string;
  detail_title: string;
  slogan: string | null;
  description: string | null;
  specs: Record<string, unknown> | null;
  brand: string | null;
  slug: string;
  gender: string | null;
  category: string | null;
  subcategory: string | null;
  mrp: number;
  selling_price: number;
  size_chart_url: string | null;
  is_returnable: boolean;
  is_exchangeable: boolean;
  exchange_window_days: number | null;
  tags: string[] | null;
  keywords: string | null;
  is_active: boolean;
  created_at: string;
  product_variants?: ProductVariant[];
  product_media?: ProductMedia[];
};

export type ProductVariant = {
  id: string;
  product_id: string;
  sku: string;
  color: string | null;
  size: string | null;
  price: number;
  stock: number;
  created_at: string;
};

export type ProductMedia = {
  id: string;
  product_id: string;
  variant_id: string | null;
  media_type: string;
  url: string;
  sort_order: number;
  created_at: string;
};

export type FilterCategory = "all" | "men" | "women" | "accessories";

export type ProductFilters = {
  category: FilterCategory;
  search?: string;
};

export type ProductsPage = {
  products: Product[];
  nextCursor: string | null;
  hasMore: boolean;
};
