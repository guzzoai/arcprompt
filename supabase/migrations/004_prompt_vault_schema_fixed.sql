-- Migration for Prompt Vault Schema Updates (Fixed)
-- Adds support for markdown-based prompts with multi-step workflows

-- First, let's see what difficulty levels exist
-- SELECT DISTINCT difficulty_level FROM public.prompts;

-- Add new columns to support markdown prompt format
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS workflow_type TEXT DEFAULT 'single' CHECK (workflow_type IN ('single', 'multi-step'));
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS step_count INTEGER DEFAULT 1;
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS steps_data JSONB DEFAULT '[]';
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS markdown_metadata JSONB DEFAULT '{}';
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS estimated_time TEXT;
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS platforms TEXT[] DEFAULT ARRAY['ChatGPT', 'Claude', 'Gemini'];
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS short_description TEXT;
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS how_to_use JSONB DEFAULT '[]';
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS what_you_get JSONB DEFAULT '[]';
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS expected_results JSONB DEFAULT '[]';
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS variations JSONB DEFAULT '[]';
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS workflow_overview TEXT;
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS what_you_create TEXT;
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS prompt_type TEXT DEFAULT 'FREE' CHECK (prompt_type IN ('FREE', 'PRO', 'PREMIUM'));

-- Drop the existing constraint completely first
ALTER TABLE public.prompts DROP CONSTRAINT IF EXISTS prompts_difficulty_level_check;

-- Update existing difficulty_level values to match new format (handle all possible cases)
UPDATE public.prompts SET difficulty_level = 'Beginner' WHERE LOWER(difficulty_level) IN ('beginner', 'simple');
UPDATE public.prompts SET difficulty_level = 'Intermediate' WHERE LOWER(difficulty_level) = 'intermediate';
UPDATE public.prompts SET difficulty_level = 'Advanced' WHERE LOWER(difficulty_level) = 'advanced';
UPDATE public.prompts SET difficulty_level = 'Expert' WHERE LOWER(difficulty_level) = 'expert';

-- Handle any other values that might exist
UPDATE public.prompts SET difficulty_level = 'Beginner' 
WHERE difficulty_level NOT IN ('Beginner', 'Intermediate', 'Advanced', 'Expert') 
   OR difficulty_level IS NULL;

-- Now add the new constraint
ALTER TABLE public.prompts ADD CONSTRAINT prompts_difficulty_level_check 
CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert'));

-- Create unique constraint on slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_prompts_slug ON public.prompts(slug) WHERE slug IS NOT NULL;

-- Add indexes for new fields
CREATE INDEX IF NOT EXISTS idx_prompts_workflow_type ON public.prompts(workflow_type);
CREATE INDEX IF NOT EXISTS idx_prompts_step_count ON public.prompts(step_count);
CREATE INDEX IF NOT EXISTS idx_prompts_prompt_type ON public.prompts(prompt_type);
CREATE INDEX IF NOT EXISTS idx_prompts_estimated_time ON public.prompts(estimated_time);

-- Update full-text search index to include new fields
DROP INDEX IF EXISTS idx_prompts_search;
CREATE INDEX idx_prompts_search ON public.prompts USING GIN (
  to_tsvector('english', 
    title || ' ' || 
    COALESCE(description, '') || ' ' || 
    COALESCE(short_description, '') || ' ' || 
    content || ' ' ||
    COALESCE(workflow_overview, '') || ' ' ||
    COALESCE(what_you_create, '')
  )
);

-- Function to generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(regexp_replace(regexp_replace(title, '[^a-zA-Z0-9\s]', '', 'g'), '\s+', '-', 'g'));
END;
$$ LANGUAGE plpgsql;

-- Function to update slug automatically
CREATE OR REPLACE FUNCTION update_prompt_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug = generate_slug(NEW.title);
    
    -- Ensure uniqueness
    WHILE EXISTS (SELECT 1 FROM public.prompts WHERE slug = NEW.slug AND id != NEW.id) LOOP
      NEW.slug = NEW.slug || '-' || substring(NEW.id::text from 1 for 8);
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic slug generation
DROP TRIGGER IF EXISTS trigger_update_prompt_slug ON public.prompts;
CREATE TRIGGER trigger_update_prompt_slug
  BEFORE INSERT OR UPDATE ON public.prompts
  FOR EACH ROW
  EXECUTE FUNCTION update_prompt_slug();

-- Add comments for documentation
COMMENT ON COLUMN public.prompts.workflow_type IS 'Type of prompt: single (one prompt) or multi-step (workflow)';
COMMENT ON COLUMN public.prompts.step_count IS 'Number of steps in workflow (1 for single prompts)';
COMMENT ON COLUMN public.prompts.steps_data IS 'JSON array of workflow steps with titles, content, and estimated time';
COMMENT ON COLUMN public.prompts.markdown_metadata IS 'Metadata extracted from markdown frontmatter';
COMMENT ON COLUMN public.prompts.estimated_time IS 'Estimated time to complete the prompt/workflow';
COMMENT ON COLUMN public.prompts.platforms IS 'Array of supported AI platforms';
COMMENT ON COLUMN public.prompts.short_description IS 'Brief description for card display';
COMMENT ON COLUMN public.prompts.slug IS 'URL-friendly identifier generated from title';
COMMENT ON COLUMN public.prompts.how_to_use IS 'JSON array of usage instructions';
COMMENT ON COLUMN public.prompts.what_you_get IS 'JSON array of expected outputs';
COMMENT ON COLUMN public.prompts.expected_results IS 'JSON array of expected results';
COMMENT ON COLUMN public.prompts.variations IS 'JSON array of prompt variations';
COMMENT ON COLUMN public.prompts.workflow_overview IS 'Overview text for multi-step workflows';
COMMENT ON COLUMN public.prompts.what_you_create IS 'Description of what users will create';
COMMENT ON COLUMN public.prompts.prompt_type IS 'Pricing tier: FREE, PRO, or PREMIUM';