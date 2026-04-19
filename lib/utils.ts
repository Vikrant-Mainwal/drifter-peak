import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const products = [
  {
    id: "1",
    name: "DRIFT OVERSIZED TEE",
    price: 2499,
    originalPrice: 3499,
    tag: "DROP 01",
    category: "tees",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80",
    ],
    description: "Peak comfort. Zero compromise. Crafted from heavyweight 320gsm cotton — built for those who drift above average.",
    limited: true,
  },
  {
    id: "2",
    name: "PEAK CARGO PANTS",
    price: 4999,
    originalPrice: 6499,
    tag: "SOLD OUT SOON",
    category: "bottoms",
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
    ],
    description: "Not your basic cargos. Seven pockets of pure utility. Tapered cut meets street aggression.",
    limited: true,
  },
  {
    id: "3",
    name: "VOID HOODIE",
    price: 5499,
    originalPrice: 7499,
    tag: "NEW DROP",
    category: "hoodies",
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80",
    ],
    description: "Heavyweight. Oversized. Premium brushed fleece interior. For when you need to disappear into your own world.",
    limited: false,
  },
  {
    id: "4",
    name: "REBEL SHORTS",
    price: 2799,
    originalPrice: 3799,
    tag: "DROP 01",
    category: "bottoms",
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800&q=80",
    ],
    description: "Gym to street. No excuses. 4-way stretch with a silhouette that moves with you.",
    limited: true,
  },
  {
    id: "5",
    name: "PEAK LOGO TEE",
    price: 1999,
    originalPrice: 2799,
    tag: "ESSENTIAL",
    category: "tees",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80",
      "https://images.unsplash.com/photo-1622445275576-721325763afe?w=800&q=80",
    ],
    description: "The foundation. Simple. Clean. The logo that says everything without saying anything.",
    limited: false,
  },
  {
    id: "6",
    name: "DRIFTER BOMBER",
    price: 8999,
    originalPrice: 12499,
    tag: "RARE DROP",
    category: "jackets",
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800&q=80",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
    ],
    description: "Season-defining piece. Limited 200 units worldwide. Satin shell, embroidered peaks, your next grail.",
    limited: true,
  },
];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
