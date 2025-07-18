-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Categories policies (read-only for all users)
CREATE POLICY "Categories are viewable by everyone" ON public.categories
  FOR SELECT USING (true);

-- Tags policies (read-only for all users)
CREATE POLICY "Tags are viewable by everyone" ON public.tags
  FOR SELECT USING (true);

-- Prompts policies
CREATE POLICY "Published prompts are viewable by everyone" ON public.prompts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Users can view their own prompts" ON public.prompts
  FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Users can create prompts" ON public.prompts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own prompts" ON public.prompts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own prompts" ON public.prompts
  FOR DELETE USING (auth.uid() = author_id);

-- Prompt tags policies
CREATE POLICY "Prompt tags are viewable by everyone" ON public.prompt_tags
  FOR SELECT USING (true);

CREATE POLICY "Users can manage tags for their prompts" ON public.prompt_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.prompts
      WHERE id = prompt_id AND author_id = auth.uid()
    )
  );

-- Ratings policies
CREATE POLICY "Ratings are viewable by everyone" ON public.ratings
  FOR SELECT USING (true);

CREATE POLICY "Users can create ratings" ON public.ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings" ON public.ratings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings" ON public.ratings
  FOR DELETE USING (auth.uid() = user_id);

-- Favorites policies
CREATE POLICY "Users can view their own favorites" ON public.favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create favorites" ON public.favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON public.favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Collections policies
CREATE POLICY "Public collections are viewable by everyone" ON public.collections
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own collections" ON public.collections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create collections" ON public.collections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collections" ON public.collections
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collections" ON public.collections
  FOR DELETE USING (auth.uid() = user_id);

-- Collection prompts policies
CREATE POLICY "Collection prompts are viewable based on collection visibility" ON public.collection_prompts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.collections
      WHERE id = collection_id AND (is_public = true OR user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage their collection prompts" ON public.collection_prompts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.collections
      WHERE id = collection_id AND user_id = auth.uid()
    )
  );

-- Prompt usage policies
CREATE POLICY "Users can view their own usage data" ON public.prompt_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create usage records" ON public.prompt_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Submissions policies
CREATE POLICY "Users can view their own submissions" ON public.submissions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create submissions" ON public.submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending submissions" ON public.submissions
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Functions to update rating averages
CREATE OR REPLACE FUNCTION public.update_prompt_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.prompts
  SET 
    rating_avg = (
      SELECT COALESCE(AVG(rating), 0)
      FROM public.ratings
      WHERE prompt_id = COALESCE(NEW.prompt_id, OLD.prompt_id)
    ),
    rating_count = (
      SELECT COUNT(*)
      FROM public.ratings
      WHERE prompt_id = COALESCE(NEW.prompt_id, OLD.prompt_id)
    )
  WHERE id = COALESCE(NEW.prompt_id, OLD.prompt_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update rating averages
CREATE TRIGGER update_prompt_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.ratings
  FOR EACH ROW EXECUTE FUNCTION public.update_prompt_rating();

-- Function to update favorites count
CREATE OR REPLACE FUNCTION public.update_prompt_favorites()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.prompts
  SET favorites_count = (
    SELECT COUNT(*)
    FROM public.favorites
    WHERE prompt_id = COALESCE(NEW.prompt_id, OLD.prompt_id)
  )
  WHERE id = COALESCE(NEW.prompt_id, OLD.prompt_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update favorites count
CREATE TRIGGER update_prompt_favorites_trigger
  AFTER INSERT OR DELETE ON public.favorites
  FOR EACH ROW EXECUTE FUNCTION public.update_prompt_favorites();

-- Function to update usage count
CREATE OR REPLACE FUNCTION public.update_prompt_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.prompts
  SET usage_count = (
    SELECT COUNT(*)
    FROM public.prompt_usage
    WHERE prompt_id = NEW.prompt_id
  )
  WHERE id = NEW.prompt_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update usage count
CREATE TRIGGER update_prompt_usage_count_trigger
  AFTER INSERT ON public.prompt_usage
  FOR EACH ROW EXECUTE FUNCTION public.update_prompt_usage_count();

-- Function to update tag usage count
CREATE OR REPLACE FUNCTION public.update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.tags
    SET usage_count = usage_count + 1
    WHERE id = NEW.tag_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.tags
    SET usage_count = usage_count - 1
    WHERE id = OLD.tag_id;
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update tag usage count
CREATE TRIGGER update_tag_usage_count_trigger
  AFTER INSERT OR DELETE ON public.prompt_tags
  FOR EACH ROW EXECUTE FUNCTION public.update_tag_usage_count();