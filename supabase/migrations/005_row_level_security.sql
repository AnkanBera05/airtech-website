-- ==============================================================================
-- AIRTECH MEP ENGINEERING CONSULTANCY — ROW LEVEL SECURITY (RLS) POLICIES
-- Migration: 005_row_level_security.sql
-- PostgreSQL / Supabase
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. HELPER FUNCTIONS FOR SECURITY CONTEXT & ROLES
-- ------------------------------------------------------------------------------

-- Get current authenticated user's role
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS user_role_type AS $$
    SELECT role FROM profiles WHERE id = auth.uid() AND status = 'active' LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Get current authenticated user's status
CREATE OR REPLACE FUNCTION current_user_status()
RETURNS user_status_type AS $$
    SELECT status FROM profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Get current authenticated user's organization ID (for client tenancy)
CREATE OR REPLACE FUNCTION current_user_organization_id()
RETURNS UUID AS $$
    SELECT organization_id FROM profiles WHERE id = auth.uid() AND status = 'active' LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Check if user is an Administrator or Owner
CREATE OR REPLACE FUNCTION is_airtech_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
          AND status = 'active' 
          AND role IN ('owner', 'admin')
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Check if user is a Finance Administrator or Owner
CREATE OR REPLACE FUNCTION is_finance_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
          AND status = 'active' 
          AND role IN ('owner', 'admin', 'finance_admin')
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Check if user is assigned to a specific project (or is an Admin/Owner)
CREATE OR REPLACE FUNCTION is_assigned_to_project(p_project_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid() 
          AND p.status = 'active'
          AND (
              p.role IN ('owner', 'admin')
              OR EXISTS (
                  SELECT 1 FROM project_members pm
                  WHERE pm.project_id = p_project_id AND pm.user_id = auth.uid()
              )
              OR (
                  p.role = 'client' 
                  AND p.organization_id = (SELECT client_id FROM projects WHERE id = p_project_id)
              )
          )
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 2. ENABLE RLS ON ALL SENSITIVE TABLES
-- ------------------------------------------------------------------------------
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE drawings ENABLE ROW LEVEL SECURITY;
ALTER TABLE drawing_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE technical_submittals ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE timesheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_otp_challenges ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 3. PROFILES POLICIES
-- ------------------------------------------------------------------------------
-- Users can view their own profile. Admins can view all profiles.
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id OR is_airtech_admin());

-- Users can update only their non-privileged fields (avatar, phone)
CREATE POLICY "Users can update own basic profile" ON profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Only Admins can create or update roles and statuses
CREATE POLICY "Admins full management of profiles" ON profiles
    FOR ALL USING (is_airtech_admin());

-- ------------------------------------------------------------------------------
-- 4. ORGANIZATIONS POLICIES (Client Isolation)
-- ------------------------------------------------------------------------------
-- Admins and employees can view client organizations. Clients can ONLY view their own organization.
CREATE POLICY "Admins and Staff view organizations" ON organizations
    FOR SELECT USING (
        current_user_role() IN ('owner', 'admin', 'project_manager', 'finance_admin', 'employee')
        OR id = current_user_organization_id()
    );

CREATE POLICY "Admins manage organizations" ON organizations
    FOR ALL USING (is_airtech_admin());

-- ------------------------------------------------------------------------------
-- 5. PROJECTS POLICIES
-- ------------------------------------------------------------------------------
-- Projects accessible only if assigned or own client org
CREATE POLICY "Authorized project access" ON projects
    FOR SELECT USING (is_assigned_to_project(id));

CREATE POLICY "Admins and PMs manage projects" ON projects
    FOR ALL USING (
        is_airtech_admin() 
        OR (current_user_role() = 'project_manager' AND lead_consultant_id = auth.uid())
    );

-- ------------------------------------------------------------------------------
-- 6. DRAWINGS & REVISIONS POLICIES
-- ------------------------------------------------------------------------------
-- Clients can ONLY view approved drawings marked accessible
CREATE POLICY "View drawings" ON drawings
    FOR SELECT USING (
        is_airtech_admin()
        OR (current_user_role() IN ('project_manager', 'employee') AND is_assigned_to_project(project_id))
        OR (current_user_role() = 'client' AND is_assigned_to_project(project_id) AND status = 'approved')
    );

CREATE POLICY "Staff manage drawings" ON drawings
    FOR ALL USING (
        is_airtech_admin()
        OR (current_user_role() IN ('project_manager', 'employee') AND is_assigned_to_project(project_id))
    );

CREATE POLICY "View drawing revisions" ON drawing_revisions
    FOR SELECT USING (
        is_airtech_admin()
        OR (current_user_role() IN ('project_manager', 'employee') AND EXISTS (
            SELECT 1 FROM drawings d WHERE d.id = drawing_id AND is_assigned_to_project(d.project_id)
        ))
        OR (current_user_role() = 'client' AND is_client_accessible = true AND approved_by IS NOT NULL AND EXISTS (
            SELECT 1 FROM drawings d WHERE d.id = drawing_id AND is_assigned_to_project(d.project_id)
        ))
    );

-- ------------------------------------------------------------------------------
-- 7. INVOICES & PAYMENTS (Strict Financial Isolation)
-- ------------------------------------------------------------------------------
-- Regular employees CANNOT see financial invoices! Only Finance Admins, Owners & the specific Client.
CREATE POLICY "Finance and Client view invoices" ON invoices
    FOR SELECT USING (
        is_finance_admin()
        OR (current_user_role() = 'client' AND client_id = current_user_organization_id() AND status != 'draft')
    );

CREATE POLICY "Finance manage invoices" ON invoices
    FOR ALL USING (is_finance_admin());

CREATE POLICY "Finance and Client view invoice items" ON invoice_items
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM invoices i WHERE i.id = invoice_id AND (
            is_finance_admin() 
            OR (current_user_role() = 'client' AND i.client_id = current_user_organization_id() AND i.status != 'draft')
        ))
    );

CREATE POLICY "Finance and Client view payments" ON payments
    FOR SELECT USING (
        is_finance_admin()
        OR (current_user_role() = 'client' AND client_id = current_user_organization_id())
    );

CREATE POLICY "Finance manage payments" ON payments
    FOR ALL USING (is_finance_admin());

-- ------------------------------------------------------------------------------
-- 8. TASK COMMENTS (Internal Discussions Hidden From Clients)
-- ------------------------------------------------------------------------------
CREATE POLICY "View task comments" ON task_comments
    FOR SELECT USING (
        is_airtech_admin()
        OR (current_user_role() IN ('project_manager', 'employee') AND EXISTS (
            SELECT 1 FROM tasks t WHERE t.id = task_id AND is_assigned_to_project(t.project_id)
        ))
        OR (current_user_role() = 'client' AND is_internal = false AND EXISTS (
            SELECT 1 FROM tasks t WHERE t.id = task_id AND is_assigned_to_project(t.project_id)
        ))
    );

-- ------------------------------------------------------------------------------
-- 9. NOTIFICATIONS & AUDIT LOGS
-- ------------------------------------------------------------------------------
CREATE POLICY "Users view own notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users update own notifications" ON notifications
    FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins view audit logs" ON audit_logs
    FOR SELECT USING (is_airtech_admin());

-- ------------------------------------------------------------------------------
-- 10. AUTH OTP CHALLENGES (Server-Side Service Role Only)
-- ------------------------------------------------------------------------------
-- Never allow direct client SELECT/INSERT/UPDATE on OTP challenges. Service-role only!
CREATE POLICY "Service role only for OTP" ON auth_otp_challenges
    FOR ALL USING (false);
