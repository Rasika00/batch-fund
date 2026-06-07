-- Run once in Supabase SQL Editor if writes fail from the browser (anon key)
-- Fixes: empty students table / cannot seed or save payments

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

DROP POLICY IF EXISTS "Allow public insert students" ON students;
DROP POLICY IF EXISTS "Allow public update students" ON students;
DROP POLICY IF EXISTS "Allow public delete students" ON students;
DROP POLICY IF EXISTS "Allow public insert events" ON events;
DROP POLICY IF EXISTS "Allow public update events" ON events;
DROP POLICY IF EXISTS "Allow public delete events" ON events;
DROP POLICY IF EXISTS "Allow public insert transactions" ON transactions;
DROP POLICY IF EXISTS "Allow public update transactions" ON transactions;
DROP POLICY IF EXISTS "Allow public delete transactions" ON transactions;
DROP POLICY IF EXISTS "Allow public insert media" ON media;
DROP POLICY IF EXISTS "Allow public update media" ON media;
DROP POLICY IF EXISTS "Allow public delete media" ON media;
DROP POLICY IF EXISTS "Allow public insert comments" ON comments;
DROP POLICY IF EXISTS "Allow public update comments" ON comments;
DROP POLICY IF EXISTS "Allow public delete comments" ON comments;

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
