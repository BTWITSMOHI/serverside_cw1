-- =========================
-- DROP TABLES
-- =========================
DROP TABLE IF EXISTS api_usage_logs CASCADE;
DROP TABLE IF EXISTS api_keys CASCADE;
DROP TABLE IF EXISTS bids CASCADE;
DROP TABLE IF EXISTS employment CASCADE;
DROP TABLE IF EXISTS certifications CASCADE;
DROP TABLE IF EXISTS degrees CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS revoked_tokens CASCADE;
DROP TABLE IF EXISTS tokens CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =========================
-- USERS
-- =========================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- TOKENS
-- For email verification + password reset
-- =========================
CREATE TABLE tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  token_type TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  is_used BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- REVOKED TOKENS
-- For secure logout
-- =========================
CREATE TABLE revoked_tokens (
  id SERIAL PRIMARY KEY,
  token TEXT NOT NULL,
  revoked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- PROFILES
-- One profile per user + analytics fields for CW2
-- =========================
CREATE TABLE profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  bio TEXT NOT NULL,
  linkedin_url TEXT NOT NULL,
  profile_image TEXT,

  programme TEXT,
  graduation_year INTEGER,
  industry_sector TEXT,
  job_title TEXT,
  employer TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- DEGREES
-- =========================
CREATE TABLE degrees (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  degree_name TEXT NOT NULL,
  institution TEXT NOT NULL,
  year INTEGER NOT NULL
);

-- =========================
-- CERTIFICATIONS
-- =========================
CREATE TABLE certifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  certification_url TEXT,
  completion_date DATE,
  year INTEGER NOT NULL
);

-- =========================
-- EMPLOYMENT
-- =========================
CREATE TABLE employment (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  industry_sector TEXT,
  start_date DATE NOT NULL,
  end_date DATE
);

-- =========================
-- BIDS
-- =========================
CREATE TABLE bids (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL CHECK (amount > 0),
  is_winner BOOLEAN DEFAULT false,
  bid_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- API KEYS
-- For CW2 scoped client access
-- =========================
CREATE TABLE api_keys (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  api_key TEXT UNIQUE NOT NULL,
  permissions TEXT[] NOT NULL,
  client_type TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- API USAGE LOGS
-- Tracks endpoint usage by API key/client
-- =========================
CREATE TABLE api_usage_logs (
  id SERIAL PRIMARY KEY,
  api_key_id INTEGER REFERENCES api_keys(id) ON DELETE SET NULL,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- DEFAULT API KEYS
-- =========================
INSERT INTO api_keys (name, api_key, permissions, client_type)
VALUES
(
  'Analytics Dashboard',
  'dashboard_key_123',
  ARRAY['read:alumni', 'read:analytics'],
  'dashboard'
),
(
  'Mobile AR App',
  'mobile_ar_key_123',
  ARRAY['read:alumni_of_day'],
  'ar_app'
)
ON CONFLICT (api_key) DO NOTHING;

-- =========================
-- INDEXES
-- =========================
CREATE INDEX idx_tokens_user_id ON tokens(user_id);
CREATE INDEX idx_tokens_token ON tokens(token);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_programme ON profiles(programme);
CREATE INDEX idx_profiles_graduation_year ON profiles(graduation_year);
CREATE INDEX idx_profiles_industry_sector ON profiles(industry_sector);
CREATE INDEX idx_profiles_job_title ON profiles(job_title);
CREATE INDEX idx_profiles_employer ON profiles(employer);

CREATE INDEX idx_degrees_user_id ON degrees(user_id);
CREATE INDEX idx_certifications_user_id ON certifications(user_id);
CREATE INDEX idx_employment_user_id ON employment(user_id);

CREATE INDEX idx_bids_user_id ON bids(user_id);
CREATE INDEX idx_bids_bid_date ON bids(bid_date);

CREATE INDEX idx_api_keys_api_key ON api_keys(api_key);
CREATE INDEX idx_api_usage_logs_api_key_id ON api_usage_logs(api_key_id);
CREATE INDEX idx_api_usage_logs_created_at ON api_usage_logs(created_at);