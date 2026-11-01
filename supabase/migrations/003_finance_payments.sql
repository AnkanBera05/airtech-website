-- ==============================================================================
-- AIRTECH MEP ENGINEERING CONSULTANCY — FINANCE, STRIPE & PAYMENTS SCHEMA
-- Migration: 003_finance_payments.sql
-- PostgreSQL / Supabase
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. QUOTATIONS & CHANGE REQUESTS
-- ------------------------------------------------------------------------------
CREATE TABLE quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'QT-2026-001'
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    client_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    subtotal_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    tax_percentage NUMERIC(5, 2) NOT NULL DEFAULT 18.00, -- Standard 18% GST for MEP engineering in India
    tax_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    valid_until DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft', -- 'draft', 'issued', 'accepted', 'declined', 'expired'
    prepared_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE quotation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_id UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
    item_description TEXT NOT NULL,
    discipline engineering_discipline_type NOT NULL DEFAULT 'integrated_mep',
    quantity NUMERIC(10, 2) NOT NULL DEFAULT 1.00,
    unit_price NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    total_price NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE change_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    cr_number VARCHAR(50) NOT NULL, -- e.g. 'CR-HVAC-01'
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    scope_change_impact TEXT,
    cost_impact NUMERIC(15, 2) DEFAULT 0.00,
    time_impact_days INT DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'pending_review', -- 'pending_review', 'approved_by_client', 'rejected', 'invoiced'
    requested_by UUID NOT NULL REFERENCES profiles(id),
    approved_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 2. INVOICES & INVOICE ITEMS (With Indian GST & Multi-currency)
-- ------------------------------------------------------------------------------
CREATE TYPE invoice_status_type AS ENUM (
    'draft',
    'issued',
    'partially_paid',
    'paid',
    'overdue',
    'cancelled',
    'refunded'
);

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'INV-2026-0042'
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    client_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    milestone_id UUID REFERENCES milestones(id) ON DELETE SET NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    
    -- Subtotal and Base Amounts
    subtotal_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    
    -- Indian GST Breakdown (Applicable under HSN/SAC 998333 for Architectural & Engineering services)
    is_interstate BOOLEAN NOT NULL DEFAULT false, -- If client state != West Bengal -> IGST, else CGST + SGST
    cgst_rate NUMERIC(5, 2) DEFAULT 9.00,
    cgst_amount NUMERIC(15, 2) DEFAULT 0.00,
    sgst_rate NUMERIC(5, 2) DEFAULT 9.00,
    sgst_amount NUMERIC(15, 2) DEFAULT 0.00,
    igst_rate NUMERIC(5, 2) DEFAULT 18.00,
    igst_amount NUMERIC(15, 2) DEFAULT 0.00,
    total_tax_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    
    -- Final Totals
    total_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    paid_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    balance_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    
    status invoice_status_type NOT NULL DEFAULT 'draft',
    notes TEXT,
    payment_terms TEXT DEFAULT 'Payment due within 15 days of invoice date.',
    
    created_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_invoices_client ON invoices(client_id);
CREATE INDEX idx_invoices_project ON invoices(project_id);
CREATE INDEX idx_invoices_status ON invoices(status);

CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    sac_hsn_code VARCHAR(20) DEFAULT '998333', -- Engineering consultancy services
    description TEXT NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL DEFAULT 1.00,
    unit_rate NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    sort_order INT NOT NULL DEFAULT 0
);

-- ------------------------------------------------------------------------------
-- 3. PAYMENTS & PAYMENT TRANSACTIONS (Stripe + Bank/UPI)
-- ------------------------------------------------------------------------------
CREATE TYPE payment_gateway_type AS ENUM (
    'stripe',
    'manual_bank_transfer',
    'manual_upi',
    'cheque'
);

CREATE TYPE payment_status_type AS ENUM (
    'pending',
    'processing',
    'succeeded',
    'failed',
    'cancelled',
    'refunded'
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE RESTRICT,
    client_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    amount NUMERIC(15, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    gateway payment_gateway_type NOT NULL,
    status payment_status_type NOT NULL DEFAULT 'pending',
    
    -- Stripe Specific fields
    stripe_session_id VARCHAR(255) UNIQUE,
    stripe_payment_intent_id VARCHAR(255) UNIQUE,
    stripe_charge_id VARCHAR(255),
    
    -- Manual / Bank payment verification fields
    bank_reference_utr VARCHAR(100), -- UTR / Transaction Reference number
    proof_document_path TEXT,        -- Storage path to uploaded deposit receipt
    verified_by UUID REFERENCES profiles(id),
    verified_at TIMESTAMPTZ,
    
    receipt_url TEXT,
    notes TEXT,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_payments_invoice ON payments(invoice_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_stripe_session ON payments(stripe_session_id);
CREATE INDEX idx_payments_stripe_pi ON payments(stripe_payment_intent_id);

CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL, -- e.g. 'checkout.session.completed', 'charge.refunded'
    event_id VARCHAR(255) UNIQUE,     -- Stripe event id for idempotency
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_transactions_event_id ON payment_transactions(event_id);

-- ------------------------------------------------------------------------------
-- 4. EXPENSES, TIMESHEETS & LEAVE
-- ------------------------------------------------------------------------------
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES profiles(id),
    category VARCHAR(100) NOT NULL, -- 'Site Travel', 'Printing / Drawing Reprographics', 'Accommodation', 'Testing Equipment'
    amount NUMERIC(15, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    expense_date DATE NOT NULL,
    description TEXT,
    receipt_document_path TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'reimbursed', 'rejected'
    approved_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE timesheets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    work_date DATE NOT NULL,
    hours_logged NUMERIC(4, 2) NOT NULL,
    activity_description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'submitted', -- 'submitted', 'approved', 'rejected'
    approved_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    leave_type VARCHAR(50) NOT NULL, -- 'Casual', 'Sick', 'Earned'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days NUMERIC(4, 1) NOT NULL,
    reason TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    approved_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TRIGGER update_quotations_updated_at BEFORE UPDATE ON quotations
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
