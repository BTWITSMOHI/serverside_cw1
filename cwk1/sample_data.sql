-- =========================
-- SAMPLE DATA FOR DASHBOARD
-- =========================
-- All sample users use a placeholder password hash.
-- For real login testing, register a user through the frontend.
-- The sample users are mainly for dashboard analytics/charts.

-- USERS
INSERT INTO users (email, password_hash, is_verified)
VALUES
('alice@eastminster.ac.uk', 'sample_hash', true),
('bob@eastminster.ac.uk', 'sample_hash', true),
('sara@eastminster.ac.uk', 'sample_hash', true),
('omar@eastminster.ac.uk', 'sample_hash', true),
('maya@eastminster.ac.uk', 'sample_hash', true),
('daniel@eastminster.ac.uk', 'sample_hash', true),
('fatima@eastminster.ac.uk', 'sample_hash', true),
('james@eastminster.ac.uk', 'sample_hash', true),
('aisha@eastminster.ac.uk', 'sample_hash', true),
('ryan@eastminster.ac.uk', 'sample_hash', true),
('leila@eastminster.ac.uk', 'sample_hash', true),
('hassan@eastminster.ac.uk', 'sample_hash', true),
('zain@eastminster.ac.uk', 'sample_hash', true),
('emma@eastminster.ac.uk', 'sample_hash', true),
('noah@eastminster.ac.uk', 'sample_hash', true),
('sophia@eastminster.ac.uk', 'sample_hash', true),
('ibrahim@eastminster.ac.uk', 'sample_hash', true),
('amelia@eastminster.ac.uk', 'sample_hash', true)
ON CONFLICT (email) DO NOTHING;

-- PROFILES
INSERT INTO profiles (
  user_id, full_name, bio, linkedin_url,
  programme, graduation_year, industry_sector, job_title, employer
)
VALUES
((SELECT id FROM users WHERE email='alice@eastminster.ac.uk'), 'Alice Khan', 'Computer Science graduate working in software engineering.', 'https://linkedin.com/in/alice', 'Computer Science', 2024, 'Technology & IT', 'Software Engineer', 'Google'),

((SELECT id FROM users WHERE email='bob@eastminster.ac.uk'), 'Bob Smith', 'Business Management graduate working in consulting.', 'https://linkedin.com/in/bob', 'Business Management', 2023, 'Consulting', 'Business Analyst', 'Deloitte'),

((SELECT id FROM users WHERE email='sara@eastminster.ac.uk'), 'Sara Ali', 'Computer Science graduate working in financial analytics.', 'https://linkedin.com/in/sara', 'Computer Science', 2024, 'Financial Services', 'Data Analyst', 'Barclays'),

((SELECT id FROM users WHERE email='omar@eastminster.ac.uk'), 'Omar Rahman', 'Cyber Security graduate working in cloud security.', 'https://linkedin.com/in/omar', 'Cyber Security', 2022, 'Technology & IT', 'Security Analyst', 'Microsoft'),

((SELECT id FROM users WHERE email='maya@eastminster.ac.uk'), 'Maya Patel', 'Business Management graduate focused on digital marketing.', 'https://linkedin.com/in/maya', 'Business Management', 2024, 'Retail & E-commerce', 'Marketing Analyst', 'Amazon'),

((SELECT id FROM users WHERE email='daniel@eastminster.ac.uk'), 'Daniel Brown', 'Computer Science graduate working in healthcare software.', 'https://linkedin.com/in/daniel', 'Computer Science', 2021, 'Healthcare', 'Software Developer', 'NHS Digital'),

((SELECT id FROM users WHERE email='fatima@eastminster.ac.uk'), 'Fatima Noor', 'Data Science graduate working in machine learning.', 'https://linkedin.com/in/fatima', 'Data Science', 2024, 'Technology & IT', 'Data Scientist', 'IBM'),

((SELECT id FROM users WHERE email='james@eastminster.ac.uk'), 'James Wilson', 'Computer Science graduate working in cloud engineering.', 'https://linkedin.com/in/james', 'Computer Science', 2023, 'Technology & IT', 'Cloud Engineer', 'AWS'),

((SELECT id FROM users WHERE email='aisha@eastminster.ac.uk'), 'Aisha Begum', 'Business Management graduate working in media analytics.', 'https://linkedin.com/in/aisha', 'Business Management', 2022, 'Media & Entertainment', 'Marketing Analyst', 'BBC'),

((SELECT id FROM users WHERE email='ryan@eastminster.ac.uk'), 'Ryan Clarke', 'Cyber Security graduate working in security operations.', 'https://linkedin.com/in/ryan', 'Cyber Security', 2023, 'Technology & IT', 'SOC Analyst', 'BT'),

