-- Insert default categories
INSERT INTO public.categories (name, slug, description, color, icon, sort_order) VALUES
  ('Writing', 'writing', 'Creative writing, technical writing, and content creation prompts', '#EF4444', 'PenTool', 1),
  ('Coding', 'coding', 'Programming, debugging, and software development prompts', '#3B82F6', 'Code', 2),
  ('Design', 'design', 'UI/UX design, graphics, and creative concepts', '#8B5CF6', 'Palette', 3),
  ('Marketing', 'marketing', 'Marketing copy, strategy, and analytics prompts', '#10B981', 'TrendingUp', 4),
  ('Business', 'business', 'Business planning, analysis, and communication', '#F59E0B', 'Briefcase', 5),
  ('Education', 'education', 'Teaching, learning, and research prompts', '#06B6D4', 'GraduationCap', 6),
  ('Personal', 'personal', 'Productivity, self-improvement, and personal tasks', '#84CC16', 'User', 7),
  ('Data Analysis', 'data-analysis', 'Data processing, analysis, and visualization', '#EC4899', 'BarChart', 8);

-- Insert subcategories for Writing
INSERT INTO public.categories (name, slug, description, parent_id, color, icon, sort_order) VALUES
  ('Creative Writing', 'creative-writing', 'Fiction, poetry, and creative content', 
   (SELECT id FROM public.categories WHERE slug = 'writing'), '#EF4444', 'Feather', 1),
  ('Technical Writing', 'technical-writing', 'Documentation, tutorials, and technical content',
   (SELECT id FROM public.categories WHERE slug = 'writing'), '#DC2626', 'FileText', 2),
  ('Content Creation', 'content-creation', 'Blog posts, articles, and social media content',
   (SELECT id FROM public.categories WHERE slug = 'writing'), '#B91C1C', 'Edit', 3);

-- Insert subcategories for Coding
INSERT INTO public.categories (name, slug, description, parent_id, color, icon, sort_order) VALUES
  ('Code Generation', 'code-generation', 'Generate code in various programming languages',
   (SELECT id FROM public.categories WHERE slug = 'coding'), '#3B82F6', 'Code2', 1),
  ('Debugging', 'debugging', 'Find and fix bugs in code',
   (SELECT id FROM public.categories WHERE slug = 'coding'), '#2563EB', 'Bug', 2),
  ('Code Review', 'code-review', 'Review and improve existing code',
   (SELECT id FROM public.categories WHERE slug = 'coding'), '#1D4ED8', 'Search', 3),
  ('Documentation', 'documentation', 'Generate code documentation and comments',
   (SELECT id FROM public.categories WHERE slug = 'coding'), '#1E40AF', 'BookOpen', 4);

-- Insert default tags
INSERT INTO public.tags (name, slug, description, color) VALUES
  ('Beginner Friendly', 'beginner-friendly', 'Suitable for beginners', '#10B981'),
  ('Advanced', 'advanced', 'For experienced users', '#EF4444'),
  ('Quick Start', 'quick-start', 'Get started quickly', '#3B82F6'),
  ('Template', 'template', 'Reusable template', '#8B5CF6'),
  ('Step-by-Step', 'step-by-step', 'Detailed instructions', '#F59E0B'),
  ('Creative', 'creative', 'For creative tasks', '#EC4899'),
  ('Professional', 'professional', 'Business and professional use', '#6B7280'),
  ('Educational', 'educational', 'Learning and teaching', '#06B6D4'),
  ('Productivity', 'productivity', 'Improve productivity', '#84CC16'),
  ('Analysis', 'analysis', 'Data and content analysis', '#F97316');

