-- ==============================================================================
-- AIRTECH MEP ENGINEERING CONSULTANCY — ENGINEERING & PROJECTS SCHEMA
-- Migration: 002_engineering_projects.sql
-- PostgreSQL / Supabase
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. PROJECTS & PROJECT MEMBERS
-- ------------------------------------------------------------------------------
CREATE TYPE project_status_type AS ENUM (
    'concept_design',
    'detailed_engineering',
    'tender_preparation',
    'construction_supervision',
    'testing_commissioning',
    'handed_over',
    'on_hold'
);

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_code VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'AT-2026-HOSP-01'
    name VARCHAR(255) NOT NULL,
    description TEXT,
    client_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    lead_consultant_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status project_status_type NOT NULL DEFAULT 'concept_design',
    disciplines engineering_discipline_type[] NOT NULL DEFAULT '{hvac,fire_fighting,plumbing,electrical,bms}',
    location_city VARCHAR(100) NOT NULL,
    location_state VARCHAR(100) DEFAULT 'West Bengal',
    built_up_area_sqft NUMERIC(12, 2), -- e.g. 450,000 sq ft hospital or commercial facility
    hvac_tonnage_tr NUMERIC(10, 2),    -- e.g. 1,200 TR chiller plant
    start_date DATE,
    target_completion_date DATE,
    actual_completion_date DATE,
    total_contract_value NUMERIC(15, 2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'INR',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_projects_client ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_lead ON projects(lead_consultant_id);

CREATE TABLE project_members (
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    project_role VARCHAR(100) NOT NULL DEFAULT 'Project Engineer', -- 'Project Director', 'Lead HVAC', 'Draftsperson'
    is_lead BOOLEAN NOT NULL DEFAULT false,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (project_id, user_id)
);

-- ------------------------------------------------------------------------------
-- 2. MILESTONES & TASKS
-- ------------------------------------------------------------------------------
CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    completion_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'delayed'
    billing_percentage NUMERIC(5, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_milestones_project ON milestones(project_id);

CREATE TYPE task_priority_type AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE task_status_type AS ENUM ('todo', 'in_progress', 'under_review', 'completed');

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES milestones(id) ON DELETE SET NULL,
    discipline engineering_discipline_type NOT NULL DEFAULT 'hvac',
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority task_priority_type NOT NULL DEFAULT 'medium',
    status task_status_type NOT NULL DEFAULT 'todo',
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    due_date DATE,
    estimated_hours NUMERIC(6, 2),
    actual_hours NUMERIC(6, 2) DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);

CREATE TABLE task_assignments (
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (task_id, user_id)
);

CREATE TABLE task_subtasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    completed_by UUID REFERENCES profiles(id)
);

CREATE TABLE task_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    is_internal BOOLEAN NOT NULL DEFAULT false, -- Clients cannot view internal engineer discussions
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 3. DRAWINGS & DRAWING REVISIONS (CAD / BIM)
-- ------------------------------------------------------------------------------
CREATE TABLE drawings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    drawing_number VARCHAR(100) NOT NULL, -- e.g. 'AT-HOSP-HVAC-DWG-001'
    title VARCHAR(255) NOT NULL,
    discipline engineering_discipline_type NOT NULL,
    current_revision VARCHAR(10) NOT NULL DEFAULT 'R0',
    status VARCHAR(50) NOT NULL DEFAULT 'draft', -- 'draft', 'internal_review', 'issued_for_approval', 'approved', 'as_built'
    cad_software VARCHAR(50) DEFAULT 'ZWCAD/AutoCAD',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(project_id, drawing_number)
);

CREATE INDEX idx_drawings_project ON drawings(project_id);

CREATE TABLE drawing_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    drawing_id UUID NOT NULL REFERENCES drawings(id) ON DELETE CASCADE,
    revision_code VARCHAR(10) NOT NULL, -- 'R0', 'R1', 'R2'
    revision_notes TEXT,
    file_path TEXT NOT NULL, -- Private Supabase Storage bucket path
    file_size_bytes BIGINT,
    mime_type VARCHAR(100) DEFAULT 'application/pdf',
    uploaded_by UUID NOT NULL REFERENCES profiles(id),
    approved_by UUID REFERENCES profiles(id),
    approved_at TIMESTAMPTZ,
    is_client_accessible BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(drawing_id, revision_code)
);

-- ------------------------------------------------------------------------------
-- 4. RFIS (REQUESTS FOR INFORMATION) & TECHNICAL SUBMITTALS
-- ------------------------------------------------------------------------------
CREATE TABLE rfis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    rfi_number VARCHAR(50) NOT NULL, -- e.g. 'RFI-HVAC-001'
    discipline engineering_discipline_type NOT NULL,
    subject VARCHAR(255) NOT NULL,
    question TEXT NOT NULL,
    suggested_solution TEXT,
    priority task_priority_type NOT NULL DEFAULT 'medium',
    status VARCHAR(50) NOT NULL DEFAULT 'open', -- 'open', 'in_review', 'closed'
    raised_by UUID NOT NULL REFERENCES profiles(id),
    assigned_to UUID REFERENCES profiles(id),
    response TEXT,
    responded_by UUID REFERENCES profiles(id),
    responded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(project_id, rfi_number)
);

CREATE INDEX idx_rfis_project ON rfis(project_id);

CREATE TABLE technical_submittals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    submittal_number VARCHAR(50) NOT NULL, -- e.g. 'SUB-CHILLER-01'
    title VARCHAR(255) NOT NULL,
    item_category VARCHAR(100) NOT NULL, -- 'Water-Cooled Chiller', 'AHU', 'Fire Pump'
    manufacturer_oem VARCHAR(150),       -- 'Carrier', 'Daikin', 'Grundfos'
    model_number VARCHAR(150),
    spec_section VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'submitted', -- 'submitted', 'approved', 'approved_as_noted', 'revise_resubmit', 'rejected'
    consultant_remarks TEXT,
    document_path TEXT, -- Storage path for catalog/data sheet
    submitted_by UUID NOT NULL REFERENCES profiles(id),
    reviewed_by UUID REFERENCES profiles(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 5. DOCUMENTS, VERSIONS & APPROVALS (General Project Specs, BOQs, Reports)
-- ------------------------------------------------------------------------------
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    document_category VARCHAR(50) NOT NULL, -- 'heat_load_calculation', 'boq', 'tender_specification', 'commissioning_report'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    storage_bucket VARCHAR(100) NOT NULL DEFAULT 'project-documents',
    storage_path TEXT NOT NULL,
    version VARCHAR(20) NOT NULL DEFAULT 'v1.0',
    is_client_visible BOOLEAN NOT NULL DEFAULT false,
    uploaded_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE document_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    approver_id UUID NOT NULL REFERENCES profiles(id),
    approval_status VARCHAR(50) NOT NULL, -- 'approved', 'rejected'
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 6. MEETINGS & ACTION ITEMS
-- ------------------------------------------------------------------------------
CREATE TABLE meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    meeting_date TIMESTAMPTZ NOT NULL,
    location VARCHAR(255),
    meeting_type VARCHAR(50) DEFAULT 'design_review', -- 'design_review', 'site_coordination', 'client_progress'
    mom_document_path TEXT,
    created_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE action_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    assignee_id UUID REFERENCES profiles(id),
    due_date DATE,
    is_resolved BOOLEAN NOT NULL DEFAULT false,
    resolved_at TIMESTAMPTZ
);

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_drawings_updated_at BEFORE UPDATE ON drawings
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_rfis_updated_at BEFORE UPDATE ON rfis
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
