-- ==============================================================================
-- AIRTECH ENTERPRISE CMS, CLERK INTEGRATION & MEDIA STORAGE MIGRATION
-- Migration: 007_enterprise_cms_and_clerk.sql
-- ==============================================================================

-- 1. Add Clerk User ID to Profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS clerk_user_id TEXT UNIQUE;
CREATE INDEX IF NOT EXISTS idx_profiles_clerk_user_id ON profiles(clerk_user_id);

-- 2. Website Global Settings
CREATE TABLE IF NOT EXISTS website_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  company_name TEXT NOT NULL DEFAULT 'AIRTECH',
  tagline TEXT DEFAULT 'HVAC & MEP Engineering Consultancy',
  primary_email TEXT NOT NULL DEFAULT 'info@airtech.in',
  advisory_email TEXT DEFAULT 'consultant@airtech-mep.com',
  primary_phone TEXT NOT NULL DEFAULT '+91 80 1234 5678',
  advisory_phone TEXT DEFAULT '+91 98363 44430',
  registered_address TEXT NOT NULL DEFAULT 'Rajarhat Gopalpur, Kolkata - 700136, West Bengal, India',
  design_center_address TEXT DEFAULT 'Bengaluru, Karnataka, India',
  gstin TEXT DEFAULT '19AABCA1234F1Z5',
  pan TEXT DEFAULT 'AABCA1234F',
  hsn_sac TEXT DEFAULT '998333',
  seo_title TEXT DEFAULT 'AIRTECH — HVAC & MEP Engineering Consultancy | Kolkata',
  seo_description TEXT DEFAULT 'Specialist MEP engineering consultancy delivering integrated, energy-efficient building services solutions.',
  announcement_banner_enabled BOOLEAN DEFAULT FALSE,
  announcement_banner_text TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT
);

-- 3. Universal Media Library Catalog
CREATE TABLE IF NOT EXISTS media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  bucket TEXT NOT NULL DEFAULT 'airtech-public',
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  alt_text TEXT,
  category TEXT DEFAULT 'general',
  uploaded_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_media_assets_bucket ON media_assets(bucket);
CREATE INDEX IF NOT EXISTS idx_media_assets_category ON media_assets(category);

-- 4. Dynamic Services Management
CREATE TABLE IF NOT EXISTS services_cms (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  detailed_description TEXT,
  specifications JSONB DEFAULT '[]'::jsonb,
  standards TEXT,
  image_url TEXT,
  icon_name TEXT DEFAULT 'Fan',
  display_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Dynamic Projects & Portfolio Management
CREATE TABLE IF NOT EXISTS projects_cms (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- Commercial, Healthcare, Hospitality, Retail, Institutional
  disciplines TEXT[] DEFAULT ARRAY['HVAC'],
  location TEXT NOT NULL,
  capacity TEXT,
  status TEXT DEFAULT 'Completed', -- Concept, Detailed Engineering, Execution, Completed
  cover_image_url TEXT NOT NULL,
  gallery_image_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  client_name TEXT,
  challenge_description TEXT,
  solution_description TEXT,
  is_featured_on_home BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Leadership & Advisors Management
CREATE TABLE IF NOT EXISTS leadership_cms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  credentials TEXT,
  bio TEXT NOT NULL,
  image_url TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Career Openings & Applications
CREATE TABLE IF NOT EXISTS career_openings_cms (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  employment_type TEXT NOT NULL DEFAULT 'Full-time',
  experience_required TEXT,
  description TEXT NOT NULL,
  responsibilities JSONB DEFAULT '[]'::jsonb,
  qualifications JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS career_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id TEXT REFERENCES career_openings_cms(id) ON DELETE SET NULL,
  job_title TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  experience_years TEXT,
  resume_storage_path TEXT,
  resume_url TEXT,
  cover_notes TEXT,
  status TEXT DEFAULT 'new', -- new, under_review, shortlisted, rejected, hired
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Enable Row Level Security (RLS) on CMS Tables
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE services_cms ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects_cms ENABLE ROW LEVEL SECURITY;
ALTER TABLE leadership_cms ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_openings_cms ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_applications ENABLE ROW LEVEL SECURITY;

-- Public can SELECT published content
CREATE POLICY "Public can view website settings" ON website_settings FOR SELECT USING (true);
CREATE POLICY "Public can view published services" ON services_cms FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published projects" ON projects_cms FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published leadership" ON leadership_cms FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view active careers" ON career_openings_cms FOR SELECT USING (is_active = true);
CREATE POLICY "Public can submit career applications" ON career_applications FOR INSERT WITH CHECK (true);

-- Admins / Owners can do ALL on CMS tables
CREATE POLICY "Admins have full access to website settings" ON website_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.clerk_user_id = auth.uid()::text AND profiles.role IN ('owner', 'admin', 'content_admin'))
);

CREATE POLICY "Admins have full access to media assets" ON media_assets FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.clerk_user_id = auth.uid()::text AND profiles.role IN ('owner', 'admin', 'content_admin'))
);

CREATE POLICY "Admins have full access to services cms" ON services_cms FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.clerk_user_id = auth.uid()::text AND profiles.role IN ('owner', 'admin', 'content_admin'))
);

CREATE POLICY "Admins have full access to projects cms" ON projects_cms FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.clerk_user_id = auth.uid()::text AND profiles.role IN ('owner', 'admin', 'content_admin'))
);

CREATE POLICY "Admins have full access to leadership cms" ON leadership_cms FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.clerk_user_id = auth.uid()::text AND profiles.role IN ('owner', 'admin', 'content_admin'))
);

CREATE POLICY "Admins have full access to career openings cms" ON career_openings_cms FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.clerk_user_id = auth.uid()::text AND profiles.role IN ('owner', 'admin', 'content_admin'))
);

CREATE POLICY "Admins have full access to career applications" ON career_applications FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.clerk_user_id = auth.uid()::text AND profiles.role IN ('owner', 'admin'))
);
