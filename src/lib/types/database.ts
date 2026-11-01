// ==============================================================================
// AIRTECH MEP ENGINEERING CONSULTANCY — DATABASE TYPES
// ==============================================================================

export type UserRole = 
  | 'owner' 
  | 'admin' 
  | 'project_manager' 
  | 'finance_admin' 
  | 'employee' 
  | 'client';

export type UserStatus = 
  | 'pending_approval' 
  | 'active' 
  | 'suspended' 
  | 'revoked';

export type EngineeringDiscipline = 
  | 'hvac' 
  | 'fire_fighting' 
  | 'plumbing' 
  | 'electrical' 
  | 'bms' 
  | 'integrated_mep';

export type ProjectStatus = 
  | 'concept_design' 
  | 'detailed_engineering' 
  | 'tender_preparation' 
  | 'construction_supervision' 
  | 'testing_commissioning' 
  | 'handed_over' 
  | 'on_hold';

export type InvoiceStatus = 
  | 'draft' 
  | 'issued' 
  | 'partially_paid' 
  | 'paid' 
  | 'overdue' 
  | 'cancelled' 
  | 'refunded';

export type PaymentGateway = 
  | 'stripe' 
  | 'manual_bank_transfer' 
  | 'manual_upi' 
  | 'cheque';

export type PaymentStatus = 
  | 'pending' 
  | 'processing' 
  | 'succeeded' 
  | 'failed' 
  | 'cancelled' 
  | 'refunded';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  designation?: string;
  organization_id?: string;
  role: UserRole;
  status: UserStatus;
  mfa_enabled: boolean;
  avatar_url?: string;
  department?: string;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  organization_type: string;
  gstin?: string;
  pan?: string;
  address_line1?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  email?: string;
  created_at: string;
}

export interface Project {
  id: string;
  project_code: string;
  name: string;
  description?: string;
  client_id: string;
  lead_consultant_id?: string;
  status: ProjectStatus;
  disciplines: EngineeringDiscipline[];
  location_city: string;
  location_state?: string;
  built_up_area_sqft?: number;
  hvac_tonnage_tr?: number;
  start_date?: string;
  target_completion_date?: string;
  total_contract_value: number;
  currency: string;
  created_at: string;
  client?: Organization;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  project_id?: string;
  client_id: string;
  milestone_id?: string;
  issue_date: string;
  due_date: string;
  currency: string;
  subtotal_amount: number;
  is_interstate: boolean;
  cgst_rate: number;
  cgst_amount: number;
  sgst_rate: number;
  sgst_amount: number;
  igst_rate: number;
  igst_amount: number;
  total_tax_amount: number;
  total_amount: number;
  paid_amount: number;
  balance_amount: number;
  status: InvoiceStatus;
  notes?: string;
  created_at: string;
  client?: Organization;
  project?: Project;
  items?: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  sac_hsn_code: string;
  description: string;
  quantity: number;
  unit_rate: number;
  amount: number;
  sort_order: number;
}

export interface Payment {
  id: string;
  invoice_id: string;
  client_id: string;
  amount: number;
  currency: string;
  gateway: PaymentGateway;
  status: PaymentStatus;
  stripe_session_id?: string;
  stripe_payment_intent_id?: string;
  bank_reference_utr?: string;
  paid_at?: string;
  created_at: string;
  invoice?: Invoice;
}

export interface Drawing {
  id: string;
  project_id: string;
  drawing_number: string;
  title: string;
  discipline: EngineeringDiscipline;
  current_revision: string;
  status: string;
  cad_software: string;
  updated_at: string;
}

export interface RFI {
  id: string;
  project_id: string;
  rfi_number: string;
  discipline: EngineeringDiscipline;
  subject: string;
  question: string;
  status: string;
  created_at: string;
  response?: string;
}