((SELECT id FROM users WHERE email='leila@eastminster.ac.uk'), 'Leila Ahmed', 'Data Science graduate working in finance analytics.', 'https://linkedin.com/in/leila', 'Data Science', 2021, 'Financial Services', 'Data Analyst', 'HSBC'),

((SELECT id FROM users WHERE email='hassan@eastminster.ac.uk'), 'Hassan Malik', 'Computer Science graduate working in DevOps.', 'https://linkedin.com/in/hassan', 'Computer Science', 2022, 'Technology & IT', 'DevOps Engineer', 'Accenture'),

((SELECT id FROM users WHERE email='zain@eastminster.ac.uk'), 'Zain Ahmed', 'Cyber Security graduate specialising in penetration testing.', 'https://linkedin.com/in/zain', 'Cyber Security', 2024, 'Technology & IT', 'Penetration Tester', 'PwC'),

((SELECT id FROM users WHERE email='emma@eastminster.ac.uk'), 'Emma Jones', 'Business Management graduate working in product operations.', 'https://linkedin.com/in/emma', 'Business Management', 2021, 'Retail & E-commerce', 'Product Analyst', 'Tesco'),

((SELECT id FROM users WHERE email='noah@eastminster.ac.uk'), 'Noah Taylor', 'Data Science graduate working in insurance analytics.', 'https://linkedin.com/in/noah', 'Data Science', 2023, 'Financial Services', 'BI Analyst', 'Aviva'),

((SELECT id FROM users WHERE email='sophia@eastminster.ac.uk'), 'Sophia Green', 'Computer Science graduate working in fintech.', 'https://linkedin.com/in/sophia', 'Computer Science', 2024, 'Financial Services', 'Backend Developer', 'Monzo'),

((SELECT id FROM users WHERE email='ibrahim@eastminster.ac.uk'), 'Ibrahim Hussain', 'Computer Science graduate working in platform engineering.', 'https://linkedin.com/in/ibrahim', 'Computer Science', 2022, 'Technology & IT', 'Platform Engineer', 'Meta'),

((SELECT id FROM users WHERE email='amelia@eastminster.ac.uk'), 'Amelia White', 'Business Management graduate working in data-led operations.', 'https://linkedin.com/in/amelia', 'Business Management', 2023, 'Consulting', 'Operations Analyst', 'KPMG')
ON CONFLICT (user_id) DO NOTHING;

-- DEGREES
INSERT INTO degrees (user_id, degree_name, institution, year)
VALUES
((SELECT id FROM users WHERE email='alice@eastminster.ac.uk'), 'BSc Computer Science', 'Eastminster University', 2024),
((SELECT id FROM users WHERE email='bob@eastminster.ac.uk'), 'BA Business Management', 'Eastminster University', 2023),
((SELECT id FROM users WHERE email='sara@eastminster.ac.uk'), 'BSc Computer Science', 'Eastminster University', 2024),
((SELECT id FROM users WHERE email='omar@eastminster.ac.uk'), 'BSc Cyber Security', 'Eastminster University', 2022),
((SELECT id FROM users WHERE email='maya@eastminster.ac.uk'), 'BA Business Management', 'Eastminster University', 2024),
((SELECT id FROM users WHERE email='daniel@eastminster.ac.uk'), 'BSc Computer Science', 'Eastminster University', 2021),
((SELECT id FROM users WHERE email='fatima@eastminster.ac.uk'), 'BSc Data Science', 'Eastminster University', 2024),
((SELECT id FROM users WHERE email='james@eastminster.ac.uk'), 'BSc Computer Science', 'Eastminster University', 2023),
((SELECT id FROM users WHERE email='aisha@eastminster.ac.uk'), 'BA Business Management', 'Eastminster University', 2022),
((SELECT id FROM users WHERE email='ryan@eastminster.ac.uk'), 'BSc Cyber Security', 'Eastminster University', 2023),
((SELECT id FROM users WHERE email='leila@eastminster.ac.uk'), 'BSc Data Science', 'Eastminster University', 2021),
((SELECT id FROM users WHERE email='hassan@eastminster.ac.uk'), 'BSc Computer Science', 'Eastminster University', 2022);

