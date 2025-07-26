-- Seed categories for prompt vault
-- Creates the category hierarchy matching the markdown folder structure

-- Insert main categories
INSERT INTO public.categories (name, slug, description, color, icon, sort_order) VALUES
('Social Media', 'social-media', 'Prompts for social media marketing, content creation, and audience engagement', '#1DA1F2', 'Share2', 1),
('Business Strategy', 'business-strategy', 'Strategic business planning, market analysis, and competitive intelligence', '#10B981', 'Briefcase', 2),
('Content Creation', 'content-creation', 'Content marketing, copywriting, and creative content development', '#8B5CF6', 'PenTool', 3),
('Advertising', 'advertising', 'Ad copy creation, campaign management, and marketing optimization', '#F59E0B', 'Megaphone', 4),
('Automation', 'automation', 'Productivity tools, workflow automation, and process optimization', '#6366F1', 'Zap', 5),
('Core Methods', 'core-methods', 'Fundamental prompting techniques and AI interaction strategies', '#DC2626', 'Database', 6)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  color = EXCLUDED.color,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order;

-- Insert subcategories for Social Media
INSERT INTO public.categories (name, slug, description, parent_id, color, sort_order) VALUES
('Analytics & Growth', 'analytics-growth', 'Analytics, growth tracking, and performance optimization', (SELECT id FROM public.categories WHERE slug = 'social-media'), '#1DA1F2', 1),
('Audience Engagement', 'audience-engagement', 'Community building and audience interaction strategies', (SELECT id FROM public.categories WHERE slug = 'social-media'), '#1DA1F2', 2),
('Content Creation', 'sm-content-creation', 'Social media content creation and optimization', (SELECT id FROM public.categories WHERE slug = 'social-media'), '#1DA1F2', 3),
('Content Planning', 'content-planning', 'Content calendars and strategic planning', (SELECT id FROM public.categories WHERE slug = 'social-media'), '#1DA1F2', 4),
('Platform Optimization', 'platform-optimization', 'Platform-specific optimization strategies', (SELECT id FROM public.categories WHERE slug = 'social-media'), '#1DA1F2', 5),
('Video Content', 'video-content', 'Video content creation and optimization', (SELECT id FROM public.categories WHERE slug = 'social-media'), '#1DA1F2', 6),
('Workflows', 'sm-workflows', 'Complete social media campaign workflows', (SELECT id FROM public.categories WHERE slug = 'social-media'), '#1DA1F2', 7)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  parent_id = EXCLUDED.parent_id,
  color = EXCLUDED.color,
  sort_order = EXCLUDED.sort_order;

-- Insert subcategories for Business Strategy
INSERT INTO public.categories (name, slug, description, parent_id, color, sort_order) VALUES
('Business Planning & Strategy', 'business-planning-strategy', 'Comprehensive business planning and strategic development', (SELECT id FROM public.categories WHERE slug = 'business-strategy'), '#10B981', 1),
('Market & Competitive Analysis', 'market-competitive-analysis', 'Market research and competitive intelligence', (SELECT id FROM public.categories WHERE slug = 'business-strategy'), '#10B981', 2),
('Operations Management', 'operations-management', 'Operational planning and management frameworks', (SELECT id FROM public.categories WHERE slug = 'business-strategy'), '#10B981', 3),
('Business Workflows', 'business-workflows', 'Complete business development workflows', (SELECT id FROM public.categories WHERE slug = 'business-strategy'), '#10B981', 4)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  parent_id = EXCLUDED.parent_id,
  color = EXCLUDED.color,
  sort_order = EXCLUDED.sort_order;

-- Insert subcategories for Content Creation
INSERT INTO public.categories (name, slug, description, parent_id, color, sort_order) VALUES
('Content Strategy & Optimization', 'content-strategy-optimization', 'Content marketing strategy and SEO optimization', (SELECT id FROM public.categories WHERE slug = 'content-creation'), '#8B5CF6', 1),
('Creative & Multimedia', 'creative-multimedia', 'Creative content and multimedia production', (SELECT id FROM public.categories WHERE slug = 'content-creation'), '#8B5CF6', 2)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  parent_id = EXCLUDED.parent_id,
  color = EXCLUDED.color,
  sort_order = EXCLUDED.sort_order;

-- Insert subcategories for Advertising
INSERT INTO public.categories (name, slug, description, parent_id, color, sort_order) VALUES
('Ad Copy Creation', 'ad-copy-creation', 'Advertisement copywriting and creative development', (SELECT id FROM public.categories WHERE slug = 'advertising'), '#F59E0B', 1),
('Campaign Management', 'campaign-management', 'Campaign planning, management, and optimization', (SELECT id FROM public.categories WHERE slug = 'advertising'), '#F59E0B', 2),
('Platform Specific', 'platform-specific', 'Platform-specific advertising strategies', (SELECT id FROM public.categories WHERE slug = 'advertising'), '#F59E0B', 3),
('Ad Workflows', 'ad-workflows', 'Complete advertising campaign workflows', (SELECT id FROM public.categories WHERE slug = 'advertising'), '#F59E0B', 4)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  parent_id = EXCLUDED.parent_id,
  color = EXCLUDED.color,
  sort_order = EXCLUDED.sort_order;

-- Insert subcategories for Automation
INSERT INTO public.categories (name, slug, description, parent_id, color, sort_order) VALUES
('Productivity', 'productivity', 'Personal and team productivity optimization', (SELECT id FROM public.categories WHERE slug = 'automation'), '#6366F1', 1),
('Workflow Automation', 'workflow-automation', 'Business process automation and optimization', (SELECT id FROM public.categories WHERE slug = 'automation'), '#6366F1', 2),
('Workflow Productivity', 'workflow-productivity', 'Productivity-focused workflow automation', (SELECT id FROM public.categories WHERE slug = 'automation'), '#6366F1', 3)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  parent_id = EXCLUDED.parent_id,
  color = EXCLUDED.color,
  sort_order = EXCLUDED.sort_order;

-- Insert subcategories for Core Methods
INSERT INTO public.categories (name, slug, description, parent_id, color, sort_order) VALUES
('Prompting Techniques', 'prompting-techniques', 'Core prompting methods and techniques', (SELECT id FROM public.categories WHERE slug = 'core-methods'), '#DC2626', 1)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  parent_id = EXCLUDED.parent_id,
  color = EXCLUDED.color,
  sort_order = EXCLUDED.sort_order;

-- Create some common tags
INSERT INTO public.tags (name, slug, description, color) VALUES
('beginner-friendly', 'beginner-friendly', 'Suitable for beginners', '#10B981'),
('advanced', 'advanced', 'Requires advanced knowledge', '#DC2626'),
('workflow', 'workflow', 'Multi-step workflow process', '#8B5CF6'),
('marketing', 'marketing', 'Marketing related content', '#F59E0B'),
('social-media', 'social-media', 'Social media focused', '#1DA1F2'),
('content', 'content', 'Content creation and management', '#8B5CF6'),
('strategy', 'strategy', 'Strategic planning and analysis', '#10B981'),
('automation', 'automation', 'Process automation', '#6366F1'),
('copywriting', 'copywriting', 'Writing and copy creation', '#8B5CF6'),
('analytics', 'analytics', 'Data analysis and metrics', '#6366F1')
ON CONFLICT (slug) DO NOTHING;