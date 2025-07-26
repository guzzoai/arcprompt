-- Fix the 5 failed prompt migrations
-- This script handles constraint violations and duplicate slugs

-- First, let's check what prompts have invalid difficulty_level values
-- SELECT id, title, difficulty_level FROM prompts WHERE difficulty_level NOT IN ('Beginner', 'Intermediate', 'Advanced', 'Expert');

-- Fix difficulty_level constraint violations
-- Handle "Simple" -> "Beginner"
UPDATE prompts 
SET difficulty_level = 'Beginner' 
WHERE difficulty_level = 'Simple';

-- Handle "Single" -> "Beginner" (assuming this was meant to be a simple/beginner level)
UPDATE prompts 
SET difficulty_level = 'Beginner' 
WHERE difficulty_level = 'Single';

-- Handle any other edge cases
UPDATE prompts 
SET difficulty_level = 'Beginner' 
WHERE difficulty_level NOT IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')
   AND difficulty_level IS NOT NULL;

-- Fix duplicate slug issue by adding unique suffix
-- Find and update any duplicate slugs
WITH duplicate_slugs AS (
  SELECT slug, COUNT(*) as count
  FROM prompts 
  WHERE slug IS NOT NULL
  GROUP BY slug 
  HAVING COUNT(*) > 1
),
ranked_duplicates AS (
  SELECT p.id, p.slug, p.title,
         ROW_NUMBER() OVER (PARTITION BY p.slug ORDER BY p.created_at) as rn
  FROM prompts p
  INNER JOIN duplicate_slugs ds ON p.slug = ds.slug
)
UPDATE prompts 
SET slug = CONCAT(slug, '-', SUBSTRING(id::text, 1, 8))
FROM ranked_duplicates rd
WHERE prompts.id = rd.id 
  AND rd.rn > 1;

-- Verify the fixes
SELECT 'Difficulty Level Issues' as check_type, COUNT(*) as count
FROM prompts 
WHERE difficulty_level NOT IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')

UNION ALL

SELECT 'Duplicate Slugs' as check_type, COUNT(*) as count
FROM (
  SELECT slug, COUNT(*) as count
  FROM prompts 
  WHERE slug IS NOT NULL
  GROUP BY slug 
  HAVING COUNT(*) > 1
) duplicates;