-- EMPLOYMENT
INSERT INTO employment (user_id, company, role, industry_sector, start_date, end_date)
VALUES
((SELECT id FROM users WHERE email='alice@eastminster.ac.uk'), 'Google', 'Software Engineer', 'Technology & IT', '2024-09-01', NULL),
((SELECT id FROM users WHERE email='bob@eastminster.ac.uk'), 'Deloitte', 'Business Analyst', 'Consulting', '2023-08-01', NULL),
((SELECT id FROM users WHERE email='sara@eastminster.ac.uk'), 'Barclays', 'Data Analyst', 'Financial Services', '2024-10-01', NULL),
((SELECT id FROM users WHERE email='omar@eastminster.ac.uk'), 'Microsoft', 'Security Analyst', 'Technology & IT', '2022-09-01', NULL),
((SELECT id FROM users WHERE email='maya@eastminster.ac.uk'), 'Amazon', 'Marketing Analyst', 'Retail & E-commerce', '2024-07-01', NULL),
((SELECT id FROM users WHERE email='daniel@eastminster.ac.uk'), 'NHS Digital', 'Software Developer', 'Healthcare', '2021-09-01', NULL),
((SELECT id FROM users WHERE email='fatima@eastminster.ac.uk'), 'IBM', 'Data Scientist', 'Technology & IT', '2024-08-01', NULL),
((SELECT id FROM users WHERE email='james@eastminster.ac.uk'), 'AWS', 'Cloud Engineer', 'Technology & IT', '2023-09-01', NULL),
((SELECT id FROM users WHERE email='aisha@eastminster.ac.uk'), 'BBC', 'Marketing Analyst', 'Media & Entertainment', '2022-10-01', NULL),
((SELECT id FROM users WHERE email='ryan@eastminster.ac.uk'), 'BT', 'SOC Analyst', 'Technology & IT', '2023-11-01', NULL),
((SELECT id FROM users WHERE email='leila@eastminster.ac.uk'), 'HSBC', 'Data Analyst', 'Financial Services', '2021-09-01', NULL),
((SELECT id FROM users WHERE email='hassan@eastminster.ac.uk'), 'Accenture', 'DevOps Engineer', 'Technology & IT', '2022-06-01', NULL),
((SELECT id FROM users WHERE email='zain@eastminster.ac.uk'), 'PwC', 'Penetration Tester', 'Technology & IT', '2024-09-01', NULL),
((SELECT id FROM users WHERE email='emma@eastminster.ac.uk'), 'Tesco', 'Product Analyst', 'Retail & E-commerce', '2021-07-01', NULL),
((SELECT id FROM users WHERE email='noah@eastminster.ac.uk'), 'Aviva', 'BI Analyst', 'Financial Services', '2023-08-01', NULL),
((SELECT id FROM users WHERE email='sophia@eastminster.ac.uk'), 'Monzo', 'Backend Developer', 'Financial Services', '2024-10-01', NULL),
((SELECT id FROM users WHERE email='ibrahim@eastminster.ac.uk'), 'Meta', 'Platform Engineer', 'Technology & IT', '2022-05-01', NULL),
((SELECT id FROM users WHERE email='amelia@eastminster.ac.uk'), 'KPMG', 'Operations Analyst', 'Consulting', '2023-06-01', NULL);

-- CERTIFICATIONS
INSERT INTO certifications (user_id, name, issuer, certification_url, completion_date, year)
VALUES
((SELECT id FROM users WHERE email='alice@eastminster.ac.uk'), 'Docker Certified Associate', 'Docker', '', '2024-06-01', 2024),
((SELECT id FROM users WHERE email='alice@eastminster.ac.uk'), 'AWS Solutions Architect', 'AWS', '', '2024-08-01', 2024),

((SELECT id FROM users WHERE email='bob@eastminster.ac.uk'), 'Certified Scrum Master', 'Scrum Alliance', '', '2023-11-01', 2023),
((SELECT id FROM users WHERE email='bob@eastminster.ac.uk'), 'Tableau Specialist', 'Tableau', '', '2024-02-01', 2024),

((SELECT id FROM users WHERE email='sara@eastminster.ac.uk'), 'Google Data Analytics', 'Google', '', '2024-05-01', 2024),
((SELECT id FROM users WHERE email='sara@eastminster.ac.uk'), 'Tableau Specialist', 'Tableau', '', '2024-07-01', 2024),

((SELECT id FROM users WHERE email='omar@eastminster.ac.uk'), 'Kubernetes CKA', 'CNCF', '', '2023-04-01', 2023),
((SELECT id FROM users WHERE email='omar@eastminster.ac.uk'), 'CompTIA Security+', 'CompTIA', '', '2022-12-01', 2022),

((SELECT id FROM users WHERE email='maya@eastminster.ac.uk'), 'Certified Scrum Master', 'Scrum Alliance', '', '2025-02-01', 2025),

((SELECT id FROM users WHERE email='daniel@eastminster.ac.uk'), 'AWS Solutions Architect', 'AWS', '', '2022-03-01', 2022),
((SELECT id FROM users WHERE email='daniel@eastminster.ac.uk'), 'Docker Certified Associate', 'Docker', '', '2022-06-01', 2022),

