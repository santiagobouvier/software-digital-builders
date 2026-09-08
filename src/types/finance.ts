// Tipos de dominio del módulo financiero y calendario

export type TransactionType = "income" | "expense";
export type TransactionStatus = "pending" | "paid" | "cancelled";
export type TransactionRecurrence = "none" | "monthly" | "yearly";
export type CalendarEventType = "meeting" | "payment" | "delivery" | "reminder" | "other";
export type PlanBillingCycle = "monthly" | "yearly";
export type PlanStatus = "active" | "paused" | "cancelled";
export type PaymentMethod =
  | "transferencia"
  | "efectivo"
  | "tarjeta"
  | "mercadopago"
  | "paypal"
  | "crypto"
  | "otro";

export interface Transaction {
  id: string;
  client_id: string | null;
  type: TransactionType;
  status: TransactionStatus;
  description: string;
  category: string | null;
  amount: number;
  currency: string;
  due_date: string;
  paid_date: string | null;
  recurrence: TransactionRecurrence;
  plan_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Join opcional
  client?: { company_name: string } | null;
}

export interface ClientPlan {
  id: string;
  client_id: string;
  name: string;
  amount: number;
  currency: string;
  billing_cycle: PlanBillingCycle;
  payment_method: PaymentMethod;
  payment_details: string | null;
  status: PlanStatus;
  start_date: string;
  next_due_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Join opcional
  client?: { company_name: string } | null;
}

/** Aporte mensual de un plan (anual se prorratea /12) en su propia moneda */
export function planMonthlyAmount(plan: ClientPlan): number {
  return plan.billing_cycle === "monthly" ? plan.amount : plan.amount / 12;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  client_id: string | null;
  event_date: string;
  event_time: string | null;
  type: CalendarEventType;
  completed: boolean;
  created_at: string;
  updated_at: string;
  // Join opcional
  client?: { company_name: string } | null;
}

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  income: "Cobro",
  expense: "Gasto",
};

export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  pending: "Pendiente",
  paid: "Pagado",
  cancelled: "Cancelado",
};

export const RECURRENCE_LABELS: Record<TransactionRecurrence, string> = {
  none: "Único",
  monthly: "Mensual",
  yearly: "Anual",
};

export const BILLING_CYCLE_LABELS: Record<PlanBillingCycle, string> = {
  monthly: "Mensual",
  yearly: "Anual",
};

export const PLAN_STATUS_LABELS: Record<PlanStatus, string> = {
  active: "Activo",
  paused: "Pausado",
  cancelled: "Cancelado",
};

export const PLAN_STATUS_COLORS: Record<PlanStatus, string> = {
  active: "bg-success/20 text-success",
  paused: "bg-warning/20 text-warning",
  cancelled: "bg-destructive/20 text-destructive",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  transferencia: "Transferencia",
  efectivo: "Efectivo",
  tarjeta: "Tarjeta",
  mercadopago: "Mercado Pago",
  paypal: "PayPal",
  crypto: "Crypto",
  otro: "Otro",
};

export const EVENT_TYPE_LABELS: Record<CalendarEventType, string> = {
  meeting: "Reunión",
  payment: "Pago/Cobro",
  delivery: "Entrega",
  reminder: "Recordatorio",
  other: "Otro",
};

export const EVENT_TYPE_COLORS: Record<CalendarEventType, string> = {
  meeting: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  payment: "bg-green-500/20 text-green-400 border-green-500/30",
  delivery: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  reminder: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  other: "bg-muted text-muted-foreground border-border",
};

export const EXPENSE_CATEGORIES = [
  "Infraestructura",
  "Software / Suscripciones",
  "Publicidad",
  "Impuestos",
  "Servicios profesionales",
  "Equipamiento",
  "Otro",
];

export const INCOME_CATEGORIES = [
  "Desarrollo web",
  "Mantenimiento",
  "Software a medida",
  "Bots / Automatización",
  "Consultoría",
  "Otro",
];
