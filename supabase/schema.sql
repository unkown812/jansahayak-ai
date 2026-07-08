-- JanSahayak AI Database Schema SQL Script
-- Copy and paste this script directly into your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Create Grievances Table
CREATE TABLE IF NOT EXISTS grievances (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  translated_description TEXT,
  reporter TEXT,
  sector TEXT NOT NULL,
  urgency TEXT NOT NULL,
  status TEXT DEFAULT 'Pending',
  coordinates JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  impact TEXT
);

-- 2. Create Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  sector TEXT NOT NULL,
  cost NUMERIC NOT NULL,
  duration INTEGER NOT NULL,
  status TEXT DEFAULT 'Queued',
  priority INTEGER DEFAULT 99,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  materials TEXT
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies (Allow anonymous read/write operations for testing ease, restrict as needed in production)
DROP POLICY IF EXISTS "Allow public read of grievances" ON grievances;
CREATE POLICY "Allow public read of grievances" ON grievances FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert of grievances" ON grievances;
CREATE POLICY "Allow public insert of grievances" ON grievances FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update of grievances" ON grievances;
CREATE POLICY "Allow public update of grievances" ON grievances FOR UPDATE USING (true);


DROP POLICY IF EXISTS "Allow public read of projects" ON projects;
CREATE POLICY "Allow public read of projects" ON projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert of projects" ON projects;
CREATE POLICY "Allow public insert of projects" ON projects FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update of projects" ON projects;
CREATE POLICY "Allow public update of projects" ON projects FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete of projects" ON projects;
CREATE POLICY "Allow public delete of projects" ON projects FOR DELETE USING (true);
