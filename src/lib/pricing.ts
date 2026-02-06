// Pricing calculation helpers for products and packs

export interface ProductPricing {
  oneTime: number;
  monthly: number;
}

export interface PackItemWithProduct {
  quantity: number;
  product: {
    price_one_time: number;
    price_monthly: number;
  };
}

export interface PackPricing {
  subtotalOneTime: number;
  subtotalMonthly: number;
  discountOneTime: number;
  discountMonthly: number;
  totalOneTime: number;
  totalMonthly: number;
}

export type DiscountType = 'none' | 'percent' | 'fixed';

/**
 * Calculate pack totals with discount applied
 */
export function calculatePackPricing(
  items: PackItemWithProduct[],
  discountType: DiscountType,
  discountValue: number
): PackPricing {
  // Calculate subtotals
  const subtotalOneTime = items.reduce(
    (sum, item) => sum + item.product.price_one_time * item.quantity,
    0
  );
  const subtotalMonthly = items.reduce(
    (sum, item) => sum + item.product.price_monthly * item.quantity,
    0
  );

  // Apply discount
  let discountOneTime = 0;
  let discountMonthly = 0;

  if (discountType === 'percent' && discountValue > 0) {
    const factor = discountValue / 100;
    discountOneTime = subtotalOneTime * factor;
    discountMonthly = subtotalMonthly * factor;
  } else if (discountType === 'fixed' && discountValue > 0) {
    // For fixed discount, apply proportionally to one_time and monthly
    const total = subtotalOneTime + subtotalMonthly;
    if (total > 0) {
      const oneTimeRatio = subtotalOneTime / total;
      discountOneTime = Math.min(discountValue * oneTimeRatio, subtotalOneTime);
      discountMonthly = Math.min(discountValue * (1 - oneTimeRatio), subtotalMonthly);
    }
  }

  const totalOneTime = Math.max(0, subtotalOneTime - discountOneTime);
  const totalMonthly = Math.max(0, subtotalMonthly - discountMonthly);

  return {
    subtotalOneTime,
    subtotalMonthly,
    discountOneTime,
    discountMonthly,
    totalOneTime,
    totalMonthly,
  };
}

/**
 * Get effective pricing for a subscription item
 */
export function getSubscriptionPricing(
  pricingMode: 'catalog' | 'custom',
  catalogOneTime: number,
  catalogMonthly: number,
  customOneTime: number,
  customMonthly: number
): ProductPricing {
  if (pricingMode === 'custom') {
    return {
      oneTime: customOneTime,
      monthly: customMonthly,
    };
  }
  return {
    oneTime: catalogOneTime,
    monthly: catalogMonthly,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('es-UY', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Calculate total MRR and setup for a client's subscriptions
 */
export function calculateClientTotals(
  subscriptions: Array<{
    pricing_mode: 'catalog' | 'custom';
    custom_one_time: number;
    custom_monthly: number;
    is_active: boolean;
    catalogOneTime: number;
    catalogMonthly: number;
  }>
): { totalSetup: number; totalMRR: number } {
  return subscriptions.reduce(
    (acc, sub) => {
      if (!sub.is_active) return acc;
      
      const pricing = getSubscriptionPricing(
        sub.pricing_mode,
        sub.catalogOneTime,
        sub.catalogMonthly,
        sub.custom_one_time,
        sub.custom_monthly
      );
      
      return {
        totalSetup: acc.totalSetup + pricing.oneTime,
        totalMRR: acc.totalMRR + pricing.monthly,
      };
    },
    { totalSetup: 0, totalMRR: 0 }
  );
}
