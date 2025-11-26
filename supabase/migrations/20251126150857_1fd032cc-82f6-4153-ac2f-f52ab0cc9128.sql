-- Add unique constraint to prevent duplicate emails in contacts table
-- First, remove any existing duplicates by keeping only the most recent entry for each email
DELETE FROM contacts a
USING contacts b
WHERE a.id < b.id
  AND a.email = b.email;

-- Now add the unique constraint
ALTER TABLE contacts
ADD CONSTRAINT contacts_email_unique UNIQUE (email);