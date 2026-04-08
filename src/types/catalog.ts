// Types for the Products & Packs module

export type BillingType = 'one_time' | 'recurring';
export type DiscountType = 'none' | 'percent' | 'fixed';
export type ClientStatus = 'lead' | 'active' | 'paused' | 'cancelled';
export type SubscriptionItemType = 'product' | 'pack';
export type PricingMode = 'catalog' | 'custom';
export type ProductCategory = 'bot_whatsapp' | 'bot_interno' | 'web_rapida' | 'web_autogestionable' | 'otro';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  billing_type: BillingType;
  category: ProductCategory | null;
  price_one_time: number;
  price_monthly: number;
  currency: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Pack {
  id: string;
  name: string;
  description: string | null;
  discount_type: DiscountType;
  discount_value: number;
  currency: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface PackItem {
  id: string;
  pack_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  product?: Product;
}

export interface PackWithItems extends Pack {
  pack_items: PackItem[];
}

export interface Client {
  id: string;
  company_name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  status: ClientStatus;
  notes: string | null;
  logo_url: string | null;
  logo_bg_color: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientSubscription {
  id: string;
  client_id: string;
  item_type: SubscriptionItemType;
  product_id: string | null;
  pack_id: string | null;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  pricing_mode: PricingMode;
  custom_one_time: number;
  custom_monthly: number;
  custom_notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  product?: Product;
  pack?: PackWithItems;
}

export interface ClientWithSubscriptions extends Client {
  client_subscriptions: ClientSubscription[];
}

// Form types
export interface ProductFormData {
  name: string;
  description: string;
  billing_type: BillingType;
  price_one_time: number;
  price_monthly: number;
  is_active: boolean;
}

export interface PackFormData {
  name: string;
  description: string;
  discount_type: DiscountType;
  discount_value: number;
  is_active: boolean;
}

export interface ClientFormData {
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  country: string;
  status: ClientStatus;
  notes: string;
  logo_bg_color: string;
}

export interface SubscriptionFormData {
  item_type: SubscriptionItemType;
  product_id: string;
  pack_id: string;
  pricing_mode: PricingMode;
  custom_one_time: number;
  custom_monthly: number;
  custom_notes: string;
}

// Status labels for display
export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  lead: 'Lead',
  active: 'Activo',
  paused: 'Pausado',
  cancelled: 'Cancelado',
};

export const CLIENT_STATUS_COLORS: Record<ClientStatus, string> = {
  lead: 'bg-blue-500/20 text-blue-400',
  active: 'bg-green-500/20 text-green-400',
  paused: 'bg-yellow-500/20 text-yellow-400',
  cancelled: 'bg-red-500/20 text-red-400',
};
