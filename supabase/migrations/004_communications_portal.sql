-- ==============================================================================
-- AIRTECH MEP ENGINEERING CONSULTANCY — COMMUNICATIONS, OTP & PORTAL SCHEMA
-- Migration: 004_communications_portal.sql
-- PostgreSQL / Supabase
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. SECURE SERVER-SIDE EMAIL OTP CHALLENGES
-- ------------------------------------------------------------------------------
CREATE TABLE auth_otp_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    otp_hash TEXT NOT NULL, -- SHA-256 / bcrypt hash of the 6-digit OTP
    purpose VARCHAR(50) NOT NULL DEFAULT 'login_2fa', -- 'login_2fa', 'password_reset', 'email_change'
    attempts_count INT NOT NULL DEFAULT 0,
    max_attempts INT NOT NULL DEFAULT 3,
    is_used BOOLEAN NOT NULL DEFAULT false,
    expires_at TIMESTAMPTZ NOT NULL, -- Current time + 5 minutes
    resend_available_at TIMESTAMPTZ NOT NULL, -- Current time + 60 seconds
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_otp_user_pending ON auth_otp_challenges(user_id, is_used, expires_at);
CREATE INDEX idx_otp_email ON auth_otp_challenges(email);

-- ------------------------------------------------------------------------------
-- 2. NOTIFICATIONS & PREFERENCES
-- ------------------------------------------------------------------------------
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'info', -- 'info', 'invoice', 'drawing', 'task', 'security'
    action_url TEXT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);

CREATE TABLE notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    email_invoice_alerts BOOLEAN NOT NULL DEFAULT true,
    email_drawing_updates BOOLEAN NOT NULL DEFAULT true,
    email_task_assignments BOOLEAN NOT NULL DEFAULT true,
    email_security_alerts BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 3. CAREERS & JOB APPLICATIONS
-- ------------------------------------------------------------------------------
CREATE TABLE careers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL, -- e.g. 'Senior HVAC Design Engineer'
    department VARCHAR(100) NOT NULL, -- 'HVAC', 'Electrical & BMS', 'PHE & Fire Protection'
    location VARCHAR(100) NOT NULL DEFAULT 'Kolkata, India',
    employment_type VARCHAR(50) NOT NULL DEFAULT 'Full-Time',
    experience_years VARCHAR(50) NOT NULL DEFAULT '5-8 Years',
    description TEXT NOT NULL,
    requirements TEXT[] NOT NULL,
    responsibilities TEXT[] NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    career_id UUID REFERENCES careers(id) ON DELETE SET NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    total_experience_years NUMERIC(4, 1),
    current_company VARCHAR(255),
    notice_period_days INT,
    resume_storage_path TEXT NOT NULL, -- Stored in private bucket
    cover_letter TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'new', -- 'new', 'shortlisted', 'interview_scheduled', 'rejected', 'hired'
    reviewed_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 4. CONTACT ENQUIRIES (Public Website Lead Generation)
-- ------------------------------------------------------------------------------
CREATE TABLE contact_enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    organization_name VARCHAR(255),
    project_type VARCHAR(100), -- 'Commercial Complex', 'Super-Speciality Hospital', 'Industrial Plant', 'Hotel / Resort'
    estimated_area_sqft VARCHAR(50),
    message TEXT NOT NULL,
    disciplines_needed engineering_discipline_type[] DEFAULT '{hvac}',
    status VARCHAR(50) NOT NULL DEFAULT 'unread', -- 'unread', 'contacted', 'proposal_sent', 'archived'
    assigned_to UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_contact_enquiries_status ON contact_enquiries(status);

-- ------------------------------------------------------------------------------
-- 5. CALENDAR EVENTS (Site Inspections, Commissioning, Review Meetings)
-- ------------------------------------------------------------------------------
CREATE TABLE calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(50) NOT NULL DEFAULT 'site_visit', -- 'site_visit', 'chiller_testing', 'client_meeting', 'submission_deadline'
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    location VARCHAR(255),
    created_by UUID NOT NULL REFERENCES profiles(id),
    attendees UUID[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_calendar_events_project ON calendar_events(project_id);
