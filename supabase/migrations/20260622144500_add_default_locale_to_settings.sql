-- Add default_locale column to site_settings table
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS default_locale text DEFAULT 'id' CHECK (default_locale IN ('id', 'en'));

-- Update existing record to set default_locale to 'id' if not set
UPDATE site_settings SET default_locale = 'id' WHERE id = 1 AND default_locale IS NULL;
