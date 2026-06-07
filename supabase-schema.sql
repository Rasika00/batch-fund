-- RT Funds Database Schema for Supabase
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- =====================================================
-- STUDENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    index_number TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    reg_no TEXT,
    department TEXT,
    amount_paid REAL DEFAULT 0,
    amount_owed REAL DEFAULT 0,
    status TEXT DEFAULT 'Unpaid',
    monthly_payments JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_students_index ON students(index_number);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);

-- =====================================================
-- EVENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    target REAL DEFAULT 0,
    deadline DATE,
    color TEXT,
    collected REAL DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TRANSACTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    method TEXT,
    amount REAL NOT NULL,
    status TEXT DEFAULT 'Approved',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_transactions_student ON transactions(student_id);
CREATE INDEX IF NOT EXISTS idx_transactions_event ON transactions(event_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);

-- =====================================================
-- MEDIA TABLE (Base64 Storage for Static Hosting)
-- =====================================================
CREATE TABLE IF NOT EXISTS media (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT,
    filename TEXT NOT NULL,
    url TEXT,
    data TEXT,
    mimetype TEXT,
    size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- COMMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    author TEXT,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- USER SESSIONS TABLE (for admin auth)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'Treasurer',
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SEED DATA: Admin Users
-- =====================================================
INSERT INTO user_sessions (email, password_hash, role, name) VALUES
    ('ENT2023070@tec.rjt.ac.lk', 'Sp03@tech', 'Treasurer', 'Salinda'),
    ('itt2023097@tec.rjt.ac.lk', '200309700301.', 'Admin', 'Rasika')
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-runs)
DROP POLICY IF EXISTS "Allow public read students" ON students;
DROP POLICY IF EXISTS "Allow public read events" ON events;
DROP POLICY IF EXISTS "Allow public read transactions" ON transactions;
DROP POLICY IF EXISTS "Allow public read media" ON media;
DROP POLICY IF EXISTS "Allow public read comments" ON comments;
DROP POLICY IF EXISTS "Allow authenticated insert students" ON students;
DROP POLICY IF EXISTS "Allow authenticated update students" ON students;
DROP POLICY IF EXISTS "Allow authenticated delete students" ON students;
DROP POLICY IF EXISTS "Allow authenticated insert events" ON events;
DROP POLICY IF EXISTS "Allow authenticated update events" ON events;
DROP POLICY IF EXISTS "Allow authenticated delete events" ON events;
DROP POLICY IF EXISTS "Allow authenticated insert transactions" ON transactions;
DROP POLICY IF EXISTS "Allow authenticated update transactions" ON transactions;
DROP POLICY IF EXISTS "Allow authenticated delete transactions" ON transactions;
DROP POLICY IF EXISTS "Allow authenticated insert media" ON media;
DROP POLICY IF EXISTS "Allow authenticated update media" ON media;
DROP POLICY IF EXISTS "Allow authenticated delete media" ON media;
DROP POLICY IF EXISTS "Allow authenticated insert comments" ON comments;
DROP POLICY IF EXISTS "Allow authenticated update comments" ON comments;
DROP POLICY IF EXISTS "Allow authenticated delete comments" ON comments;

-- Public read access for all tables
CREATE POLICY "Allow public read students" ON students FOR SELECT USING (true);
CREATE POLICY "Allow public read events" ON events FOR SELECT USING (true);
CREATE POLICY "Allow public read transactions" ON transactions FOR SELECT USING (true);
CREATE POLICY "Allow public read media" ON media FOR SELECT USING (true);
CREATE POLICY "Allow public read comments" ON comments FOR SELECT USING (true);

-- Public write access (anon key used by the static frontend)
CREATE POLICY "Allow public insert students" ON students FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow public update students" ON students FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Allow public delete students" ON students FOR DELETE TO anon, authenticated USING (true);

CREATE POLICY "Allow public insert events" ON events FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow public update events" ON events FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Allow public delete events" ON events FOR DELETE TO anon, authenticated USING (true);

CREATE POLICY "Allow public insert transactions" ON transactions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow public update transactions" ON transactions FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Allow public delete transactions" ON transactions FOR DELETE TO anon, authenticated USING (true);

CREATE POLICY "Allow public insert media" ON media FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow public update media" ON media FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Allow public delete media" ON media FOR DELETE TO anon, authenticated USING (true);

CREATE POLICY "Allow public insert comments" ON comments FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow public update comments" ON comments FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Allow public delete comments" ON comments FOR DELETE TO anon, authenticated USING (true);

-- =====================================================
-- STORAGE BUCKET FOR MEDIA FILES
-- =====================================================
-- Drop existing policies if they exist (bucket deletion via Storage API not allowed)
DROP POLICY IF EXISTS "Allow public access to funds-media" ON storage.objects CASCADE;
DROP POLICY IF EXISTS "Allow authenticated uploads to funds-media" ON storage.objects CASCADE;
DROP POLICY IF EXISTS "Allow authenticated deletes from funds-media" ON storage.objects CASCADE;

-- Create bucket (if not exists)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('funds-media', 'funds-media', true)
ON CONFLICT DO NOTHING;

-- Create policies
CREATE POLICY "Allow public access to funds-media"
ON storage.objects FOR SELECT
USING (bucket_id = 'funds-media');

CREATE POLICY "Allow authenticated uploads to funds-media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'funds-media');

CREATE POLICY "Allow authenticated deletes from funds-media"
ON storage.objects FOR DELETE
USING (bucket_id = 'funds-media');