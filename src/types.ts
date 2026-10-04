export type Gender = 'men' | 'women' | 'unisex';

export type FragranceFamily =
  | 'fresh'
  | 'woody'
  | 'oud'
  | 'floral'
  | 'oriental'
  | 'gourmand'
  | 'citrus'
  | 'amber';

export interface ProductSize {
  id: number;
  label: string; // e.g., '30ml', '50ml', '100ml'
  price: number;
  salePrice: number | null;
  stock: number;
}

export interface Review {
  id: number;
  productId: number;
  name: string;
  email?: string;
  rating: number; // 1-5
  title?: string;
  body: string;
  approved: boolean;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku?: string;
  shortDescription: string;
  description: string;
  basePrice: number;
  salePrice: number | null;
  costPrice?: number;
  stock: number;
  categoryId?: number;
  categoryName?: string;
  gender: Gender;
  fragranceFamily: FragranceFamily;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  longevity: string;
  sillage: string;
  season: string;
  occasion: string;
  bestFor: string;
  tags: string[];
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  active: boolean;
  images: string[];
  sizes: ProductSize[];
  rating: number;
  reviewCount: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image?: string;
  active: boolean;
  sortOrder: number;
}

export interface Collection {
  id: number;
  name: string;
  slug: string;
  description: string;
  image?: string;
  active: boolean;
  productIds: number[];
  sortOrder: number;
}

export interface CartItem {
  id: string; // `${productId}-${sizeId || 'base'}`
  productId: number;
  sizeId: number | null;
  quantity: number;
  name: string;
  slug: string;
  image: string;
  sizeLabel: string;
  unitPrice: number;
  salePrice: number | null;
  effectivePrice: number;
  stock: number;
}

export interface OrderItem {
  productId: number;
  nameSnapshot: string;
  sizeLabel?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  image?: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  province: string;
  postalCode?: string;
  notes?: string;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: 'cod';
  status: OrderStatus;
  internalNotes?: string;
  createdAt: string;
  items: OrderItem[];
}

export interface SiteSettings {
  brand_name: string;
  announcement_enabled: boolean;
  announcement_text: string;
  free_delivery_threshold: number;
  shipping_flat: number;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  policy_shipping: string;
  policy_returns: string;
  policy_privacy: string;
  policy_terms: string;
}

export interface HomepageContent {
  hero: {
    eyebrow: string;
    heading: string;
    description: string;
    ctaPrimary: { label: string; href: string };
    ctaSecondary: { label: string; href: string };
    image?: string;
    enabled: boolean;
  };
  brandStory: {
    eyebrow: string;
    title: string;
    text: string;
    cta: { label: string; href: string };
  };
}

export type ActivePage =
  | { name: 'home' }
  | { name: 'shop'; params?: { category?: string; family?: string; gender?: string; q?: string } }
  | { name: 'product'; slug: string }
  | { name: 'collections' }
  | { name: 'collection'; slug: string }
  | { name: 'cart' }
  | { name: 'checkout' }
  | { name: 'order-confirmation'; orderNumber: string }
  | { name: 'track-order' }
  | { name: 'wishlist' }
  | { name: 'about' }
  | { name: 'contact' }
  | { name: 'faq' }
  | { name: 'boutiques' }
  | { name: 'studio' }
  | { name: 'animator' }
  | { name: 'policy'; slug: 'shipping' | 'returns' | 'privacy' | 'terms' }
  | { name: 'admin'; subview?: 'dashboard' | 'orders' | 'products' | 'inventory' | 'reviews' | 'homepage' | 'settings' };
