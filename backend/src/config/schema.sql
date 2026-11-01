-- ============================================================
-- Finance Data Processing - PostgreSQL Schema
-- ============================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ROLES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS roles (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default roles
INSERT INTO roles (name, description) VALUES
  ('admin',   'Full access: manage users, records, view analytics'),
  ('analyst', 'Read records, access insights and summaries'),
  ('viewer',  'Read-only access to dashboard data')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         VARCHAR(100) NOT NULL,
  email        VARCHAR(255) UNIQUE NOT NULL,
  password     VARCHAR(255) NOT NULL,
  role_id      UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  status       VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FINANCIAL RECORDS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS financial_records (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  amount      NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
  type        VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
  category    VARCHAR(100) NOT NULL,
  date        DATE NOT NULL,
  notes       TEXT,
  created_by  UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  deleted_at  TIMESTAMPTZ DEFAULT NULL,   -- soft delete
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_records_type     ON financial_records(type)     WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_records_category ON financial_records(category) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_records_date     ON financial_records(date)     WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_records_created  ON financial_records(created_by) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_users_email      ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role       ON users(role_id);