-- Insert sample prompts
INSERT INTO public.prompts (title, description, content, category_id, difficulty_level, ai_platforms, variables, example_output, usage_instructions, status, featured) VALUES
  (
    'Blog Post Writer',
    'Create engaging blog posts on any topic with proper structure and SEO optimization',
    'Write a comprehensive blog post about {topic}. Include:

1. An attention-grabbing headline
2. An engaging introduction that hooks the reader
3. 3-5 main sections with subheadings
4. Practical tips or actionable advice
5. A conclusion that summarizes key points
6. Meta description for SEO (150-160 characters)

Target audience: {target_audience}
Tone: {tone}
Word count: {word_count} words

Make sure to include relevant keywords naturally throughout the content.',
    (SELECT id FROM public.categories WHERE slug = 'content-creation'),
    'intermediate',
    ARRAY['chatgpt', 'claude', 'gemini'],
    '{"topic": "string", "target_audience": "string", "tone": "string", "word_count": "number"}',
    'A well-structured blog post with headline, introduction, main sections, conclusion, and meta description.',
    'Replace the variables in curly braces with your specific requirements. Specify your topic, target audience, desired tone, and word count.',
    'published',
    true
  ),
  (
    'Code Reviewer',
    'Get detailed code reviews with suggestions for improvement',
    'Please review the following code and provide detailed feedback:

```{programming_language}
{code}
```

Focus on:
1. Code quality and readability
2. Performance optimization opportunities
3. Security vulnerabilities
4. Best practices adherence
5. Potential bugs or edge cases
6. Suggestions for improvement

Provide specific line-by-line feedback where applicable and suggest alternative implementations.',
    (SELECT id FROM public.categories WHERE slug = 'code-review'),
    'advanced',
    ARRAY['chatgpt', 'claude', 'gemini'],
    '{"programming_language": "string", "code": "string"}',
    'Detailed code review with specific feedback on quality, performance, security, and suggestions for improvement.',
    'Paste your code in the {code} variable and specify the programming language.',
    'published',
    true
  ),
  (
    'Marketing Copy Generator',
    'Generate persuasive marketing copy for products or services',
    'Create compelling marketing copy for {product_or_service}:

Product/Service: {product_or_service}
Target Audience: {target_audience}
Key Benefits: {key_benefits}
Call-to-Action: {call_to_action}
Tone: {tone}

Generate:
1. Headline (attention-grabbing, max 10 words)
2. Subheadline (supporting statement, max 20 words)
3. Body copy (2-3 paragraphs highlighting benefits)
4. Call-to-action button text
5. Social proof elements (testimonial format)

Focus on emotional triggers and clear value proposition.',
    (SELECT id FROM public.categories WHERE slug = 'marketing'),
    'intermediate',
    ARRAY['chatgpt', 'claude', 'gemini'],
    '{"product_or_service": "string", "target_audience": "string", "key_benefits": "string", "call_to_action": "string", "tone": "string"}',
    'Complete marketing copy package with headline, subheadline, body copy, CTA, and social proof elements.',
    'Fill in the details about your product/service, target audience, key benefits, desired call-to-action, and tone.',
    'published',
    false
  ),
  (
    'Python Function Generator',
    'Generate Python functions with documentation and error handling',
    'Create a Python function that {function_purpose}:

Requirements:
- Function name: {function_name}
- Parameters: {parameters}
- Return type: {return_type}
- Include comprehensive docstring with Google style
- Add type hints
- Implement proper error handling
- Include input validation
- Add example usage in docstring

Additional requirements: {additional_requirements}',
    (SELECT id FROM public.categories WHERE slug = 'code-generation'),
    'beginner',
    ARRAY['chatgpt', 'claude', 'gemini'],
    '{"function_purpose": "string", "function_name": "string", "parameters": "string", "return_type": "string", "additional_requirements": "string"}',
    'A complete Python function with type hints, docstring, error handling, and example usage.',
    'Describe what the function should do, provide the function name, parameters, return type, and any additional requirements.',
    'published',
    true
  ),
  (
    'UI/UX Design Brief',
    'Create comprehensive design briefs for UI/UX projects',
    'Create a detailed UI/UX design brief for {project_type}:

Project: {project_name}
Target Users: {target_users}
Platform: {platform}
Key Features: {key_features}

Include:
1. Project Overview
2. User Personas (2-3 detailed personas)
3. User Journey Map
4. Information Architecture
5. Wireframe Requirements
6. Visual Design Guidelines
   - Color palette suggestions
   - Typography recommendations
   - UI component specifications
7. Accessibility Requirements
8. Success Metrics
9. Timeline and Deliverables

Focus on user-centered design principles and modern UI/UX best practices.',
    (SELECT id FROM public.categories WHERE slug = 'design'),
    'advanced',
    ARRAY['chatgpt', 'claude', 'gemini'],
    '{"project_type": "string", "project_name": "string", "target_users": "string", "platform": "string", "key_features": "string"}',
    'A comprehensive UI/UX design brief with personas, user journey, wireframe requirements, and design guidelines.',
    'Specify the project type, name, target users, platform, and key features you want to include.',
    'published',
    false
  );

-- Link prompts to tags
INSERT INTO public.prompt_tags (prompt_id, tag_id) VALUES
  -- Blog Post Writer tags
  ((SELECT id FROM public.prompts WHERE title = 'Blog Post Writer'), (SELECT id FROM public.tags WHERE slug = 'template')),
  ((SELECT id FROM public.prompts WHERE title = 'Blog Post Writer'), (SELECT id FROM public.tags WHERE slug = 'creative')),
  ((SELECT id FROM public.prompts WHERE title = 'Blog Post Writer'), (SELECT id FROM public.tags WHERE slug = 'professional')),
  
  -- Code Reviewer tags
  ((SELECT id FROM public.prompts WHERE title = 'Code Reviewer'), (SELECT id FROM public.tags WHERE slug = 'advanced')),
  ((SELECT id FROM public.prompts WHERE title = 'Code Reviewer'), (SELECT id FROM public.tags WHERE slug = 'step-by-step')),
  ((SELECT id FROM public.prompts WHERE title = 'Code Reviewer'), (SELECT id FROM public.tags WHERE slug = 'analysis')),
  
  -- Marketing Copy Generator tags
  ((SELECT id FROM public.prompts WHERE title = 'Marketing Copy Generator'), (SELECT id FROM public.tags WHERE slug = 'template')),
  ((SELECT id FROM public.prompts WHERE title = 'Marketing Copy Generator'), (SELECT id FROM public.tags WHERE slug = 'professional')),
  ((SELECT id FROM public.prompts WHERE title = 'Marketing Copy Generator'), (SELECT id FROM public.tags WHERE slug = 'creative')),
  
  -- Python Function Generator tags
  ((SELECT id FROM public.prompts WHERE title = 'Python Function Generator'), (SELECT id FROM public.tags WHERE slug = 'beginner-friendly')),
  ((SELECT id FROM public.prompts WHERE title = 'Python Function Generator'), (SELECT id FROM public.tags WHERE slug = 'template')),
  ((SELECT id FROM public.prompts WHERE title = 'Python Function Generator'), (SELECT id FROM public.tags WHERE slug = 'educational')),
  
  -- UI/UX Design Brief tags
  ((SELECT id FROM public.prompts WHERE title = 'UI/UX Design Brief'), (SELECT id FROM public.tags WHERE slug = 'advanced')),
  ((SELECT id FROM public.prompts WHERE title = 'UI/UX Design Brief'), (SELECT id FROM public.tags WHERE slug = 'step-by-step')),
  ((SELECT id FROM public.prompts WHERE title = 'UI/UX Design Brief'), (SELECT id FROM public.tags WHERE slug = 'professional'));