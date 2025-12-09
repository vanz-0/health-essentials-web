-- Create enum for challenge types
CREATE TYPE public.challenge_type AS ENUM ('glow_up', 'hair_revival', 'stretch_mark_fade', 'clear_skin', 'makeup_mastery', 'body_care');

-- Create enum for challenge status
CREATE TYPE public.challenge_status AS ENUM ('active', 'paused', 'completed', 'abandoned');

-- Create enum for alert types
CREATE TYPE public.alert_type AS ENUM ('2_days', '5_days', '7_days_reset');

-- Create challenges table
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_type challenge_type NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  duration_days INTEGER NOT NULL DEFAULT 30,
  discount_percent INTEGER NOT NULL DEFAULT 15,
  difficulty TEXT NOT NULL DEFAULT 'beginner',
  category TEXT NOT NULL,
  recommended_products JSONB NOT NULL DEFAULT '[]'::jsonb,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create challenge_days table
CREATE TABLE public.challenge_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  tip TEXT NOT NULL,
  routine_time TEXT NOT NULL DEFAULT 'both',
  product_nums JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(challenge_id, day_number)
);

-- Create user_challenges table
CREATE TABLE public.user_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  current_day INTEGER NOT NULL DEFAULT 1,
  missed_days_streak INTEGER NOT NULL DEFAULT 0,
  status challenge_status NOT NULL DEFAULT 'active',
  discount_code TEXT UNIQUE,
  product_snapshot JSONB DEFAULT '{}'::jsonb,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create challenge_progress table
CREATE TABLE public.challenge_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_challenge_id UUID NOT NULL REFERENCES public.user_challenges(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_challenge_id, day_number)
);

-- Create challenge_alerts table
CREATE TABLE public.challenge_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_challenge_id UUID NOT NULL REFERENCES public.user_challenges(id) ON DELETE CASCADE,
  alert_type alert_type NOT NULL,
  sent BOOLEAN NOT NULL DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for challenges (public read, admin write)
CREATE POLICY "Anyone can view active challenges" ON public.challenges
  FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage challenges" ON public.challenges
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for challenge_days (public read)
CREATE POLICY "Anyone can view challenge days" ON public.challenge_days
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage challenge days" ON public.challenge_days
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for user_challenges
CREATE POLICY "Users can view their own challenges" ON public.user_challenges
  FOR SELECT USING (auth.uid() = user_id OR email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Anyone can enroll in challenges" ON public.user_challenges
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own challenges" ON public.user_challenges
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all user challenges" ON public.user_challenges
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for challenge_progress
CREATE POLICY "Users can view their own progress" ON public.challenge_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_challenges uc 
      WHERE uc.id = user_challenge_id AND uc.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own progress" ON public.challenge_progress
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_challenges uc 
      WHERE uc.id = user_challenge_id AND uc.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own progress" ON public.challenge_progress
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_challenges uc 
      WHERE uc.id = user_challenge_id AND uc.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all progress" ON public.challenge_progress
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for challenge_alerts
CREATE POLICY "Users can view their own alerts" ON public.challenge_alerts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_challenges uc 
      WHERE uc.id = user_challenge_id AND uc.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all alerts" ON public.challenge_alerts
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for performance
CREATE INDEX idx_challenge_days_challenge_id ON public.challenge_days(challenge_id);
CREATE INDEX idx_user_challenges_user_id ON public.user_challenges(user_id);
CREATE INDEX idx_user_challenges_status ON public.user_challenges(status);
CREATE INDEX idx_challenge_progress_user_challenge_id ON public.challenge_progress(user_challenge_id);
CREATE INDEX idx_challenge_alerts_user_challenge_id ON public.challenge_alerts(user_challenge_id);

-- Create updated_at triggers
CREATE TRIGGER update_challenges_updated_at
  BEFORE UPDATE ON public.challenges
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_challenges_updated_at
  BEFORE UPDATE ON public.user_challenges
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed the 6 challenges
INSERT INTO public.challenges (challenge_type, title, description, icon, discount_percent, difficulty, category, recommended_products) VALUES
('glow_up', '30-Day Glow Up Challenge', 'Transform your skin with a complete skincare routine that cleanses, treats, and nourishes for radiant, glowing skin.', 'Sparkles', 15, 'beginner', 'skincare', '["001", "002", "003", "004", "005", "006", "007", "008"]'),
('hair_revival', '30-Day Hair Revival Challenge', 'Restore your hair''s natural shine and strength with our comprehensive hair care program.', 'Scissors', 15, 'intermediate', 'haircare', '["101", "102", "103", "104", "105", "106", "107", "108"]'),
('stretch_mark_fade', '30-Day Stretch Mark Fade Challenge', 'Consistent daily treatment to visibly reduce stretch marks and improve skin elasticity.', 'Heart', 20, 'beginner', 'bodycare', '["201", "202", "203", "204", "205"]'),
('clear_skin', '30-Day Clear Skin Challenge', 'Combat acne and blemishes with a targeted routine for clearer, healthier skin.', 'Shield', 15, 'intermediate', 'skincare', '["301", "302", "303", "304", "305", "306"]'),
('makeup_mastery', '30-Day Makeup Mastery Challenge', 'Learn professional makeup techniques from basic to advanced, one day at a time.', 'Palette', 10, 'advanced', 'makeup', '["401", "402", "403", "404", "405", "406", "407"]'),
('body_care', '30-Day Body Care Ritual', 'Establish a luxurious full-body care routine for silky smooth, nourished skin.', 'Flower2', 15, 'beginner', 'bodycare', '["501", "502", "503", "504", "505", "506", "507", "508"]');