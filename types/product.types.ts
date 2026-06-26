export interface Product {
  id: string;
  list_title: string;
  detail_title: string | null;
  slogan: string | null;
  description: string | null;
  specs: Record<string, string> | null;
  brand: string | null;
  mrp: number;
  selling_price: number;
  size_chart_url: string | null;
  is_returnable: boolean;
  is_exchangeable: boolean;
  exchange_window_days: number | null;
}

 export interface ProductMedia {
  id: string;
  media_type: "image" | "video";
  url: string;
  variant_id: string | null;
}

export type ProductInsert = Omit<Product, "id" | "created_at">;
export type ProductUpdate = Partial<ProductInsert>;

// Config-based form fields — add/remove without touching form UI
export interface FormField {
  name: keyof ProductInsert;
  label: string;
  type:
    | "text"
    | "number"
    | "textarea"
    | "toggle"
    | "multiselect"
    | "tags"
    | "image";
  placeholder?: string;
  options?: string[]; // for multiselect
  required?: boolean;
  span?: "full" | "half"; // layout grid hint
}

// export const PRODUCT_FORM_FIELDS: FormField[] = [
//   {
//     name: "name",
//     label: "Product Name",
//     type: "text",
//     required: true,
//     span: "full",
//   },
//   {
//     name: "tag",
//     label: "Badge / Tag",
//     type: "text",
//     required: true,
//     span: "half",
//   },
//   {
//     name: "category",
//     label: "Category",
//     type: "text",
//     required: true,
//     span: "half",
//   },
//   {
//     name: "price",
//     label: "Selling Price (₹)",
//     type: "number",
//     required: true,
//     span: "half",
//   },
//   {
//     name: "original_price",
//     label: "Original Price (₹)",
//     type: "number",
//     required: true,
//     span: "half",
//   },
//   {
//     name: "stock",
//     label: "Stock Qty",
//     type: "number",
//     required: true,
//     span: "half",
//   },
//   {
//     name: "description",
//     label: "Description",
//     type: "textarea",
//     required: true,
//     span: "full",
//   },
//   {
//     name: "sizes",
//     label: "Available Sizes",
//     type: "multiselect",
//     options: ["XS", "S", "M", "L", "XL", "XXL"],
//     span: "full",
//   },
//   { name: "limited", label: "Limited Drop", type: "toggle", span: "half" },
//   {
//     name: "images",
//     label: "Product Images",
//     type: "image",
//     required: true,
//     span: "full",
//   },
// ];
