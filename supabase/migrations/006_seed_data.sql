-- ==============================================================================
-- AIRTECH MEP ENGINEERING CONSULTANCY — SEED DATA
-- Migration: 006_seed_data.sql
-- Realistic test data for AIRTECH Kolkata
-- ==============================================================================

-- 1. Organizations
INSERT INTO organizations (id, name, slug, organization_type, gstin, pan, address_line1, city, state, country, postal_code, phone, email)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Apollo Multispeciality Hospitals Ltd', 'apollo-kolkata', 'client', '19AAACA1234F1Z1', 'AAACA1234F', '58 Canal Circular Road', 'Kolkata', 'West Bengal', 'India', '700054', '+91 33 2320 3040', 'projects@apollo-kolkata.com'),
    ('22222222-2222-2222-2222-222222222222', 'ITC Infotech Park (Eastern Zone)', 'itc-infotech', 'client', '19AABCI9876E1Z5', 'AABCI9876E', 'Plot No. 1, Action Area III, New Town', 'Kolkata', 'West Bengal', 'India', '700160', '+91 33 4000 5000', 'facilities@itcinfotech.com')
ON CONFLICT (id) DO NOTHING;

-- 2. Projects
INSERT INTO projects (
    id, project_code, name, description, client_id, status, disciplines, 
    location_city, location_state, built_up_area_sqft, hvac_tonnage_tr, 
    start_date, target_completion_date, total_contract_value, currency
)
VALUES
    (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        'AT-2026-HOSP-01',
        'Apollo Eastern Wing Super-Speciality Expansion',
        'Complete MEP & Cleanroom Design: 8 Modular Operation Theatres (NABH/ASHRAE 170 compliance), 40 ICU beds, 1,400 TR Water-Cooled Screw Chiller Plant, Automatic Fire Sprinklers & Integrated BMS.',
        '11111111-1111-1111-1111-111111111111',
        'detailed_engineering',
        ARRAY['hvac', 'fire_fighting', 'plumbing', 'electrical', 'bms']::engineering_discipline_type[],
        'Kolkata',
        'West Bengal',
        380000.00,
        1400.00,
        '2026-06-01',
        '2027-12-31',
        3500000.00,
        'INR'
    ),
    (
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        'AT-2026-COMM-02',
        'ITC Green Tech Tower (LEED Platinum)',
        'Sustainable MEP Design consultancy for G+18 IT Tower. High-efficiency magnetic bearing centrifugal chillers, demand-controlled ventilation (DCV), rainwater harvesting, and solar PV integration.',
        '22222222-2222-2222-2222-222222222222',
        'concept_design',
        ARRAY['hvac', 'electrical', 'bms']::engineering_discipline_type[],
        'New Town, Kolkata',
        'West Bengal',
        520000.00,
        1850.00,
        '2026-09-15',
        '2028-03-31',
        4800000.00,
        'INR'
    )
ON CONFLICT (id) DO NOTHING;

-- 3. Milestones
INSERT INTO milestones (id, project_id, title, description, due_date, status, billing_percentage)
VALUES
    ('m1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Milestone 1: Heat Load & Schematic MEP Concept', 'Approved Heat Load calculations (HAP 6.0), System Selection Report & Concept Schematics.', '2026-08-15', 'completed', 25.00),
    ('m2222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Milestone 2: Detailed Design, BOQ & Tender Specs', 'Plant room layouts, ducting/piping sizing, technical tender specifications, and vendor make-lists.', '2026-11-30', 'in_progress', 35.00),
    ('m3333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Milestone 3: Good For Construction (GFC) Drawings', 'Issuance of GFC drawings, coordinated composite services drawings (CSD) and builder work drawings.', '2027-04-30', 'pending', 25.00),
    ('m4444444-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Milestone 4: Testing, Commissioning & Handover', 'TAB (Testing, Adjusting & Balancing) review, cleanroom validation certificates and as-built vetting.', '2027-12-15', 'pending', 15.00)
ON CONFLICT (id) DO NOTHING;

-- 4. Invoices
INSERT INTO invoices (
    id, invoice_number, project_id, client_id, milestone_id, issue_date, due_date, currency,
    subtotal_amount, is_interstate, cgst_rate, cgst_amount, sgst_rate, sgst_amount, total_tax_amount,
    total_amount, paid_amount, balance_amount, status, created_by
)
VALUES
    (
        'inv-1111111-1111-1111-1111-111111111111',
        'INV-2026-0041',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        '11111111-1111-1111-1111-111111111111',
        'm1111111-1111-1111-1111-111111111111',
        '2026-08-20',
        '2026-09-05',
        'INR',
        875000.00,
        false,
        9.00,
        78750.00,
        9.00,
        78750.00,
        157500.00,
        1032500.00,
        1032500.00,
        0.00,
        'paid',
        '00000000-0000-0000-0000-000000000000'
    ),
    (
        'inv-2222222-2222-2222-2222-222222222222',
        'INV-2026-0042',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        '11111111-1111-1111-1111-111111111111',
        'm2222222-2222-2222-2222-222222222222',
        '2026-10-25',
        '2026-11-10',
        'INR',
        1225000.00,
        false,
        9.00,
        110250.00,
        9.00,
        110250.00,
        220500.00,
        1445500.00,
        0.00,
        1445500.00,
        'issued',
        '00000000-0000-0000-0000-000000000000'
    )
ON CONFLICT (id) DO NOTHING;

-- 5. Invoice Items
INSERT INTO invoice_items (invoice_id, sac_hsn_code, description, quantity, unit_rate, amount, sort_order)
VALUES
    (
        'inv-2222222-2222-2222-2222-222222222222',
        '998333',
        'Milestone 2 Professional Engineering Fee: Detailed HVAC, Fire Fighting & Electrical Design & BOQ Preparation for Apollo Super-Speciality Expansion (35% billing)',
        1.00,
        1225000.00,
        1225000.00,
        1
    )
ON CONFLICT (id) DO NOTHING;

-- 6. Company Settings
INSERT INTO company_settings (key, value, description)
VALUES
    ('company_profile', '{"name": "AIRTECH HVAC & MEP Engineering Consultancy", "legal_name": "AIRTECH", "headquarters": "Kolkata, West Bengal, India", "email": "contact@airtech-mep.com", "phone": "+91 98363 44430", "gstin": "19AABCA1234F1Z5", "pan": "AABCA1234F"}'::jsonb, 'Corporate legal identity'),
    ('tax_configuration', '{"default_gst_rate": 18.0, "cgst_rate": 9.0, "sgst_rate": 9.0, "igst_rate": 18.0, "hsn_sac_code": "998333", "service_description": "Engineering and Technical Advisory Services"}'::jsonb, 'Indian GST parameters'),
    ('payment_methods', '{"stripe_enabled": true, "stripe_currency": "INR", "bank_transfer_enabled": true, "upi_enabled": true, "bank_details": {"bank_name": "State Bank of India", "account_no": "392019401928", "ifsc": "SBIN0001234", "branch": "Rajarhat Gopalpur, Kolkata", "upi_id": "airtechmep@sbi"}}'::jsonb, 'Accepted payment modes and banking records')
ON CONFLICT (key) DO NOTHING;