((SELECT id FROM users WHERE email='fatima@eastminster.ac.uk'), 'Google Data Analytics', 'Google', '', '2024-03-01', 2024),
((SELECT id FROM users WHERE email='fatima@eastminster.ac.uk'), 'Python PCEP', 'Python Institute', '', '2024-04-01', 2024),

((SELECT id FROM users WHERE email='james@eastminster.ac.uk'), 'AWS Solutions Architect', 'AWS', '', '2023-05-01', 2023),
((SELECT id FROM users WHERE email='james@eastminster.ac.uk'), 'Terraform Associate', 'HashiCorp', '', '2023-07-01', 2023),

((SELECT id FROM users WHERE email='ryan@eastminster.ac.uk'), 'CompTIA Security+', 'CompTIA', '', '2023-06-01', 2023),
((SELECT id FROM users WHERE email='ryan@eastminster.ac.uk'), 'Kubernetes CKA', 'CNCF', '', '2023-08-01', 2023),

((SELECT id FROM users WHERE email='hassan@eastminster.ac.uk'), 'Docker Certified Associate', 'Docker', '', '2022-04-01', 2022),
((SELECT id FROM users WHERE email='hassan@eastminster.ac.uk'), 'Kubernetes CKA', 'CNCF', '', '2022-08-01', 2022),

((SELECT id FROM users WHERE email='zain@eastminster.ac.uk'), 'CompTIA Security+', 'CompTIA', '', '2024-02-01', 2024),
((SELECT id FROM users WHERE email='zain@eastminster.ac.uk'), 'Certified Ethical Hacker', 'EC-Council', '', '2024-04-01', 2024),

((SELECT id FROM users WHERE email='emma@eastminster.ac.uk'), 'Certified Scrum Master', 'Scrum Alliance', '', '2022-02-01', 2022),

((SELECT id FROM users WHERE email='noah@eastminster.ac.uk'), 'Power BI Data Analyst', 'Microsoft', '', '2023-04-01', 2023),
((SELECT id FROM users WHERE email='noah@eastminster.ac.uk'), 'Google Data Analytics', 'Google', '', '2023-06-01', 2023),

((SELECT id FROM users WHERE email='sophia@eastminster.ac.uk'), 'AWS Solutions Architect', 'AWS', '', '2024-07-01', 2024),

((SELECT id FROM users WHERE email='ibrahim@eastminster.ac.uk'), 'Terraform Associate', 'HashiCorp', '', '2022-09-01', 2022),
((SELECT id FROM users WHERE email='ibrahim@eastminster.ac.uk'), 'Docker Certified Associate', 'Docker', '', '2022-10-01', 2022),

((SELECT id FROM users WHERE email='amelia@eastminster.ac.uk'), 'Certified Scrum Master', 'Scrum Alliance', '', '2023-09-01', 2023),
((SELECT id FROM users WHERE email='amelia@eastminster.ac.uk'), 'Tableau Specialist', 'Tableau', '', '2023-11-01', 2023);

-- BIDS
INSERT INTO bids (user_id, amount, is_winner)
VALUES
((SELECT id FROM users WHERE email='alice@eastminster.ac.uk'), 100, false),
((SELECT id FROM users WHERE email='bob@eastminster.ac.uk'), 150, false),
((SELECT id FROM users WHERE email='sara@eastminster.ac.uk'), 200, true),
((SELECT id FROM users WHERE email='omar@eastminster.ac.uk'), 175, false),
((SELECT id FROM users WHERE email='maya@eastminster.ac.uk'), 125, false);

-- SAMPLE API USAGE LOGS
INSERT INTO api_usage_logs (api_key_id, endpoint, method, status_code)
VALUES
((SELECT id FROM api_keys WHERE api_key='dashboard_key_123'), '/api/analytics/summary', 'GET', 200),
((SELECT id FROM api_keys WHERE api_key='dashboard_key_123'), '/api/analytics/programme', 'GET', 200),
((SELECT id FROM api_keys WHERE api_key='dashboard_key_123'), '/api/analytics/industry', 'GET', 200),
((SELECT id FROM api_keys WHERE api_key='dashboard_key_123'), '/api/analytics/jobs', 'GET', 200),
((SELECT id FROM api_keys WHERE api_key='dashboard_key_123'), '/api/analytics/employers', 'GET', 200),
((SELECT id FROM api_keys WHERE api_key='dashboard_key_123'), '/api/analytics/certifications', 'GET', 200),
((SELECT id FROM api_keys WHERE api_key='dashboard_key_123'), '/api/analytics/graduation-trends', 'GET', 200),
((SELECT id FROM api_keys WHERE api_key='dashboard_key_123'), '/api/analytics/usage', 'GET', 200),
((SELECT id FROM api_keys WHERE api_key='mobile_ar_key_123'), '/api/analytics/alumni-of-day', 'GET', 200);