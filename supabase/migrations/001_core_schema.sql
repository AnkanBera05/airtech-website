-- ==============================================================================
-- AIRTECH MEP ENGINEERING CONSULTANCY — CORE DATABASE SCHEMA
-- Migration: 001_core_schema.sql
-- PostgreSQL / Supabase
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. ENUMS & DOMAINS
-- ------------------------------------------------------------------------------

CREATE TYPE user_role_type AS ENUM (
    'owner',
    'admin',
    'project_manager',
    'finance_admin',
    'employee',
    'client'
);

CREATE TYPE user_status_type AS ENUM (
    'pending_approval',
    'active',
    'suspended',
    'revoked'
);

CREATE TYPE engineering_discipline_type AS ENUM (
    'hvac',
    'fire_fighting',
    'plumbing',
    'electrical',
    'bms',
    'integrated_mep'
);

-- ------------------------------------------------------------------------------
-- 2. ORGANIZATIONS (Clients, Partner Consultants, EPC Contractors)
-- ------------------------------------------------------------------------------
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    organization_type VARCHAR(50) NOT NULL DEFAULT 'client', -- 'client', 'vendor', 'contractor', 'partner'
    gstin VARCHAR(15), -- 15-character Indian GST Identification Number
    pan VARCHAR(10),   -- 10-character Indian Permanent Account Number
    address_line1 TEXT,
    address_line2 TEXT,
    city VARCHAR(100),
    state VARCHAR(100) DEFAULT 'West Bengal',
    country VARCHAR(100) DEFAULT 'India',
    postal_code VARCHAR(20),
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_gstin ON organizations(gstin);

-- ------------------------------------------------------------------------------
-- 3. USER PROFILES (Links to Supabase auth.users)
-- ------------------------------------------------------------------------------
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    designation VARCHAR(150), -- e.g., 'Senior HVAC Engineer', 'Project Director'
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    role user_role_type NOT NULL DEFAULT 'client',
    status user_status_type NOT NULL DEFAULT 'pending_approval',
    mfa_enabled BOOLEAN NOT NULL DEFAULT false,
    avatar_url TEXT,
    department VARCHAR(100), -- 'HVAC', 'Electrical', 'Plumbing', 'Fire Protection', 'Accounts'
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    last_login_at TIMESTAMPTZ,
    last_login_ip VARCHAR(45)
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_status ON profiles(status);
CREATE INDEX idx_profiles_org ON profiles(organization_id);

-- ------------------------------------------------------------------------------
-- 4. ROLES & PERMISSIONS LOOKUP (RBAC)
-- ------------------------------------------------------------------------------
CREATE TABLE permissions (
    id VARCHAR(100) PRIMARY KEY, -- e.g., 'projects.create', 'invoices.approve', 'drawings.upload'
    description TEXT NOT NULL,
    module VARCHAR(50) NOT NULL -- 'projects', 'finance', 'engineering', 'admin', 'hr'
);

CREATE TABLE role_permissions (
    role user_role_type NOT NULL,
    permission_id VARCHAR(100) REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role, permission_id)
);

-- ------------------------------------------------------------------------------
-- 5. REGISTRATION REQUESTS & APPROVALS
-- ------------------------------------------------------------------------------
CREATE TABLE registration_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    requested_role user_role_type NOT NULL DEFAULT 'client',
    company_name VARCHAR(255),
    phone VARCHAR(50),
    justification TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_reg_requests_status ON registration_requests(status);

-- ------------------------------------------------------------------------------
-- 6. SECURITY AUDIT LOGS & ACTIVITY LOGS
-- ------------------------------------------------------------------------------
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- 'auth.login_otp', 'invoice.paid', 'drawing.approved'
    entity_type VARCHAR(100) NOT NULL, -- 'invoice', 'drawing', 'project', 'profile'
    entity_id VARCHAR(100),
    ip_address VARCHAR(45),
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ------------------------------------------------------------------------------
-- 7. COMPANY SETTINGS
-- ------------------------------------------------------------------------------
CREATE TABLE company_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Trigger to auto-update `updated_at` column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
