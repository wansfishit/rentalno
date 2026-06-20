-- 1. Make user_id optional to allow guest bookings
ALTER TABLE bookings ALTER COLUMN user_id DROP NOT NULL;

-- 2. Add guest details columns
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS guest_name text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS guest_phone text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS guest_address text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS guest_location text;

-- 3. Add explicit foreign key for profile joins (fixes admin dashboard bug)
-- Even though user_id references auth.users, Supabase JS joins to public.profiles
-- requires a foreign key to public.profiles. Since id in profiles is identical to auth.users,
-- this allows seamless joining.
ALTER TABLE bookings 
  ADD CONSTRAINT fk_bookings_profile 
  FOREIGN KEY (user_id) 
  REFERENCES profiles(id) 
  ON DELETE SET NULL;

-- 4. Update RLS Policies to allow anonymous/guest inserts
-- Drop existing insert policy
DROP POLICY IF EXISTS "bookings_insert_own" ON bookings;

-- Create new policy: authenticated users must use their own user_id, 
-- anonymous/guests must leave user_id NULL
CREATE POLICY "bookings_insert_own_or_guest" ON bookings FOR INSERT
  TO public
  WITH CHECK (
    (auth.role() = 'authenticated' AND auth.uid() = user_id) OR
    (auth.role() = 'anon' AND user_id IS NULL)
  );

-- Admin needs to read all bookings, even those without a user_id
-- We drop and recreate select policy to ensure it applies to anon bookings too
DROP POLICY IF EXISTS "bookings_select_own" ON bookings;
CREATE POLICY "bookings_select_own" ON bookings FOR SELECT
  TO authenticated USING (
    auth.uid() = user_id OR is_admin() OR user_id IS NULL
  );
