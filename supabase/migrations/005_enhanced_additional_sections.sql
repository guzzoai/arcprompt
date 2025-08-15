-- Migration to enhance additional_sections with type and parsing information
-- This adds support for structured additional section rendering

-- Check if additional_sections column exists, if not create it
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='prompts' AND column_name='additional_sections') THEN
        ALTER TABLE public.prompts ADD COLUMN additional_sections JSONB DEFAULT '{}';
    END IF;
END $$;

-- Update existing additional_sections data to include type and icon fields
UPDATE public.prompts 
SET additional_sections = (
    SELECT jsonb_object_agg(
        key,
        value || jsonb_build_object(
            'type', CASE 
                WHEN LOWER(value->>'title') LIKE '%example%' OR LOWER(value->>'title') LIKE '%output%' OR LOWER(value->>'title') LIKE '%sample%' THEN 'example'
                WHEN LOWER(value->>'title') LIKE '%success%' OR LOWER(value->>'title') LIKE '%metric%' OR LOWER(value->>'title') LIKE '%result%' OR LOWER(value->>'title') LIKE '%performance%' THEN 'metrics'
                WHEN LOWER(value->>'title') LIKE '%tip%' OR LOWER(value->>'title') LIKE '%hint%' OR LOWER(value->>'title') LIKE '%advice%' THEN 'tips'
                WHEN LOWER(value->>'title') LIKE '%best practice%' OR LOWER(value->>'title') LIKE '%recommendation%' OR LOWER(value->>'title') LIKE '%guideline%' THEN 'practices'
                WHEN LOWER(value->>'title') LIKE '%troubleshoot%' OR LOWER(value->>'title') LIKE '%problem%' OR LOWER(value->>'title') LIKE '%issue%' OR LOWER(value->>'title') LIKE '%error%' OR LOWER(value->>'title') LIKE '%fix%' THEN 'troubleshooting'
                WHEN LOWER(value->>'title') LIKE '%note%' OR LOWER(value->>'title') LIKE '%important%' OR LOWER(value->>'title') LIKE '%warning%' OR LOWER(value->>'title') LIKE '%caution%' THEN 'notes'
                WHEN LOWER(value->>'title') LIKE '%feature%' OR LOWER(value->>'title') LIKE '%capability%' OR LOWER(value->>'title') LIKE '%function%' THEN 'features'
                WHEN LOWER(value->>'title') LIKE '%step%' OR LOWER(value->>'title') LIKE '%process%' OR LOWER(value->>'title') LIKE '%workflow%' OR LOWER(value->>'title') LIKE '%procedure%' THEN 'process'
                ELSE 'generic'
            END,
            'icon', CASE 
                WHEN LOWER(value->>'title') LIKE '%example%' OR LOWER(value->>'title') LIKE '%output%' OR LOWER(value->>'title') LIKE '%sample%' THEN '📝'
                WHEN LOWER(value->>'title') LIKE '%success%' OR LOWER(value->>'title') LIKE '%metric%' OR LOWER(value->>'title') LIKE '%result%' OR LOWER(value->>'title') LIKE '%performance%' THEN '📊'
                WHEN LOWER(value->>'title') LIKE '%tip%' OR LOWER(value->>'title') LIKE '%hint%' OR LOWER(value->>'title') LIKE '%advice%' THEN '💡'
                WHEN LOWER(value->>'title') LIKE '%best practice%' OR LOWER(value->>'title') LIKE '%recommendation%' OR LOWER(value->>'title') LIKE '%guideline%' THEN '⭐'
                WHEN LOWER(value->>'title') LIKE '%troubleshoot%' OR LOWER(value->>'title') LIKE '%problem%' OR LOWER(value->>'title') LIKE '%issue%' OR LOWER(value->>'title') LIKE '%error%' OR LOWER(value->>'title') LIKE '%fix%' THEN '🔧'
                WHEN LOWER(value->>'title') LIKE '%note%' OR LOWER(value->>'title') LIKE '%important%' OR LOWER(value->>'title') LIKE '%warning%' OR LOWER(value->>'title') LIKE '%caution%' THEN '⚠️'
                WHEN LOWER(value->>'title') LIKE '%feature%' OR LOWER(value->>'title') LIKE '%capability%' OR LOWER(value->>'title') LIKE '%function%' THEN '🚀'
                WHEN LOWER(value->>'title') LIKE '%step%' OR LOWER(value->>'title') LIKE '%process%' OR LOWER(value->>'title') LIKE '%workflow%' OR LOWER(value->>'title') LIKE '%procedure%' THEN '🔄'
                ELSE '📄'
            END
        )
    )
    FROM jsonb_each(additional_sections) AS kv(key, value)
    WHERE jsonb_typeof(additional_sections) = 'object'
)
WHERE additional_sections IS NOT NULL 
  AND additional_sections != '{}' 
  AND jsonb_typeof(additional_sections) = 'object';

-- Add indexes for the new fields
CREATE INDEX IF NOT EXISTS idx_prompts_additional_sections_gin ON public.prompts USING GIN (additional_sections);

-- Add comments for documentation
COMMENT ON COLUMN public.prompts.additional_sections IS 'JSON object containing additional markdown sections with title, content, order, type, and icon';

-- Create a function to parse content structure (placeholder for future enhancement)
-- This would be called from the application layer to populate parsedContent
CREATE OR REPLACE FUNCTION parse_additional_section_content(content TEXT, section_type TEXT)
RETURNS JSONB AS $$
BEGIN
    -- For now, return empty array - parsing will be done in application layer
    -- This function is a placeholder for future server-side parsing if needed
    RETURN '[]'::jsonb;
END;
$$ LANGUAGE plpgsql;