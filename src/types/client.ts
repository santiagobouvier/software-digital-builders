// Tipos de dominio de clientes (fichas de empresas)

export type ClientStatus = "lead" | "active" | "paused" | "cancelled";

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

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  lead: "Lead",
  active: "Activo",
  paused: "Pausado",
  cancelled: "Cancelado",
};

export const CLIENT_STATUS_COLORS: Record<ClientStatus, string> = {
  lead: "bg-blue-500/20 text-blue-400",
  active: "bg-green-500/20 text-green-400",
  paused: "bg-yellow-500/20 text-yellow-400",
  cancelled: "bg-red-500/20 text-red-400",
};
