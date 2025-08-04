-- Add additional_sections JSONB field to prompts table
-- This field will store all extra markdown sections beyond the basic 4

ALTER TABLE prompts 
ADD COLUMN additional_sections JSONB DEFAULT '{}';